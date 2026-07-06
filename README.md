# Brands Galaxy

Live e-commerce site for a Pakistan-based luxury cosmetics, skincare, and K-beauty retailer — **brandsgalaxy.store**.

This file is the source of truth for orienting in this codebase. It reflects the **current, deployed state** of the project, not the original scaffold. If anything here looks stale, prefer `git log` / the actual code over this doc, then fix this doc.

## Architecture

Decoupled two-service app:

| Layer | Tech | Hosted on |
|---|---|---|
| Frontend | Next.js 14 (App Router, JavaScript, no TS) + React 18 + Tailwind + Zustand | Vercel |
| Backend | FastAPI (Python 3.11) + SQLAlchemy 2.0 + Alembic | Render |
| Database | PostgreSQL | Supabase |
| File storage | Supabase Storage (falls back to local `backend/app/static/products/` in dev) | Supabase |

**Why routing works the way it does:** in production, Next.js rewrites (`frontend/next.config.js`) proxy `/api/*` and `/static/*` straight through to the Render backend. The browser only ever talks to the Vercel domain — this sidesteps CORS entirely, which is why several past commits mention CORS fixes (those were from before the proxy was in place).

Render's free tier sleeps the backend when idle, so:
- `frontend/src/components/KeepAlive.js` pings the backend to delay cold sleep.
- `frontend/src/app/products/page.js` auto-retries product fetches to ride out a cold start instead of showing "0 results".

## Repo layout

```
brands-galaxy-vscode/
├── backend/                     FastAPI app
│   ├── app/
│   │   ├── main.py              App factory, CORS, static mount, DB init + seed on startup (lifespan)
│   │   ├── config.py            Pydantic settings (env vars)
│   │   ├── database.py          SQLAlchemy engine/session (auto-adds sslmode=require for Postgres)
│   │   ├── models/               user.py, product.py (Category + Product), order.py (Order/OrderItem/enums)
│   │   ├── schemas/               Pydantic request/response models
│   │   ├── routes/
│   │   │   ├── auth.py           /api/auth — register, login (JWT), me
│   │   │   ├── products.py       /api/products — list/filter/sort/paginate, categories, brands, admin CRUD, image upload
│   │   │   └── orders.py         /api/orders — checkout pricing (Pakistan-specific), admin order management, WhatsApp notify
│   │   ├── utils/                 auth.py (bcrypt/JWT), storage.py (Supabase or local upload), seed.py, seed_korean.py
│   │   └── static/products/       Local fallback image storage
│   ├── migrations/                Alembic (currently just 001_initial_schema.py — most schema changes went via create_all, not migrations)
│   ├── seed_kbeauty.py            Standalone script to seed/expand the Korean-beauty catalog — run manually
│   ├── requirements.txt, alembic.ini, Procfile, runtime.txt (pins Python 3.11.9), .env / .env.example
│
├── frontend/                    Next.js app
│   ├── src/
│   │   ├── app/                  File-based routes: / , /products , /products/[slug] , /cart , /checkout ,
│   │   │                         /orders , /wishlist , /auth/login , /auth/register , /admin , /admin/orders ,
│   │   │                         /admin/products/new , /admin/products/edit/[id] , robots.ts , sitemap.ts
│   │   ├── components/           Navbar.js, ProductCard.js, QuickViewModal.js, KeepAlive.js
│   │   └── lib/
│   │       ├── store.js          Zustand stores (persisted to localStorage): useCartStore, useWishlistStore, useAuthStore
│   │       ├── api.js             Axios instance; relative URLs in prod (proxy), JWT auto-attach, 401 → auto-logout
│   │       ├── currency.js        PKR formatting + shipping/tax constants (see "duplicated logic" below)
│   │       └── utils.js           getImageUrl() and misc helpers
│   ├── package.json, tailwind.config.js, next.config.js, vercel.json, .env.local
│
├── public/                      Marketing/product images referenced directly by the frontend
├── .claude/agents/               Domain-spec playbooks for AI agents (not runtime code)
├── .vscode/                      VS Code tasks (install/run backend & frontend)
├── brands-galaxy.code-workspace  Multi-root workspace (root/backend/frontend)
└── vercel.json                  Empty — lets Vercel auto-detect the frontend/ Next.js app
```

## Business logic worth knowing

- **Checkout**: Cash on Delivery or bank transfer only — no payment gateway is wired up (a Stripe publishable-key placeholder sits unused in `frontend/.env.local`).
- **Pricing rules (Pakistan-specific)**: Karachi vs. other-city shipping rates, 4% tax, free shipping over Rs. 5000. This logic is **duplicated in three places** — `backend/app/routes/orders.py`, `frontend/src/lib/store.js`, and `frontend/src/app/checkout/page.js` — keep them in sync when changing rates.
- **Order notifications**: creating an order fires a WhatsApp message via the CallMeBot API on a background thread (non-blocking), gated by the `CALLMEBOT_API_KEY` env var.
- **Products**: soft-delete only (`is_active=False`). List endpoint limit ceiling is 500 to accommodate the full catalog (~164 active products across 12+ brands, including Korean brands like ANUA and MEDICUBE).
- **Auth**: JWT bearer tokens, `is_admin` flag gates `/admin` routes and pages.

## Known rough edges

- `backend/app/schemas/order.py` defines a fuller US-style address schema (state/postal_code/country) that's **unused** — `routes/orders.py` defines its own simpler inline models matching the actual Pakistan-only checkout form. Don't edit the unused schema expecting it to take effect.
- A stray literal folder `frontend/src/{app,components,lib}` exists alongside the real `app/`, `components/`, `lib/` directories — a leftover brace-expansion mistake, safe to ignore/delete.
- `backend/.env` contains real values and isn't obviously covered by `.gitignore` — verify before pushing that live secrets aren't committed.

## Environment variables

**`backend/.env`** (see `backend/.env.example`):
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SECRET_KEY=...
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_SERVICE_KEY=...
SUPABASE_BUCKET=products
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
CALLMEBOT_API_KEY=...        # optional — enables WhatsApp order notifications
```
Note: `ALLOWED_ORIGINS` handling in `config.py` always force-includes `brandsgalaxy.store`/`www.` regardless of this value.

**`frontend/.env.local`**:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...   # placeholder, unused — no Stripe integration exists yet
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Running locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API: http://localhost:8000 — Swagger docs: http://localhost:8000/docs

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
http://localhost:3000

Or use the VS Code tasks (`Ctrl+Shift+P` → `Tasks: Run Task`) defined in `.vscode/tasks.json` — includes a "Start Both Servers" task.

On backend startup, `main.py`'s lifespan hook runs `Base.metadata.create_all` and seeds the DB from `utils/seed.py` **only if the categories table is empty**. To (re)seed Korean-beauty products, run `backend/app/utils/seed_korean.py` or `backend/seed_kbeauty.py` manually.

## Deployment

- **Frontend**: Vercel, auto-detects Next.js from `frontend/` (`frontend/vercel.json` → `{"framework": "nextjs"}`; root `vercel.json` is intentionally empty).
- **Backend**: Render, via `backend/Procfile` (`uvicorn app.main:app`). Python pinned to 3.11.9 (`backend/runtime.txt`) because some deps (Pillow, bcrypt) lack prebuilt wheels for newer Python versions on Render.

## Key files by concern

| Concern | Files |
|---|---|
| Products | `backend/app/models/product.py`, `routes/products.py`, `schemas/product.py`, `frontend/src/app/products/**`, `frontend/src/components/ProductCard.js` |
| Orders / checkout | `backend/app/models/order.py`, `routes/orders.py`, `frontend/src/app/checkout/page.js`, `frontend/src/app/orders/page.js`, `frontend/src/app/admin/orders/page.js` |
| Auth | `backend/app/routes/auth.py`, `utils/auth.py`, `frontend/src/lib/store.js` (`useAuthStore`), `frontend/src/app/auth/**`, `frontend/src/lib/api.js` |
| Admin | `frontend/src/app/admin/**` |
| Seeding | `backend/app/utils/seed.py`, `seed_korean.py`, `backend/seed_kbeauty.py` |
| Config/deploy | `backend/app/config.py`, `backend/Procfile`, `backend/runtime.txt`, `frontend/next.config.js`, `frontend/vercel.json` |
