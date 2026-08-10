import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { useUnderlineBounce } from "./useUnderlineBounce";

// What a link of this kind looks like, kept out of the component because the
// email button wears it without being a link — the same reason the hop itself
// lives in useUnderlineBounce. See CopyEmailLink.
export const bouncingUnderlineLinkClassName =
	"bouncing-underline-link whitespace-nowrap transition-colors duration-200 ease-out-cubic hover:text-ink-hover";

/**
 * The label and the rule under it — the part that hops. The rule is a span at
 * the bottom of the label box rather than a text-decoration so that it can be
 * moved, and so it lands at the same height as PicturePopover's dotted one; the
 * label box is what focus outlines, see .bouncing-underline-link in styles.css.
 */
export function BouncingUnderlineLabel({
	children,
	underlineRef,
}: {
	children: ReactNode;
	underlineRef: Ref<HTMLSpanElement>;
}) {
	return (
		<span className="bouncing-underline-link-label relative inline-block">
			{children}
			<span
				aria-hidden="true"
				className="absolute inset-x-0 bottom-0 h-px bg-ink-hover"
				ref={underlineRef}
			/>
		</span>
	);
}

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
	const { bounce, underlineRef } = useUnderlineBounce(bounceHeight);

	return (
		<a
			{...props}
			className={`${bouncingUnderlineLinkClassName} ${className}`}
			href={href}
			onFocus={(event) => {
				onFocus?.(event);
				if (!event.defaultPrevented) {
					bounce();
				}
			}}
			onMouseEnter={(event) => {
				onMouseEnter?.(event);
				if (!event.defaultPrevented) {
					bounce();
				}
			}}
		>
			{leading && <>{leading} </>}
			<BouncingUnderlineLabel underlineRef={underlineRef}>
				{children}
			</BouncingUnderlineLabel>
		</a>
	);
}
