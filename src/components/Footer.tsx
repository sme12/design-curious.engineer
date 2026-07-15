import { BouncingUnderlineLink } from "./BouncingUnderlineLink";
import { GitHubIcon } from "./icons";

export function Footer() {
	return (
		<footer>
			<div className="mx-auto flex max-w-content flex-col gap-6 px-gutter pt-12 pb-9 text-small md:flex-row md:items-baseline md:justify-between md:px-0 md:py-16 2xl:max-w-content-xl 2xl:text-small-xl">
				<div className="space-y-2 py-3.5">
					<p className="text-ink-muted">
						Designed and built by Vitalii Sazanov, 2026
					</p>
					<p>
						<span className="text-ink-muted">Opensourced on </span>
						<BouncingUnderlineLink
							href="https://github.com/sme12/design-curious.engineer"
							leading={
								<GitHubIcon className="inline-block size-4 align-text-bottom mx-0.5 mb-0.5 2xl:mb-1" />
							}
							rel="noopener"
							target="_blank"
						>
							GitHub
						</BouncingUnderlineLink>
					</p>
				</div>
				<nav className="flex items-center md:justify-end gap-6 text-ink-secondary">
					<span className="inline-flex items-center gap-1.5">
						<span className="text-ink-muted lowercase">About</span>
						<span className="inline-flex items-center self-stretch rounded-badge bg-black/5 px-1 font-semibold text-[9px] text-ink-muted uppercase leading-none tracking-wide">
							soon
						</span>
					</span>
				</nav>
			</div>
		</footer>
	);
}
