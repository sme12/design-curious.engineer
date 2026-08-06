import { Link } from "@tanstack/react-router";

import { BouncingUnderlineLink } from "./BouncingUnderlineLink";
import { GitHubIcon } from "./icons";

export function Footer() {
	return (
		<footer>
			<div className="mx-auto max-w-content px-gutter pt-8 pb-6 text-small md:px-0 md:py-10 2xl:max-w-content-xl 2xl:text-small-xl">
				<div className="flex flex-col gap-9 md:flex-row md:items-start md:justify-between">
					<div className="space-y-2">
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
					<nav className="flex items-center gap-6 text-ink-secondary">
						<Link
							activeProps={{ className: "text-ink" }}
							className="-mx-3 -my-3.5 inline-flex px-3 py-3.5 transition-[color] hover:text-ink-hover lowercase"
							to="/about"
						>
							About
						</Link>
						<span className="inline-flex items-center gap-1.5">
							<span className="lowercase">Writing</span>
							<span className="inline-flex items-center self-stretch rounded-badge bg-black/5 px-1 font-semibold text-[9px] text-ink-muted uppercase leading-none tracking-wide">
								soon
							</span>
						</span>
					</nav>
				</div>
			</div>
		</footer>
	);
}
