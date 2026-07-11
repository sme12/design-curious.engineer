import { HandHeading } from "./HandHeading";

export function ByDay() {
	return (
		<section className="pt-12 pb-15 md:py-section">
			<div className="mx-auto max-w-content px-gutter md:grid md:grid-cols-[235px_1fr] md:items-start md:px-0">
				<HandHeading>by day</HandHeading>
				<p className="mt-10 text-body md:mt-0">
					Lead developer at{" "}
					<a
						className="whitespace-nowrap underline underline-offset-4 decoration-from-font transition-colors hover:text-ink-tertiary"
						href="https://www.kraftvaerk.com/"
						rel="noreferrer"
						target="_blank"
					>
						<img
							alt=""
							className="inline-block size-4.5 rounded-xs align-text-bottom"
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
