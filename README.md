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
```bash
docker compose up --build
```

The app is available at `http://localhost:3001` and health checks at `http://localhost:3001/health`.
