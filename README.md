# Recap

Turn any meeting transcript into structured Notion tasks and email summaries — automatically.

---

## Prerequisites

- **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- All API keys from `.env.example`

---

## First-time Setup (local)

### Step 1 — Fill in your `.env`

```bash
cp .env.example .env
```

Fill in all values except `N8N_API_KEY` — you'll get that in Step 3.

| Variable | Where to get it |
|---|---|
| `POSTGRES_PASSWORD` | Make up any strong password |
| `N8N_ENCRYPTION_KEY` | Run: `openssl rand -hex 16` |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `NOTION_API_KEY` | [notion.so/my-integrations](https://www.notion.so/my-integrations) → your integration → Access token |
| `SENDGRID_API_KEY` | [app.sendgrid.com](https://app.sendgrid.com) → Settings → API Keys |
| `SENDGRID_FROM_EMAIL` | A verified sender email in SendGrid |
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com](https://supabase.com) → your project → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → service_role key |

### Step 2 — Set up Supabase tables

1. Go to your Supabase project → **SQL Editor**
2. Paste the contents of `supabase-schema.sql` → **Run**

### Step 3 — Start the stack

```bash
docker compose up --build
```

Wait ~60 seconds. Then open **http://localhost:5678** and:

1. Complete the n8n setup wizard (create an account)
2. Go to **Settings → n8n API → Create API key** → copy it
3. Paste it into your `.env` as `N8N_API_KEY=...`

### Step 4 — Import & register the workflow

Run the importer:

```bash
docker compose --profile init up n8n-init
```

This imports the workflow via the n8n API. **One manual step is then required** —
n8n does not register a production webhook for an API-imported workflow until it
is saved once from the editor:

1. Open http://localhost:5678 and open the **Recap** workflow
2. Drag any node a few pixels (so the workflow is marked as changed)
3. Press **Ctrl+S** to save — this registers the `/webhook/recap/*` routes
4. Confirm the **Active** toggle (top-right) is ON

Verify registration:

```bash
curl -X POST http://localhost:5678/webhook/recap/process \
  -H "Content-Type: application/json" -d '{"transcript":"test"}'
```

You should get a JSON response (or an Anthropic API message) — **not**
`"... is not registered"`.

> **Prefer doing it entirely in the UI?** Skip the importer: in n8n click
> **Create workflow** → ⋮ menu → **Import from File** → select
> `n8n-workflows/recap.json` → drag a node → **Ctrl+S** → toggle **Active**.
> This avoids the API-import registration quirk altogether.

### Step 5 — Open the app

**http://localhost:3000**

---

## Daily Use (after first-time setup)

```bash
docker compose up        # start everything
docker compose down      # stop everything
docker compose down -v   # stop + wipe all data (fresh start)
```

---

## How it works

```
Paste transcript
  → n8n webhook (/webhook/recap/process) → Claude API extracts tasks
  → User reviews & edits
  → Confirm (/webhook/recap/confirm) → Notion tasks created + email sent
  → Session saved to Supabase history
```

- **http://localhost:3000** — main app
- **http://localhost:3000/history** — past sessions
- **http://localhost:5678** — n8n UI (admin only)

---

## Deploying to Railway

The frontend and n8n are deployed as **two separate Railway services**, with a Railway Postgres plugin for n8n's database.

1. **Postgres** — add the Railway Postgres plugin; note its connection vars.
2. **n8n service** — uses the root `railway.toml` (image `n8nio/n8n:latest`). Set these variables:
   - `DB_TYPE=postgresdb` and the `DB_POSTGRESDB_*` vars pointing at the Railway Postgres plugin
   - `N8N_ENCRYPTION_KEY` (same value you used locally, or a fresh one)
   - `WEBHOOK_URL` = the service's **public** URL **with a trailing slash**, e.g. `https://recap-n8n.up.railway.app/`
   - `N8N_PROTOCOL=https`, `N8N_HOST=<your-n8n-domain>`
   - `N8N_CORS_ENABLE=true`, `N8N_CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>`
   - `NODE_FUNCTION_ALLOW_ENV=ANTHROPIC_API_KEY,NOTION_API_KEY,SENDGRID_API_KEY,SENDGRID_FROM_EMAIL`
   - `ANTHROPIC_API_KEY`, `NOTION_API_KEY`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
   - After it boots, create an API key in the n8n UI and import `n8n-workflows/recap.json` (UI import, or run the init script against the public URL).
3. **frontend service** — root directory `frontend/`, builds from `frontend/Dockerfile`. Set:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_N8N_WEBHOOK_URL` = `https://<your-n8n-domain>/webhook/recap`

> ⚠️ Because `NEXT_PUBLIC_*` vars are baked in at build time, set them as **build args** in Railway (or re-deploy after changing them).

---

## Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js 14 + Tailwind CSS |
| Containers | Docker + Docker Compose |
| Workflow engine | n8n (self-hosted) |
| AI extraction | Claude API (claude-sonnet-4-6) |
| Task management | Notion API |
| Email | SendGrid |
| Session storage | Supabase (Postgres) |
| Production hosting | Railway |
