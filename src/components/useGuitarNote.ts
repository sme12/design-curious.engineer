import { animate } from "motion";
import { useCallback, useEffect, useRef } from "react";

// Annotation knobs (seconds)
const SHAFT_DRAW = 0.5; // the arrow's curve, tail to tip
const HEAD_DRAW = 0.2; // both barbs, drawn through the tip as one stroke
const HEAD_LEAD = 0.06; // which come off the tip before the curve settles
const TEXT_LEAD = 0.1; // and the pen is on the first line before they do
const LINE_WRITE = 0.3; // one line of handwriting, first letter to last
const LINE_STEP = 0.17; // the pen starts the next line before finishing this one
const FADE_OUT = 0.3; // the whole note, on the way out, as written as it got

// How much of a stroke is on the page, as a dash offset: 1 is none of it, 0 is
// all of it. The paths carry pathLength="1", so the pair means the same on any
// of them however long it really is.
const UNDRAWN = 1;
const DRAWN = 0;

/**
 * The offset goes on as an attribute rather than a style, and unitless, for
 * the reasons written out beside the paths in About — the short of it being
 * that a bare number is a path length and a px one is a Safari bug.
 */
function setDrawn(stroke: SVGPathElement, offset: number) {
	stroke.setAttribute("stroke-dashoffset", offset.toFixed(4));
}

/**
 * Draws the note beside the guitar on hover and clears it again on the way
 * out, in the order it would be put on paper by someone pointing something
 * out: the arrow first — each `[data-stroke]` in turn, shaft before head — and
 * then the words above it, a `[data-line]` at a time, under the same pen wipe
 * the polaroid caption uses (see the `pen-reveal` utility).
 *
 * Returns the ref for the note itself and the pair of handlers the guitar
 * hangs off its pointer events — the ref belongs to the hook, as in
 * useUnderlineBounce, since the caller only passes it back.
 *
 * Nothing happens without a real pointer: a note that appears on tap and then
 * sits there until you tap something else is not the same gesture at all. With
 * reduced motion it appears already written instead.
 */
export function useGuitarNote() {
	const noteRef = useRef<HTMLSpanElement>(null);
	const anims = useRef<ReturnType<typeof animate>[]>([]);
	const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const stop = useCallback(() => {
		for (const anim of anims.current) {
			anim.cancel();
		}
		anims.current = [];
		if (resetTimer.current !== null) {
			clearTimeout(resetTimer.current);
			resetTimer.current = null;
		}
	}, []);

	const show = useCallback(() => {
		const note = noteRef.current;
		if (!note || !matchMedia("(hover: hover)").matches) {
			return;
		}
		stop();

		const lines = Array.from(note.querySelectorAll<HTMLElement>("[data-line]"));
		// Document order is drawing order: the shaft, then the head
		const strokes = Array.from(
			note.querySelectorAll<SVGPathElement>("[data-stroke]"),
		);
		note.style.opacity = "1";

		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			for (const line of lines) {
				line.style.setProperty("--p", "125%");
			}
			for (const stroke of strokes) {
				setDrawn(stroke, DRAWN);
			}
			return;
		}

		// Back to blank before anything is scheduled. Every animation below waits
		// on a delay, and a delay is not a hold: whatever the last hover left
		// behind is what's on screen until the animation that owns it starts. Off
		// and on again quickly enough and that would be the finished note, sitting
		// there fully written for a beat before rewinding to write itself.
		for (const line of lines) {
			line.style.setProperty("--p", "0%");
		}
		for (const stroke of strokes) {
			setDrawn(stroke, UNDRAWN);
		}

		let delay = 0;
		const running = strokes.map((stroke, index) => {
			const shaft = index === 0;
			const duration = shaft ? SHAFT_DRAW : HEAD_DRAW;
			const anim = animate(UNDRAWN, DRAWN, {
				duration,
				delay,
				// A flick: the shaft picks up speed all the way into the tip, and the
				// barbs come off it and stop
				ease: shaft ? "easeIn" : "easeOut",
				onUpdate: (offset) => setDrawn(stroke, offset),
			});
			delay += duration - HEAD_LEAD;
			return anim;
		});
		// The head is still landing the lead it was started early by, and the pen
		// is back up at the first line before even that has settled
		delay += HEAD_LEAD - TEXT_LEAD;

		for (const line of lines) {
			running.push(
				animate(
					line,
					{ "--p": ["0%", "125%"] },
					{ duration: LINE_WRITE, delay, ease: "easeInOut" },
				),
			);
			delay += LINE_STEP;
		}

		anims.current = running;
	}, [stop]);

	const hide = useCallback(() => {
		const note = noteRef.current;
		if (!note) {
			return;
		}
		if (resetTimer.current !== null) {
			clearTimeout(resetTimer.current);
			resetTimer.current = null;
		}

		// Back to the stylesheet's resting state — invisible, unwritten, undrawn —
		// and not before it has gone, or the note would put itself away in plain
		// view rather than fade
		const clear = () => {
			resetTimer.current = null;
			note.style.removeProperty("opacity");
			for (const line of note.querySelectorAll<HTMLElement>("[data-line]")) {
				line.style.removeProperty("--p");
			}
			for (const stroke of note.querySelectorAll<SVGPathElement>(
				"[data-stroke]",
			)) {
				setDrawn(stroke, UNDRAWN);
			}
		};

		if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
			stop();
			clear();
			return;
		}

		// Note the writing is left running rather than stopped. Cancelling an
		// animation in motion hands the value back to where it started from, so
		// stopping the pen here would blank every line that had been written the
		// instant the cursor left, and leave an empty box to do the fading. A page
		// pulled out from under a hand mid-sentence keeps the sentence, so what is
		// on the paper stays on it and the whole note goes at once — including the
		// last word or two, which finish being written on the way out.
		anims.current.push(
			animate(note, { opacity: 0 }, { duration: FADE_OUT, ease: "easeOut" }),
		);
		resetTimer.current = setTimeout(() => {
			// In this order, and in one go: stopping the fade puts the opacity back
			// to the 1 it was animating from, and clearing drops that inline value
			// for the stylesheet's 0. Neither is painted on its own.
			stop();
			clear();
		}, FADE_OUT * 1000);
	}, [stop]);

	useEffect(() => stop, [stop]);

	return { noteRef, show, hide };
}
