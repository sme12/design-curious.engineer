import { useCallback, useEffect, useRef } from "react";
import { usePulse } from "./PulseGroup";

// Decode scramble: a wave sweeps the word left to right and each letter
// flickers through a few code glyphs in Geist Pixel — same ink as the body —
// before snapping back. No movement; the flicker is the motion.
const STAGGER = 0.06; // s between neighboring letters starting to scramble
const FLICKS = 6; // wrong glyphs a letter shows before settling
const FLICK_MS = 50; // ms each wrong glyph stays up
const GLYPHS = "{}[]<>/=+*#$%&01";

const SCRAMBLE_DURATION = (FLICKS * FLICK_MS) / 1000; // s one letter flickers

function randomGlyph() {
	return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Wraps a word so a decode scramble washes over it whenever the surrounding
 * PulseGroup fires — the digital sibling of ShimmerWord's rainbow. Screen
 * readers still get the word in one piece.
 */
export function ScrambleWord({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	const lettersRef = useRef<HTMLSpanElement>(null);
	const timers = useRef<number[]>([]);

	const pulse = useCallback(() => {
		const wrap = lettersRef.current;
		if (!wrap) {
			return;
		}
		const letters = Array.from(wrap.children) as HTMLElement[];
		const chars = [...children];

		// Background tabs throttle timers, so a pulse can land while the last
		// one is still mid-flicker — reset to the real letters first, or a
		// scramble glyph gets captured as "original" and sticks forever.
		for (const id of timers.current) {
			window.clearTimeout(id);
			window.clearInterval(id);
		}
		for (const [index, letter] of letters.entries()) {
			letter.textContent = chars[index] ?? "";
			letter.classList.remove("font-pixel", "font-normal", "text-center");
			letter.style.removeProperty("width");
		}

		timers.current = letters.flatMap((letter, index) => {
			const original = chars[index] ?? "";
			let swap: number | undefined;

			const start = window.setTimeout(
				() => {
					// Lock the slot to the real letter's width so the mono glyphs
					// can't ripple the rest of the line
					letter.style.width = `${letter.getBoundingClientRect().width}px`;
					// font-normal: the pixel font is single-weight, so keep the
					// word's semibold from triggering a mushy synthetic bold
					letter.classList.add("font-pixel", "font-normal", "text-center");
					letter.textContent = randomGlyph();

					let flick = 1;
					swap = window.setInterval(() => {
						flick += 1;
						if (flick > FLICKS) {
							window.clearInterval(swap);
							letter.textContent = original;
							letter.classList.remove(
								"font-pixel",
								"font-normal",
								"text-center",
							);
							letter.style.removeProperty("width");
							return;
						}
						letter.textContent = randomGlyph();
					}, FLICK_MS);
					timers.current.push(swap);
				},
				index * STAGGER * 1000,
			);

			return [start];
		});
	}, [children]);

	usePulse((children.length - 1) * STAGGER + SCRAMBLE_DURATION, pulse);

	useEffect(() => {
		return () => {
			for (const id of timers.current) {
				window.clearTimeout(id);
				window.clearInterval(id);
			}
		};
	}, []);

	return (
		<span className={className}>
			{/* The word lives in generated content: screen readers announce it,
			    but the clipboard never sees pseudo-elements, so copying the
			    sentence doesn't double the word. */}
			<span
				className="sr-only before:content-[attr(data-word)]"
				data-word={children}
			/>
			<span aria-hidden="true" className="whitespace-nowrap" ref={lettersRef}>
				{[...children].map((char, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: static letters never reorder
					<span className="inline-block" key={index}>
						{char}
					</span>
				))}
			</span>
		</span>
	);
}
