'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, ImagePlus, Link2, MapPin, Save, Tag, Video, X } from 'lucide-react';
import { demoMemories, getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import type { Memory, TimelineChapterOverride } from '@/lib/types';
import { loadCloudValue, saveCloudValue, STORY_COLLECTION_KEYS } from '@/lib/story-cloud';
import { makeLocalId } from '@/lib/local-data';
import { deleteStoryMedia, isSupabaseMediaReference, uploadStoryMedia } from '@/lib/story-media';
import { StoryImage } from '@/components/media/story-image';
import { getTimelineChapters } from '@/lib/timeline-chapters';

const STORAGE_KEY = 'llodxjudi-memories';

export default function NewMemoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const baseChapters = getDemoChapters(new Date(DEMO_ANNIVERSARY_DATE));
  const [chapterOverrides, setChapterOverrides] = useState<TimelineChapterOverride[]>([]);
  const chapters = getTimelineChapters(new Date(DEMO_ANNIVERSARY_DATE), chapterOverrides);
  const [tags, setTags] = useState<string[]>(['Milestone']);
  const [tagValue, setTagValue] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [customChapterName, setCustomChapterName] = useState('');
  const [form, setForm] = useState({
    title: '',
    memoryDate: '',
    location: '',
    chapterId: baseChapters[0]?.id ?? 'ch-1',
    story: '',
    imagePath: '',
    videoPath: '',
  });

  useEffect(() => {
    let active = true;
    loadCloudValue<TimelineChapterOverride[]>(STORY_COLLECTION_KEYS.timelineChapters, [])
      .then((overrides) => { if (active) setChapterOverrides(overrides); })
      .catch((cause: unknown) => {
        if (active) setSaveError(cause instanceof Error ? cause.message : 'Could not load timeline chapters.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!editId) return;
    let active = true;
    loadCloudValue<Memory[]>(STORAGE_KEY, demoMemories)
      .then((memories) => {
        const memory = memories.find((item) => item.id === editId);
        if (!active) return;
        if (!memory) {
          setSaveError('This memory was not found in your shared story.');
          return;
        }
        setForm({
          title: memory.title,
          memoryDate: memory.memoryDate,
          location: memory.location ?? '',
          chapterId: memory.chapterName ? 'custom' : memory.chapterId,
          story: memory.story,
          imagePath: memory.imagePath ?? '',
          videoPath: memory.videoPath ?? '',
        });
        setCustomChapterName(memory.chapterName ?? '');
        setTags(memory.tags);
      })
      .catch((cause: unknown) => {
        if (active) setSaveError(cause instanceof Error ? cause.message : 'Could not load this memory.');
      });
    return () => { active = false; };
  }, [editId]);

  const addTag = () => {
    const nextTag = tagValue.trim();
    if (nextTag && !tags.includes(nextTag)) setTags([...tags, nextTag]);
    setTagValue('');
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = form.title.trim();
    const story = form.story.trim();
    const memoryDate = form.memoryDate;

    if (!title || !story || !memoryDate) return;
    setSaving(true);
    setSaveError('');

    let uploadedImage: string | null = null;
    let uploadedVideo: string | null = null;
    try {
      const current = await loadCloudValue<Memory[]>(STORAGE_KEY, demoMemories);
      const existing = current.find((memory) => memory.id === editId);
      const id = existing?.id ?? makeLocalId('memory');
      const imagePath = imageFile
        ? (uploadedImage = await uploadStoryMedia(imageFile, `memories/${id}`))
        : form.imagePath.trim() || null;
      const videoPath = videoFile
        ? (uploadedVideo = await uploadStoryMedia(videoFile, `memories/${id}`))
        : form.videoPath.trim() || null;
      const customMemory: Memory = {
        id,
        coupleId: existing?.coupleId ?? 'demo',
        chapterId: form.chapterId === 'custom' ? `custom-${customChapterName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : form.chapterId,
        chapterName: form.chapterId === 'custom' ? customChapterName.trim() : undefined,
        title,
        memoryDate,
        story,
        imagePath,
        videoPath,
        location: form.location.trim() || null,
        tags: tags.length ? tags.map((tag) => tag.toLowerCase().replace(/\s+/g, '-')) : ['milestone'],
        createdBy: existing?.createdBy ?? 'demo',
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const next = existing
        ? current.map((memory) => memory.id === existing.id ? customMemory : memory)
        : [customMemory, ...current];
      await saveCloudValue(STORAGE_KEY, next);
      setSaved(true);

      const oldImage = existing?.imagePath && existing.imagePath !== imagePath ? existing.imagePath : null;
      const oldVideo = existing?.videoPath && existing.videoPath !== videoPath ? existing.videoPath : null;
      try {
        await Promise.all([deleteStoryMedia(oldImage), deleteStoryMedia(oldVideo)]);
      } catch (cleanupError) {
        window.alert(cleanupError instanceof Error ? `Memory saved, but old media cleanup failed: ${cleanupError.message}` : 'Memory saved, but old media cleanup failed.');
      }
      window.setTimeout(() => router.push('/gallery'), 700);
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not save this memory to the cloud.');
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fff8f7] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Button asChild variant="ghost" size="sm" className="mb-5"><Link href="/gallery"><ArrowLeft className="mr-2 h-4 w-4" /> Back to gallery</Link></Button>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Add to our story</p>
            <h1 className="mt-2 font-script text-5xl text-wine sm:text-7xl">{editId ? 'Edit Memory' : 'Add a New Memory'}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Add a link, date, and story. We keep it light and romantic.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <Card className="editorial-card rounded-2xl">
              <CardContent className="space-y-5 p-5 sm:p-7">
                <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <ImagePlus className="h-5 w-5" />
                    <p className="text-sm font-semibold">Photo</p>
                  </div>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                    className="mt-3 border-primary/20 bg-white/70"
                  />
                  <Input
                    type="url"
                    value={isSupabaseMediaReference(form.imagePath) ? '' : form.imagePath}
                    onChange={(event) => { setImageFile(null); handleChange('imagePath', event.target.value); }}
                    placeholder="https://images.example.com/our-date.jpg"
                    aria-label="Or paste a photo URL"
                    className="mt-3 border-primary/20 bg-white/70"
                  />
                  {imageFile && <p className="mt-2 text-xs text-muted-foreground">Selected: {imageFile.name}</p>}
                  {!imageFile && form.imagePath && (
                    <div className="mt-3 flex items-center gap-3">
                      <StoryImage src={form.imagePath} alt="Current memory photo" className="h-16 w-16 rounded-md object-cover" />
                      <Button type="button" size="sm" variant="outline" onClick={() => handleChange('imagePath', '')}>Remove photo</Button>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Video className="h-5 w-5" />
                    <p className="text-sm font-semibold">Video</p>
                  </div>
                  <Input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
                    className="mt-3 border-primary/20 bg-white/70"
                  />
                  <Input
                    type="url"
                    value={isSupabaseMediaReference(form.videoPath) ? '' : form.videoPath}
                    onChange={(event) => { setVideoFile(null); handleChange('videoPath', event.target.value); }}
                    placeholder="https://example.com/our-love-story.mp4"
                    aria-label="Or paste a video URL"
                    className="mt-3 border-primary/20 bg-white/70"
                  />
                  {videoFile && <p className="mt-2 text-xs text-muted-foreground">Selected: {videoFile.name}</p>}
                  {form.videoPath && !videoFile && <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => handleChange('videoPath', '')}>Remove video</Button>}
                </div>

                <div className="rounded-2xl border border-primary/15 bg-white/60 p-4 text-xs leading-5 text-muted-foreground">
                  Upload photos or videos up to 50 MB each to your private cloud storage, or paste a direct URL.
                </div>
              </CardContent>
            </Card>

            <Card className="editorial-card rounded-2xl">
              <CardContent className="space-y-5 p-5 sm:p-7">
                <div className="space-y-2"><Label htmlFor="title">Title <span className="text-primary">*</span></Label><Input id="title" value={form.title} onChange={(event) => handleChange('title', event.target.value)} required placeholder="e.g. Our first date" className="border-primary/20 bg-white/70" /></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="date" className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-primary" /> Date <span className="text-primary">*</span></Label><Input id="date" type="date" value={form.memoryDate} onChange={(event) => handleChange('memoryDate', event.target.value)} required className="border-primary/20 bg-white/70" /></div>
                  <div className="space-y-2"><Label htmlFor="location" className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Location</Label><Input id="location" value={form.location} onChange={(event) => handleChange('location', event.target.value)} placeholder="e.g. Bagio City" className="border-primary/20 bg-white/70" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="chapter">Chapter</Label><select id="chapter" value={form.chapterId} onChange={(event) => handleChange('chapterId', event.target.value)} className="flex h-10 w-full rounded-md border border-primary/20 bg-white/70 px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">{chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>Month {chapter.monthNumber} · {chapter.title}</option>)}<option value="custom">Type a chapter name…</option></select>{form.chapterId === 'custom' && <Input value={customChapterName} onChange={(event) => setCustomChapterName(event.target.value)} placeholder="Type your chapter name" required className="border-primary/20 bg-white/70" />}</div>
                <div className="space-y-2"><Label htmlFor="story">Story <span className="text-primary">*</span></Label><Textarea id="story" value={form.story} onChange={(event) => handleChange('story', event.target.value)} required placeholder="Tell the story behind this memory..." className="min-h-32 border-primary/20 bg-white/70" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-primary" /> Tags</Label><div className="flex flex-wrap gap-2">{tags.map((tag) => <Badge key={tag} variant="secondary" className="gap-1 capitalize">{tag}<button type="button" onClick={() => setTags(tags.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}><X className="h-3 w-3" /></button></Badge>)}</div><div className="flex gap-2"><Input value={tagValue} onChange={(event) => setTagValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTag(); } }} placeholder="Add a tag" className="border-primary/20 bg-white/70" /><Button type="button" variant="outline" onClick={addTag}>Add</Button></div></div>
                {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
                <Button type="submit" disabled={saving} className="w-full bg-gradient-wine text-white hover:opacity-90"><Save className="mr-2 h-4 w-4" />{saved ? 'Saved to cloud...' : saving ? 'Saving to cloud...' : editId ? 'Update Memory ♡' : 'Save Memory ♡'}</Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
