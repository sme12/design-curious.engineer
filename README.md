# design-curious.engineer

Personal website of Vitalii Sazanov — a design-curious engineer from Finland.

## Stack

- [TanStack Start](https://tanstack.com/start) with file-based routing (`src/routes/`)
- React 19
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-first config
- [Biome](https://biomejs.dev) for linting & formatting
- Deployed to Cloudflare Workers via Wrangler

## Development

```bash
npm install
npm run dev   # http://localhost:3000
```

Other scripts:

```bash
npm run build          # production build
npm run preview        # preview the production build
npm run test           # vitest
npm run check          # biome lint + format check
npm run sync-shelves   # refresh the Goodreads shelf data & covers
```

## Docs

- [Goodreads shelf](docs/goodreads-shelf.md) — the book covers on `/about`:
  how the data is synced, and how to run a sync.

## Deploy

```bash
npm run deploy    # build + wrangler deploy (Cloudflare Workers)
```

Worker config is in `wrangler.jsonc`.
