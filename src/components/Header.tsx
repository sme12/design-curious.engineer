import { Link } from "@tanstack/react-router";

import { TornSurface } from "./TornSurface";

export function Header({ standalone = false }: { standalone?: boolean }) {
	const row = (
		<div className="mx-auto flex max-w-content items-center justify-between px-gutter py-6 text-paper-muted text-small md:px-0 md:py-10 2xl:max-w-content-xl 2xl:text-small-xl">
			<h1>
				<Link
					className="-mx-3 -my-3.5 inline-flex px-3 py-3.5 transition-[color] hover:text-paper lowercase"
					to="/"
				>
					Vitalii Sazanov
				</Link>
			</h1>
			<nav className="flex items-center gap-6">
				<Link
					activeProps={{ className: "text-paper" }}
					className="-mx-3 -my-3.5 inline-flex px-3 py-3.5 transition-[color] hover:text-paper lowercase"
					to="/about"
				>
					About
				</Link>
				{/* Not a link yet. Its line box is 16/18px, the same as the links'
				    -my-3.5 margin box, so it adds no height to the row. */}
				<span className="inline-flex items-center gap-1.5">
					<span className="lowercase">Writing</span>
					<span className="inline-flex items-center self-stretch rounded-badge bg-paper/10 px-1 font-semibold text-[9px] text-paper-muted/50 uppercase leading-none tracking-wide">
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
