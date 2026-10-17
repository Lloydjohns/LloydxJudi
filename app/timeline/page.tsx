'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading, EmptyState } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, BookOpen, Calendar, ArrowRight, MapPin } from 'lucide-react';
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

export default function TimelinePage() {
  const anniversaryDate = new Date(DEMO_ANNIVERSARY_DATE);
  const now = new Date();
  const totalChapters = getTotalChapters(anniversaryDate, now);
  const chapters = getDemoChapters(anniversaryDate);

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fff8f7]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <SectionHeading
          title="Our Timeline"
          subtitle="A month at a time, a lifetime of memories."
        />

        <div className="mt-10 mb-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-primary" />
            {totalChapters} chapters unlocked
          </span>
          <span className="text-border">|</span>
          <span>{demoMemories.length} memories captured</span>
        </div>

        {/* Timeline line */}
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent sm:-translate-x-px" />

          <div className="space-y-8">
            {chapters.map((chapter, index) => {
              const unlocked = isChapterUnlocked(anniversaryDate, chapter.monthNumber, now);
              const memories = demoMemories.filter((m) => m.chapterId === chapter.id);
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
                                {memories.length} {memories.length === 1 ? 'memory' : 'memories'}
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
