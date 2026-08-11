import type { ReactNode } from "react";
import { useDrawnRule } from "./useDrawnRule";

export function HandHeading({
	as: Tag = "h2",
	children,
	className = "",
}: {
	/** Section headings are h2; a page whose title lives here uses h1. */
	as?: "h1" | "h2";
	children: ReactNode;
	className?: string;
}) {
	const ruleRef = useDrawnRule();

	return (
		<Tag
			className={`flex w-42.75 flex-col gap-1 font-hand font-semibold text-body italic 2xl:w-48 2xl:text-body-xl ${className}`}
		>
			<span className="whitespace-nowrap">{children}</span>
			{/* Ruled under the word rather than printed with it — see useDrawnRule.
			    The wipe is the `pen-reveal` utility's, which rests at unwritten, so
			    the hook is what puts the rule on the page. */}
			<svg
				ref={ruleRef}
				aria-hidden="true"
				className="pen-reveal h-1 w-42.5 text-accent 2xl:w-47.75"
				fill="currentColor"
				preserveAspectRatio="none"
				viewBox="0 0 170 4"
			>
				<path
					clipRule="evenodd"
					d="M0 0.631881L22.3483 1.13417L44.2852 0.239679L106.831 1.63991L170 0L169.993 1.82225V2.96904L148.659 3.98739L126.675 3.79702L63.3971 2.9656L0.106172 4L0.117674 1.82225L0 0.631881Z"
					fillRule="evenodd"
				/>
			</svg>
		</Tag>
	);
}
