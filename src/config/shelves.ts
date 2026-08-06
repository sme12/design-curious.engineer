// Single source of shelf config, shared by the sync script and the frontend.
// Built for N shelves, one configured — a second shelf becomes a second
// section on /about, not a route.

export const SHELVES = [
	{
		slug: "work-reads",
		heading: "Books I read to become a better professional",
	},
] as const;

// A named constant because the filter matches a literal Goodreads shelf name.
// Renaming that shelf on Goodreads would silently reintroduce those books with
// no build error.
export const EXCLUDED_SHELVES = ["did-not-finish"];

export const COVER_WIDTH = 400;
export const GOODREADS_USER_ID = "107695305";

export type ShelfSlug = (typeof SHELVES)[number]["slug"];

export type Book = {
	/** Goodreads book_id, stable, e.g. "41793" */
	id: string;
	/** Used for alt text and hover, not rendered as text */
	title: string;
	/** Retained, not rendered */
	author: string;
	/** 0–5, retained, not rendered */
	rating: number;
	/** "/covers/41793.webp" or null */
	cover: string | null;
	/** Intrinsic size of the WebP; null alongside a null cover */
	coverWidth: number | null;
	coverHeight: number | null;
	readAt: string | null;
	shelvedAt: string;
	link: string;
};
