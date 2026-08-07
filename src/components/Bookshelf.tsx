import { BouncingUnderlineLink } from "./BouncingUnderlineLink";
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
					<div className="space-y-6 2xl:space-y-8">
						<p className="text-body text-paper-muted 2xl:text-body-xl">
							This shelf comes straight from Goodreads. It holds books that have
							helped me grow as an engineer, designer, and leader, and it
							updates whenever I finish one. Click a cover to see it on
							Goodreads.
						</p>
					</div>
					<Shelf slug="work-reads" />
					<p className="text-body text-paper-muted 2xl:text-body-xl">
						See everything I read, including the books I hope will not only make
						me a better professional but also a better person, on my{" "}
						<BouncingUnderlineLink
							className="text-paper hover:text-paper-muted"
							href="https://www.goodreads.com/user/show/107695305-vitalii"
							rel="noreferrer"
							target="_blank"
						>
							Goodreads profile
						</BouncingUnderlineLink>
						.
					</p>
				</div>
			</div>
		</TornSurface>
	);
}
