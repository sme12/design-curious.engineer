import { animate } from "motion";
import { type RefObject, useCallback, useEffect, useRef } from "react";

// Handwriting knobs (seconds)
const PEN_SPEED = 0.085; // per character
const PEN_LIFT = 0.14; // pause between words
const PEN_DELAY = 0; // before the first word

/**
 * Handwrites the caption word by word: returns a `write` callback that
 * sweeps the pen across each `[data-word]` element inside `captionRef`.
 * With reduced motion the caption appears fully written instead.
 */
export function useHandwrittenCaption(
	captionRef: RefObject<HTMLElement | null>,
) {
	const penAnims = useRef<ReturnType<typeof animate>[]>([]);

	const write = useCallback(() => {
		const words = Array.from(
			captionRef.current?.querySelectorAll<HTMLSpanElement>("[data-word]") ??
				[],
		);

		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			for (const word of words) {
				word.style.setProperty("--p", "125%");
			}
			return;
		}

		let delay = PEN_DELAY;
		penAnims.current = words.map((word) => {
			const duration = PEN_SPEED * (word.textContent?.length ?? 0) + 0.12;
			const anim = animate(
				word,
				{ "--p": ["0%", "125%"] },
				{ duration, delay, ease: "easeInOut" },
			);
			delay += duration + PEN_LIFT;
			return anim;
		});
	}, [captionRef]);

	useEffect(
		() => () => {
			for (const anim of penAnims.current) {
				anim.cancel();
			}
		},
		[],
	);

	return write;
}
