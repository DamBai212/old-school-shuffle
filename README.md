# Old School Shuffle

Old School Shuffle is a Next.js music editorial prototype built around a club-night
visual language: a front page, a post archive, individual longform pieces, and a
dedicated shuffle playlist page that feels like part magazine and part booth monitor.

## What It Includes

- Nightlife-inspired homepage with a reshuffling playlist and editorial modules
- Archive page for browsing every post in one place
- Dynamic post pages under `/posts/[slug]`
- Dedicated playlist route at `/playlist`
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
- `/posts` for the archive
- `/posts/[slug]` for individual stories
- `/playlist` for the full booth queue

## Scripts

- `npm run dev` starts the development server
- `npm run build` creates the production build
- `npm run start` runs the production server
- `npm run lint` runs ESLint
- `npm run lint:fix` runs ESLint with safe fixes
- `npm run typecheck` runs the TypeScript compiler without emitting files

## Continuous Integration

GitHub Actions runs on pushes and pull requests with:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Docker

Build and run the production container locally with:

```bash
docker compose up --build
```

The app is exposed on `http://localhost:3001`.

## Project Structure

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
    |   |-- playlist/page.tsx
    |   `-- posts/
    |       |-- [slug]/page.tsx
    |       `-- page.tsx
    |-- components/
    |   `-- shuffle-playlist.tsx
    `-- content/
        |-- playlist.ts
        `-- posts.ts
```

## Next Ideas

- connect the editorial content to a CMS or content collection workflow
- add tests around route rendering and content helpers
- expand the archive with more posts, filters, or issue-based navigation
- add richer media treatments such as audio embeds or artist spotlights
