# Old School Shuffle

[![CI](https://github.com/DamBai212/old-school-shuffle/actions/workflows/ci.yml/badge.svg)](https://github.com/DamBai212/old-school-shuffle/actions/workflows/ci.yml)

Most club-night blog templates read like a corporate landing page with music words
swapped in; Old School Shuffle is a Next.js editorial prototype that tries to make
the page itself feel like 2AM — a front page, a filterable post archive, longform
pieces, and a reshuffling playlist that behaves like a selector's queue.

## Demo

<!-- TODO: replace with a real screenshot or short gif of the homepage + shuffle
     playlist in action. A `site-preview.png` at the repo root is already
     gitignored and ready to be swapped in here, e.g.:
     ![Old School Shuffle homepage](./site-preview.png) -->

`npm run dev` and open `http://localhost:3000` to see it live in the meantime.

## What It Includes

- Nightlife-inspired homepage with a reshuffling playlist and editorial modules
- Archive page with shareable lane, signal, and search filters
- Dynamic post pages under `/posts/[slug]`
- Archive lane pages under `/posts/category/[slug]`
- Topic signal pages under `/posts/tag/[slug]`
- Dedicated playlist route at `/playlist` with a route map back into the archive
- Strict TypeScript, ESLint, and GitHub Actions CI
- Docker setup for running the app in a container

## Stack

- Next.js 14 with the App Router
- React 18
- TypeScript
- ESLint
- Docker / Docker Compose

## Requirements

- Node.js 18.17 or newer
- npm
- Docker and Docker Compose if you want to run the containerized build

Node 20 is the recommended local version and matches the Docker image. An `.nvmrc`
file is included for `nvm` users.

## Local Development

1. Install the project dependencies.

   ```bash
   nvm install
   nvm use
   npm install
   ```

2. Create your local environment file.

   ```bash
   cp .env.local.example .env.local
   ```

3. Start the development server.

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

The app currently reads:

- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_TAGLINE`

Copy `.env.local.example` to `.env.local` and adjust values as needed.

## Routes

- `/` for the homepage and featured shuffle module
- `/posts` for the archive explorer with query-param filters
- `/posts/category/[slug]` for archive lanes by category
- `/posts/tag/[slug]` for archive topics by tag
- `/posts/[slug]` for individual stories
- `/playlist` for the full booth queue
- `/health` for container and uptime checks

## Scripts

- `npm run dev` starts the development server
- `npm run build` creates the production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint
- `npm run lint:fix` runs ESLint with safe fixes
- `npm run typecheck` runs the TypeScript compiler without emitting files
- `npm run test` runs the Vitest suite once

## Testing

Tests run on [Vitest](https://vitest.dev) with jsdom and React Testing Library.
Coverage focuses on the app's actual logic rather than markup:

- `src/content/posts.test.ts` — the related-post scoring/ranking algorithm, tag
  sort order, archive-index boundary behavior, and slug/query-string helpers
- `src/components/shuffle-playlist.test.tsx` — the Fisher-Yates shuffle (returns
  a permutation, never mutates its input) and the reshuffle interaction
- `src/components/archive-explorer.test.tsx` — search and lane-filter behavior
  in the archive UI

Run `npm run test` locally, or add `-- --watch` for watch mode.

## Continuous Integration

GitHub Actions runs on pushes and pull requests with:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Architecture

A couple of decisions shape this codebase more than the others:

**Content lives in typed TypeScript modules, not a CMS or MDX files.**
`src/content/posts.ts` and `src/content/playlist.ts` export plain objects and the
derived-data functions (`getRelatedPosts`, `getTags`, `getAdjacentPosts`, …) that
every route reads from. This buys full type safety from content to markup, zero
network calls or filesystem parsing at build time, and content bugs that show up
as compile errors instead of broken pages. The tradeoff: adding or editing a post
means writing TypeScript and opening a pull request — there's no editor UI, so
this doesn't scale to a non-technical writer or a large, fast-moving archive
without a real content layer behind it.

**The archive filters client-side and syncs state to the URL.**
`ArchiveExplorer` filters the full post list in the browser (search, lane, tag)
and mirrors the active filters into the query string via `router.replace`, so a
filtered view is shareable and back/forward-navigable. That's simple and fast at
the current archive size, but it ships the entire post list to the client and
re-filters it on every keystroke — it would need to move to server-side search
or pagination well before the archive grows into the hundreds of posts.

## Docker

The production image is a multi-stage build: dependencies and the Next.js build
run in throwaway stages, and only the output of `next build`'s `standalone`
mode (see `next.config.mjs`) is copied into the final `node:20-alpine` runner
along with `public/` and `.next/static`. That keeps the deployed image small and
free of the source tree, dev dependencies, and full `node_modules` — the
tradeoff is that `output: "standalone"` changes how the app is started (`node
server.js` instead of `next start`), so local dev and the containerized runtime
aren't running the exact same server.

Build and run the production container locally with:

```bash
docker compose up --build
```

The app is exposed on `http://localhost:3000`, and health checks are available at `http://localhost:3000/health`.

## Project Structure

```text
.
|-- .github/workflows/ci.yml
|-- Dockerfile
|-- docker-compose.yml
|-- vitest.config.mts
|-- package.json
|-- package-lock.json
|-- public/
|   `-- record.svg
`-- src/
    |-- app/
    |   |-- globals.css
    |   |-- health/route.ts
    |   |-- icon.svg
    |   |-- layout.tsx
    |   |-- page.tsx
    |   |-- playlist/page.tsx
    |   `-- posts/
    |       |-- [slug]/page.tsx
    |       |-- category/[slug]/page.tsx
    |       |-- page.tsx
    |       `-- tag/[slug]/page.tsx
    |-- components/
    |   |-- archive-explorer.tsx
    |   |-- archive-explorer.test.tsx
    |   |-- shuffle-playlist.tsx
    |   `-- shuffle-playlist.test.tsx
    |-- content/
    |   |-- playlist.ts
    |   |-- posts.ts
    |   `-- posts.test.ts
    `-- test/
        `-- setup.ts
```

## Next Ideas

- connect the editorial content to a CMS or content collection workflow
- expand the archive with more posts, multi-select filters, or issue-based navigation
- add richer media treatments such as audio embeds or artist spotlights
- move archive search server-side once the post count outgrows client-side filtering
