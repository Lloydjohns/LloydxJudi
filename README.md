# LloydxJudi

## Shared story setup

Story data is stored in Supabase so it is available on each device after entering the same shared access code. There is no email/password login or public account creation in the app. Memories, timeline events and chapter edits, letters, special dates, playlist entries, and the couple profile are stored in the `story_collections` table. Uploaded photos and videos are stored in a private Supabase Storage bucket.

### Configure Supabase

1. Apply the full contents of `supabase/migrations/20261118133846_story_cloud_sync.sql` to your Supabase project in **Dashboard → SQL Editor → New query → Run**. It creates the RLS-protected story table, grants the authenticated Data API role access subject to RLS, and creates the private media bucket. The migration is safe to rerun if a previous attempt stopped partway through; it refreshes the named policies without deleting story rows. It also asks PostgREST to reload its schema.
2. Create one shared user in Supabase Auth (or reuse the account that owns the existing story data). The app's server checks the shared access code, then establishes a session for this account; people using the app do not enter the account's email or password.
3. Set these public variables for local development and in the Vercel project's environment settings, then redeploy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Set these **server-only** variables in local development and Vercel, then redeploy:
   - `STORY_ACCESS_CODE`: a long, unique code shared only with the intended devices/users (use at least 32 random characters).
   - `STORY_SHARED_EMAIL`: the shared Supabase Auth user's email.
   - `STORY_SHARED_PASSWORD`: that Supabase Auth user's password.

If the app reports that `public.story_collections` is missing from the schema cache, the migration has not been run on this Supabase project (or PostgREST has not yet refreshed). Run the migration above; if the table exists but the error persists, use **Project Settings → API → Reload schema cache**, then reload the app.

The access code is verified on the server and is not included in browser code. The server exchanges it for a Supabase session for the shared account; the database and storage remain private under the migration's owner-based RLS policies. Never expose `STORY_ACCESS_CODE`, `STORY_SHARED_PASSWORD`, or `SUPABASE_SERVICE_ROLE_KEY` in a `NEXT_PUBLIC_*` variable.

### Unlock and move existing data

Enter the same shared access code on your laptop, PC, and phone. On the first visit from an authenticated device, the app copies that browser's saved story collections into the shared account when the cloud collection does not already exist. **Unlock first on the browser that contains the data you want to migrate.** Other devices load the shared cloud data after entering the code.

Existing externally hosted image and video links stay as links. New files uploaded through the memory form are stored privately in Supabase Storage (up to 50 MB per file). Local files from other browsers or devices cannot be transferred automatically; upload or re-add those files on the browser containing them.

## Email features

To send invitations and anniversary dinner choices by email, configure these server environment variables:

- `RESEND_API_KEY`
- `RESEND_FROM` (a sender address verified with Resend)
- `ANNIVERSARY_EMAIL_TO` (the address that receives restaurant choices)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only, if required by the email feature)

Run the anniversary-choice migration in `supabase/migrations` in Supabase. Guests can download an all-day calendar invite for November 22, 2026 after choosing a restaurant.
