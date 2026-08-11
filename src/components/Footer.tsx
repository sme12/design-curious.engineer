import { Link } from "@tanstack/react-router";

import { BouncingUnderlineLink } from "./BouncingUnderlineLink";
import { GitHubIcon } from "./icons";

const navLinkClassName =
	"-mx-3 -my-3.5 inline-flex px-3 py-3.5 transition-[color] duration-200 ease-out-cubic hover:text-ink-hover lowercase";

// Same active rule as the header nav: accent underline for the current route,
// hover stays color-only so the two states read apart.
const navLinkActiveProps = {
	className:
		"text-ink underline decoration-accent decoration-2 underline-offset-4",
};

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
						{/* exact, because every path is prefixed by "/" — without it the
						    home link would sit underlined on /about as well. */}
						<Link
							activeOptions={{ exact: true }}
							activeProps={navLinkActiveProps}
							className={navLinkClassName}
							to="/"
						>
							Home
						</Link>
						<Link
							activeProps={navLinkActiveProps}
							className={navLinkClassName}
							to="/about"
						>
							About
						</Link>
						{/* Muted below the real links, since it does not go anywhere yet —
						    but only to ink-muted, which is 4.9:1 on the paper and so still
						    clears AA. ink-hover, the next step down, is 4.2:1. */}
						<span className="inline-flex items-center gap-1.5 text-ink-muted">
							<span className="lowercase">Writing</span>
							{/* Darker than the label it trails, because the chip tint puts it on
							    #e9e9e9 rather than the paper: ink-muted would land at 4.4:1
							    there, ink-tertiary at 5.5:1. */}
							<span className="inline-flex items-center self-stretch rounded-badge bg-black/5 px-1 font-semibold text-[9px] text-ink-tertiary uppercase leading-none tracking-wide">
								soon
							</span>
						</span>
					</nav>
				</div>
			</div>
		</footer>
	);
}
