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
} from '@/lib/date-utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { TimelineEvent } from '@/lib/types';
import { loadLocalList, makeLocalId, saveLocalList } from '@/lib/local-data';

const STORAGE_KEY = 'llodxjudi-timeline-events';

export default function TimelinePage() {
  const anniversaryDate = new Date(DEMO_ANNIVERSARY_DATE);
  const now = new Date();
  const totalChapters = getTotalChapters(anniversaryDate, now);
  const chapters = getDemoChapters(anniversaryDate);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [memories, setMemories] = useState(demoMemories);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setEvents(loadLocalList<TimelineEvent>(STORAGE_KEY, []));
    setMemories(loadLocalList('llodxjudi-memories', demoMemories));
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setEventDate('');
    setStory('');
    setImageUrl('');
  };

  const saveEvent = (event: React.FormEvent<HTMLFormElement>) => {
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
    saveLocalList(STORAGE_KEY, next);
    setEvents(next);
    resetForm();
  };

  const editEvent = (entry: TimelineEvent) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setEventDate(entry.eventDate);
    setStory(entry.story);
    setImageUrl(entry.imageUrl ?? '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEvent = (entry: TimelineEvent) => {
    if (!window.confirm(`Delete “${entry.title}” from the timeline?`)) return;
    const next = events.filter((item) => item.id !== entry.id);
    saveLocalList(STORAGE_KEY, next);
    setEvents(next);
    if (editingId === entry.id) resetForm();
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
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" className="bg-gradient-wine text-white hover:opacity-90">
                  {editingId ? <Save className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingId ? 'Update moment' : 'Add moment'}
                </Button>
                {editingId && <Button type="button" variant="outline" onClick={resetForm}><X className="mr-2 h-4 w-4" />Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        {sortedEvents.length > 0 && (
          <section className="mt-8 space-y-3" aria-label="Your timeline moments">
            <h2 className="font-serif-display text-2xl font-semibold">Our Moments</h2>
            {sortedEvents.map((entry) => (
              <Card key={entry.id} className="border-primary/15 shadow-soft">
                <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                  <Calendar className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">{format(new Date(entry.eventDate), 'MMMM d, yyyy')}</p>
                    <h3 className="font-serif-display text-lg font-semibold">{entry.title}</h3>
                    <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{entry.story}</p>
                    {entry.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.imageUrl} alt={entry.title} className="mt-3 max-h-72 w-full rounded-lg object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button type="button" size="icon" variant="ghost" aria-label={`Edit ${entry.title}`} onClick={() => editEvent(entry)}><Pencil className="h-4 w-4" /></Button>
                    <Button type="button" size="icon" variant="ghost" aria-label={`Delete ${entry.title}`} onClick={() => deleteEvent(entry)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

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
              const unlocked = isChapterUnlocked(anniversaryDate, chapter.monthNumber, now);
              const chapterMemories = memories.filter((m) => m.chapterId === chapter.id);
              const isLeft = index % 2 === 0;
              const dateRange = formatChapterDateRange(anniversaryDate, chapter.monthNumber);

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
                    {unlocked ? (
                      <Link href={`/timeline/${chapter.id}`}>
                        <Card className="editorial-card rounded-2xl hover:shadow-romantic hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden group">
                          {chapter.coverImage && (
                            <div className="relative h-40 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
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
                        </Card>
                      </Link>
                    ) : (
                      <Card className="rounded-2xl border-dashed border-border bg-white/50 overflow-hidden">
                        <div className="h-40 bg-muted flex items-center justify-center">
                          <div className="text-center">
                            <Lock className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                            <p className="mt-2 text-xs text-muted-foreground">Locked</p>
                          </div>
                        </div>
                        <CardContent className="p-4 space-y-2">
                          <Badge variant="outline">Month {chapter.monthNumber}</Badge>
                          <h3 className="font-serif-display text-lg font-semibold text-muted-foreground">
                            {chapter.title}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {dateRange}
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            Unlocks on {format(getChapterStartDate(anniversaryDate, chapter.monthNumber), 'MMM d, yyyy')}
                          </p>
                        </CardContent>
                      </Card>
                    )}
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
