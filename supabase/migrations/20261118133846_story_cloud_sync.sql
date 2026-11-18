create table public.story_collections (
  user_id uuid not null references auth.users (id) on delete cascade,
  collection_key text not null check (
    collection_key in (
      'llodxjudi-memories',
      'llodxjudi-letters',
      'llodxjudi-special-dates',
      'llodxjudi-playlist',
      'llodxjudi-timeline-events',
      'llodxjudi-timeline-chapters',
      'llodxjudi-couple-profile'
    )
  ),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, collection_key)
);

alter table public.story_collections enable row level security;

grant select, insert, update, delete on public.story_collections to authenticated;

create policy "Users can read their own story collections"
  on public.story_collections
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own story collections"
  on public.story_collections
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own story collections"
  on public.story_collections
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own story collections"
  on public.story_collections
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lloydxjudi-story-media',
  'lloydxjudi-story-media',
  false,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can read their own story media"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'lloydxjudi-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can upload their own story media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'lloydxjudi-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can update their own story media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'lloydxjudi-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'lloydxjudi-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own story media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'lloydxjudi-story-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );