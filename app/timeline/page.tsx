'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading, EmptyState } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lock, BookOpen, Calendar, ArrowRight, MapPin, Pencil, Plus, Save, Trash2, X, ImagePlus } from 'lucide-react';
import { demoMemories, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import { getDemoChapters } from '@/lib/demo-data';
import {
  getChapterStartDate,
  getChapterEndDate,
  isChapterUnlocked,
  getTotalChapters,
  formatChapterDateRange,
  parseDateSafe,
} from '@/lib/date-utils';
import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import type { TimelineChapterOverride, TimelineEvent } from '@/lib/types';
import { makeLocalId } from '@/lib/local-data';
import { loadCloudValue, saveCloudValue, STORY_COLLECTION_KEYS } from '@/lib/story-cloud';
import { StoryImage } from '@/components/media/story-image';

const STORAGE_KEY = STORY_COLLECTION_KEYS.timelineEvents;
const MEMORY_STORAGE_KEY = STORY_COLLECTION_KEYS.memories;
const CHAPTER_STORAGE_KEY = STORY_COLLECTION_KEYS.timelineChapters;

export default function TimelinePage() {
  const anniversaryDate = new Date(DEMO_ANNIVERSARY_DATE);
  const now = new Date();
  const totalChapters = getTotalChapters(anniversaryDate, now);
  const baseChapters = getDemoChapters(anniversaryDate);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [memories, setMemories] = useState(demoMemories);
  const [chapterOverrides, setChapterOverrides] = useState<TimelineChapterOverride[]>([]);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterIntro, setChapterIntro] = useState('');
  const [chapterImageUrl, setChapterImageUrl] = useState('');
  const [chapterLetter, setChapterLetter] = useState('');
  const [chapterStartDate, setChapterStartDate] = useState('');
  const [chapterEndDate, setChapterEndDate] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      loadCloudValue<TimelineEvent[]>(STORAGE_KEY, []),
      loadCloudValue(MEMORY_STORAGE_KEY, demoMemories),
      loadCloudValue<TimelineChapterOverride[]>(CHAPTER_STORAGE_KEY, []),
    ])
      .then(([savedEvents, savedMemories, savedOverrides]) => {
        if (!active) return;
        setEvents(savedEvents);
        setMemories(savedMemories);
        setChapterOverrides(savedOverrides);
      })
      .catch((cause: unknown) => {
        if (active) setSaveError(cause instanceof Error ? cause.message : 'Could not load timeline data from the cloud.');
      });
    return () => { active = false; };
  }, []);

  const chapters: Array<(typeof baseChapters)[number] & Partial<Pick<TimelineChapterOverride, 'startDate' | 'endDate'>>> = baseChapters.map((chapter) => {
    const override = chapterOverrides.find((item) => item.chapterId === chapter.id);
    if (override) return { ...chapter, ...override };
    const coverImage = memories.find((memory) => memory.chapterId === chapter.id)?.imagePath ?? null;
    return { ...chapter, coverImage };
  });

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setEventDate('');
    setStory('');
    setImageUrl('');
  };

  const saveEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedStory = story.trim();
    if (!trimmedTitle || !eventDate || !trimmedStory) return;
    const existing = events.find((item) => item.id === editingId);
    const entry: TimelineEvent = {
      id: existing?.id ?? makeLocalId('timeline'),
      title: trimmedTitle,
      eventDate,
      story: trimmedStory,
      imageUrl: imageUrl.trim() || null,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const next = existing
      ? events.map((item) => item.id === existing.id ? entry : item)
      : [...events, entry];
    setSaving(true);
    setSaveError('');
    try {
      await saveCloudValue(STORAGE_KEY, next);
      setEvents(next);
      resetForm();
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not save this moment.');
    } finally {
      setSaving(false);
    }
  };

  const editEvent = (entry: TimelineEvent) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setEventDate(entry.eventDate);
    setStory(entry.story);
    setImageUrl(entry.imageUrl ?? '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEvent = async (entry: TimelineEvent) => {
    if (!window.confirm(`Delete “${entry.title}” from the timeline?`)) return;
    const next = events.filter((item) => item.id !== entry.id);
    try {
      await saveCloudValue(STORAGE_KEY, next);
      setEvents(next);
      if (editingId === entry.id) resetForm();
    } catch (cause) {
      window.alert(cause instanceof Error ? cause.message : 'Could not delete this moment.');
    }
  };

  const resetChapterForm = () => {
    setEditingChapterId(null);
    setChapterTitle('');
    setChapterIntro('');
    setChapterImageUrl('');
    setChapterLetter('');
    setChapterStartDate('');
    setChapterEndDate('');
  };

  const editChapter = (chapter: (typeof chapters)[number]) => {
    setEditingChapterId(chapter.id);
    setChapterTitle(chapter.title);
    setChapterIntro(chapter.intro);
    setChapterImageUrl(chapter.coverImage ?? '');
    setChapterLetter(chapter.monthlyLetter ?? '');
    setChapterStartDate(format(getChapterStartDate(anniversaryDate, chapter.monthNumber), 'yyyy-MM-dd'));
    setChapterEndDate(format(new Date(getChapterEndDate(anniversaryDate, chapter.monthNumber).getTime() - 86400000), 'yyyy-MM-dd'));
    const savedOverride = chapterOverrides.find((item) => item.chapterId === chapter.id);
    if (savedOverride?.startDate) setChapterStartDate(savedOverride.startDate);
    if (savedOverride?.endDate) setChapterEndDate(savedOverride.endDate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveChapter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = chapterTitle.trim();
    const trimmedIntro = chapterIntro.trim();
    if (!editingChapterId || !trimmedTitle || !trimmedIntro || !chapterStartDate || !chapterEndDate) return;
    if (chapterEndDate < chapterStartDate) {
      setSaveError('The chapter end date must be on or after its start date.');
      return;
    }

    const override: TimelineChapterOverride = {
      chapterId: editingChapterId,
      title: trimmedTitle,
      intro: trimmedIntro,
      coverImage: chapterImageUrl.trim() || null,
      monthlyLetter: chapterLetter.trim() || null,
      startDate: chapterStartDate,
      endDate: chapterEndDate,
    };
    const next = [
      ...chapterOverrides.filter((item) => item.chapterId !== editingChapterId),
      override,
    ];
    setSaving(true);
    setSaveError('');
    try {
      await saveCloudValue(CHAPTER_STORAGE_KEY, next);
      setChapterOverrides(next);
      resetChapterForm();
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Could not save the chapter.');
    } finally {
      setSaving(false);
    }
  };

  const resetChapter = async (chapter: (typeof baseChapters)[number]) => {
    if (!window.confirm(`Reset “${chapter.title}” to its original content?`)) return;
    const next = chapterOverrides.filter((item) => item.chapterId !== chapter.id);
    try {
      await saveCloudValue(CHAPTER_STORAGE_KEY, next);
      setChapterOverrides(next);
      if (editingChapterId === chapter.id) resetChapterForm();
    } catch (cause) {
      window.alert(cause instanceof Error ? cause.message : 'Could not reset the chapter.');
    }
  };

  const sortedEvents = [...events].sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fff8f7]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SectionHeading
          title="Our Timeline"
          subtitle="A month at a time, a lifetime of memories."
        />
        {saveError && <p role="alert" className="mt-4 rounded-lg border border-destructive/30 bg-white p-3 text-sm text-destructive">{saveError}</p>}

        <Card className="mt-8 border-primary/15 shadow-soft">
          <CardContent className="p-5 sm:p-6">
            <h2 className="font-serif-display text-xl font-semibold">{editingId ? 'Edit timeline moment' : 'Add a timeline moment'}</h2>
            <form onSubmit={saveEvent} className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timeline-title">Title</Label>
                <Input id="timeline-title" value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="A moment to remember" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline-date">Date</Label>
                <Input id="timeline-date" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="timeline-story">Story</Label>
                <Textarea id="timeline-story" value={story} onChange={(event) => setStory(event.target.value)} required placeholder="Write what made this moment special..." />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="timeline-image" className="flex items-center gap-1.5">
                  <ImagePlus className="h-4 w-4 text-primary" />
                  Image link (optional)
                </Label>
                <Input id="timeline-image" type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://example.com/your-photo.jpg" />
                {editingId && imageUrl && (
                  <div className="flex items-center gap-3 rounded-lg border border-primary/15 bg-muted/20 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Timeline moment preview" className="h-16 w-16 rounded-md object-cover" />
                    <p className="min-w-0 break-all text-xs text-muted-foreground">{imageUrl}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={saving} className="bg-gradient-wine text-white hover:opacity-90">
                  {editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {saving ? 'Saving to cloud...' : editingId ? 'Update moment' : 'Add moment'}
                </Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}><X className="mr-2 h-4 w-4" />Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        {editingChapterId && (
          <Card className="mt-5 border-primary/15 shadow-soft">
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-serif-display text-xl font-semibold">Edit monthly chapter</h2>
              <p className="mt-1 text-sm text-muted-foreground">Update the chapter title, description, cover image, and letter.</p>
              <form onSubmit={saveChapter} className="mt-4 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="chapter-start-date">Start date</Label>
                    <Input id="chapter-start-date" type="date" value={chapterStartDate} onChange={(event) => setChapterStartDate(event.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chapter-end-date">End date</Label>
                    <Input id="chapter-end-date" type="date" value={chapterEndDate} onChange={(event) => setChapterEndDate(event.target.value)} min={chapterStartDate || undefined} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter-title">Title</Label>
                  <Input id="chapter-title" value={chapterTitle} onChange={(event) => setChapterTitle(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter-intro">Description</Label>
                  <Textarea id="chapter-intro" value={chapterIntro} onChange={(event) => setChapterIntro(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter-image">Cover image URL</Label>
                  <Input id="chapter-image" type="url" value={chapterImageUrl} onChange={(event) => setChapterImageUrl(event.target.value)} placeholder="https://example.com/photo.jpg" />
                  {chapterImageUrl && (
                    <div className="flex items-center gap-3 rounded-lg border border-primary/15 bg-muted/20 p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={chapterImageUrl} alt="Chapter cover preview" className="h-16 w-16 rounded-md object-cover" />
                      <p className="min-w-0 break-all text-xs text-muted-foreground">{chapterImageUrl}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter-letter">Monthly letter (optional)</Label>
                  <Textarea id="chapter-letter" value={chapterLetter} onChange={(event) => setChapterLetter(event.target.value)} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={saving} className="bg-gradient-wine text-white hover:opacity-90"><Save className="mr-2 h-4 w-4" />{saving ? 'Saving to cloud...' : 'Update chapter'}</Button>
                  <Button type="button" variant="outline" onClick={resetChapterForm}><X className="mr-2 h-4 w-4" />Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <section className="mt-8 space-y-3" aria-label="Your timeline moments">
          <h2 className="font-serif-display text-2xl font-semibold">Our Moments</h2>
          {sortedEvents.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No moments yet"
              message="Add your first special moment above and it will appear here."
            />
          ) : (
            sortedEvents.map((entry) => (
              <Card key={entry.id} className="border-primary/15 shadow-soft">
                <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                  <Calendar className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{format(parseISO(entry.eventDate), 'MMMM d, yyyy')}</p>
                    <h3 className="font-serif-display text-lg font-semibold">{entry.title}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{entry.story}</p>
                    {entry.imageUrl && (
                      <div className="mt-4 flex max-h-[36rem] items-center justify-center overflow-hidden rounded-xl bg-muted/30">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={entry.imageUrl} alt={entry.title} className="max-h-[36rem] w-full object-contain" loading="lazy" />
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1">
                    <Button type="button" size="sm" variant="outline" aria-label={`Edit ${entry.title}`} onClick={() => editEvent(entry)}><Pencil className="mr-1.5 h-4 w-4" />Edit</Button>
                    <Button type="button" size="sm" variant="outline" aria-label={`Delete ${entry.title}`} onClick={() => deleteEvent(entry)}><Trash2 className="mr-1.5 h-4 w-4" />Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>

        <div className="mt-10 mb-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" />
            {totalChapters} chapters unlocked
          </span>
          <span className="text-border">|</span>
          <span>          {memories.length} memories captured</span>
        </div>

        {/* Timeline line */}
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent sm:-translate-x-px" />

          <div className="space-y-8">
            {chapters.map((chapter, index) => {
              const unlocked = isChapterUnlocked(anniversaryDate, chapter.monthNumber, now, chapter.startDate);
              const chapterMemories = memories.filter((m) => m.chapterId === chapter.id);
              const isLeft = index % 2 === 0;
              const dateRange = formatChapterDateRange(anniversaryDate, chapter.monthNumber, chapter.startDate, chapter.endDate);

              return (
                <div
                  key={chapter.id}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 mt-6">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-soft transition-all ${
                        unlocked
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-muted border-border text-muted-foreground'
                      }`}
                    >
                      {unlocked ? (
                        <span className="text-xs font-bold">{chapter.monthNumber}</span>
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`ml-12 sm:ml-0 sm:w-1/2 ${isLeft ? 'sm:pr-10' : 'sm:pl-10'}`}>
                    <Card className={`editorial-card rounded-2xl overflow-hidden group ${unlocked ? 'hover:shadow-romantic hover:-translate-y-0.5 transition-all duration-300' : 'border-dashed bg-white/50'}`}>
                      {unlocked ? (
                        <Link href={`/timeline/${chapter.id}`} className="block">
                          {chapter.coverImage && (
                            <div className="relative h-52 overflow-hidden sm:h-64">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <StoryImage
                                src={chapter.coverImage}
                                alt={chapter.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-xs text-white/80">Month {chapter.monthNumber}</p>
                                <h3 className="font-serif-display text-xl font-semibold text-white">
                                  {chapter.title}
                                </h3>
                              </div>
                            </div>
                          )}
                          <CardContent className="p-4 space-y-2">
                            {!chapter.coverImage && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">Month {chapter.monthNumber}</Badge>
                                </div>
                                <h3 className="font-serif-display text-xl font-semibold">
                                  {chapter.title}
                                </h3>
                              </>
                            )}
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {dateRange}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {chapter.intro}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs text-muted-foreground">
                                {chapterMemories.length} {chapterMemories.length === 1 ? 'memory' : 'memories'}
                              </span>
                              <span className="text-xs text-primary flex items-center gap-1 font-medium">
                                Read chapter <ArrowRight className="h-3 w-3" />
                              </span>
                            </div>
                          </CardContent>
                        </Link>
                      ) : (
                        <>
                          <div className="h-40 bg-muted flex items-center justify-center">
                            <div className="text-center">
                              <Lock className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                              <p className="mt-2 text-xs text-muted-foreground">Locked</p>
                            </div>
                          </div>
                          <CardContent className="p-4 space-y-2">
                            <Badge variant="outline">Month {chapter.monthNumber}</Badge>
                            <h3 className="font-serif-display text-lg font-semibold text-muted-foreground">{chapter.title}</h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {dateRange}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{chapter.intro}</p>
                            <p className="text-xs text-muted-foreground italic">
                              Unlocks on {format(parseDateSafe(chapter.startDate ?? '') ?? getChapterStartDate(anniversaryDate, chapter.monthNumber), 'MMM d, yyyy')}
                            </p>
                          </CardContent>
                        </>
                      )}
                      <div className="flex flex-wrap gap-2 border-t border-primary/10 p-3">
                        <Button type="button" size="sm" variant="outline" aria-label={`Edit month ${chapter.monthNumber}`} onClick={() => editChapter(chapter)}>
                          <Pencil className="mr-1.5 h-4 w-4" />Edit
                        </Button>
                        {chapterOverrides.some((item) => item.chapterId === chapter.id) && (
                          <Button type="button" size="sm" variant="ghost" aria-label={`Reset month ${chapter.monthNumber}`} onClick={() => resetChapter(chapter)}>
                            <Trash2 className="mr-1.5 h-4 w-4" />Reset
                          </Button>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block sm:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        {chapters.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="No chapters yet"
            message="Your timeline will grow as your story unfolds."
          />
        )}
      </div>
      </div>
    </AppShell>
  );
}
