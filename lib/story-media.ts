import { getSupabaseBrowserClient } from '@/lib/supabase-client';

const BUCKET = 'lloydxjudi-story-media';
const STORAGE_REFERENCE_PREFIX = `supabase://${BUCKET}/`;
export const MAX_STORY_MEDIA_SIZE = 50 * 1024 * 1024;

export function isSupabaseMediaReference(value: string): boolean {
  return value.startsWith(STORAGE_REFERENCE_PREFIX);
}

export async function uploadStoryMedia(file: File, folder: string): Promise<string> {
  if (file.size > MAX_STORY_MEDIA_SIZE) {
    throw new Error('Choose a photo or video smaller than 50 MB.');
  }
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    throw new Error('Only image and video files can be uploaded.');
  }

  const supabase = getSupabaseBrowserClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(`Could not verify your account: ${userError.message}`);
  if (!userData.user) throw new Error('Please sign in before uploading media.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'upload';
  const path = `${userData.user.id}/${folder}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Could not upload ${file.type.startsWith('video/') ? 'video' : 'photo'}: ${error.message}`);

  return `${STORAGE_REFERENCE_PREFIX}${path}`;
}

export async function resolveStoryMediaUrl(value: string): Promise<string> {
  if (!isSupabaseMediaReference(value)) return value;
  const path = value.slice(STORAGE_REFERENCE_PREFIX.length);
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  if (error) throw new Error(`Could not load private media: ${error.message}`);
  return data.signedUrl;
}

export async function deleteStoryMedia(value: string | null | undefined): Promise<void> {
  if (!value || !isSupabaseMediaReference(value)) return;
  const path = value.slice(STORAGE_REFERENCE_PREFIX.length);
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Could not delete the old media file: ${error.message}`);
}
