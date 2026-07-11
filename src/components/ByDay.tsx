import { HandHeading } from "./HandHeading";

export function ByDay() {
	return (
		<section className="pt-12 pb-15 md:py-section 2xl:py-39">
			<div className="mx-auto max-w-content px-gutter md:grid md:grid-cols-[235px_1fr] md:items-start md:px-0 2xl:max-w-content-xl 2xl:grid-cols-[376px_1fr]">
				<HandHeading>by day</HandHeading>
				<p className="mt-10 text-body md:mt-0 2xl:text-body-xl">
					Lead developer at{" "}
					<a
						className="whitespace-nowrap underline underline-offset-4 decoration-from-font transition-colors hover:text-ink-tertiary"
						href="https://www.kraftvaerk.com/"
						rel="noreferrer"
						target="_blank"
					>
						<img
							alt=""
							className="inline-block size-4.5 rounded-xs align-text-bottom 2xl:size-5"
							src="/kraftvaerk.png"
						/>{" "}
						Kraftvaerk
					</a>
					, helping prominent companies across the Nordics{" "}
					<strong className="font-semibold">grow digitally</strong>.
				</p>
			</div>
		</section>
	);
}
