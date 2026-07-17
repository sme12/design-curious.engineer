import { BouncingUnderlineLink } from "./BouncingUnderlineLink";
import { GitHubIcon } from "./icons";

export function Footer() {
	return (
		<footer>
			<div className="mx-auto max-w-content px-gutter pt-8 pb-6 text-small md:px-0 md:py-10 2xl:max-w-content-xl 2xl:text-small-xl">
				<div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
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
			</div>
		</footer>
	);
}
