# Lead Tracker

A simple full-stack Lead Tracker: create leads, update their status, search, and list them.

## Architecture

```
lead-tracker/
├── backend/    Express + TypeScript API, MongoDB via Mongoose
└── frontend/   React + TypeScript UI, built with Vite
```

- **Backend** (`backend/`): Express REST API. `Lead` model (name, email, phone, status, createdAt) stored in MongoDB via Mongoose. Routes live in `src/routes/leads.ts`; `src/app.ts` builds the Express app (importable by tests without opening a port), `src/server.ts` connects to the database and starts listening.
- **Frontend** (`frontend/`): React function components with hooks, no state library needed for this scope. `src/api/leads.ts` wraps `fetch` calls to the backend. `App.tsx` owns the lead list state and passes callbacks down to `LeadForm`, `SearchBar`, and `LeadList`.
- **Database**: MongoDB. By default the backend spins up an in-memory MongoDB instance (via `mongodb-memory-server`) so the app runs with zero external setup. Point it at a real MongoDB instance (local or Atlas) by setting `MONGODB_URI` and `USE_IN_MEMORY_DB=false` in `backend/.env`.

## Features

- Create a lead (name, email, phone)
- Update a lead's status (New, Contacted, Qualified, Won, Lost)
- Search leads by name, email, or phone
- Filter leads by status
- List all leads, newest first

## Setup & Run

Requires Node.js 18+.

```bash
# from the repo root
npm run install:all
npm run dev
```

This starts the backend on `http://localhost:4000` and the frontend on `http://localhost:5173` at the same time. Open `http://localhost:5173` in a browser.

To run them separately instead:

```bash
cd backend && cp .env.example .env && npm install && npm run dev
cd frontend && cp .env.example .env && npm install && npm run dev
```

### Using a real MongoDB instance

Edit `backend/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/lead-tracker
USE_IN_MEMORY_DB=false
```

### Running tests

```bash
cd backend && npm test
```

8 API tests cover lead creation/validation, listing, search, status filtering, and status updates (including 404/400 error paths), run against an in-memory MongoDB instance with Jest + Supertest.

## Deployment

- **Backend**: deploy `backend/` to any Node host (Render, Railway, Fly.io). Set `MONGODB_URI` to a hosted MongoDB (e.g. MongoDB Atlas) and `USE_IN_MEMORY_DB=false`. Build with `npm run build`, start with `npm start`.
- **Frontend**: deploy `frontend/` to a static host (Vercel, Netlify). Set `VITE_API_URL` to the deployed backend's `/api` URL, build with `npm run build`, and serve the `dist/` folder.

## Trade-offs

- **In-memory MongoDB by default**: makes the project runnable in one command with no local database install, at the cost of data not persisting across restarts. Switching to a persistent MongoDB is a two-line env change.
- **No auth**: out of scope for this assignment; all endpoints are open.
- **Client-side debounced search**: search/status filtering is debounced (300ms) on the frontend and delegated to a MongoDB regex query on the backend rather than a full-text search index, which is fine at this scale but wouldn't scale to a very large lead list.
- **No pagination**: the lead list loads in full; acceptable for the assignment's scope but would need to be paginated for production-scale data.

## Future Improvements

- Add authentication and per-user lead ownership
- Pagination / infinite scroll for large lead lists
- Edit/delete leads, not just status updates
- Optimistic UI rollback covers status updates only; extend to lead creation
- CI pipeline running lint/tests on push
