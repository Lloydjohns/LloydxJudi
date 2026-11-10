import { NextResponse } from 'next/server';

const inviteAttempts = new Map<string, { count: number; resetAt: number }>();
const INVITE_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM;
  if (!resendKey || !sender) {
    return NextResponse.json({ error: 'Invitations are not configured. Set RESEND_API_KEY and RESEND_FROM on the server.' }, { status: 503 });
  }

  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  let originHost = '';
  try {
    if (origin) originHost = new URL(origin).host.toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Invitation requests must come from this site.' }, { status: 403 });
  }
  if (!originHost || !host || originHost !== host.split(',')[0].trim().toLowerCase()) {
    return NextResponse.json({ error: 'Invitation requests must come from this site.' }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object') {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  const { email, coupleName } = payload as { email?: unknown; coupleName?: unknown };
  if (
    typeof email !== 'string'
    || email.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || (coupleName !== undefined && (typeof coupleName !== 'string' || coupleName.length > 100))
  ) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const clientIp = request.headers.get('x-nf-client-connection-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? 'unknown';
  const now = Date.now();
  const previous = inviteAttempts.get(clientIp);
  if (previous && previous.resetAt > now && previous.count >= INVITE_LIMIT) {
    return NextResponse.json({ error: 'Too many invitations sent. Please try again later.' }, { status: 429 });
  }
  inviteAttempts.set(clientIp, previous && previous.resetAt > now
    ? { count: previous.count + 1, resetAt: previous.resetAt }
    : { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  if (inviteAttempts.size > 1000) {
    inviteAttempts.forEach((attempt, ip) => {
      if (attempt.resetAt <= now) inviteAttempts.delete(ip);
    });
  }

  const appUrl = new URL('/', request.url).toString();
  const name = typeof coupleName === 'string' && coupleName.trim()
    ? coupleName.trim().replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ')
    : 'Our Story';
  let emailed: Response;
  try {
    emailed = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [email.trim()],
        subject: `${name} — join me in our story`,
        text: `I'd love for you to join me in ${name}.\n\nOpen our story here: ${appUrl}\n\nSee you there!`,
      }),
    });
  } catch (error) {
    console.error('Invite email provider request failed:', error);
    return NextResponse.json({ error: 'Could not reach the email service. Please try again later.' }, { status: 502 });
  }

  if (!emailed.ok) {
    console.error('Invite email delivery failed with status:', emailed.status);
    return NextResponse.json({ error: 'The invitation could not be sent. Check the email service configuration and try again.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
