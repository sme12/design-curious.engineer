import { animate } from "motion";
import { type RefObject, useCallback, useEffect, useRef } from "react";

// Shake knobs: [degrees, seconds] — a short burst of wrist flicks: vigorous
// at first, tapering off with a lazier cadence toward the settle. Kept brief
// so the card is still by the time the photo visibly starts developing
// (see START_DELAY in usePolaroidDevelop), with only a slight overlap.
const FLICKS: [deg: number, at: number][] = [
	[0, 0],
	[-7, 0.1],
	[8, 0.2],
	[-6.5, 0.3],
	[6.5, 0.4],
	[-5, 0.5],
	[3.5, 0.6],
	[-2, 0.69],
	[0, 0.78],
];
const GRIP_SHIFT = 1.3; // px of sideways drift per degree — fakes a pivot at the grip
const TOUCH_SCALE = 0.6; // gentler flick amplitude on touch devices

const DURATION = FLICKS[FLICKS.length - 1][1];

/**
 * Shakes the polaroid like an impatient photographer: decaying wrist flicks
 * pivoting around where the fingers grip the bottom border. Returns a `shake`
 * callback whose promise resolves once the card settles (immediately with
 * reduced motion).
 */
export function usePolaroidShake(cardRef: RefObject<HTMLElement | null>) {
	const anim = useRef<ReturnType<typeof animate>>(undefined);

	const shake = useCallback(() => {
		const card = cardRef.current;
		if (!card || matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return Promise.resolve();
		}

		// Touch devices get a gentler shake — the card fills more of a small
		// screen, so the full desktop amplitude reads as violent there
		const scale = matchMedia("(pointer: coarse)").matches ? TOUCH_SCALE : 1;

		anim.current = animate(
			card,
			{
				rotate: FLICKS.map(([deg]) => deg * scale),
				x: FLICKS.map(([deg]) => deg * scale * GRIP_SHIFT),
			},
			{
				duration: DURATION,
				ease: "easeInOut",
				times: FLICKS.map(([, at]) => at / DURATION),
			},
		);
		return anim.current.then(() => {});
	}, [cardRef]);

	useEffect(() => () => anim.current?.cancel(), []);

	return shake;
}
