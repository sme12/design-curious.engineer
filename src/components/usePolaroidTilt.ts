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
		let rect = target.getBoundingClientRect();
		let frame = 0;
		let pointer: { x: number; y: number } | null = null;

		// Cached rather than measured per event: the previous frame wrote a
		// transform to this subtree, so a fresh read here would force a synchronous
		// relayout on every mousemove — and a card that hasn't scrolled or resized
		// is still where it was.
		const measure = () => {
			rect = target.getBoundingClientRect();
		};

		const render = () => {
			frame = 0;
			if (!pointer) return;
			const x = pointer.x - rect.left;
			const y = pointer.y - rect.top;
			const tiltX = (y / rect.height - 0.5) * MAX_TILT * 2;
			const tiltY = (x / rect.width - 0.5) * MAX_TILT * -2;
			wrapper.style.setProperty(
				"transform",
				`perspective(${PERSPECTIVE}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
			);
			glare.style.setProperty(
				"transform",
				`translate(calc(${x / 1.5}px - 50%), calc(${y / 1.5}px - 50%)) scale(3)`,
			);
		};

		const onEnter = () => {
			measure();
			// The page can move under a held cursor, and the rect is viewport-relative
			window.addEventListener("scroll", measure, { passive: true });
			window.addEventListener("resize", measure);
			// Once the settle transition has had time to finish, switch to
			// untransitioned updates so the tilt tracks the cursor precisely
			snapTimeout = window.setTimeout(
				() => wrapper.style.setProperty("transition-duration", "0s"),
				SETTLE_MS,
			);
		};

		const onMove = (e: MouseEvent) => {
			pointer = { x: e.clientX, y: e.clientY };
			// Several events can land in one frame; only the last one is worth drawing
			frame ||= requestAnimationFrame(render);
		};

		const onLeave = () => {
			clearTimeout(snapTimeout);
			cancelAnimationFrame(frame);
			frame = 0;
			pointer = null;
			window.removeEventListener("scroll", measure);
			window.removeEventListener("resize", measure);
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
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", measure);
			window.removeEventListener("resize", measure);
			target.removeEventListener("mouseenter", onEnter);
			target.removeEventListener("mousemove", onMove);
			target.removeEventListener("mouseleave", onLeave);
		};
	}, [targetRef, wrapperRef, glareRef]);
}
