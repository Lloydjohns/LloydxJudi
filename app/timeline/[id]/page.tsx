'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { HeartDivider } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, ArrowRight, Mail, Pencil, Trash2 } from 'lucide-react';
import { demoMemories, getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import { formatChapterDateRange } from '@/lib/date-utils';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import type { Memory, TimelineChapterOverride } from '@/lib/types';
import { loadCloudValue, saveCloudValue, STORY_COLLECTION_KEYS } from '@/lib/story-cloud';
import { StoryImage } from '@/components/media/story-image';
import { StoryVideo } from '@/components/media/story-video';

export default function ChapterDetailPage() {
  const params = useParams();
  const chapterId = params?.id as string;
  const anniversaryDate = useMemo(() => new Date(DEMO_ANNIVERSARY_DATE), []);
  const chapters = useMemo(() => getDemoChapters(anniversaryDate), [anniversaryDate]);
  const baseChapter = chapters.find((c) => c.id === chapterId);
  const [chapterOverride, setChapterOverride] = useState<TimelineChapterOverride | null>(null);
  const [memories, setMemories] = useState<Memory[]>(demoMemories);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!baseChapter) {
      notFound();
      return;
    }
    let active = true;
    Promise.all([
      loadCloudValue<TimelineChapterOverride[]>(STORY_COLLECTION_KEYS.timelineChapters, []),
      loadCloudValue<Memory[]>(STORY_COLLECTION_KEYS.memories, demoMemories),
    ])
      .then(([overrides, savedMemories]) => {
        if (!active) return;
        setChapterOverride(overrides.find((item) => item.chapterId === chapterId) ?? null);
        setMemories(savedMemories);
      })
      .catch((cause: unknown) => {
        if (active) setLoadError(cause instanceof Error ? cause.message : 'Could not load this chapter.');
      });
    return () => { active = false; };
  }, [baseChapter, chapterId]);

  const chapter = baseChapter
    ? {
        ...baseChapter,
        coverImage: memories.find((memory) => memory.chapterId === baseChapter.id)?.imagePath ?? null,
        ...chapterOverride,
      }
    : null;
  if (!chapter) return null;

  const chapterMemories = memories
    .filter((m) => m.chapterId === chapter.id)
    .sort((a, b) => new Date(a.memoryDate).getTime() - new Date(b.memoryDate).getTime());

  const dateRange = formatChapterDateRange(anniversaryDate, chapter.monthNumber, chapter.startDate, chapter.endDate);

  const deleteMemory = async (memory: Memory) => {
    if (!window.confirm(`Delete “${memory.title}” from this chapter?`)) return;
    const next = memories.filter((item) => item.id !== memory.id);
    try {
      await saveCloudValue(STORY_COLLECTION_KEYS.memories, next);
      setMemories(next);
    } catch (cause) {
      window.alert(cause instanceof Error ? cause.message : 'Could not delete the memory.');
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {loadError && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-white p-3 text-sm text-destructive">{loadError}</p>}
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/timeline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to timeline
          </Link>
        </Button>

        {/* Cover */}
        {chapter.coverImage && (
          <div className="relative overflow-hidden rounded-2xl shadow-romantic mb-8 h-64 sm:h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <StoryImage
              src={chapter.coverImage}
              alt={chapter.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <Badge className="mb-2 bg-primary/90 text-primary-foreground">
                Month {chapter.monthNumber}
              </Badge>
              <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-white">
                {chapter.title}
              </h1>
              <p className="mt-2 text-sm text-white/80 flex items-center justify-center gap-1">
                <Calendar className="h-3 w-3" /> {dateRange}
              </p>
            </div>
          </div>
        )}

        {!chapter.coverImage && (
          <div className="text-center mb-8">
            <Badge className="mb-2 bg-primary/90 text-primary-foreground">
              Month {chapter.monthNumber}
            </Badge>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold">
              {chapter.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" /> {dateRange}
            </p>
          </div>
        )}

        <p className="text-base text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
          {chapter.intro}
        </p>

        <HeartDivider className="my-8" />

        {/* Monthly letter */}
        {chapter.monthlyLetter && (
          <Card className="border-primary/20 shadow-soft bg-blush/20 mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="font-serif-display text-2xl font-semibold">A Letter for You</h2>
              </div>
              <div className="whitespace-pre-line text-base leading-relaxed font-serif-display">
                {chapter.monthlyLetter}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Memories */}
        <div>
          <h2 className="font-serif-display text-2xl font-semibold mb-6">
            Memories from this chapter
          </h2>

          {chapterMemories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No memories in this chapter yet. Add one to start filling the page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {chapterMemories.map((memory) => (
                  <Card key={memory.id} className="border-primary/15 shadow-soft hover:shadow-romantic hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group h-full">
                    <Link href={`/memories/${memory.id}`} className="block">
                    {memory.imagePath && (
                      <div className="relative h-52 overflow-hidden sm:h-64">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <StoryImage
                          src={memory.imagePath}
                          alt={memory.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    {memory.videoPath && (
                      <div className="relative h-52 overflow-hidden bg-black sm:h-64">
                        <StoryVideo src={memory.videoPath} controls playsInline preload="metadata" className="h-full w-full object-contain" aria-label={`Play video: ${memory.title}`} />
                      </div>
                    )}
                    <CardContent className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(memory.memoryDate), 'MMM d, yyyy')}
                      </p>
                      <h3 className="font-serif-display text-lg font-semibold">
                        {memory.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {memory.story}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        {memory.location && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {memory.location}
                          </span>
                        )}
                        <span className="text-xs text-primary flex items-center gap-1 font-medium ml-auto">
                          View <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                    </Link>
                    <div className="flex flex-wrap gap-2 border-t border-primary/10 p-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/memories/new?edit=${encodeURIComponent(memory.id)}`}>
                          <Pencil className="mr-1.5 h-4 w-4" />Edit
                        </Link>
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => deleteMemory(memory)}>
                        <Trash2 className="mr-1.5 h-4 w-4" />Delete
                      </Button>
                    </div>
                  </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
