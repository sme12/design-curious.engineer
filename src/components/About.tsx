import { HandHeading } from "./HandHeading";

export function About() {
	return (
		<section className="pt-12 pb-15 md:py-section 2xl:py-23">
			<div className="mx-auto max-w-content px-gutter md:grid md:grid-cols-[235px_1fr] md:items-start md:px-0 2xl:max-w-content-xl 2xl:grid-cols-[272px_1fr]">
				<HandHeading as="h1">about Vitalii</HandHeading>
				{/* TODO: placeholder copy — written to set the layout, not to ship */}
				<div className="mt-10 space-y-6 text-pretty md:mt-0 2xl:space-y-8">
					<p className="text-body 2xl:text-body-xl">
						I've spent most of my career in the seam between design and
						engineering, and I've never been much good at picking a side. What
						started as nudging CSS until a layout finally felt right turned into
						a decade of building for the web — and into a stubborn belief that
						the two crafts are really one craft wearing different hats.
					</p>
					<p className="text-body 2xl:text-body-xl">
						In practice that means I like the unglamorous parts. The state
						nobody designed for. The animation that's 80ms too slow. The
						component that works fine until someone resizes the window. I care
						about the details that are easy to skip and impossible to unsee, and
						I'd rather ship one thing that holds up than five that almost do.
					</p>
					<p className="text-body 2xl:text-body-xl">
						Away from the screen I'm usually reading, taking photos I never get
						around to sorting, or explaining to someone why their favourite app
						has a bad empty state. This site is where I put the things I make
						for myself — half finished, occasionally finished, always something
						I was curious about first.
					</p>
				</div>
			</div>
		</section>
	);
}
