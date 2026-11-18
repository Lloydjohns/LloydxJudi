import { timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const attempts = new Map<string, { count: number; resetAt: number }>();
const ATTEMPT_LIMIT = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host.split(',')[0].trim().toLowerCase();
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Access requests must come from this site.' }, { status: 403, headers });
  }

  const ip = request.headers.get('x-nf-client-connection-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? 'unknown';
  const now = Date.now();
  const previous = attempts.get(ip);
  if (previous && previous.resetAt > now && previous.count >= ATTEMPT_LIMIT) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a while and try again.' }, { status: 429, headers });
  }
  attempts.set(ip, previous && previous.resetAt > now
    ? { count: previous.count + 1, resetAt: previous.resetAt }
    : { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  if (attempts.size > 1000) {
    attempts.forEach((attempt, key) => {
      if (attempt.resetAt <= now) attempts.delete(key);
    });
  }

  const expectedCode = process.env.STORY_ACCESS_CODE;
  const email = process.env.STORY_SHARED_EMAIL;
  const password = process.env.STORY_SHARED_PASSWORD;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!expectedCode || !email || !password || !url || !publishableKey) {
    return NextResponse.json({ error: 'Shared story access is not configured on the server.' }, { status: 503, headers });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Enter the shared access code.' }, { status: 400, headers });
  }
  const accessCode = payload && typeof payload === 'object'
    ? (payload as { accessCode?: unknown }).accessCode
    : undefined;
  if (typeof accessCode !== 'string' || accessCode.length > 256) {
    return NextResponse.json({ error: 'Enter the shared access code.' }, { status: 400, headers });
  }

  const provided = Buffer.from(accessCode);
  const expected = Buffer.from(expectedCode);
  const codeMatches = provided.length === expected.length && timingSafeEqual(provided, expected);
  if (!codeMatches) {
    return NextResponse.json({ error: 'That access code did not unlock our story. Try again.' }, { status: 401, headers });
  }

  const supabase = createClient(url, publishableKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    console.error('Shared story account authentication failed.');
    return NextResponse.json({ error: 'The shared story account is temporarily unavailable.' }, { status: 503, headers });
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  }, { headers });
}
