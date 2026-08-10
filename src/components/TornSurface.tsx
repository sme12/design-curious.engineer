import type { ReactNode } from "react";

// Desktop tears the band with a repeating mask; mobile can't, because the band
// also slants — so the slant is a clip-path and the tear is a rotated strip of
// surface-deep laid over the seam. Every torn band on the site comes through
// here, so the tear's geometry is written down once.
const STRIP =
	"-left-3 absolute h-9 w-[calc(100%+48px)] origin-top-left rotate-[atan2(-24px,100vw)] bg-surface-deep md:hidden";

export function TornSurface({
	as: Tag = "section",
	children,
	className = "",
	edges,
}: {
	as?: "header" | "section";
	children: ReactNode;
	/** Styling for the band itself — background, padding. */
	className?: string;
	edges: "both" | "bottom";
}) {
	const both = edges === "both";

	return (
		<Tag className="relative overflow-x-clip">
			<div
				className={`${both ? "clip-angle-y md:mask-torn-y" : "clip-angle-b md:mask-torn-b"} md:[clip-path:none] ${className}`}
			>
				{children}
			</div>
			{both ? (
				<div aria-hidden="true" className={`mask-torn-t top-3 ${STRIP}`} />
			) : null}
			<div
				aria-hidden="true"
				className={`mask-torn-b top-[calc(100%-24px)] ${STRIP}`}
			/>
		</Tag>
	);
}
