import { animate } from "motion";
import { useEffect, useRef } from "react";

// Rule-drawing knobs
const RULE_DRAW = 0.42; // s for the whole rule, one end to the other
const IN_VIEW = 0.6; // how much of it has to be on screen before the pen starts

/**
 * Draws the accent rule under a HandHeading the first time it scrolls into
 * view, under the same soft-edged pen wipe the polaroid caption and the
 * guitar's note are written by (see the `pen-reveal` utility). A mask rather
 * than a dash offset because the rule is a tapered fill and not a stroke —
 * there is no dash to walk.
 *
 * 0.42s for 170px sits just past LINE_WRITE, the 0.3s useGuitarNote gives a
 * line of handwriting: the same hand at the same speed, over a longer mark.
 *
 * The word above it is left printed. It is the heading, and a heading you have
 * to wait to read is a worse heading. Once only, and for the same reason — the
 * rule belongs to the resting state, so one that redrew itself every time it
 * came back past the top of the screen would be something you end up watching
 * rather than something under a word. With reduced motion it is ruled already.
 */
export function useDrawnRule() {
	const ruleRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const rule = ruleRef.current;
		if (!rule) {
			return;
		}

		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			rule.style.setProperty("--p", "125%");
			return;
		}

		let anim: ReturnType<typeof animate> | undefined;
		// Fires on its own for anything already on screen at mount, which is what
		// a heading above the fold wants: drawn on arrival, not on the first scroll
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) {
					return;
				}
				observer.disconnect();
				anim = animate(
					rule,
					{ "--p": ["0%", "125%"] },
					{ duration: RULE_DRAW, ease: "easeInOut" },
				);
			},
			{ threshold: IN_VIEW },
		);
		observer.observe(rule);

		return () => {
			observer.disconnect();
			anim?.cancel();
		};
	}, []);

	return ruleRef;
}
