import { HandHeading } from "./HandHeading";
import { Shelf } from "./Shelf";
import { TornSurface } from "./TornSurface";

export function Bookshelf() {
	return (
		<TornSurface
			className="bg-(image:--gradient-surface-radial) pt-17 pb-20 md:py-26 2xl:py-29"
			edges="both"
		>
			<div className="mx-auto max-w-content px-gutter md:grid md:grid-cols-[235px_1fr] md:items-start md:px-0 2xl:max-w-content-xl 2xl:grid-cols-[272px_1fr]">
				<HandHeading className="text-paper">bookshelf</HandHeading>
				<div className="mt-10 space-y-10 text-pretty md:mt-0 2xl:space-y-12">
					{/* TODO: placeholder copy — written to set the layout, not to ship */}
					<p className="text-body text-paper-muted 2xl:text-body-xl">
						I read slowly and re-read often. Most of what shaped how I work came
						from books that had nothing to do with software, and a handful that
						had everything to do with it.
					</p>
					<Shelf slug="work-reads" />
				</div>
			</div>
		</TornSurface>
	);
}
