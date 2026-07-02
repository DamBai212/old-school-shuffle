# Old School Shuffle

Old School Shuffle is a small Next.js music blog prototype built to feel more like
a late-night listening room than a traditional publication site. The homepage acts
like a feed, the archive is meant to be explored like crates or playlists, and the
playlist pages connect the writing back to sequencing, mood, and after-hours energy.

If you want a starter that already has a strong editorial point of view, this is
that. If you want a blank corporate shell, it is definitely not that.

## What This Project Includes

- A nightlife-inspired homepage with a reshuffling editorial playlist
- A post archive with shareable lane, signal, and search filters
- Individual story pages under `/posts/[slug]`
- Archive lane pages under `/posts/category/[slug]`
- Topic signal pages under `/posts/tag/[slug]`
- A full listening-room route at `/playlist`
- Dedicated editorial mix pages under `/playlist/[slug]`
- An optional Spotify spotlight for pulling in one real public playlist with sample previews when available
- Shareable listening-room filters for exploring the local queue by turn, lane, artist, or story
- Story, lane, and topic pages that deep-link back into matching queue views
- TypeScript, ESLint, and GitHub Actions CI
- Docker support for running the app in a container

## Tech Stack

- Next.js 14 with the App Router
- React 18
- TypeScript
- ESLint
- Docker and Docker Compose

## What You Need

- Node.js 18.17 or newer
- npm
- Docker and Docker Compose if you want the containerized version

Node 20 is the recommended local version and matches the Docker image. There is
also an `.nvmrc` if you use `nvm`.

## Getting Started

1. Install the dependencies.

   ```bash
   nvm install
   nvm use
   npm install
   ```

2. Create a local env file.

   ```bash
   cp .env.local.example .env.local
   ```

3. Start the app.

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

You can run the site without Spotify. If you leave the Spotify variables blank,
the app falls back to the built-in editorial playlist content.

## Environment Variables

The app currently reads:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_EDITORIAL_PLAYLIST_ID`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_TAGLINE`

`SPOTIFY_EDITORIAL_PLAYLIST_ID` can be:

- a raw playlist ID
- a full Spotify playlist URL
- a `spotify:playlist:...` URI

`SPOTIFY_REDIRECT_URI` is still included in `.env.example` for future OAuth work,
but the current Spotify integration only uses Client Credentials for public data.

## Spotify Setup

Spotify support is optional, but it gives the site a nice extra layer. When it is
configured, the homepage and listening room can pull in one real public playlist,
show a short preview queue, offer play/pause sample buttons when Spotify provides
preview audio, and render a Spotify embed alongside the site's own curated shuffle
deck.

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Copy `.env.local.example` to `.env.local` if you have not already.
3. Add your Spotify credentials and the playlist you want to feature.

   ```bash
   SPOTIFY_CLIENT_ID=your-spotify-client-id
   SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
   SPOTIFY_EDITORIAL_PLAYLIST_ID=spotify-playlist-id-or-url
   ```

4. Start the app with `npm run dev`.

### How It Works

- Spotify secrets stay on the server
- The app fetches a public playlist snapshot through the Spotify Web API
- Track rows can play short preview samples when Spotify exposes a `preview_url`
- The listening room can render a Spotify embed without replacing the site's own playlist logic
- If Spotify is missing or unavailable, the local editorial queue still works

### A Few Notes

- If you later add user login, Spotify redirect URIs need to match exactly
- For local OAuth work, Spotify currently expects loopback IPs like `127.0.0.1` rather than `localhost`
- This repo does not yet support personal playback, saved tracks, or user-specific libraries
- Right now the integration is best for public playlists, blog spotlights, and editorial mixes

## Main Routes

- `/` for the homepage feed
- `/posts` for the archive explorer
- `/posts/category/[slug]` for archive lanes
- `/posts/tag/[slug]` for archive signals
- `/posts/[slug]` for individual stories
- `/playlist` for the main listening room
- `/playlist/[slug]` for editorial mix pages

## Useful Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint
- `npm run lint:fix` runs ESLint with safe fixes
- `npm run typecheck` runs TypeScript without emitting files

## CI

GitHub Actions runs the usual safety checks on pushes and pull requests:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Docker

If you want to run the production-shaped version locally:

```bash
docker compose up --build
```

The app will be available at `http://localhost:3001`.

## Project Shape

```text
.
|-- .github/workflows/ci.yml
|-- Dockerfile
|-- docker-compose.yml
|-- public/
|   `-- record.svg
`-- src/
    |-- app/
    |   |-- globals.css
    |   |-- icon.svg
    |   |-- layout.tsx
    |   |-- page.tsx
    |   |-- playlist/
    |   |   |-- [slug]/page.tsx
    |   |   `-- page.tsx
    |   `-- posts/
    |       |-- [slug]/page.tsx
    |       |-- category/[slug]/page.tsx
    |       |-- page.tsx
    |       `-- tag/[slug]/page.tsx
    |-- components/
    |   |-- archive-explorer.tsx
    |   |-- playlist-explorer.tsx
    |   |-- spotify-preview-queue.tsx
    |   |-- shuffle-playlist.tsx
    |   `-- spotify-spotlight.tsx
    |-- content/
    |   |-- playlist.ts
    |   `-- posts.ts
    `-- lib/
        `-- spotify.ts
```

## Where You Could Take It Next

- connect the editorial content to a CMS or content collection workflow
- add Spotify Authorization Code with PKCE for personal libraries or user-specific playlists
- add tests around route rendering and content helpers
- expand the archive with more posts, multi-select filters, or issue-based navigation
- add richer media treatments such as audio embeds, artist spotlights, or listening notes
