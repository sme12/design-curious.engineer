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
    title: string; // alt text and hover, never rendered as text
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
  from squarish to tall, and cropping to a uniform box slices titles off. Cards
  align to the top of the row instead.
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
2x. The current draft grid uses ~100px cards, where every cover is comfortably
above 2x. Any design landing on materially larger cards should decide whether
that softness is acceptable.

## Frontend

[`src/components/Shelf.tsx`](../src/components/Shelf.tsx), rendered inside
`/about` by `Bookshelf.tsx`.

**Data access.** A plain module import of the JSON. No server function, no
runtime fetch, no `await` in the loader. Server-rendered as part of `/about`.

**Layout.** Covers only — no title, author, or rating as text. Auto-filling grid,
aligned to the top of each row so varying cover heights don't force a crop.
Visual design is still a draft; see [Deferred](#deferred).

**The heading lives inside the component.** If the shelf is empty the component
returns `null`, taking the heading with it. A heading placed on the About page
would survive an empty shelf and orphan itself above nothing.

**Interaction.** The whole card links to `book.link` on Goodreads.

- Pointer devices: title on hover.
- Touch devices: no hover exists, and the title is deliberately not surfaced —
  tapping opens the full Goodreads record instead. A tap-to-reveal state would
  compete with the link for the same gesture.

**Accessibility.** `alt={title}` on every cover — real alt text, never `alt=""`.
This is the only path to the title for screen readers, for touch users, and for
any cover that fails to load, so it is load-bearing rather than decorative. The
hover title is a `title` attribute on top of that, not instead of it.

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
