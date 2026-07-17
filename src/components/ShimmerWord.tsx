import { animate } from "motion";
import { useCallback, useEffect, useRef } from "react";
import { usePulse } from "./PulseGroup";

// One glint sweeps the word left to right, then it rests as plain ink
// until the next pulse.
const STAGGER = 0.08; // s between neighboring letters starting to tint
const TINT_DURATION = 0.45; // s a letter spends tinting up and back
const JUMP_PX = 3; // little hop off the baseline at the color peak

// A full hue sweep across the word, saturated enough to clearly read as
// rainbow while keeping ink-like lightness for contrast on paper
function letterColor(index: number, count: number) {
	const hue = 15 + (330 * index) / Math.max(count - 1, 1);
	return `oklch(0.53 0.21 ${hue})`;
}

/**
 * Wraps a word so a soft rainbow shimmer washes over it, letter by letter,
 * whenever the surrounding PulseGroup fires. Ambient only — no pointer
 * interaction, and screen readers still get the word in one piece.
 */
export function ShimmerWord({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	const lettersRef = useRef<HTMLSpanElement>(null);
	const anims = useRef<ReturnType<typeof animate>[]>([]);

	const pulse = useCallback(() => {
		const wrap = lettersRef.current;
		if (!wrap) {
			return;
		}
		const letters = Array.from(wrap.children) as HTMLElement[];
		// Hidden tabs suspend Motion animations mid-flight; cancel any stale
		// ones so they release color and y before the new run claims them.
		for (const anim of anims.current) {
			anim.cancel();
		}
		const ink = getComputedStyle(wrap).color;
		anims.current = letters.flatMap((letter, index) => {
			const at = index * STAGGER;
			return [
				animate(
					letter,
					{ color: [ink, letterColor(index, letters.length), ink] },
					{ delay: at, duration: TINT_DURATION, ease: "easeInOut" },
				),
				// Quick launch off the baseline, then a softly damped spring
				// landing — a calmer cousin of the bouncing underline
				animate([
					[letter, { y: -JUMP_PX }, { at, duration: 0.12, ease: "easeOut" }],
					[letter, { y: 0 }, { type: "spring", stiffness: 450, damping: 18 }],
				]),
			];
		});
	}, []);

	usePulse((children.length - 1) * STAGGER + TINT_DURATION, pulse);

	useEffect(() => {
		return () => {
			for (const anim of anims.current) {
				anim.cancel();
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
