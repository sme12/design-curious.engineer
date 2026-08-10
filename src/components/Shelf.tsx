import type { CSSProperties } from "react";
import type { Book, ShelfSlug } from "../config/shelves";
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
//
// Three across on phones rather than four: at 390px four columns puts a cover
// under 80px, which is below the point where a title on a cover is still
// legible — and the shelf is a thing you read, not a texture.
const COLUMNS_NARROW = 3;
const COLUMNS = 4;

// Every cell is a 2:3 box, which is what keeps the rows a uniform height and
// lets the planks be positioned off nothing but percentages.
const CELL_RATIO = 2 / 3;

// A shelf that ends mid-row ends in a hole, so the last row gets a plant. Two
// free slots is the threshold: with one, the plant is wedged against the last
// book and the row just reads as full — the gap is what makes it a shelf with
// room on it rather than a grid that ran out of books.
const PLANT_MIN_GAP = 2;

// The plant keeps a book's cell — one column, 2:3 — and slides right to the
// middle of the empty stretch, rather than taking a cell as wide as the stretch
// is. A cell that wide has no height a book agrees with: the row is sized by
// its contents, so a plant measured against its own cell ends up setting the
// row height and lifting every book in the row off the plank.
//
// How far it slides is the only thing the layout has to say, and it says it as
// a number of free cells. Written out per count because Tailwind only generates
// the class names it can read in the source, and an interpolated one isn't
// there to be read.
//
// The counts that can occur are set by the column math: a last row is short by
// one less than the column count at most, so three columns leave 0 to 2 free
// and four leave 0 to 3. Since the plant wants two, narrow has exactly one
// number to say and wide has two.
const PLANT_GAP_NARROW = "[--plant-gap:2]";
const PLANT_GAP_WIDE: Record<number, string> = {
	2: "md:[--plant-gap:2]",
	3: "md:[--plant-gap:3]",
};

// Covers run from 0.62 to 0.80 wide-to-tall. At the full column width the tall
// ones would outgrow the cell and push the row — and the shelf line — down, so
// narrow those until they fit; the rest keep the column. Nothing is cropped.
function coverWidth(book: Book) {
	if (!book.coverWidth || !book.coverHeight) return "100%";
	const ratio = book.coverWidth / book.coverHeight;
	return `${Math.min(1, ratio / CELL_RATIO) * 100}%`;
}

// How thick the book is, as a share of its own width — the page block on the
// right is sized off this. A shelf where every book is the same thickness reads
// as a pattern rather than as books, and Goodreads gives us no page count, so
// this is a hash of the id: arbitrary, but stable, so a book doesn't change
// thickness between renders.
const THINNEST = 10;
const THICKEST = 19;

function bookThickness(id: string) {
	let hash = 0;
	for (const character of id) {
		hash = (hash * 31 + character.charCodeAt(0)) % 9973;
	}
	return `${THINNEST + (hash % (THICKEST - THINNEST + 1))}%`;
}

export function Shelf({ slug }: { slug: ShelfSlug }) {
	const books = SHELF_DATA[slug];

	// A shelf with no books is no shelf: rendering on would leave a plank with
	// nothing standing on it, which reads as a bug rather than as an empty shelf.
	if (books.length === 0) return null;

	// One plank per row of books, the last one included even where it carries a
	// single title — a shelf runs the length of the wall either way.
	//
	// Fewer columns means more rows, so the narrow layout needs the most planks
	// and the wide one hides the surplus. Rendering the larger count and dropping
	// the extras in CSS keeps this a single server-rendered tree: the breakpoint
	// is the browser's to decide, and nothing here can know it.
	const narrowRows = Math.ceil(books.length / COLUMNS_NARROW);
	const wideRows = Math.ceil(books.length / COLUMNS);
	const plankRows = Array.from({ length: narrowRows }, (_, index) => index);

	// Same split for the plant: how much of the last row is left over depends on
	// how many columns there are, so each layout counts its own free slots and
	// the plant is hidden in whichever one hasn't got the room. Since it only
	// appears where two slots are free, it always drops into an existing hole —
	// it can never push the shelf onto another row.
	const narrowGap = narrowRows * COLUMNS_NARROW - books.length;
	const wideGap = wideRows * COLUMNS - books.length;
	const showsNarrow = narrowGap >= PLANT_MIN_GAP;
	const showsWide = wideGap >= PLANT_MIN_GAP;
	const plantCell = [
		showsNarrow ? "block" : "hidden",
		showsWide ? "md:block" : "md:hidden",
		showsNarrow && PLANT_GAP_NARROW,
		showsWide && PLANT_GAP_WIDE[wideGap],
	]
		.filter(Boolean)
		.join(" ");

	return (
		/* --shelf-depth is the plank's front-to-back size; the row gap and the
		   plank's placement are both derived from it in styles.css, so these
		   three numbers are the whole responsive story. The padding is the
		   room the last plank hangs into, below the final row of books.
		   --book-gap is the space between books within a row. It lives here as
		   a variable rather than as a gap utility because styles.css needs the
		   same number to widen each book's hover target across it. */
		<div className="pb-[calc(0.16*var(--shelf-depth)+8px)] [--book-gap:0.5rem] [--shelf-depth:57px] md:[--book-gap:0.75rem] md:[--shelf-depth:72px] 2xl:[--book-gap:1rem] 2xl:[--shelf-depth:90px]">
			<div className="relative">
				{/* Covers are deliberately small: the content column is 405px at
				    md, so four across leaves ~92px cards (three across a 390px
				    phone leaves ~109px), and the covers Goodreads serves top out
				    around 380px wide — comfortably above 2x.
				    z-10 puts the books in front of the planks: they stand halfway
				    back on the surface, so each one has to hide the bit of shelf
				    behind it. */}
				<ul className="shelf-rows relative z-10 grid grid-cols-3 gap-x-(--book-gap) md:grid-cols-4">
					{books.map((book) => (
						// The cell is a fixed 2:3 box the cover sits at the bottom of.
						// Rows have to be a uniform height for the planks to land, and
						// books have to touch the shelf rather than float above it.
						// It's also what the hover is on, not the cover — see .book-slot
						// in styles.css.
						<li
							className="book-slot relative flex aspect-2/3 items-end"
							key={book.id}
						>
							{/* The hover turns the book on its axis and walks it forward
							    off the shelf. It pivots on its base, so it stays standing
							    on the plank rather than lifting off it. */}
							<a
								// The link's whole content is a picture, so it has to name
								// itself. Said once, here, rather than assembled from the
								// cover's alt plus a visually-hidden tail: this is the
								// accessible name whether or not the image exists, whether
								// or not there is a cover at all.
								aria-label={`${book.title} on Goodreads (opens in a new tab)`}
								className="book relative mx-auto block rounded-xs"
								href={book.link}
								rel="noreferrer"
								style={
									{
										width: coverWidth(book),
										// Read by .book-edge in styles.css, as a share of the
										// cover's own width — so the page block comes out the
										// right size at every breakpoint with no second set of
										// numbers.
										"--book-thickness": bookThickness(book.id),
									} as CSSProperties
								}
								target="_blank"
							>
								{/* The pool the book casts on the plank once it lifts.
								    Outside the body, so it stays flat on the shelf while
								    the book above it turns. */}
								<span className="book-cast" />
								<span className="book-body">
									{book.cover ? (
										// Kept as real alt text rather than alt="" even though
										// the link is labelled: a cover that fails to load
										// should still say which book it was.
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
									{/* The side of the book, folded flat behind the cover
									    until the turn brings it round. */}
									<span className="book-edge" />
								</span>
							</a>
						</li>
					))}
					{(showsNarrow || showsWide) && (
						// A book's cell — same column, same 2:3, same baseline — slid
						// across to the middle of the free stretch. Out of the
						// accessibility tree entirely: it says nothing about the shelf
						// that the list of titles doesn't, and an empty item in a list
						// of books is worse than no item at all.
						<li
							aria-hidden="true"
							className={`shelf-plant-slot relative aspect-2/3 ${plantCell}`}
						>
							{/* The plant's own box, so the shadow has something the
							    size of the plant to be a percentage of rather than
							    the cell, which is a book's width and a book's ratio. */}
							<span className="shelf-plant-stand">
								<span className="shelf-plant-cast" />
								<img
									alt=""
									className="shelf-plant"
									height={421}
									loading="lazy"
									src="/plant.webp"
									width={400}
								/>
							</span>
						</li>
					)}
				</ul>
				{/* The planks ride in a second grid behind the first. Same rows,
				    same gap, so every row's bottom edge is a shelf line — and the
				    books keep a list to themselves. Slightly wider than the books,
				    the way a real shelf overshoots what stands on it.

				    auto-rows-fr rather than an explicit template: the rows that
				    exist are the planks that weren't hidden, and they split the
				    height evenly either way, so the row count never has to be
				    written down twice. */}
				<div
					aria-hidden="true"
					className="shelf-rows pointer-events-none absolute -inset-x-1.5 top-0 bottom-0 grid auto-rows-fr"
				>
					{plankRows.map((row) => (
						// The rows only the narrow layout has leave the grid entirely
						// once there are four columns — display:none, so they take
						// their grid track with them.
						<div
							className={row < wideRows ? "relative" : "relative md:hidden"}
							key={row}
						>
							<ShelfPlank />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
