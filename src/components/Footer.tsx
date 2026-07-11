import { Link } from "@tanstack/react-router";

export function Footer() {
	return (
		<footer>
			<div className="mx-auto flex max-w-content flex-col gap-6 px-gutter pt-12 pb-9 text-small md:flex-row md:items-center md:justify-between md:px-0 md:py-20 2xl:max-w-content-xl 2xl:text-small-xl">
				<p className="text-ink-tertiary">
					Designed and developed by Vitalii Sazanov, Finland, 2026
				</p>
				<nav className="flex items-center justify-end gap-6 text-ink-secondary">
					<Link className="transition-colors hover:text-ink" to="/about">
						about
					</Link>
					<a
						className="transition-colors hover:text-ink"
						href="/cv.pdf"
						target="_blank"
						rel="noopener"
					>
						download cv
					</a>
				</nav>
			</div>
		</footer>
	);
}
