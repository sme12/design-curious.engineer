import { animate } from "motion";
import { useCallback, useEffect, useRef } from "react";

// The hop the underline takes when a link is hovered or focused, kept out of
// the link component because the email button wears the same underline without
// being a link — see BouncingUnderlineLink and CopyEmailLink.
export function useUnderlineBounce(bounceHeight?: number) {
	const underlineRef = useRef<HTMLSpanElement>(null);
	const anim = useRef<ReturnType<typeof animate>>(undefined);

	// Hop toward the text, then spring back down with a little overshoot
	const bounce = useCallback(() => {
		const line = underlineRef.current;
		if (!line || matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		// Scale the hop to the line box so tight line-heights don't overlap the text
		const hop = bounceHeight ?? (line.parentElement?.offsetHeight ?? 24) * 0.1;

		anim.current?.cancel();
		anim.current = animate([
			[line, { y: -hop }, { duration: 0.12, ease: "easeOut" }],
			[line, { y: 0 }, { type: "spring", stiffness: 550, damping: 9 }],
		]);
	}, [bounceHeight]);

	useEffect(() => () => anim.current?.cancel(), []);

	return { bounce, underlineRef };
}
