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
cp .env.example .env   # fill in your own PostHog project values
npm run dev            # http://localhost:3000
```

Other scripts:

```bash
npm run build          # production build
npm run preview        # preview the production build
npm run test           # vitest
npm run check          # biome lint + format check
npm run sync-shelves   # refresh the Goodreads shelf data & covers
```

## Environment variables

Analytics is PostHog, in cookieless mode (no cookies, no local or session
storage). Both variables are required — the app throws in dev if either is
missing, and silently skips analytics in production.

| Variable                            | Notes                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` | Project token (`phc_…`). Public by design — it ships in the client bundle. |
| `VITE_PUBLIC_POSTHOG_HOST`          | Client API host, e.g. `https://eu.i.posthog.com`.                          |

These are `VITE_`-prefixed, so Vite **inlines them at build time** — they are
baked into the bundle by `vite build`, not read at runtime. That means they must
be present wherever the build runs, and Cloudflare Worker runtime bindings
(`wrangler secret put`, `[vars]`) have no effect on them.

`.env` is gitignored and never committed. Cookieless mode also has to be
switched on PostHog-side, under Project settings → Cookieless server hash mode.

## Docs

- [Goodreads shelf](docs/goodreads-shelf.md) — the book covers on `/about`:
  how the data is synced, and how to run a sync.

## Deploy

```bash
npm run deploy    # build + wrangler deploy (Cloudflare Workers)
```

Worker config is in `wrangler.jsonc`. This builds locally, so the values in your
`.env` are the ones baked into the deployed bundle.

For builds that run on Cloudflare (Workers Builds, triggered on push), set the
same two variables in the dashboard under **Settings → Build → Build Variables
and Secrets**. They have to be _build_ variables, not runtime ones — see
[Environment variables](#environment-variables) above.
