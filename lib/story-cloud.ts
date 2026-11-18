import { demoMemories, demoPlaylistTracks, demoSpecialDates, DEMO_ANNIVERSARY_DATE, DEMO_COUPLE_NAME, getDemoChapters } from '@/lib/demo-data';
import type { LoveLetter } from '@/lib/types';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';

export const STORY_COLLECTION_KEYS = {
  memories: 'llodxjudi-memories',
  letters: 'llodxjudi-letters',
  specialDates: 'llodxjudi-special-dates',
  playlist: 'llodxjudi-playlist',
  timelineEvents: 'llodxjudi-timeline-events',
  timelineChapters: 'llodxjudi-timeline-chapters',
  coupleProfile: 'llodxjudi-couple-profile',
} as const;

const migrationMarker = (userId: string) => `llodxjudi-cloud-ready:${userId}`;

function getDefaultLetters(): LoveLetter[] {
  return getDemoChapters(new Date(DEMO_ANNIVERSARY_DATE))
    .filter((chapter) => chapter.monthlyLetter)
    .map((chapter) => ({
      id: `demo-letter-${chapter.id}`,
      coupleId: 'demo',
      title: `Month ${chapter.monthNumber}: ${chapter.title}`,
      body: chapter.monthlyLetter ?? '',
      recipientUserId: null,
      revealAt: null,
      createdBy: 'demo',
      createdAt: chapter.createdAt,
    }));
}

const collectionDefaults: Record<string, unknown> = {
  [STORY_COLLECTION_KEYS.memories]: demoMemories,
  [STORY_COLLECTION_KEYS.letters]: getDefaultLetters(),
  [STORY_COLLECTION_KEYS.specialDates]: demoSpecialDates,
  [STORY_COLLECTION_KEYS.playlist]: demoPlaylistTracks,
  [STORY_COLLECTION_KEYS.timelineEvents]: [],
  [STORY_COLLECTION_KEYS.timelineChapters]: [],
  [STORY_COLLECTION_KEYS.coupleProfile]: {
    name: DEMO_COUPLE_NAME,
    anniversaryDate: DEMO_ANNIVERSARY_DATE,
  },
};

function formatCollectionError(action: 'load' | 'save', key: string, error: { code?: string; message: string }): Error {
  if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
    return new Error(
      'The cloud database is not set up yet. Run supabase/migrations/20261118133846_story_cloud_sync.sql in your Supabase SQL Editor, then reload this page.'
    );
  }
  return new Error(`Could not ${action} ${key}${action === 'save' ? ' to the cloud' : ''}: ${error.message}`);
}

async function getUserId(): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(`Could not verify your account: ${error.message}`);
  if (!data.user) throw new Error('Enter the shared access code to access your story.');
  return data.user.id;
}

export async function loadCloudValue<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabaseBrowserClient();
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('story_collections')
    .select('data')
    .eq('user_id', userId)
    .eq('collection_key', key)
    .maybeSingle();

  if (error) throw formatCollectionError('load', key, error);

  if (data) return data.data as T;

  const raw = window.localStorage.getItem(key);
  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      throw new Error(`Saved browser data for ${key} is invalid. Export or clear it before syncing.`);
    }
  }

  await saveCloudValue(key, value);
  return value;
}

export async function saveCloudValue<T>(key: string, value: T): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const userId = await getUserId();
  const { error } = await supabase.from('story_collections').upsert(
    {
      user_id: userId,
      collection_key: key,
      data: value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,collection_key' }
  );
  if (error) throw formatCollectionError('save', key, error);
}

export async function syncLocalStoryData(): Promise<void> {
  const userId = await getUserId();
  const marker = migrationMarker(userId);
  if (window.localStorage.getItem(marker) === 'true') return;

  for (const [key, fallback] of Object.entries(collectionDefaults)) {
    await loadCloudValue(key, fallback);
  }
  window.localStorage.setItem(marker, 'true');
}
