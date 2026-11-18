# LloydxJudi

## Shared story setup

Story data is stored in Supabase so it is available on each device when you sign in with the same account. Memories, timeline events and chapter edits, letters, special dates, playlist entries, and the couple profile are stored in the `story_collections` table. Uploaded photos and videos are stored in a private Supabase Storage bucket.

### Configure Supabase

1. Apply `supabase/migrations/20261118133846_story_cloud_sync.sql` to your Supabase project using the Supabase SQL Editor or your linked migration workflow. It creates the RLS-protected story table and private media bucket.
2. Enable email/password sign-in in Supabase Auth. Configure the site's production URL and local URL in the Auth redirect/allowed URL settings so email confirmation links can return to the app.
3. Set these public variables for local development and in the Vercel project's environment settings, then redeploy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The browser uses only the publishable key. Never expose `SUPABASE_SERVICE_ROLE_KEY` in a `NEXT_PUBLIC_*` variable. The service-role key is only needed by server-side features that explicitly require it.

### Sign in and move existing data

Create one account, then use that same email and password on your laptop, PC, and phone. On the first authenticated visit, the app copies the current browser's saved story collections into that account when the cloud collection does not already exist. **Sign in first on the browser that contains the data you want to migrate.** Other devices load the shared cloud data after signing in.

Existing externally hosted image and video links stay as links. New files uploaded through the memory form are stored privately in Supabase Storage (up to 50 MB per file). Local files from other browsers or devices cannot be transferred automatically; upload or re-add those files on the browser containing them.

## Email features

To send invitations and anniversary dinner choices by email, configure these server environment variables:

- `RESEND_API_KEY`
- `RESEND_FROM` (a sender address verified with Resend)
- `ANNIVERSARY_EMAIL_TO` (the address that receives restaurant choices)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only, if required by the email feature)

Run the anniversary-choice migration in `supabase/migrations` in Supabase. Guests can download an all-day calendar invite for November 22, 2026 after choosing a restaurant.
