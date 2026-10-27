# FindIt Campus

A lost-and-found platform for **one university campus**, built for **CraftSolve Hackathon 2026**.
Students report lost and found belongings with full details, the system suggests likely matches with an explanation,
and a campus **administrator** connects owner and finder and verifies ownership before anything is handed over.
Owner and finder never contact each other directly.

> Built for **Mehran University of Engineering and Technology (MUET)**. The university name is configurable (`UNIVERSITY_NAME`).

> New to this project? Read `docs/SIMPLE-GUIDE.md` first (plain-language steps and exact commands).

## How the system works (admin-mediated)

1. **A student who lost something** fills in a report: name, email, phone, and the item's name, category, colour, description, where and when it was lost.
2. **A person who found something** files the same kind of report and **hands the item to the administrator**.
3. **Nobody contacts anybody directly.** Names, emails and phone numbers are visible only to the administrator. The owner never sees the finder's details and the finder never sees the owner's.
4. **The administrator** opens a report, clicks **Find matches** (the system ranks likely lost/found pairs and explains why), phones or emails both people, checks that the details really match, and **links** the two reports.
5. **Only if the details match**, the administrator hands the item to the owner and marks it **returned** (this closes both linked reports). If they do not match, nothing is handed over.
6. The administrator's own contact card (name, email, phone, office, opening hours) is shown on the Home page, About page and after every report.

## Problem statement

Students at MUET lose wallets, phones, keys, ID cards, bags, bottles and books every day. People who find them
rarely know who the owner is, and notice-board or group-chat posts get buried within hours.

## Proposed solution

One campus-only site where lost and found reports are collected with full details and a protected admin
dashboard connects the right people. A transparent matching engine suggests likely pairs. Matching is a
**suggestion only**: it never approves anything, and the administrator always verifies before handover.

## Features

- Home page with live statistics (lost / found / returned), recent reports and a how-it-works guide
- Browse with text search and filters (lost/found, category, campus location, date), status badges (open / returned / closed)
- Report form (lost or found, item name, category, **colour**, description, place, date, optional photo, private name / **email** / **phone**, validation)
- Item page with suggested matches, 0-100 score and a plain-language "why it matches" list
- Claim form with private proof of ownership; claimants check status with a private **claim code**
- Admin dashboard: login/logout, statistics, search and filter reports and claims, **"Find matches" with both parties' private contact details and one-click "Link these two"**, approve/reject claims,
  mark items returned (closes the linked report too) or closed, hide or restore reports
- Administrator contact card (name, email, phone, office, hours) on Home, About and after each report
- About / Help page with safe-handover guidance (ownership verified before handover)

## Technology stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite 6, React Router 7, plain responsive CSS |
| Backend | Node.js 22+, Express 5, helmet, cors, express-rate-limit, multer |
| Database | SQLite (`better-sqlite3`, with automatic fallback to Node's built-in `node:sqlite`) |
| Auth | scrypt password hashes, random session tokens (only the SHA-256 hash is stored) |
| Matching | Pure JavaScript service in `backend/services/matching.js` |
| Hosting | Vercel (frontend), Render (backend) |

## Project structure

```
findit-campus/
├── backend/
│   ├── server.js            # entry point (bootstraps admin, optional demo seed)
│   ├── app.js               # Express app: CORS, helmet, rate limits, routes
│   ├── config.js            # all settings from environment variables
│   ├── routes/              # public.js, admin.js
│   ├── middleware/          # auth, upload, rate limits, error handler
│   ├── services/            # items, claims, admin, matching, validation, images, security
│   ├── database/            # schema.sql, init.js, seed.js, seedData.js, db.js
│   ├── scripts/create-admin.js
│   ├── tests/               # services.test.js, api.test.js
│   └── .env.example
├── frontend/
│   ├── src/                 # pages/, components/, api.js, context.jsx, styles.css
│   ├── vercel.json
│   └── .env.example
├── docs/                    # SIMPLE-GUIDE, pitch script, demo checklist, submission checklist
├── package.json             # shortcuts: npm run setup / test / build
├── render.yaml              # Render blueprint (paid disk); free-tier steps are in "Deployment"
└── README.md
```

## Installation and local run

Requirements: Node.js 22 or newer, npm.

```bash
# 1. Backend
cd backend
npm install or npm.cmd install
copy .env.example .env        # Windows PowerShell (macOS/Linux: cp .env.example .env), then edit .env
npm run db:init   or npm.cmd run db:init      # creates the SQLite file and tables
npm run db:seed  or npm.cmd run db:seed            # optional: sample lost/found reports (only if the DB is empty)
npm run admin:create  or npm.cmd run admin:creat       # prompts for admin email and password (min 10 chars)
npm run dev    or npm.cmd run dev          # http://localhost:4000  (health: /api/health)

# 2. Frontend (new terminal)
cd frontend
npm install or npm.cmd install
copy .env.example .env.local  # Windows PowerShell (macOS/Linux: cp ...)
npm run dev or npm.cmd run dev              # http://localhost:5173
```

Alternatively set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` and the first admin is created
automatically on startup (only when no admin exists). Set `SEED_DEMO_DATA=true` to load sample data on an empty database.

## Environment variables

Backend (`backend/.env.example`):

| Variable | Purpose |
|---|---|
| `UNIVERSITY_NAME` | Branding shown across the site (default: Mehran University of Engineering and Technology) |
| `ADMIN_CONTACT_NAME`, `ADMIN_CONTACT_EMAIL`, `ADMIN_CONTACT_PHONE`, `OFFICE_LOCATION`, `OFFICE_HOURS` | The administrator contact card shown on the website (placeholders until you set them) |
| `NODE_ENV`, `PORT`, `TRUST_PROXY` | Server mode; set `TRUST_PROXY=1` on Render |
| `CORS_ORIGINS` | Comma-separated frontend origins. **Required in production** |
| `DB_PATH`, `UPLOAD_DIR`, `MAX_IMAGE_MB` | Storage locations and image size limit |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_HOURS` | Bootstrap admin and session length |
| `CAMPUS_LOCATIONS` | Optional comma-separated list replacing default locations |
| `SEED_DEMO_DATA` | `true` loads sample reports into an empty database |
| `RATE_LIMIT_GLOBAL`, `RATE_LIMIT_WRITES`, `RATE_LIMIT_LOGIN` | Rate-limit tuning |

Frontend (`frontend/.env.example`): only `VITE_API_URL` (the backend address).

## Database

Tables: `items` (reports), `claims`, `admins`, plus `admin_sessions`. Foreign keys, CHECK constraints and indexes are
defined in `backend/database/schema.sql`. Seeding is safe: it does nothing if any report exists.
`npm run db:reset` wipes reports and claims (refused when `NODE_ENV=production`).

### SQLite hosting limitations

SQLite is a single file on local disk. On Render it survives restarts only on a **persistent disk** (paid instance).
On the free tier the file and uploaded photos are erased on each deploy/restart, which is fine for a short demo
but not for real use. It also supports one backend instance only (no horizontal scaling). For production,
migrate to PostgreSQL.

## Smart matching

Score (0-100) = category 25 + title 25 + description keywords 20 + location 15 + date 15.
Text is lower-cased, stop-words removed, light stemming and synonyms applied (e.g. "purse" = "wallet"), colours
normalised. Dates fade linearly over 14 days. Pairs below 40 are hidden; the best are listed first, up to 10.
The report's **colour** counts as a keyword and is compared with the other report's colour. Every match lists the factors that
contributed. A high score never approves anything: the administrator decides.

## Handover process

1. The administrator contacts the owner (details are shown only on the admin dashboard) and asks them to come to the office with photo ID.
2. The administrator checks the owner's description against the finder's report (or the claim's private proof).
3. If they match: **Link these two**, hand the item over in person, then **Mark returned** (both linked reports close).
4. If they do not match: nothing is handed over (report stays open, or the claim is rejected).

## Sample (demo) data

`npm run db:seed` loads about 20 **fake** reports from `backend/database/seedData.js` (names like "Demo Student 1", emails on
`example.com`, phone `0300-0000000`) so matching can be demonstrated immediately. No real people are included. Seeding does nothing
if reports already exist. For a real launch run only `npm run db:init` (no seed) and keep `SEED_DEMO_DATA=false`.

## API reference

Base path `/api`. JSON in and out (reports use `multipart/form-data` for the optional image).

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/meta` | University name, categories, locations, administrator contact card |
| GET | `/stats` | Public counts |
| GET | `/items` | List/search (`q`, `type`, `category`, `location`, `status`, `date_from`, `date_to`, `page`, `limit`) |
| POST | `/items` | Create lost/found report: `type, title, category, color, description, location, event_date, contact_name, contact` (email)`, contact_phone` (rate-limited) |
| GET | `/items/:id` | Public item details (no contact info) |
| GET | `/items/:id/matches` | Suggested matches with scores and reasons |
| POST | `/items/:id/claims` | Submit claim; returns private claim code |
| GET | `/claims/status/:code` | Check claim status by code |
| POST | `/admin/login` | Admin login (rate-limited), returns session token |
| POST | `/admin/logout` | End session (auth) |
| GET | `/admin/me`, `/admin/stats` | Admin identity and statistics (auth) |
| GET | `/admin/items` | All reports incl. hidden, with private contact (auth) |
| PATCH | `/admin/items/:id` | Set `status` (open/returned/closed) and/or `visibility` (visible/hidden) (auth) |
| GET | `/admin/items/:id/matches` | Suggested matches with scores, reasons and **both parties' private contacts** (auth) |
| POST | `/admin/items/:id/link` | Link a lost report with a found report, body `{ "other_id": 12 }` (auth) |
| DELETE | `/admin/items/:id/link` | Remove the link (auth) |
| GET | `/admin/claims` | Claims incl. proof (auth) |
| PATCH | `/admin/claims/:id` | Approve/reject with optional note (auth) |

Errors return `{ "error": "message", "details": { "field": "problem" } }` (`details` only for form validation) with 400/401/404/409/413/422/429 as appropriate.
Admin routes use `Authorization: Bearer <token>`.

## Testing

```bash
cd backend && npm test
```

- `tests/services.test.js` - validation, matching (known pairs), claims workflow, admin match + link, seeding, DB constraints, upgrade of older database files
- `tests/api.test.js` - HTTP-level tests: report creation, search, privacy of public responses, claims, admin auth and 401s, upload limits, rate limits

All tests should pass. The HTTP tests need `npm install` first; without the packages they are reported as skipped, not passed.

## Deployment

### Backend on Render
1. Push the repo to GitHub. In Render create a **Web Service** with root directory `backend`, build command `npm install`, start command `npm start`.
   (Paid option: **New > Blueprint** uses `render.yaml`, which includes a persistent disk.)
2. Paid plan only: attach a persistent disk mounted at `/var/data` and set `DB_PATH=/var/data/findit.db`, `UPLOAD_DIR=/var/data/uploads`.
   Free plan: skip the disk. Data resets on every restart, so keep `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `SEED_DEMO_DATA=true` set; the admin and demo data are then recreated automatically.
3. Set env vars: `NODE_ENV=production`, `TRUST_PROXY=1`, `UNIVERSITY_NAME`, the `ADMIN_CONTACT_*` and `OFFICE_*` values, `CORS_ORIGINS=https://<your-app>.vercel.app`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (your own strong password; remove it after the first start if you wish).
4. Optional for a demo: `SEED_DEMO_DATA=true` (loads the fake demo reports into an empty database).
5. Verify `https://<service>.onrender.com/api/health`.

### Frontend on Vercel
1. Import the repo, set **Root Directory** to `frontend` (framework Vite is auto-detected; `vercel.json` handles SPA routing).
2. Set `VITE_API_URL=https://<service>.onrender.com`.
3. Deploy, then put the final Vercel URL into the backend's `CORS_ORIGINS` and redeploy the backend.

## Security considerations

- Admin routes enforce authentication on the server; hiding buttons is not relied on
- scrypt password hashing; sessions are random tokens stored only as SHA-256 hashes, with expiry and logout
- Generic login error and timing equalisation; separate strict rate limit on login
- Parameterised SQL everywhere; length limits on all inputs; JSON body limit
- Image uploads limited by size and verified by file signature (not just extension/MIME)
- Public API never returns names, emails, phone numbers, claim proof, admin notes or the lost/found link; only the logged-in administrator sees them
- Claim status is available only through an unguessable claim code
- helmet headers, CORS allow-list, global and write rate limits, generic 500 errors
- No credentials in the repo; `.env` is git-ignored; no default admin account

## Screenshots

_Add screenshots of Home, Browse, Item + matches, Claim, and Admin here before submitting (see `docs/submission-checklist.md`)._

## Deployed URLs

- Frontend: _not deployed yet - add URL_
- Backend: _not deployed yet - add URL_

## Team

| Name | Role | Contact |
|---|---|---|
| [Name] | [Role] | [Email] |

## Future improvements

Email/SMS notifications on new matches, PostgreSQL and cloud image storage, student-ID login, multi-campus mode,
image similarity matching, admin audit log, accessibility audit and multilingual UI.

## License

MIT - see `LICENSE`.
