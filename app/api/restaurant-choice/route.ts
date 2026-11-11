import { NextResponse } from 'next/server';

const restaurantLocations: Record<string, string> = {
  'The Penthouse 8747': '8747 Paseo de Roxas, Makati',
  'Sumu Niko': 'SM North EDSA, Quezon City',
  "Italianni's BGC": 'Uptown Mall, Taguig',
  'Tong Yang SM North': 'SM North EDSA, Quezon City',
};

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ANNIVERSARY_EMAIL_TO;
  const sender = process.env.RESEND_FROM;
  if (!supabaseUrl || !serviceKey || !resendKey || !recipient || !sender) {
    return NextResponse.json({ error: 'Restaurant notifications are not configured yet.' }, { status: 503 });
  }

  let restaurant: unknown;
  try {
    ({ restaurant } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (typeof restaurant !== 'string' || !Object.hasOwn(restaurantLocations, restaurant)) {
    return NextResponse.json({ error: 'Choose one of the listed dinner options.' }, { status: 400 });
  }

  const saved = await fetch(`${supabaseUrl}/rest/v1/anniversary_choices`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ restaurant }),
  });
  if (!saved.ok) return NextResponse.json({ error: 'Could not save the choice. Check the Supabase setup.' }, { status: 502 });

  const emailed = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: `Anniversary dinner choice: ${restaurant}`,
      text: `Your anniversary dinner choice is: ${restaurant}.\nLocation: ${restaurantLocations[restaurant]}\nDate: Sunday, November 22, 2026.`,
    }),
  });
  if (!emailed.ok) return NextResponse.json({ error: 'Choice saved, but email delivery failed. Check the Resend setup.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
