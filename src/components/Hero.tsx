import { GitHubIcon, LinkedInIcon, XIcon } from "./icons";
import { Polaroid } from "./Polaroid";

const EMAIL = "vitalii@sazanov.dev";

function copyEmail() {
	void navigator.clipboard.writeText(EMAIL);
}

export function Hero() {
	return (
		<section className="clip-angle-b relative bg-(image:--gradient-surface) pt-18.5 pb-16 md:[clip-path:none] md:pt-39.5 md:pb-22">
			<div className="relative mx-auto max-w-content px-gutter md:px-0">
				<p className="text-display text-paper md:text-display-lg">
					Hi, I'm Vitalii —
					<br />a design-
					<span className="relative">
						<span aria-hidden="true" className="opacity-0">
							curious
						</span>
						<span className="-translate-y-1/2 absolute top-1/2 left-0 whitespace-nowrap font-hand font-medium text-gradient-accent text-script md:text-script-lg">
							curious
						</span>
					</span>
					<br />
					engineer
				</p>
				<Polaroid className="mt-6 md:-top-11 md:absolute md:left-101.25 md:mt-0 md:rotate-[7.55deg]" />
				<div className="mt-8 flex items-center gap-4 md:mt-12.5 md:gap-3.5">
					<div className="flex items-center gap-4 md:order-2 md:gap-3.5">
						<a
							aria-label="GitHub"
							className="btn btn-icon"
							href="https://github.com/sme12"
							target="_blank"
							rel="noreferrer"
						>
							<GitHubIcon />
						</a>
						<a
							aria-label="LinkedIn"
							className="btn btn-icon"
							href="https://www.linkedin.com/in/vitalii-sazanov/"
							target="_blank"
							rel="noreferrer"
						>
							<LinkedInIcon />
						</a>
						<a
							aria-label="X (Twitter)"
							className="btn btn-icon"
							href="https://x.com/vitalii_sazanov"
							target="_blank"
							rel="noreferrer"
						>
							<XIcon />
						</a>
					</div>
					<button
						className="btn btn-solid md:order-1"
						onClick={copyEmail}
						title="Copy email address"
						type="button"
					>
						{EMAIL}
					</button>
				</div>
			</div>
		</section>
	);
}
