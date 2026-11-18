import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { syncLocalStoryData } from '@/lib/story-cloud';

export async function unlockSharedStory(accessCode: string): Promise<void> {
  const response = await fetch('/api/story-access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ accessCode }),
  });
  const result = await response.json() as {
    access_token?: unknown;
    refresh_token?: unknown;
    error?: unknown;
  };

  if (!response.ok) {
    throw new Error(typeof result.error === 'string' ? result.error : 'Could not unlock the shared story.');
  }
  if (typeof result.access_token !== 'string' || typeof result.refresh_token !== 'string') {
    throw new Error('The server returned an invalid shared story session.');
  }

  const { error } = await getSupabaseBrowserClient().auth.setSession({
    access_token: result.access_token,
    refresh_token: result.refresh_token,
  });
  if (error) throw new Error(`Could not establish the shared story session: ${error.message}`);

  await syncLocalStoryData();
}
