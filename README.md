# Old School Shuffle

A concept for a retro-inspired music shuffle experience that leans into mixtape nostalgia. This repo currently holds only documentation; the notes below outline a suggested direction for building the app.

## Suggested features
- **Library import:** Connect to Spotify, Apple Music, or local files to assemble a library of tracks.
- **Smart shuffle logic:** Weight lesser-played songs higher and allow optional rules (e.g., avoid same artist back-to-back, limit repeats per session).
- **Mixtape sessions:** Let users pin a "session" with start/end timestamps, shareable links, and session-specific artwork.
- **Themeable UI:** Retro cassette/boombox themes with keyboard shortcuts for skip, rewind, pause, and queue peek.
- **Offline-friendly playback:** Cache current session tracks when possible and fail gracefully if a provider is temporarily unavailable.

## Architecture sketch
- **Frontend:** React or Svelte app with a minimal core player component, plus a control surface for the shuffle weights and session metadata.
- **Backend:** Small API (FastAPI/Node) that normalizes track metadata from external providers, runs the shuffle algorithm, and records session history.
- **Data:** Postgres (or SQLite for local dev) tables for users, tracks, providers, sessions, and per-track play counts. Consider Redis for rate-limiting provider calls and caching recommendations.
- **Integrations:** OAuth per provider, webhooks for library changes where supported, and a thin abstraction layer to keep provider-specific quirks isolated.

## Developer experience
- **Tooling:** Prettier/ESLint (frontend), Ruff/Black (Python) or ESLint (Node), plus TypeScript if using a JS stack.
- **Testing:** Unit tests for the shuffle weighting logic, API contract tests for provider adapters, and a handful of end-to-end smoke tests for playback controls.
- **Local setup idea:** `docker-compose` services for app, API, Postgres, and a mail catcher; `.env.example` can document required keys (provider credentials, JWT secrets, and app URLs).

## Next steps
1. Decide on the target stack (React + FastAPI + Postgres is a lean starting point).
2. Stub the `docker-compose.yml` to spin up API, frontend, and database containers.
3. Define the shuffle weighting algorithm and write unit tests first.
4. Sketch the session/playlist schema and provider adapter interfaces.
5. Build a thin UI that can start a session, skip/like tracks, and view history.
