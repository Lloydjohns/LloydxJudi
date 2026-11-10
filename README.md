# LloydxJudi1

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-scaed1fx)

## Settings exports and email invitations

Story data is stored in the browser. The Settings page can download a JSON backup, a QR code that opens the deployed app, or a PDF containing saved memories, photos, timeline moments, and letters. The QR code is an app link; it does not transfer browser-local data to another device. Photos whose hosts block cross-origin downloads are listed by link in the PDF.

To send invitations from the app, configure `RESEND_API_KEY` and `RESEND_FROM` as server environment variables. `RESEND_FROM` must be a sender address verified with Resend. These values must not be exposed as `NEXT_PUBLIC_*` variables.
