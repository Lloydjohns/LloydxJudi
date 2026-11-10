-- Run this migration in the Supabase SQL editor.
-- Asset URLs stay in the database; the actual media can remain hosted elsewhere.
create table if not exists public.media_links (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('image', 'video', 'song')),
  title text not null,
  url text not null,
  related_memory_id text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_links_kind_position_idx
  on public.media_links (kind, position);

create table if not exists public.anniversary_choices (
  id uuid primary key default gen_random_uuid(),
  restaurant text not null,
  created_at timestamptz not null default now()
);

alter table public.media_links enable row level security;
alter table public.anniversary_choices enable row level security;

-- Writes are made server-side with the Supabase service role key.
-- No anon policies are added, so the public browser cannot read or alter these tables.
