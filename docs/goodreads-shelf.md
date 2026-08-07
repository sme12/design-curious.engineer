# Goodreads shelf

A shelf of book covers on `/about`, sourced from a Goodreads custom shelf.
Read-only, covers only, each linking out to Goodreads.

## How it works

```
Goodreads RSS  ──►  scripts/sync-shelves.ts  ──►  src/data/shelves/*.json   ─┐
 (CI only)           (manual GitHub Action)       public/covers/*.webp      │
                                                  assets/covers-raw/*       │
                                                          │                 │
                                                     committed              │
                                                          ▼                 │
                                      src/components/Shelf.tsx  ◄───────────┘
                                        (plain import, SSR'd)
```

Everything the site reads is committed to the repo. The site never talks to
Goodreads at runtime — it can't, since the feed blocks browser requests.

### Why the data is committed rather than fetched at build time

A production build runs from a clean throwaway checkout, so a build-time fetch
has no previous state to fall back to: one Goodreads outage would ship an empty
shelf. Committing the artifacts makes fail-soft structural rather than something
to implement. It also means a sync only triggers a deploy when the data actually
changed.

## Running a sync

Manual only, for now. After finishing a book:

- **GitHub** — Actions tab → _Sync Goodreads shelves_ → **Run workflow**.
  It commits and pushes only if `git status --porcelain` is non-empty.
- **Locally** — `npm run sync-shelves`, then commit the result.

To go back to a daily sync, uncomment the `schedule` block in
[`.github/workflows/sync-shelves.yml`](../.github/workflows/sync-shelves.yml).

## Configuration

All of it lives in [`src/config/shelves.ts`](../src/config/shelves.ts), shared
by the sync script and the component:

```ts
export const SHELVES = [
    {
        slug: 'work-reads',
        heading: 'Books I read to become a better professional',
    },
] as const;

export const EXCLUDED_SHELVES = ['did-not-finish'];
export const COVER_WIDTH = 400;
export const GOODREADS_USER_ID = '107695305';
```

`EXCLUDED_SHELVES` is a named constant because the filter matches a literal
Goodreads shelf name — see [Failure modes](#failure-modes).

### Adding a second shelf

Shelves render as sections, not routes. A second shelf is:

1. A new entry in `SHELVES`.
2. `npm run sync-shelves`.
3. An import and a line in `SHELF_DATA` in `Shelf.tsx` (the import stays static
   so the JSON is bundled, not fetched).
4. A second `<Shelf slug="…" />` in `Bookshelf.tsx`.

Revisit dedicated routes only if a shelf outgrows a section.

## Data source

Goodreads retired its public API in December 2020 and issues no new developer
keys. The per-shelf RSS feed is the only remaining source:

```
https://www.goodreads.com/review/list_rss/{user_id}?shelf={slug}
```

Constraints inherited from the feed:

- **Caps at 100 items per shelf.** The script warns above 90.
- **Requires the profile and shelf to be public.**
- **Blocks direct browser requests**, so it is only ever fetched from CI.
- **An unknown shelf is not an error.** Goodreads ignores the parameter and
  serves the entire library instead. The script guards against this — see
  [Failure modes](#failure-modes).
- **`user_date_added` is mutated on edit** and is not the date the book was
  shelved. `user_date_created` is.
- **Timestamps carry a `-0700` offset.** Dates are read as the wall-clock date
  written in the feed; normalising to UTC would push evening timestamps onto
  the next day and break same-day grouping.
- **`user_read_at` is empty** for books backfilled in bulk.
- **Exposes a single `author_name`.** _The Pragmatic Programmer_ returns "Andy
  Hunt" with no Dave Thomas. Not fixable from RSS. Accepted — the author is not
  rendered.

## Data shape

`src/data/shelves/{slug}.json`, committed, pre-sorted, tab-indented so it passes
`biome check` like any other source file.

```ts
type Book = {
    id: string; // Goodreads book_id, stable, e.g. "41793"
    title: string; // alt text and accessible name, never rendered as text
    author: string; // retained, not rendered
    rating: number; // 0–5, retained, not rendered
    cover: string | null; // "/covers/41793.webp"
    coverWidth: number | null; // intrinsic size of the WebP, to reserve layout space
    coverHeight: number | null;
    readAt: string | null;
    shelvedAt: string;
    link: string; // https://www.goodreads.com/book/show/{id}
};
```

Dropped from the feed: `book_description` (publisher marketing copy, up to ~400
words per item), `average_rating` (crowd score, not the author's), `user_review`,
`num_pages`, `isbn`.

`rating` and `author` are retained despite not being displayed. `rating` is the
only non-date sort key available; `author` is one hover-design decision away
from being needed. Both cost nothing.

Feed titles carry series and subtitle cruft — _"Agile Estimating and Planning
(Robert C. Martin Series)"_. Stored verbatim, no cleanup. Titles are never laid
out as text, so length does not affect the grid.

## Sync script

[`scripts/sync-shelves.ts`](../scripts/sync-shelves.ts). Per shelf in `SHELVES`:

1. Fetch the RSS feed, parse with `fast-xml-parser`.
2. **Abort if the feed yields zero items.** Exit non-zero without writing.
   Never overwrite good data with an empty result.
3. **Abort if no item is actually on the requested shelf** (verified against
   each item's `user_shelves`). This catches the whole-library fallback.
4. Warn if the shelf holds ≥ 90 items.
5. Filter out any item whose `user_shelves` contains a value in
   `EXCLUDED_SHELVES`. Log the count filtered.
6. Sort by `readAt || shelvedAt`, descending. The sort is stable, so books
   sharing a date hold their feed order.
7. Resolve covers.
8. Write JSON.

Sorting happens here, once. The component never sorts.

The script is idempotent: a second run with no shelf changes produces no diff,
which is what keeps the Action from committing churn.

### What a failed run leaves behind

Writes are not staged: covers land as each book is processed, and each shelf's
JSON is written before the next shelf is fetched. A run that fails partway
through therefore leaves partial artifacts on disk.

Nothing partial ever reaches the site. The Action's commit step only runs if the
script exits 0, so a failed CI run is discarded with the runner's checkout.
Locally, every artifact is tracked by git, so `git restore .` undoes a
half-finished run.

The two aborts that matter — an empty feed and the whole-library fallback — both
fire before anything is written at all, since they are checked on the fetch.
Orphan cleanup is deliberately deferred until every shelf has succeeded, because
it deletes files rather than rewriting them.

## Cover pipeline

Two committed directories:

- `assets/covers-raw/{book_id}.{ext}` — full-resolution original, outside
  `public/`, never served.
- `public/covers/{book_id}.webp` — resized, quality 80, served.

Rules:

- **Source URL:** take `book_large_image_url` and strip the `._SX###_` /
  `._SY###_` segment to get the true original; sizes in the feed are
  inconsistent. Falls back to the sized URL if the stripped one 404s.
- **Decode before caching.** A 200 response is not a promise of an image;
  Goodreads sometimes answers with an error page. Bodies that Sharp cannot
  decode are treated exactly like a 404, so the fallback URL still gets its
  turn and nothing undecodable is ever written to `assets/covers-raw/`.
- **Skip if present.** If the raw file already exists, it is not re-downloaded.
  Covers are fetched from Goodreads exactly once per book, ever. The WebP is
  re-encoded from the raw on every run, so changing `COVER_WIDTH` takes effect
  without going back to Goodreads.
- **Resize by width only.** Never crop, never force an aspect ratio. Covers vary
  from squarish to tall, and cropping to a uniform box slices titles off. The
  grid takes them at their own proportions and lines their bottoms up on the
  shelf instead.
- **Never upscale.** See [Cover resolution](#cover-resolution).
- **Missing cover:** if the URL contains `nophoto`, or the download 404s, or
  neither URL yields a decodable image, no file is written and `cover` is
  `null`. One unavailable cover never fails the sync.
- **Self-healing raws.** If an existing raw stops decoding, it is deleted and
  the book falls back to `cover: null` for that run; the next sync re-fetches
  it. A bad file can't wedge the cache.
- **Orphan cleanup:** files in both directories whose `book_id` no longer
  appears in any shelf are deleted.

Keeping the raws means the WebP target size can change later without going back
to Goodreads — editions get delisted and those URLs rot. Since covers are the
entire visual, a redesign at a different card size is a re-encode, not a
re-fetch.

### Cover resolution

`COVER_WIDTH` is 400, but Goodreads' originals top out around **249–381px
wide** — the `_SX318_` / `_SY475_` suffixes are mostly no-ops, and stripping
them yields the same image. Covers are therefore stored at native size rather
than upscaled into fake resolution.

The practical consequence: a 200px-wide card renders at roughly 1.25–1.9x, not
2x. Four columns puts cards at ~92px in the 405px content column and ~120px on
wide screens, where even the narrowest cover in the shelf still clears 2x. Any
design landing on materially larger cards should decide whether that softness is
acceptable.

## Frontend

[`src/components/Shelf.tsx`](../src/components/Shelf.tsx), rendered inside
`/about` by `Bookshelf.tsx`.

**Data access.** A plain module import of the JSON. No server function, no
runtime fetch, no `await` in the loader. Server-rendered as part of `/about`.

**Layout.** Covers only — no title, author, or rating as text. Three columns
below `md` and four from `md` up, on cells of a fixed 2:3 ratio, with each cover
bottom-aligned inside its cell and narrowed (never cropped) if its own ratio is
taller than the cell. Three on phones because four across 390px puts a cover
under 80px, which is below the size at which the title on a cover can be read —
and the shelf is meant to be read, not to be texture.

**The planks.** Each row of books stands on a shelf: a thin slab built in CSS 3D
by [`ShelfPlank.tsx`](../src/components/ShelfPlank.tsx), styled in `styles.css`.
The planks live in a second grid overlaid on the list — same rows, same row gap
— so the list stays a plain list of books and the shelves stay decoration
(`aria-hidden`).

Two things follow from wanting books to *rest* on something, and both are why
the grid is no longer auto-filling:

- **The column count has to be known at render time.** An auto-filling grid
  decides its columns in the browser, which leaves the component unable to say
  how many rows — and therefore how many planks — there are.
- **Rows have to be a uniform height.** Covers are bottom-aligned rather than
  top-aligned, since the bottom edge is now a contact line.

Two column counts means two row counts, and the server can't know which one the
browser will pick. The component renders the *larger* count — the narrow
layout's — and the surplus planks carry `md:hidden`, so they leave the grid
entirely at the breakpoint where their rows stop existing. The plank grid sizes
its tracks with `auto-rows-fr` rather than an explicit `repeat()`, so the rows
that survive split the height evenly on their own and the row count never has to
be written down a second time.

One custom property, `--shelf-depth`, is the plank's front-to-back size and the
only number that changes across breakpoints: the row gap and the plank's
placement are both derived from it, since the projected geometry of the tipped
slab is a fixed multiple of its depth.

**The finish is dark.** The shelf started life light gray — a `#e3e3e3` surface
over a `#464646`–`#9c9c9c` edge — which put the brightest thing on the page
underneath the books rather than in them. It's graphite now: `#6b6b6b` falling
to `#494949` across the surface, over a `#1a1a1a`–`#3b3b3b` edge. Same lighting,
same shading, moved down the scale. Two parts of it had to change shape rather
than value to stay that way:

- **The edge tracks the surface by ratio, not by offset.** On the light plank
  the lip sat 37 steps below the front of the surface; carrying that difference
  down puts the bottom of the edge below black. The ratio is the physical
  relationship anyway — a vertical face turned away from the key light keeps a
  *fraction* of it, it doesn't lose a fixed amount — so the ramp is now the old
  ramp's proportions, 0.36 to 0.81 of the surface's front stop.
- **Every white overlay came down.** `rgb(255 255 255 / 0.32)` lifts `#e3e3e3`
  by nine steps and a base this dark by forty-seven, so the alphas that read as
  satin on the light plank read as wet chrome here; they're set to land roughly
  the old absolute lift instead. The sweep's troughs went the other way. They
  were gray — darker than the old base, *lighter* than this one — so they'd have
  come out as bands of light. They're black now.

**The heading lives inside the component.** If the shelf is empty the component
returns `null`, taking the heading with it. A heading placed on the About page
would survive an empty shelf and orphan itself above nothing.

**The turn.** On hover the book rotates on its vertical axis and moves toward
the camera, which opens up its right-hand side — so `.book-edge` is there to be
found: a strip as wide as the book is thick, hinged on the cover's right edge
and folded a quarter turn backwards. Edge-on it projects to nothing, so at rest
the shelf renders exactly as it did before, and one element covers the whole
effect.

- The book pivots on its **bottom edge**, and the perspective origin sits low,
  so it stays standing on the plank. Rotating about the middle lifts it off.
- It steps forward on **Z rather than scaling up** — the perspective does the
  growing, so it reads as coming toward you off the shelf instead of inflating
  in place.
- Thickness is a **percentage of the cover's own width**, so the page block is
  the right size at every breakpoint with no second set of numbers. The value
  per book is a hash of its Goodreads id: Goodreads gives us no page count, and
  a shelf where every book is the same thickness reads as a pattern rather than
  as books.
- The hover half is gated behind `@media (hover: hover)`; `:focus-visible` gets
  the same turn, so keyboard users see the book they're on.

**What you hover is the cell, not the cover** — `.book-slot`, the `<li>`, with a
`::before` reaching half the column gap out on either side. Two gaps sit between
one cover and the next: the column gap itself, and the slack either side of a
cover too narrow to fill its cell (which is most of them — see `coverWidth`).
With the hover on the cover, crossing either one un-hovers everything, and
sliding along a row flashes the whole shelf back to full brightness between
books. The cell closes the second gap and the `::before` closes the first,
reaching *exactly* half the gap so neighbouring targets meet rather than overlap.
The pseudo-element is transparent and is drawn before the anchor, so the link
still takes the clicks over the cover.

The gap is a variable, `--book-gap`, set per breakpoint next to `--shelf-depth`
and fed to the grid — the hover target has to be widened by the same number the
grid is spaced by, and there should only be one of it.

The **row** gap is deliberately left open. That one is shelf, not a seam between
neighbours, and there's no flicker to fix in a movement nothing is chasing across.

**Two shadows, and why one of them isn't a `box-shadow`.** The resting shadow is
`--shadow-book` on the cover, and it is never animated: it's the book's own
contact line, so it belongs to the book and should travel with it. The pool the
lifted book casts on the plank is a separate blurred element, `.book-cast`,
sitting outside the rotating body. Animating a `box-shadow` instead would repaint
the book every frame — a shadow can't be composited — and inside a rotating
`preserve-3d` element that flickers. Only `opacity` and `transform` move on the
cast, so the blur is painted once. It's also the correct geometry: a shadow on
the cover turns with the cover, when a pool on a shelf should stay on the shelf.
It's weighted toward its own top edge, since a pool centred on the contact line
spends its dark core behind the cover and only clears it where it has already
faded — but it ramps *in* over the first quarter rather than opening at full
strength, because the top of the box is a hard boundary and the book only stands
over part of it.

The cast is sized off `--shelf-depth`, not off the cover. What's in front of the
book is *shelf*, and the surface between the book's baseline and the front lip
is `0.16 × depth`. Measured as a share of the cover instead, the pool runs off
the front of the plank on wide screens, where the covers grow faster than the
planks do. Its ends are masked for the same reason `.shelf-cast`'s are: a
gradient that stops square reads as a smudge.

**The rest of the shelf steps back.** While one book is hovered, every other
book takes `filter: brightness(0.64) saturate(0.85)`, and the planks take
`brightness(0.82)`. Two things worth knowing about it:

- The rule is written as `.shelf-rows:has(.book-slot:hover) .book-slot:not(:hover)
  .book`, so **nothing carries a filter at rest**. That keeps the resting shelf
  byte-for-byte what it was, and keeps every book off the compositor until it has
  a reason to be there. Scoping to `.shelf-rows` rather than the page means a
  shelf only ever dims its own books.
- The planks dim, but **less far**. They're one continuous surface running under
  the hovered book as well as the rest, so taking them as dark as the books would
  cut the one book meant to stand in the light off from what it's standing on.
  Leaving them undimmed is worse still: the brightest thing on a shelf full of
  dimmed books ends up being the furniture.

A `filter` on `.book` sounds like it should flatten the `preserve-3d` body
underneath it. It doesn't — `.book` carries `perspective`, not `preserve-3d`, and
a book that is dimmed *and* mid-turn (which happens whenever you move from one
book straight to the next) still renders its page block in 3D.

**Interaction.** The whole card links to `book.link` on Goodreads. No `title`
attribute: the browser tooltip is unstyleable, arrives on its own schedule,
never appears on touch, and can't be reached from the keyboard — it was
duplicating the accessible name for the one group of users who already had it.
The title is not surfaced on tap either; tapping opens the full Goodreads
record, and a tap-to-reveal state would compete with the link for the same
gesture.

**Accessibility.**

- **The link names itself.** An `aria-label` on the anchor — the title, then
  _"on Goodreads (opens in a new tab)"_. The link's entire content is a
  picture, so the name is
  stated once, in one place, rather than assembled from the cover's `alt` plus a
  visually-hidden tail — it comes out the same whether the image loads, and the
  same for the books that have no cover at all.
- **Covers keep real `alt` text** — `alt={title}`, never `alt=""`, even though
  the link is labelled and the `alt` is therefore not what gets announced. A
  cover that fails to load should still say which book it was.
- **The focus ring is the cell's**, not the link's — see below.

**The focus ring.** `outline` on `.book-slot` via `:has(.book:focus-visible)`,
with the link's own ring turned off. Two reasons, and they're the same two that
put the hover on the cell:

- **The link is the thing that turns.** A ring on it gets dragged through the
  rotation and out over the shelf with the book, at the one moment you need a
  fixed mark of where you are. The cell doesn't move, so the ring doesn't
  either: the book steps forward out of a box that stays put.
- **The cell is the only consistent rectangle.** Covers run 0.62–0.80
  wide-to-tall, so a ring drawn round the link is a different size and shape on
  every book and a row of them doesn't line up. Every cell is the same 2:3 box
  on the same baseline.

It is written out — `2px solid var(--focus-ring-color)`, `outline-offset: 2px` —
rather than the `outline-style: auto` the rest of the site uses. Chrome's auto
ring follows ink overflow, and this element has plenty of it: the `::before`
hover pad reaching into both column gaps, and the book's cast pool hanging below
the baseline. Auto wraps all of that and comes out an L.

**Images.** `loading="lazy"`, with explicit `width`/`height` from the WebP to
avoid layout shift.

**Missing cover.** `cover: null` renders a typographic fallback — the title on a
solid block, still linked. No broken `<img>` ever ships.

## Failure modes

| Failure                               | Behaviour                                                                                          |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Goodreads down / blocks CI            | Script exits non-zero, no commit, no deploy, site unchanged                                        |
| Feed returns 0 items                  | Script aborts before writing                                                                       |
| Shelf made private                    | Same as above                                                                                      |
| Shelf renamed or deleted              | Feed silently returns the **whole library**; the membership check catches it and the script aborts |
| Shelf empty after filtering           | Component returns `null`; section and heading both absent from `/about`                            |
| Cover 404, `nophoto`, or undecodable  | `cover: null`, typographic fallback renders; sync continues                                        |
| Sync fails partway through            | Partial artifacts on disk, never committed — CI discards the checkout, locally `git restore .`     |
| Shelf exceeds 100 books               | Warning logged; oldest silently absent until split into sub-shelves                                |
| `did-not-finish` renamed on Goodreads | **Silent.** DNFs reappear on the site. No detection.                                               |

The last row is the known weak point and is accepted as-is: the filter matches a
literal shelf name, and Goodreads gives no signal when one is renamed. Renaming
the _source_ shelf is caught; renaming an _excluded_ shelf is not.
