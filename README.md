# LloydxJudi1

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-scaed1fx)

## Settings exports and email invitations

Story data is stored in the browser. The Settings page can download a JSON backup, a QR code that opens the deployed app, or a PDF containing saved memories, photos, timeline moments, and letters. The QR code is an app link; it does not transfer browser-local data to another device. Photos whose hosts block cross-origin downloads are listed by link in the PDF.

To send invitations and anniversary dinner choices by email, configure these server environment variables:

- `RESEND_API_KEY`
- `RESEND_FROM` (a sender address verified with Resend)
- `ANNIVERSARY_EMAIL_TO` (the address that receives restaurant choices)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Run the anniversary-choice migration in `supabase/migrations` in Supabase. Keep server secrets out of `NEXT_PUBLIC_*` variables. Guests can download an all-day calendar invite for November 22, 2026 after choosing a restaurant.
