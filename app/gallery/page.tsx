'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading, EmptyState } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Images, MapPin, Calendar, Filter, X, Plus } from 'lucide-react';
import { demoMemories, getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import type { Memory } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ALL_TAGS = ['milestone', 'travel', 'funny', 'first-date'];
const FILTER_TAGS = ['all', ...ALL_TAGS];
const STORAGE_KEY = 'llodxjudi-memories';

type ChapterFilter = 'all' | string;
type TagFilter = 'all' | string;

export default function GalleryPage() {
  const anniversaryDate = new Date(DEMO_ANNIVERSARY_DATE);
  const chapters = getDemoChapters(anniversaryDate);

  const [savedMemories, setSavedMemories] = useState<Memory[]>([]);
  const [tagFilter, setTagFilter] = useState<TagFilter>('all');
  const [chapterFilter, setChapterFilter] = useState<ChapterFilter>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Memory[];
      setSavedMemories(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSavedMemories([]);
    }
  }, []);

  const allMemories = useMemo(() => [...savedMemories, ...demoMemories], [savedMemories]);

  const filteredMemories = useMemo(() => {
    return allMemories.filter((m) => {
      if (tagFilter !== 'all' && !m.tags.includes(tagFilter)) return false;
      if (chapterFilter !== 'all' && m.chapterId !== chapterFilter) return false;
      if (dateFrom && new Date(m.memoryDate) < new Date(dateFrom)) return false;
      if (dateTo && new Date(m.memoryDate) > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [allMemories, tagFilter, chapterFilter, dateFrom, dateTo]);

  const hasActiveFilters = tagFilter !== 'all' || chapterFilter !== 'all' || dateFrom || dateTo;

  const clearFilters = () => {
    setTagFilter('all');
    setChapterFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fff8f7]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            title="Our Gallery"
            subtitle="All the moments, in one place."
            center={false}
          />
          <Button asChild size="sm" className="shrink-0 bg-gradient-wine text-white hover:opacity-90">
            <Link href="/memories/new"><Plus className="mr-1.5 h-4 w-4" /> Add memory</Link>
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTER_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium transition-colors capitalize',
                    tagFilter === tag
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  {tag === 'all' ? 'All' : tag.replace('-', ' ')}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setShowFilters((s) => !s)}
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="border-primary/15 shadow-soft animate-fade-in">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Chapter</Label>
                    <Select value={chapterFilter} onValueChange={setChapterFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All chapters" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All chapters</SelectItem>
                        {chapters.map((ch) => (
                          <SelectItem key={ch.id} value={ch.id}>
                            Month {ch.monthNumber}: {ch.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">From date</Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">To date</Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredMemories.length} of {allMemories.length} memories
                    </p>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" /> Clear filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8">
          {filteredMemories.length === 0 ? (
            <EmptyState
              icon={Images}
              title="No memories found"
              message="Try adjusting your filters to see more memories."
              action={
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {filteredMemories.map((memory, index) => (
                <Link
                  key={memory.id}
                  href={`/memories/${memory.id}`}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border-4 border-white shadow-soft hover:shadow-romantic transition-all duration-300 cursor-pointer',
                    'aspect-square animate-fade-in-up',
                    index === 0 && 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  )}
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
                >
                  {memory.imagePath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={memory.imagePath}
                      alt={memory.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : memory.videoPath ? (
                    <video
                      src={memory.videoPath}
                      className="h-full w-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f6dfe5] to-[#f4ece8] text-center p-4 text-sm font-medium text-wine">
                      {memory.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs text-white/80 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(memory.memoryDate), 'MMM d, yyyy')}
                    </p>
                    <p className="font-serif-display text-sm font-semibold text-white truncate">
                      {memory.title}
                    </p>
                    {memory.location && (
                      <p className="text-xs text-white/70 flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3" /> {memory.location}
                      </p>
                    )}
                  </div>
                  {memory.tags.includes('milestone') && (
                    <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs">
                      Milestone
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        <section className="mt-10 overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-soft">
          <div className="relative aspect-[16/9] w-full bg-black">
            <video
              className="h-full w-full object-cover"
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              controls
              playsInline
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d13]/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Love reel</p>
              <h2 className="mt-2 font-serif-display text-3xl text-white sm:text-5xl">A little movie of us</h2>
            </div>
          </div>
        </section>
      </div>
      </div>
    </AppShell>
  );
}
