import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useUnderlineBounce } from "./useUnderlineBounce";

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
			className={`bouncing-underline-link whitespace-nowrap transition-colors duration-200 ease-out-cubic hover:text-ink-hover ${className}`}
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
