import { NextResponse } from 'next/server';

const restaurantLocations: Record<string, string> = {
  'The Penthouse 8747': '8747 Paseo de Roxas, Makati',
  'Sumu Niko': 'SM North EDSA, Quezon City',
  "Italianni's BGC": 'Uptown Mall, Taguig',
  'Tong Yang SM North': 'SM North EDSA, Quezon City',
};

const sanitizeText = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') return '';
  const cleaned = value.trim().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength).trim() : cleaned;
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

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Please complete the dinner form before sending.' }, { status: 400 });
  }

  const { restaurant, guestName, preferredTime, dressCode, specialNotes } = payload as {
    restaurant?: unknown;
    guestName?: unknown;
    preferredTime?: unknown;
    dressCode?: unknown;
    specialNotes?: unknown;
  };

  if (typeof restaurant !== 'string' || !Object.hasOwn(restaurantLocations, restaurant)) {
    return NextResponse.json({ error: 'Choose one of the listed dinner options.' }, { status: 400 });
  }

  const cleanGuestName = sanitizeText(guestName, 80) || 'Judith Peñaflor';
  const cleanPreferredTime = sanitizeText(preferredTime, 50) || '7:30 PM';
  const cleanDressCode = sanitizeText(dressCode, 80) || 'Dressy casual / elegant date night';
  const cleanSpecialNotes = sanitizeText(specialNotes, 300) || 'No special notes added.';
  const restaurantLocation = restaurantLocations[restaurant];

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

  const emailText = [
    'Anniversary Dinner RSVP',
    '',
    `Guest: ${cleanGuestName}`,
    `Chosen restaurant: ${restaurant}`,
    `Location: ${restaurantLocation}`,
    'Date: Sunday, November 22, 2026',
    `Preferred time: ${cleanPreferredTime}`,
    `Dress code: ${cleanDressCode}`,
    `Special notes: ${cleanSpecialNotes}`,
    '',
    'Thank you for choosing to celebrate this special evening with me.',
    'Please reply with any final adjustments or questions.',
    '',
    'With love,',
    'Lloyd & Judi',
  ].join('\n');

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2d1d2f; max-width: 620px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #fff4f7 0%, #f8e9ed 100%); padding: 28px 24px; border-radius: 18px; border: 1px solid #f1d4de;">
        <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #b14d72; font-weight: bold;">Anniversary dinner RSVP</p>
        <h1 style="margin: 0 0 20px; font-size: 30px; line-height: 1.2; color: #5d2d3d;">Your date night details</h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d; width: 160px;">Guest:</td><td>${cleanGuestName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Restaurant:</td><td>${restaurant}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Location:</td><td>${restaurantLocation}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Date:</td><td>Sunday, November 22, 2026</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Preferred time:</td><td>${cleanPreferredTime}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Dress code:</td><td>${cleanDressCode}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d; vertical-align: top;">Special notes:</td><td>${cleanSpecialNotes}</td></tr>
        </table>
        <p style="margin-top: 22px; margin-bottom: 8px; font-size: 15px; color: #5d2d3d;">Thank you for choosing to celebrate this special evening with me. Please reply to this email with any final adjustments or questions.</p>
        <p style="margin: 0; font-size: 15px; color: #5d2d3d;">With love,</p>
        <p style="margin: 0; font-size: 18px; color: #b14d72; font-weight: bold;">Lloyd &amp; Judi</p>
      </div>
    </div>
  `;

  const emailed = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: `Anniversary dinner RSVP: ${restaurant}`,
      text: emailText,
      html: emailHtml,
    }),
  });
  if (!emailed.ok) return NextResponse.json({ error: 'Choice saved, but email delivery failed. Check the Resend setup.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
