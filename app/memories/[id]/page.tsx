'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { HeartDivider } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Tag } from 'lucide-react';
import { demoMemories, getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import { format } from 'date-fns';
import { useEffect } from 'react';

export default function MemoryDetailPage() {
  const params = useParams();
  const memoryId = params?.id as string;
  const anniversaryDate = new Date(DEMO_ANNIVERSARY_DATE);
  const chapters = getDemoChapters(anniversaryDate);

  const sortedMemories = [...demoMemories].sort(
    (a, b) => new Date(a.memoryDate).getTime() - new Date(b.memoryDate).getTime()
  );
  const currentIndex = sortedMemories.findIndex((m) => m.id === memoryId);
  const memory = sortedMemories[currentIndex];

  useEffect(() => {
    if (!memory) notFound();
  }, [memory]);

  if (!memory) return null;

  const prevMemory = currentIndex > 0 ? sortedMemories[currentIndex - 1] : null;
  const nextMemory = currentIndex < sortedMemories.length - 1 ? sortedMemories[currentIndex + 1] : null;
  const chapter = chapters.find((c) => c.id === memory.chapterId);

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/gallery">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to gallery
          </Link>
        </Button>

        {/* Hero image */}
        {memory.imagePath && (
          <div className="relative overflow-hidden rounded-2xl shadow-romantic mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={memory.imagePath}
              alt={memory.title}
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Title and meta */}
        <div className="text-center mb-6">
          <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold">
            {memory.title}
          </h1>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(memory.memoryDate), 'MMMM d, yyyy')}
          </p>
          {memory.location && (
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {memory.location}
            </p>
          )}
        </div>

        <HeartDivider className="my-6" />

        {/* Story */}
        <div className="prose prose-romantic max-w-none">
          <p className="text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-line">
            {memory.story}
          </p>
        </div>

        {/* Tags and chapter */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {chapter && (
            <Link href={`/timeline/${chapter.id}`}>
              <Badge variant="secondary" className="hover:bg-primary/10 cursor-pointer">
                Chapter {chapter.monthNumber}: {chapter.title}
              </Badge>
            </Link>
          )}
          {memory.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="capitalize flex items-center gap-1">
              <Tag className="h-3 w-3" /> {tag.replace('-', ' ')}
            </Badge>
          ))}
        </div>

        <HeartDivider className="my-10" />

        {/* Prev/next navigation */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            {prevMemory ? (
              <Link href={`/memories/${prevMemory.id}`}>
                <Card className="border-primary/15 shadow-soft hover:shadow-romantic transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <ArrowLeft className="h-5 w-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Previous</p>
                      <p className="text-sm font-medium truncate">{prevMemory.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <div className="h-full" />
            )}
          </div>
          <div>
            {nextMemory ? (
              <Link href={`/memories/${nextMemory.id}`}>
                <Card className="border-primary/15 shadow-soft hover:shadow-romantic transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center gap-3 justify-end text-right">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Next</p>
                      <p className="text-sm font-medium truncate">{nextMemory.title}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <div className="h-full" />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
