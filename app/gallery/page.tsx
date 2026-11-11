'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading, EmptyState } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Images, MapPin, Calendar, Filter, X, Plus, Pencil, Trash2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { demoMemories, getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import type { Memory } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { saveLocalList } from '@/lib/local-data';

const ALL_TAGS = ['milestone', 'travel', 'funny', 'first-date'];
const FILTER_TAGS = ['all', ...ALL_TAGS];
const STORAGE_KEY = 'llodxjudi-memories';
const featuredVideos = [
  { id: 'our-love-story', title: 'Our Love Story', src: '/video/lloydxjudi.mp4', detail: 'Our anniversary video' },
  { id: 'love-reel', title: 'A little movie of us', src: 'https://ik.imagekit.io/xui68oltcf/Bebi/8293f6ee2e954f0d94b2237d90416d57.mov/ik-video.mp4?updatedAt=1794319833885&tr=orig', detail: 'Love reel' },
];

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
  const [videoIndex, setVideoIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoMemories));
      setSavedMemories(demoMemories);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Memory[];
      setSavedMemories(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSavedMemories([]);
    }
  }, []);

  const allMemories = savedMemories;

  const deleteMemory = (memory: Memory) => {
    if (!window.confirm(`Delete “${memory.title}”?`)) return;
    const next = savedMemories.filter((item) => item.id !== memory.id);
    saveLocalList(STORAGE_KEY, next);
    setSavedMemories(next);
  };

  const filteredMemories = useMemo(() => {
    return allMemories.filter((m) => {
      if (tagFilter !== 'all' && !m.tags.includes(tagFilter)) return false;
      if (chapterFilter !== 'all' && m.chapterId !== chapterFilter) return false;
      if (dateFrom && new Date(m.memoryDate) < new Date(dateFrom)) return false;
      if (dateTo && new Date(m.memoryDate) > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [allMemories, tagFilter, chapterFilter, dateFrom, dateTo]);
  const galleryVideos = useMemo(() => [
    ...featuredVideos,
    ...filteredMemories
      .filter((memory): memory is Memory & { videoPath: string } => Boolean(memory.videoPath))
      .map((memory) => ({
        id: memory.id,
        title: memory.title,
        src: memory.videoPath,
        detail: format(new Date(memory.memoryDate), 'MMM d, yyyy'),
      })),
  ], [filteredMemories]);
  const activeVideoIndex = Math.min(videoIndex, galleryVideos.length - 1);
  const activeVideo = galleryVideos[activeVideoIndex];

  const showPreviousVideo = () => setVideoIndex(Math.max(0, activeVideoIndex - 1));
  const showNextVideo = () => setVideoIndex(Math.min(galleryVideos.length - 1, activeVideoIndex + 1));
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) showNextVideo();
    else showPreviousVideo();
  };

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
                <div
                  key={memory.id}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border-4 border-white shadow-soft hover:shadow-romantic transition-all duration-300',
                    'aspect-square animate-fade-in-up',
                    index === 0 && 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                  )}
                  style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
                >
                  {memory.videoPath ? (
                    <video
                      src={memory.videoPath}
                      className="relative z-10 h-full w-full bg-black object-contain"
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={`Play video: ${memory.title}`}
                    />
                  ) : memory.imagePath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={memory.imagePath}
                      alt={memory.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f6dfe5] to-[#f4ece8] text-center p-4 text-sm font-medium text-wine">
                      {memory.title}
                    </div>
                  )}
                  {!memory.videoPath && <Link href={`/memories/${memory.id}`} className="absolute inset-0 z-0" aria-label={`Open ${memory.title}`} />}
                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                  <div className="absolute right-2 top-2 z-30 flex gap-1">
                    <Button asChild size="icon" variant="secondary" className="h-8 w-8 bg-white/90 text-wine shadow hover:bg-white" aria-label={`Edit ${memory.title}`}>
                      <Link href={`/memories/new?edit=${encodeURIComponent(memory.id)}`}><Pencil className="h-3.5 w-3.5" /></Link>
                    </Button>
                    <Button type="button" size="icon" variant="secondary" className="h-8 w-8 bg-white/90 text-wine shadow hover:bg-white" onClick={() => deleteMemory(memory)} aria-label={`Delete ${memory.title}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {memory.videoPath && <Link href={`/memories/${memory.id}`} className="absolute bottom-2 left-2 z-30 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white"><Play className="h-3 w-3" /> Open story</Link>}
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="mt-10 overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-soft">
          <div className="flex items-center justify-between gap-3 p-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Our videos</p>
              <h2 className="mt-1 font-serif-display text-2xl text-wine sm:text-3xl">{activeVideo.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{activeVideo.detail}</p>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">{activeVideoIndex + 1} / {galleryVideos.length}</span>
          </div>
          <div
            className="relative aspect-[16/9] w-full bg-black"
            style={{ touchAction: 'pan-y' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <video
              key={activeVideo.id}
              className="relative z-10 h-full w-full object-contain"
              src={activeVideo.src}
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              aria-label={`Play video: ${activeVideo.title}`}
            >
              Your browser does not support the video tag.
            </video>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 text-wine shadow hover:bg-white disabled:opacity-40"
              onClick={showPreviousVideo}
              disabled={activeVideoIndex === 0}
              aria-label="Play previous video"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 text-wine shadow hover:bg-white disabled:opacity-40"
              onClick={showNextVideo}
              disabled={activeVideoIndex === galleryVideos.length - 1}
              aria-label="Play next video"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <p className="p-3 text-center text-xs text-muted-foreground sm:hidden">Swipe left or right to switch videos</p>
        </section>
      </div>
      </div>
    </AppShell>
  );
}
