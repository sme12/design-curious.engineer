// Syncs Goodreads custom shelves into committed JSON + cover images.
//
// Goodreads retired its API in 2020; the per-shelf RSS feed is the only source
// left. It blocks browser requests, so this only ever runs in CI (or locally),
// never from the site at runtime. Everything it produces is committed, which is
// what makes a Goodreads outage a no-op rather than an empty shelf.
//
//   npm run sync-shelves
//
// See docs/goodreads-shelf.md.

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";
import sharp from "sharp";
import {
	type Book,
	COVER_WIDTH,
	EXCLUDED_SHELVES,
	GOODREADS_USER_ID,
	SHELVES,
} from "../src/config/shelves.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DATA_DIR = path.join(ROOT, "src/data/shelves");
const RAW_DIR = path.join(ROOT, "assets/covers-raw");
const WEBP_DIR = path.join(ROOT, "public/covers");

/** The feed caps at 100 items per shelf; warn before we start losing books. */
const ITEM_CEILING_WARNING = 90;

// Goodreads 403s the default undici user agent.
const USER_AGENT =
	"Mozilla/5.0 (compatible; design-curious.engineer shelf sync)";

type FeedItem = {
	title: string;
	book_id: string | number;
	book_large_image_url: string;
	author_name: string;
	user_rating: string | number;
	user_read_at: string;
	user_date_created: string;
	user_shelves: string;
};

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

/**
 * RFC-822 -> YYYY-MM-DD, keeping the date as written in the feed's own offset.
 * Normalising to UTC would push the `-0700` evening timestamps onto the next
 * day, which is both wrong and would break the shelved-on-the-same-day grouping.
 */
function toIsoDate(value: string): string | null {
	const match = /^\w{3}, (\d{1,2}) (\w{3}) (\d{4})/.exec(value.trim());
	if (!match) return null;

	const [, day, month, year] = match;
	const monthIndex = MONTHS.indexOf(month);
	if (monthIndex === -1) return null;

	return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${day.padStart(2, "0")}`;
}

/**
 * Feed image sizes are inconsistent (`_SX318_`, `_SY475_`, unsuffixed).
 * Stripping the segment yields the true original.
 */
function originalCoverUrl(url: string): string {
	return url.replace(/\._S[XY]\d+_(\.\w+)$/, "$1");
}

async function fetchShelf(slug: string): Promise<FeedItem[]> {
	const url = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=${slug}`;
	const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });

	if (!response.ok) {
		throw new Error(`Feed for "${slug}" returned ${response.status}`);
	}

	const parser = new XMLParser({
		// Every value stays a string: book_id must not become a number, and
		// ratings are parsed explicitly below.
		parseTagValue: false,
		trimValues: true,
	});
	const parsed = parser.parse(await response.text());
	const items = parsed?.rss?.channel?.item;

	if (!items) return [];
	return Array.isArray(items) ? items : [items];
}

function shelvesOf(item: FeedItem): string[] {
	return String(item.user_shelves ?? "")
		.split(",")
		.map((shelf) => shelf.trim())
		.filter(Boolean);
}

function isExcluded(item: FeedItem): boolean {
	return shelvesOf(item).some((shelf) => EXCLUDED_SHELVES.includes(shelf));
}

/** Existing raw download for a book id, whatever extension it was saved under. */
async function findRaw(id: string): Promise<string | null> {
	const entries = await readdir(RAW_DIR);
	const match = entries.find((entry) => path.parse(entry).name === id);

	return match ? path.join(RAW_DIR, match) : null;
}

/**
 * A 200 is not a promise of an image — Goodreads sometimes answers with an error
 * page. Decoding the body before it is cached means a corrupt response falls
 * through to the fallback URL like a 404 would, rather than being written to
 * `assets/covers-raw/` where every later run would reuse it and fail.
 */
async function download(url: string): Promise<Buffer | null> {
	const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
	if (!response.ok) return null;

	const body = Buffer.from(await response.arrayBuffer());

	try {
		await sharp(body).metadata();
	} catch {
		return null;
	}

	return body;
}

/** Re-encode to the served WebP, or null if the raw no longer decodes. */
async function encodeCover(rawPath: string) {
	try {
		return await sharp(await readFile(rawPath))
			// Width only — book covers run from squarish to tall, and cropping to a
			// uniform box slices titles off. Cards align to the top of the row.
			.resize({ width: COVER_WIDTH, withoutEnlargement: true })
			.webp({ quality: 80 })
			.toBuffer({ resolveWithObject: true });
	} catch {
		return null;
	}
}

/**
 * Downloads the full-resolution cover once, ever, then re-encodes it to the
 * served WebP. Keeping the raw means a future card size is a re-encode rather
 * than a re-fetch — editions get delisted and those URLs rot.
 */
async function resolveCover(
	id: string,
	feedUrl: string,
): Promise<Pick<Book, "cover" | "coverWidth" | "coverHeight">> {
	const missing = { cover: null, coverWidth: null, coverHeight: null };

	if (!feedUrl || feedUrl.includes("nophoto")) {
		console.warn(`  ! ${id}: no cover on Goodreads`);
		return missing;
	}

	let rawPath = await findRaw(id);

	if (!rawPath) {
		const stripped = originalCoverUrl(feedUrl);
		// Stripping the size segment occasionally points at a URL Goodreads no
		// longer serves; the sized one from the feed is the fallback.
		const raw =
			(await download(stripped)) ??
			(stripped === feedUrl ? null : await download(feedUrl));

		if (!raw) {
			console.warn(`  ! ${id}: cover download failed (${stripped})`);
			return missing;
		}

		const ext = path.extname(new URL(stripped).pathname) || ".jpg";
		rawPath = path.join(RAW_DIR, `${id}${ext}`);
		await writeFile(rawPath, raw);
		console.log(`  + ${id}: downloaded cover`);
	}

	const encoded = await encodeCover(rawPath);

	// A raw that no longer decodes — truncated on disk, or cached before
	// downloads were validated — is dropped rather than kept as a file that
	// fails every run from here on. The next sync re-fetches it.
	if (!encoded) {
		await rm(rawPath);
		console.warn(
			`  ! ${id}: unreadable cover, dropped ${path.relative(ROOT, rawPath)}`,
		);
		return missing;
	}

	await writeFile(path.join(WEBP_DIR, `${id}.webp`), encoded.data);

	return {
		cover: `/covers/${id}.webp`,
		coverWidth: encoded.info.width,
		coverHeight: encoded.info.height,
	};
}

async function syncShelf(slug: string): Promise<string[]> {
	console.log(`\n${slug}`);

	const items = await fetchShelf(slug);

	// Never overwrite good data with an empty result — a private shelf, a
	// blocked request, or a Goodreads outage all look like zero items.
	if (items.length === 0) {
		throw new Error(
			`Feed for "${slug}" yielded zero items — refusing to overwrite existing data`,
		);
	}

	// Goodreads does not 404 an unknown shelf — it silently ignores the
	// parameter and serves the entire library instead. A renamed or deleted
	// shelf would otherwise publish every book the account has ever touched
	// under the shelf's heading, so membership is verified rather than trusted.
	const onShelf = items.filter((item) => shelvesOf(item).includes(slug));

	if (onShelf.length === 0) {
		throw new Error(
			`Feed for "${slug}" returned ${items.length} items, none of them on that shelf — the shelf was probably renamed or deleted`,
		);
	}

	if (onShelf.length >= ITEM_CEILING_WARNING) {
		console.warn(
			`  ! ${onShelf.length} items — the feed caps at 100, split the shelf soon`,
		);
	}

	const kept = onShelf.filter((item) => !isExcluded(item));
	const filtered = onShelf.length - kept.length;
	console.log(`  ${onShelf.length} items, ${filtered} filtered out`);

	const books: Book[] = [];

	for (const item of kept) {
		const id = String(item.book_id);
		const shelvedAt = toIsoDate(String(item.user_date_created));

		if (!shelvedAt) {
			throw new Error(`Book ${id} has an unparseable user_date_created`);
		}

		books.push({
			id,
			title: String(item.title).trim(),
			// The feed pads some names ("Paul    Graham") and exposes only one
			// author per book. Not fixable from RSS; the author isn't rendered.
			author: String(item.author_name ?? "")
				.replace(/\s+/g, " ")
				.trim(),
			rating: Number(item.user_rating) || 0,
			...(await resolveCover(id, String(item.book_large_image_url ?? ""))),
			readAt: toIsoDate(String(item.user_read_at ?? "")),
			shelvedAt,
			link: `https://www.goodreads.com/book/show/${id}`,
		});
	}

	// Sorted here, once — the component never sorts. Array#sort is stable, so
	// books sharing a date hold their feed order.
	books.sort((a, b) =>
		(b.readAt ?? b.shelvedAt).localeCompare(a.readAt ?? a.shelvedAt),
	);

	const file = path.join(DATA_DIR, `${slug}.json`);
	// Tab-indented to match the repo's Biome formatting — the file is committed,
	// so `biome check` sees it like any other source file.
	await writeFile(file, `${JSON.stringify(books, null, "\t")}\n`);
	console.log(`  → ${path.relative(ROOT, file)} (${books.length} books)`);

	return books.map((book) => book.id);
}

/** Drops covers for books no longer on any shelf. */
async function cleanOrphans(keep: Set<string>) {
	for (const dir of [RAW_DIR, WEBP_DIR]) {
		for (const entry of await readdir(dir)) {
			if (keep.has(path.parse(entry).name)) continue;

			await rm(path.join(dir, entry));
			console.log(
				`  - removed orphan ${path.relative(ROOT, path.join(dir, entry))}`,
			);
		}
	}
}

async function main() {
	for (const dir of [DATA_DIR, RAW_DIR, WEBP_DIR]) {
		if (!existsSync(dir)) await mkdir(dir, { recursive: true });
	}

	const ids = new Set<string>();

	for (const shelf of SHELVES) {
		for (const id of await syncShelf(shelf.slug)) {
			ids.add(id);
		}
	}

	console.log("");
	await cleanOrphans(ids);
	console.log("done\n");
}

main().catch((error: unknown) => {
	console.error(`\nsync-shelves failed: ${(error as Error).message}`);
	process.exit(1);
});
