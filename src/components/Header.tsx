import { Link } from "@tanstack/react-router";

import { TornSurface } from "./TornSurface";

export function Header({ standalone = false }: { standalone?: boolean }) {
	const row = (
		<div className="mx-auto flex max-w-content items-center justify-between px-gutter py-6 text-paper-muted text-small md:px-0 md:py-10 2xl:max-w-content-xl 2xl:text-small-xl">
			<h1>
				<Link
					className="-mx-3 -my-3.5 inline-flex px-3 py-3.5 transition-[color] duration-200 ease-out-cubic hover:text-paper lowercase"
					to="/"
				>
					Vitalii Sazanov
				</Link>
			</h1>
			<nav className="flex items-center gap-6">
				{/* Active gets the accent rule; hover only brightens the label. The
				    two states have to stay distinguishable, and an underline that
				    also appears under the cursor would make "where I am" and
				    "what I'm pointing at" look identical. */}
				<Link
					activeProps={{
						className:
							"text-paper underline decoration-accent decoration-2 underline-offset-4",
					}}
					className="-mx-3 -my-3.5 inline-flex px-3 py-3.5 transition-[color] duration-200 ease-out-cubic hover:text-paper lowercase"
					to="/about"
				>
					About
				</Link>
				{/* Not a link yet. Its line box is 16/18px, the same as the links'
				    -my-3.5 margin box, so it adds no height to the row.

				    Muted a step below the links, as in the footer, but only as far as
				    AA allows: 70% lands at 5.7:1 over the light end of the surface
				    gradient, which is the worst case for pale text. */}
				<span className="inline-flex items-center gap-1.5 text-paper-muted/70">
					<span className="lowercase">Writing</span>
					{/* Brighter than the label it trails — the inverse of the footer, and
					    for the same reason: the chip tint moves the ground toward the
					    text rather than away from it, so pale text needs more, not less.
					    The old 50% sat on #454545 at 3.1:1; 75% clears it at 4.8:1. */}
					<span className="inline-flex items-center self-stretch rounded-badge bg-paper/10 px-1 font-semibold text-[9px] text-paper-muted/75 uppercase leading-none tracking-wide">
						soon
					</span>
				</span>
			</nav>
		</div>
	);

	if (standalone) {
		return (
			// The mobile slant eats 24px off the right edge — on a band this short
			// that would leave the wordmark sitting on the tear, hence the extra pb.
			// Solid rather than the surface gradient: over this little height the
			// gradient is still short of surface-deep where the tear strip — which
			// is solid surface-deep — starts, and the mismatch reads as a seam.
			<TornSurface
				as="header"
				className="bg-surface-deep pb-6 md:pb-0"
				edges="bottom"
			>
				{row}
			</TornSurface>
		);
	}

	return <header className="absolute inset-x-0 top-0 z-10">{row}</header>;
}
