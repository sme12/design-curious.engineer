import { type Book, SHELVES, type ShelfSlug } from "../config/shelves";
import workReads from "../data/shelves/work-reads.json";
import { ShelfPlank } from "./ShelfPlank";

// Plain module imports — the JSON is committed, so the shelf is part of the
// SSR'd HTML with no loader, no server function, no runtime fetch. A new shelf
// adds an import and a line here.
const SHELF_DATA: Record<ShelfSlug, Book[]> = {
	"work-reads": workReads,
};

// Fixed rather than auto-filling, so the row count is known at render time and
// each row can be handed a plank. An auto-fill grid decides its columns in the
// browser, which leaves the planks with nothing to line up against.
const COLUMNS = 4;

// Every cell is a 2:3 box, which is what keeps the rows a uniform height and
// lets the planks be positioned off nothing but percentages.
const CELL_RATIO = 2 / 3;

// Covers run from 0.62 to 0.80 wide-to-tall. At the full column width the tall
// ones would outgrow the cell and push the row — and the shelf line — down, so
// narrow those until they fit; the rest keep the column. Nothing is cropped.
function coverWidth(book: Book) {
	if (!book.coverWidth || !book.coverHeight) return "100%";
	const ratio = book.coverWidth / book.coverHeight;
	return `${Math.min(1, ratio / CELL_RATIO) * 100}%`;
}

export function Shelf({ slug }: { slug: ShelfSlug }) {
	const books = SHELF_DATA[slug];

	// The heading lives inside the component so an empty shelf takes it along.
	// On the page it would survive and orphan itself above nothing.
	if (books.length === 0) return null;

	const { heading } = SHELVES.find((shelf) => shelf.slug === slug) ?? {};

	// One plank per row of books, the last one included even where it carries a
	// single title — a shelf runs the length of the wall either way.
	const plankRows = Array.from(
		{ length: Math.ceil(books.length / COLUMNS) },
		(_, index) => index + 1,
	);

	return (
		<section>
			<h3 className="font-semibold text-paper text-small 2xl:text-small-xl">
				{heading}
			</h3>
			{/* --shelf-depth is the plank's front-to-back size; the row gap and the
			    plank's placement are both derived from it in styles.css, so these
			    three numbers are the whole responsive story. The padding is the
			    room the last plank hangs into, below the final row of books. */}
			<div className="mt-6 pb-[calc(0.16*var(--shelf-depth)+8px)] [--shelf-depth:57px] md:[--shelf-depth:72px] 2xl:mt-7 2xl:[--shelf-depth:90px]">
				<div className="relative">
					{/* Covers are deliberately small: the content column is 405px at
					    md, so four across leaves ~92px cards, and the covers Goodreads
					    serves top out around 380px wide — comfortably above 2x.
					    z-10 puts the books in front of the planks: they stand halfway
					    back on the surface, so each one has to hide the bit of shelf
					    behind it. */}
					<ul className="shelf-rows relative z-10 grid grid-cols-4 gap-x-2 md:gap-x-3 2xl:gap-x-4">
						{books.map((book) => (
							// The cell is a fixed 2:3 box the cover sits at the bottom of.
							// Rows have to be a uniform height for the planks to land, and
							// books have to touch the shelf rather than float above it.
							<li className="flex aspect-2/3 items-end" key={book.id}>
								{/* The hover grows the book from its base rather than its
								    middle, so it stays standing on the shelf instead of
								    lifting off it. */}
								<a
									className="mx-auto block origin-bottom rounded-xs transition-[scale] duration-200 ease-out-cubic hover:scale-103"
									href={book.link}
									rel="noreferrer"
									style={{ width: coverWidth(book) }}
									target="_blank"
									// Pointer devices get the title on hover. Touch devices get
									// nothing extra — tapping opens the full Goodreads record,
									// and a tap-to-reveal would compete for the same gesture.
									title={book.title}
								>
									{book.cover ? (
										<img
											alt={book.title}
											className="h-auto w-full rounded-xs shadow-book"
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
					{/* The planks ride in a second grid behind the first. Same rows,
					    same gap, so every row's bottom edge is a shelf line — and the
					    books keep a list to themselves. Slightly wider than the books,
					    the way a real shelf overshoots what stands on it. */}
					<div
						aria-hidden="true"
						className="shelf-rows pointer-events-none absolute -inset-x-1.5 top-0 bottom-0 grid"
						style={{
							gridTemplateRows: `repeat(${plankRows.length}, 1fr)`,
						}}
					>
						{plankRows.map((row) => (
							<div className="relative" key={row}>
								<ShelfPlank />
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
