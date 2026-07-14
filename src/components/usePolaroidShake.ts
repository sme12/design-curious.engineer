import { animate } from "motion";
import { type RefObject, useCallback, useEffect, useRef } from "react";

// Shake knobs: [degrees, seconds] — a continuous train of wrist flicks:
// vigorous at first, tapering off with a lazier cadence toward the settle
const FLICKS: [deg: number, at: number][] = [
	[0, 0],
	[-7, 0.14],
	[8, 0.28],
	[-6.5, 0.42],
	[7, 0.56],
	[-5.5, 0.7],
	[6.5, 0.85],
	[-6, 1.0],
	[5.5, 1.15],
	[-4.5, 1.31],
	[4, 1.47],
	[-3, 1.64],
	[2, 1.81],
	[-1, 1.96],
	[0, 2.1],
];
const GRIP_SHIFT = 1.3; // px of sideways drift per degree — fakes a pivot at the grip

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

		anim.current = animate(
			card,
			{
				rotate: FLICKS.map(([deg]) => deg),
				x: FLICKS.map(([deg]) => deg * GRIP_SHIFT),
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
