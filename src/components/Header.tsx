import { Link } from "@tanstack/react-router";

export function Header() {
	return (
		<header className="absolute inset-x-0 top-0 z-10">
			<div className="mx-auto flex max-w-content items-center justify-between px-gutter py-6 text-paper-muted text-small md:px-0 md:py-10 2xl:max-w-content-xl 2xl:text-small-xl">
				<div className="inline-flex items-center gap-1.5">
					<h1>
						<Link
							className="-mx-3 -my-3.5 inline-flex px-3 py-3.5 transition-[color] hover:text-paper lowercase"
							to="/"
						>
							Vitalii Sazanov
						</Link>
					</h1>
					<span className="inline-flex items-center self-stretch rounded-badge bg-paper/10 px-1 font-semibold text-[9px] text-paper-muted/50 uppercase leading-none tracking-wide">
						beta
					</span>
				</div>
			</div>
		</header>
	);
}
