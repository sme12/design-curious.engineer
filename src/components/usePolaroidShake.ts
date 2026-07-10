import { animate } from "motion";
import { type RefObject, useCallback, useEffect, useRef } from "react";

// Shake knobs
const SWINGS = [0, -7, 8, -6.5, 5, -3, 1.5, 0]; // degrees, decaying wrist flicks
const GRIP_SHIFT = 1.3; // px of sideways drift per degree — fakes a pivot at the grip
const DURATION = 0.9; // seconds

/**
 * Shakes the polaroid like an impatient photographer: a few decaying wrist
 * flicks pivoting around where the fingers grip the bottom border. Returns
 * a `shake` callback; does nothing with reduced motion.
 */
export function usePolaroidShake(cardRef: RefObject<HTMLElement | null>) {
	const anim = useRef<ReturnType<typeof animate>>(undefined);

	const shake = useCallback(() => {
		const card = cardRef.current;
		if (!card) return;
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		anim.current = animate(
			card,
			{
				rotate: SWINGS,
				x: SWINGS.map((deg) => deg * GRIP_SHIFT),
			},
			{ duration: DURATION, ease: "easeInOut" },
		);
	}, [cardRef]);

	useEffect(() => () => anim.current?.cancel(), []);

	return shake;
}
