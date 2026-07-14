import { Card } from "./Card";
import { HandHeading } from "./HandHeading";

const PREVIEW_25600 = {
	src: "/media/25600/preview.mp4",
	poster: "/media/25600/preview.jpg",
};

export function ByNight() {
	return (
		<section className="relative overflow-x-clip">
			<div className="clip-angle-y bg-(image:--gradient-surface-radial) pt-17 pb-20 md:mask-torn-y md:py-26 md:[clip-path:none] 2xl:py-29">
				<div className="mx-auto max-w-content px-gutter md:grid md:grid-cols-[235px_1fr] md:items-start md:px-0 2xl:max-w-content-xl 2xl:grid-cols-[272px_1fr]">
					<HandHeading className="text-paper">
						by night &amp; weekends
					</HandHeading>
					<div className="mt-10 flex flex-col gap-10 md:mt-0 2xl:gap-12">
						<div className="space-y-6 text-pretty 2xl:space-y-8">
							<p className="text-body text-paper-muted 2xl:text-body-xl">
								They say turning your hobby into a job kills the hobby. Well,
								mine survived. I still spend my evenings and weekends on
								personal projects, learning, and experimentation.
							</p>
							<p className="text-body text-paper-muted 2xl:text-body-xl">
								Here's what I'm currently{" "}
								<strong className="font-semibold">nerding out</strong> about:
							</p>
						</div>
						<Card
							backgroundVideo={PREVIEW_25600}
							badge="Study"
							cta="have a look"
							href="https://github.com/sme12/25600/"
							title="25600.design"
						>
							<p>
								Reverse-engineering and rebuilding UIs crafted with exceptional
								taste, to understand what makes them work.
							</p>
							<p>
								Named after Figma’s maximum zoom level — 25,600% is as close as
								you can get to the details.
							</p>
						</Card>
					</div>
				</div>
			</div>
			<div
				aria-hidden="true"
				className="mask-torn-t -left-3 absolute top-3 h-9 w-[calc(100%+48px)] origin-top-left rotate-[atan2(-24px,100vw)] bg-surface-deep md:hidden"
			/>
			<div
				aria-hidden="true"
				className="mask-torn-b -left-3 absolute top-[calc(100%-24px)] h-9 w-[calc(100%+48px)] origin-top-left rotate-[atan2(-24px,100vw)] bg-surface-deep md:hidden"
			/>
		</section>
	);
}
