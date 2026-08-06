import { type Book, SHELVES, type ShelfSlug } from "../config/shelves";
import workReads from "../data/shelves/work-reads.json";

// Plain module imports — the JSON is committed, so the shelf is part of the
// SSR'd HTML with no loader, no server function, no runtime fetch. A new shelf
// adds an import and a line here.
const SHELF_DATA: Record<ShelfSlug, Book[]> = {
	"work-reads": workReads,
};

export function Shelf({ slug }: { slug: ShelfSlug }) {
	const books = SHELF_DATA[slug];

	// The heading lives inside the component so an empty shelf takes it along.
	// On the page it would survive and orphan itself above nothing.
	if (books.length === 0) return null;

	const { heading } = SHELVES.find((shelf) => shelf.slug === slug) ?? {};

	return (
		<section>
			<h3 className="font-semibold text-paper text-small 2xl:text-small-xl">
				{heading}
			</h3>
			{/* Draft layout — spacing, columns and the hover treatment are still
			    open (docs/goodreads-shelf.md). Cards are deliberately small: the
			    content column is 405px at md, and the covers Goodreads serves top
			    out around 380px wide, so ~100px is the size that stays crisp at 2x. */}
			<ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] items-start gap-4 2xl:mt-7 2xl:gap-5">
				{books.map((book) => (
					<li key={book.id}>
						<a
							className="block rounded-xs transition-[opacity,scale] duration-200 ease-out-cubic hover:scale-103 hover:opacity-90"
							href={book.link}
							rel="noreferrer"
							target="_blank"
							// Pointer devices get the title on hover. Touch devices get
							// nothing extra — tapping opens the full Goodreads record,
							// and a tap-to-reveal would compete for the same gesture.
							title={book.title}
						>
							{book.cover ? (
								<img
									alt={book.title}
									className="h-auto w-full rounded-xs shadow-md"
									height={book.coverHeight ?? undefined}
									loading="lazy"
									src={book.cover}
									width={book.coverWidth ?? undefined}
								/>
							) : (
								// No broken <img> ever ships.
								<span className="flex aspect-2/3 items-center rounded-xs bg-surface-deep p-2 font-medium text-caption text-paper-muted 2xl:text-caption-xl">
									{book.title}
								</span>
							)}
							<span className="sr-only">
								{" on Goodreads (opens in a new tab)"}
							</span>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
