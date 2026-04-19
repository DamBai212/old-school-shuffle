# Old School Shuffle

Minimal Ruby app scaffold for running Old School Shuffle in Docker.

## Requirements
- Docker + Docker Compose

## Environment setup
1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Set `APP_SESSION_SECRET` to a long random value.
3. Fill in `DATABASE_URL` and Spotify OAuth credentials.

## Run locally with Docker
Old School Shuffle is now scaffolded as a minimal Next.js starter with TypeScript,
App Router, and a production-oriented Docker setup.

## What Is Included

- Next.js app directory structure under `src/app`
- TypeScript configuration with strict mode enabled
- Retro-styled landing page to replace the empty placeholder repo
- Multi-stage Dockerfile using Next.js standalone output
- `docker-compose.yml` for running the app in a container
- Example environment files for local development

## Requirements

- Node.js 18.17 or newer
- npm
- Docker and Docker Compose if you want to run it in a container

Node 20 is the recommended local version for this starter and is also what the
Docker image uses. An `.nvmrc` file is included if you use `nvm`.

## Local Development

1. Install dependencies:

   ```bash
   nvm install
   nvm use
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.local.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates the production build
- `npm run start` runs the production server
- `npm run typecheck` runs the TypeScript compiler without emitting files

## Docker

To build and run the production container locally:

```bash
docker compose up --build
```

The app is available at `http://localhost:3001` and health checks at `http://localhost:3001/health`.
The app will be available at [http://localhost:3000](http://localhost:3000).
Running through Docker is the easiest option if your local Node version is older.

## Environment Variables

The starter currently uses:

- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_TAGLINE`

Copy `.env.local.example` to `.env.local` and adjust values as needed.

## Project Structure

```text
.
|-- Dockerfile
|-- docker-compose.yml
|-- package.json
|-- public/
|   `-- record.svg
`-- src/
    `-- app/
        |-- globals.css
        |-- icon.svg
        |-- layout.tsx
        `-- page.tsx
```

## Suggested Next Steps

- add more routes or feature sections
- connect the UI to a real data source or API
- add linting, tests, and CI
- decide whether this remains a single app or grows into a multi-service project
