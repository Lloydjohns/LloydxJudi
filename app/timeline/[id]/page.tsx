'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { HeartDivider } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, ArrowRight, Mail } from 'lucide-react';
import { demoMemories, getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import { formatChapterDateRange } from '@/lib/date-utils';
import { format } from 'date-fns';
import { useEffect } from 'react';

export default function ChapterDetailPage() {
  const params = useParams();
  const chapterId = params?.id as string;
  const anniversaryDate = new Date(DEMO_ANNIVERSARY_DATE);
  const chapters = getDemoChapters(anniversaryDate);
  const chapter = chapters.find((c) => c.id === chapterId);

  useEffect(() => {
    if (!chapter) notFound();
  }, [chapter]);

  if (!chapter) return null;

  const memories = demoMemories
    .filter((m) => m.chapterId === chapter.id)
    .sort((a, b) => new Date(a.memoryDate).getTime() - new Date(b.memoryDate).getTime());

  const dateRange = formatChapterDateRange(anniversaryDate, chapter.monthNumber);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/timeline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to timeline
          </Link>
        </Button>

        {/* Cover */}
        {chapter.coverImage && (
          <div className="relative overflow-hidden rounded-2xl shadow-romantic mb-8 h-64 sm:h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
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

          {memories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No memories in this chapter yet. Add one to start filling the page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {memories.map((memory) => (
                <Link key={memory.id} href={`/memories/${memory.id}`}>
                  <Card className="border-primary/15 shadow-soft hover:shadow-romantic hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden group h-full">
                    {memory.imagePath && (
                      <div className="relative h-40 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={memory.imagePath}
                          alt={memory.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
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
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
