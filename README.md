# Old School Shuffle

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
- `npm run lint` runs ESLint across the project
- `npm run lint:fix` runs ESLint and applies safe auto-fixes where possible
- `npm run start` runs the production server
- `npm run typecheck` runs the TypeScript compiler without emitting files

## Continuous Integration

GitHub Actions now runs a CI workflow on all pushes and pull requests. The
workflow uses Node 20 and runs:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Docker

To build and run the production container locally:

```bash
docker compose up --build
```

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
- add tests now that linting and CI are in place
- decide whether this remains a single app or grows into a multi-service project
