# Geero — Bedtime Stories

Geero is an AI-powered storytelling app for families. Parents add their
child's name and age, pick an adventure, and Geero — a friendly giraffe
mascot — writes, narrates, and illustrates a personalized ~5-minute bedtime
story starring their child as the hero. Stories can continue as episodes
("Next Episode"), and favorites can be bookmarked to a library.

The project is split into:

- `frontend/` — React (Vite) + Tailwind CSS v4 single-page app
- `backend/` — Node.js + Express API

## Quick start (mock mode, no API keys needed)

Geero runs out of the box with **no external services configured**. Every
integration has a graceful mock fallback so you can demo the entire app
locally:

| Service          | Live                              | Mock fallback                                   |
| ----------------- | --------------------------------- | ------------------------------------------------ |
| Firebase Auth      | Google / Email / Phone sign-in    | Local "fake" account stored in `localStorage`     |
| Firestore          | Persisted users/children/stories  | JSON file at `backend/data/db.json`               |
| Anthropic Claude   | AI-written story text             | Templated story using the adventure's premise     |
| OpenAI TTS         | Narrated MP3 audio                | Silent placeholder WAV sized to the story length   |
| OpenAI / DALL·E 3  | Story cover illustration          | Themed gradient cover (no image)                  |
| Stripe             | Real subscription checkout        | "Simulate subscribe" button instantly unlocks Plus |

### 1. Backend

```bash
cd backend
npm install
npm run dev      # http://localhost:5050
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Open `http://localhost:5173` — sign in with any of the mock auth options
(no real account needed), add your child's profile, and start generating
stories.

## Going live with real services

Copy `.env.example` to `.env` in each package and fill in whichever keys you
have — Geero will automatically switch that one integration from mock to
live (check `GET /api/health` to see the current mode of each service).

### Backend env vars (`backend/.env`)

- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` — story text generation
- `OPENAI_API_KEY`, `OPENAI_TTS_MODEL`, `OPENAI_TTS_VOICE`, `OPENAI_IMAGE_MODEL` — narration + cover art
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET` — Firebase Admin (auth verification + Firestore)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY` — subscriptions
- `CLIENT_URL`, `CORS_ORIGIN`, `PORT` — server config

### Frontend env vars (`frontend/.env`)

- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` — Firebase Auth (Google/Email/Phone)
- `VITE_API_BASE_URL` — only needed if the backend isn't reachable via the `/api` dev proxy

> When Firebase isn't configured, the frontend issues `mock.<uid>.<name>`
> bearer tokens and the backend's auth middleware accepts them directly —
> handy for local development and CI, but should never be enabled in
> production.

## App structure

- **Welcome** — sign in (Google / Email / Phone)
- **My Child** (onboarding + settings) — name, age, optional physical description
- **Home** — themed adventure picker, shows remaining free stories
- **Generating** — Geero writes/narrates/illustrates the story
- **Story Detail** — cover, theme tags, episode summary, "Start"
- **Story Player** — narrated playback with karaoke-style text highlighting and page navigation
- **My Library** — bookmarked stories
- **Settings** — night mode, feedback, about, rate, share, sign out
- **Paywall** — monthly/yearly plans once the free story limit is reached

Free accounts get 3 stories; an active subscription removes the limit.
