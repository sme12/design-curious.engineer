import { type RefObject, useEffect } from "react";

// Tilt knobs
const MAX_TILT = 8; // degrees per axis with the cursor at the card's edge
const PERSPECTIVE = 800; // px of camera distance
const SETTLE_MS = 500; // return-to-flat transition, mirrored by the enter timeout

/**
 * Tilts the polaroid in 3D toward the cursor (like it's being held and angled
 * toward you) while a glare highlight tracks the cursor across the card.
 * Hover-only: inert on touch/coarse pointers and with reduced motion.
 */
export function usePolaroidTilt({
	targetRef,
	wrapperRef,
	glareRef,
}: {
	targetRef: RefObject<HTMLElement | null>;
	wrapperRef: RefObject<HTMLElement | null>;
	glareRef: RefObject<HTMLElement | null>;
}) {
	useEffect(() => {
		const target = targetRef.current;
		const wrapper = wrapperRef.current;
		const glare = glareRef.current;
		if (
			!target ||
			!wrapper ||
			!glare ||
			!matchMedia("(hover: hover) and (pointer: fine)").matches ||
			matchMedia("(prefers-reduced-motion: reduce)").matches
		) {
			return;
		}

		let snapTimeout = 0;

		const onEnter = () => {
			// Once the settle transition has had time to finish, switch to
			// untransitioned updates so the tilt tracks the cursor precisely
			snapTimeout = window.setTimeout(
				() => wrapper.style.setProperty("transition-duration", "0s"),
				SETTLE_MS,
			);
		};

		const onMove = (e: MouseEvent) => {
			const { left, top, width, height } = target.getBoundingClientRect();
			const x = e.clientX - left;
			const y = e.clientY - top;
			const tiltX = (y / height - 0.5) * MAX_TILT * 2;
			const tiltY = (x / width - 0.5) * MAX_TILT * -2;
			wrapper.style.setProperty(
				"transform",
				`perspective(${PERSPECTIVE}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
			);
			glare.style.setProperty(
				"transform",
				`translate(calc(${x / 1.5}px - 50%), calc(${y / 1.5}px - 50%)) scale(3)`,
			);
		};

		const onLeave = () => {
			clearTimeout(snapTimeout);
			wrapper.style.setProperty("transition-duration", `${SETTLE_MS}ms`);
			wrapper.style.setProperty(
				"transform",
				`perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`,
			);
		};

		target.addEventListener("mouseenter", onEnter);
		target.addEventListener("mousemove", onMove);
		target.addEventListener("mouseleave", onLeave);
		return () => {
			clearTimeout(snapTimeout);
			target.removeEventListener("mouseenter", onEnter);
			target.removeEventListener("mousemove", onMove);
			target.removeEventListener("mouseleave", onLeave);
		};
	}, [targetRef, wrapperRef, glareRef]);
}
