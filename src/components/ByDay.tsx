import { BouncingUnderlineLink } from "./BouncingUnderlineLink";
import { HandHeading } from "./HandHeading";

export function ByDay() {
	return (
		<section className="pt-12 pb-15 md:py-section 2xl:py-26">
			<div className="mx-auto max-w-content px-gutter md:grid md:grid-cols-[235px_1fr] md:items-start md:px-0 2xl:max-w-content-xl 2xl:grid-cols-[272px_1fr]">
				<HandHeading>by day</HandHeading>
				<div className="mt-10 space-y-6 text-pretty md:mt-0 2xl:space-y-8">
					<p className="text-body 2xl:text-body-xl">
						Lead developer at{" "}
						<BouncingUnderlineLink
							href="https://www.kraftvaerk.com/"
							leading={
								<img
									alt=""
									className="inline-block size-4.5 rounded-xs align-text-bottom 2xl:size-5 mx-0.5"
									src="/kraftvaerk.png"
								/>
							}
							rel="noreferrer"
							target="_blank"
						>
							Kraftvaerk
						</BouncingUnderlineLink>
						, helping prominent companies across the Nordics{" "}
						<strong className="font-semibold">grow digitally</strong>.
					</p>
					<p className="text-body 2xl:text-body-xl">
						I tackle complex problems at the{" "}
						<strong className="font-semibold">
							intersection of design and engineering
						</strong>
						, bringing <span className="font-hand font-medium">curiosity</span>,
						uncommon care, and my full commitment.
					</p>
					<p className="text-body 2xl:text-body-xl">
						There’s a good chance I’ve helped shape the{" "}
						<strong className="font-semibold">
							seamless digital experiences
						</strong>{" "}
						you’ve had with some of your{" "}
						<BouncingUnderlineLink
							href="https://www.kraftvaerk.com/cases/"
							rel="noreferrer"
							target="_blank"
						>
							favorite brands
						</BouncingUnderlineLink>{" "}
						from Finland and Denmark.
					</p>
				</div>
			</div>
		</section>
	);
}
