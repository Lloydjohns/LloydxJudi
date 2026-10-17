'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, ImagePlus, Link2, MapPin, Save, Tag, Video, X } from 'lucide-react';
import { getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';

const STORAGE_KEY = 'llodxjudi-memories';

export default function NewMemoryPage() {
  const router = useRouter();
  const chapters = getDemoChapters(new Date(DEMO_ANNIVERSARY_DATE));
  const [tags, setTags] = useState<string[]>(['Milestone']);
  const [tagValue, setTagValue] = useState('');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: '',
    memoryDate: '',
    location: '',
    chapterId: chapters[0]?.id ?? 'ch-1',
    story: '',
    imagePath: '',
    videoPath: '',
  });

  const addTag = () => {
    const nextTag = tagValue.trim();
    if (nextTag && !tags.includes(nextTag)) setTags([...tags, nextTag]);
    setTagValue('');
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = form.title.trim();
    const story = form.story.trim();
    const memoryDate = form.memoryDate;

    if (!title || !story || !memoryDate) return;

    const customMemory = {
      id: `custom-${Date.now()}`,
      coupleId: 'demo',
      chapterId: form.chapterId,
      title,
      memoryDate,
      story,
      imagePath: form.imagePath.trim() || null,
      videoPath: form.videoPath.trim() || null,
      location: form.location.trim() || null,
      tags: tags.length ? tags.map((tag) => tag.toLowerCase().replace(/\s+/g, '-')) : ['milestone'],
      createdBy: 'demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    const next = [customMemory, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(true);
    window.setTimeout(() => router.push('/gallery'), 700);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fff8f7] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Button asChild variant="ghost" size="sm" className="mb-5"><Link href="/gallery"><ArrowLeft className="mr-2 h-4 w-4" /> Back to gallery</Link></Button>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Add to our story</p>
            <h1 className="mt-2 font-script text-5xl text-wine sm:text-7xl">Add a New Memory</h1>
            <p className="mt-2 text-sm text-muted-foreground">Add a link, date, and story. We keep it light and romantic.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <Card className="editorial-card rounded-2xl">
              <CardContent className="space-y-5 p-5 sm:p-7">
                <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <ImagePlus className="h-5 w-5" />
                    <p className="text-sm font-semibold">Image Link</p>
                  </div>
                  <Input
                    value={form.imagePath}
                    onChange={(event) => handleChange('imagePath', event.target.value)}
                    placeholder="https://images.example.com/our-date.jpg"
                    className="mt-3 border-primary/20 bg-white/70"
                  />
                </div>

                <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Video className="h-5 w-5" />
                    <p className="text-sm font-semibold">Video Link</p>
                  </div>
                  <Input
                    value={form.videoPath}
                    onChange={(event) => handleChange('videoPath', event.target.value)}
                    placeholder="https://example.com/our-love-story.mp4"
                    className="mt-3 border-primary/20 bg-white/70"
                  />
                </div>

                <div className="rounded-2xl border border-primary/15 bg-white/60 p-4 text-xs leading-5 text-muted-foreground">
                  Keep it simple: paste a direct image or video URL. No heavy files are uploaded here.
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
                <div className="space-y-2"><Label htmlFor="chapter">Chapter</Label><select id="chapter" value={form.chapterId} onChange={(event) => handleChange('chapterId', event.target.value)} className="flex h-10 w-full rounded-md border border-primary/20 bg-white/70 px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">{chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>Month {chapter.monthNumber} · {chapter.title}</option>)}</select></div>
                <div className="space-y-2"><Label htmlFor="story">Story <span className="text-primary">*</span></Label><Textarea id="story" value={form.story} onChange={(event) => handleChange('story', event.target.value)} required placeholder="Tell the story behind this memory..." className="min-h-32 border-primary/20 bg-white/70" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-primary" /> Tags</Label><div className="flex flex-wrap gap-2">{tags.map((tag) => <Badge key={tag} variant="secondary" className="gap-1 capitalize">{tag}<button type="button" onClick={() => setTags(tags.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}><X className="h-3 w-3" /></button></Badge>)}</div><div className="flex gap-2"><Input value={tagValue} onChange={(event) => setTagValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTag(); } }} placeholder="Add a tag" className="border-primary/20 bg-white/70" /><Button type="button" variant="outline" onClick={addTag}>Add</Button></div></div>
                <Button type="submit" className="w-full bg-gradient-wine text-white hover:opacity-90"><Save className="mr-2 h-4 w-4" />{saved ? 'Saved locally...' : 'Save Memory ♡'}</Button>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
