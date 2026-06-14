-- ── Recap — Supabase Schema ────────────────────────────────────────
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run

-- Sessions table: stores each processed meeting
create table if not exists public.sessions (
  id            uuid primary key default gen_random_uuid(),
  session_key   text not null,           -- anonymous browser session ID
  transcript    text not null,
  summary       text not null default '',
  decisions     jsonb not null default '[]',
  action_items  jsonb not null default '[]',
  notion_url    text,
  task_count    int,
  emails_sent   int,
  created_at    timestamptz not null default now()
);

-- Settings table: persists Notion DB ID + emails per browser session
create table if not exists public.settings (
  id                  uuid primary key default gen_random_uuid(),
  session_key         text not null unique,
  notion_database_id  text not null default '',
  default_emails      text not null default '',
  updated_at          timestamptz not null default now()
);

-- Indexes for fast session key lookups
create index if not exists sessions_session_key_idx on public.sessions(session_key);
create index if not exists sessions_created_at_idx  on public.sessions(created_at desc);
create index if not exists settings_session_key_idx on public.settings(session_key);

-- Row Level Security: open read/write (no auth — anonymous sessions)
alter table public.sessions enable row level security;
alter table public.settings  enable row level security;

-- Allow anyone to read/write their own rows (keyed by session_key they provide)
create policy "Allow all on sessions" on public.sessions
  for all using (true) with check (true);

create policy "Allow all on settings" on public.settings
  for all using (true) with check (true);
