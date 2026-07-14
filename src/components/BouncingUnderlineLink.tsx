import { animate } from "motion";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";

type BouncingUnderlineLinkProps = Omit<
	ComponentPropsWithoutRef<"a">,
	"href"
> & {
	href: string;
	leading?: ReactNode;
	bounceHeight?: number;
};

export function BouncingUnderlineLink({
	bounceHeight,
	children,
	className = "",
	href,
	leading,
	onFocus,
	onMouseEnter,
	...props
}: BouncingUnderlineLinkProps) {
	const underlineRef = useRef<HTMLSpanElement>(null);
	const anim = useRef<ReturnType<typeof animate>>(undefined);

	// Hop toward the text, then spring back down with a little overshoot
	const bounceUnderline = useCallback(() => {
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

	return (
		<a
			{...props}
			className={`bouncing-underline-link whitespace-nowrap transition-colors duration-200 ease-out-cubic hover:text-ink-hover ${className}`}
			href={href}
			onFocus={(event) => {
				onFocus?.(event);
				if (!event.defaultPrevented) {
					bounceUnderline();
				}
			}}
			onMouseEnter={(event) => {
				onMouseEnter?.(event);
				if (!event.defaultPrevented) {
					bounceUnderline();
				}
			}}
		>
			{leading && <>{leading} </>}
			<span className="bouncing-underline-link-label relative inline-block">
				{children}
				<span
					aria-hidden="true"
					className="absolute inset-x-0 bottom-0 h-px bg-ink-hover"
					ref={underlineRef}
				/>
			</span>
		</a>
	);
}
