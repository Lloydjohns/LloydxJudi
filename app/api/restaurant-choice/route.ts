import { NextResponse } from 'next/server';

const restaurantLocations: Record<string, string> = {
  'The Penthouse 8747': '8747 Paseo de Roxas, Makati',
  'Sumu Niko': 'SM North EDSA, Quezon City',
  "Italianni's BGC": 'Uptown Mall, Taguig',
  'Roof Manila': 'Pacific Skyloft, Lacson Ave, Sampaloc, Manila, 1008 Metro Manila',
};

const sanitizeText = (value: unknown, maxLength: number) => {
  if (typeof value !== 'string') return '';
  const cleaned = value.trim().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ');
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength).trim() : cleaned;
};

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const redactEmailAddresses = (value: string) => value.replace(/[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]+/g, '[email address]');

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const recipients = (process.env.ANNIVERSARY_EMAIL_TO ?? '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
  const sender = process.env.RESEND_FROM;
  if (!supabaseUrl || !serviceKey || !resendKey || recipients.length === 0 || !sender) {
    return NextResponse.json({ error: 'Restaurant notifications are not configured yet.' }, { status: 503 });
  }
  if (recipients.some((email) => !/^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(email))) {
    return NextResponse.json({ error: 'ANNIVERSARY_EMAIL_TO must contain valid email addresses separated by commas.' }, { status: 503 });
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
  const emailGuestName = escapeHtml(cleanGuestName);
  const emailRestaurant = escapeHtml(restaurant);
  const emailLocation = escapeHtml(restaurantLocation);
  const emailPreferredTime = escapeHtml(cleanPreferredTime);
  const emailDressCode = escapeHtml(cleanDressCode);
  const emailSpecialNotes = escapeHtml(cleanSpecialNotes);

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
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d; width: 160px;">Guest:</td><td>${emailGuestName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Restaurant:</td><td>${emailRestaurant}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Location:</td><td>${emailLocation}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Date:</td><td>Sunday, November 22, 2026</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Preferred time:</td><td>${emailPreferredTime}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d;">Dress code:</td><td>${emailDressCode}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #5d2d3d; vertical-align: top;">Special notes:</td><td>${emailSpecialNotes}</td></tr>
        </table>
        <p style="margin-top: 22px; margin-bottom: 8px; font-size: 15px; color: #5d2d3d;">Thank you for choosing to celebrate this special evening with me. Please reply to this email with any final adjustments or questions.</p>
        <p style="margin: 0; font-size: 15px; color: #5d2d3d;">With love,</p>
        <p style="margin: 0; font-size: 18px; color: #b14d72; font-weight: bold;">Lloyd &amp; Judi</p>
      </div>
    </div>
  `;

  const deliveryResults = await Promise.all(recipients.map(async (email) => {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: sender,
          to: [email],
          subject: `Anniversary dinner RSVP: ${restaurant}`,
          text: emailText,
          html: emailHtml,
        }),
      });
      if (response.ok) return { email, ok: true as const };

      const responseText = await response.text();
      let providerMessage = responseText;
      try {
        const providerError: unknown = JSON.parse(responseText);
        if (providerError && typeof providerError === 'object' && 'message' in providerError && typeof providerError.message === 'string') {
          providerMessage = providerError.message;
        }
      } catch {
        // Keep the provider's plain-text response when it is not JSON.
      }
      const message = sanitizeText(providerMessage, 500) || `Resend returned HTTP ${response.status}.`;
      console.error('Resend email delivery failed:', { email, status: response.status, message });
      return { email, ok: false as const, status: response.status, message };
    } catch (error) {
      console.error('Resend request failed for a configured recipient:', error);
      return { email, ok: false as const, status: null, message: 'Could not reach the email service.' };
    }
  }));
  const sentCount = deliveryResults.filter((result) => result.ok).length;
  const failures = deliveryResults.filter((result) => !result.ok);
  if (sentCount === 0) {
    const error = failures.map((failure) => {
      const reason = failure.status === null
        ? failure.message
        : `Resend returned HTTP ${failure.status}: ${failure.message}`;
      return redactEmailAddresses(reason);
    }).join(' ');
    return NextResponse.json({
      error: `Choice saved, but Resend could not send the email. ${error}`,
    }, { status: 502 });
  }
  return NextResponse.json({
    ok: true,
    sentCount,
    hasFailures: failures.length > 0,
  });
}
