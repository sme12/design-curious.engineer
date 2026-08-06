import { Link } from "@tanstack/react-router";

import { TornSurface } from "./TornSurface";

export function Header({ standalone = false }: { standalone?: boolean }) {
	// On the frontpage the wordmark is the page's h1; elsewhere the page owns
	// its own h1 and the wordmark is just a mark.
	const Wordmark = standalone ? "p" : "h1";

	const row = (
		<div className="mx-auto flex max-w-content items-center justify-between px-gutter py-6 text-paper-muted text-small md:px-0 md:py-10 2xl:max-w-content-xl 2xl:text-small-xl">
			<Wordmark>
				<Link
					className="-mx-3 -my-3.5 inline-flex px-3 py-3.5 transition-[color] hover:text-paper lowercase"
					to="/"
				>
					Vitalii Sazanov
				</Link>
			</Wordmark>
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
			<TornSurface
				as="header"
				className="bg-(image:--gradient-surface) pb-6 md:pb-0"
				edges="bottom"
			>
				{row}
			</TornSurface>
		);
	}

	return <header className="absolute inset-x-0 top-0 z-10">{row}</header>;
}
