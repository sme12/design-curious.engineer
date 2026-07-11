import { Card } from "./Card";
import { HandHeading } from "./HandHeading";

export function ByNight() {
	return (
		<section className="relative overflow-x-clip">
			<div className="clip-angle-y bg-(image:--gradient-surface-radial) pt-17 pb-20 md:mask-torn-y md:py-35.5 md:[clip-path:none] 2xl:py-42">
				<div className="mx-auto max-w-content px-gutter md:grid md:grid-cols-[235px_1fr] md:items-start md:px-0 2xl:max-w-content-xl 2xl:grid-cols-[376px_1fr]">
					<HandHeading className="text-paper">
						by night &amp; weekends
					</HandHeading>
					<div className="mt-10 flex flex-col gap-11.5 md:mt-0 2xl:gap-14">
						<Card
							badge="Study"
							cta="have a look"
							href="https://25600.design"
							title="25600.design"
						>
							Reverse-engineering, recreating, and studying exceptional UIs
							built with uncommon craft and care.
						</Card>
						<Card badge="Soon" title="New Project">
							A new project is cooking!
						</Card>
					</div>
				</div>
			</div>
			<div
				aria-hidden="true"
				className="mask-torn-t -left-3 absolute top-3 h-9 w-[calc(100%+48px)] origin-top-left rotate-[atan2(-24px,100vw)] bg-ink-secondary md:hidden"
			/>
			<div
				aria-hidden="true"
				className="mask-torn-b -left-3 absolute top-[calc(100%-24px)] h-9 w-[calc(100%+48px)] origin-top-left rotate-[atan2(-24px,100vw)] bg-ink-secondary md:hidden"
			/>
		</section>
	);
}
