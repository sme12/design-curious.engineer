import { GitHubIcon, LinkedInIcon, XIcon } from "./icons";
import { Polaroid } from "./Polaroid";

const EMAIL = "vitalii@sazanov.dev";

function copyEmail() {
	void navigator.clipboard.writeText(EMAIL);
}

export function Hero() {
	return (
		<section className="relative overflow-x-clip">
			<div className="clip-angle-b bg-(image:--gradient-surface) pt-18.5 pb-16 md:mask-torn-b md:[clip-path:none] md:pt-39.5 md:pb-25 2xl:pt-47 2xl:pb-30">
				<div className="relative mx-auto max-w-content px-gutter md:px-0 2xl:max-w-content-xl">
					<p className="text-display text-paper md:text-display-lg 2xl:text-display-xl">
						Hi, I'm Vitalii —
						<br />a design-
						<span className="relative">
							<span aria-hidden="true" className="opacity-0">
								curious
							</span>
							<span className="-translate-y-1/2 absolute top-1/2 left-0 whitespace-nowrap font-hand font-medium text-gradient-accent text-script md:text-script-lg 2xl:text-script-xl">
								curious
							</span>
						</span>
						<br />
						engineer
					</p>
					<Polaroid className="mt-6 md:-top-11 md:absolute md:left-101.25 md:mt-0 md:rotate-[7.55deg] 2xl:-top-16 2xl:right-24 2xl:left-auto" />
					<div className="mt-8 flex items-center gap-4 md:mt-12.5 md:gap-3.5 2xl:mt-15">
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
							className="btn btn-solid md:order-1 2xl:text-small-xl"
							onClick={copyEmail}
							title="Copy email address"
							type="button"
						>
							{EMAIL}
						</button>
					</div>
				</div>
			</div>
			<div
				aria-hidden="true"
				className="mask-torn-b -left-3 absolute top-[calc(100%-24px)] h-9 w-[calc(100%+48px)] origin-top-left rotate-[atan2(-24px,100vw)] bg-ink-secondary md:hidden"
			/>
		</section>
	);
}
