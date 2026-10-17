'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { HeartDivider, SectionHeading } from '@/components/layout/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Calendar,
  BookOpen,
  Images,
  Sparkles,
  Music,
  Clock,
  Mail,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { demoMemories, demoSpecialDates, DEMO_COUPLE_NAME, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import {
  getDaysTogether,
  getDaysUntilNextAnniversary,
  getNextAnniversary,
  getMonthsTogether,
  getTotalChapters,
  getChapterTitle,
} from '@/lib/date-utils';
import { format } from 'date-fns';

export default function HomePage() {
  const anniversaryDate = new Date(DEMO_ANNIVERSARY_DATE);
  const now = new Date();
  const daysTogether = getDaysTogether(anniversaryDate, now);
  const monthsTogether = getMonthsTogether(anniversaryDate, now);
  const daysUntilAnniversary = getDaysUntilNextAnniversary(anniversaryDate, now);
  const nextAnniversary = getNextAnniversary(anniversaryDate, now);
  const totalChapters = getTotalChapters(anniversaryDate, now);
  const featuredMemory = demoMemories[0];
  const latestMemories = [...demoMemories].sort(
    (a, b) => new Date(b.memoryDate).getTime() - new Date(a.memoryDate).getTime()
  );
  const latestMemory = latestMemories[0];
  const currentChapterTitle = getChapterTitle(monthsTogether + 1);

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <AppShell>
      {/* Hero greeting */}
      <section className="relative overflow-hidden border-b border-primary/10 bg-[#fff5f4]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary animate-fade-in">
                {greeting}, my love
              </p>
              <h1 className="mt-2 font-script text-5xl leading-tight text-wine sm:text-7xl animate-fade-in-up">
                Hi, {DEMO_COUPLE_NAME.split(' ')[0]} ♡
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Every moment with you is a beautiful chapter. This is our little corner of the world.
              </p>
            </div>
            <div className="hidden text-right lg:block">
              <p className="font-script text-3xl text-primary">Together is our favorite place to be ♡</p>
              <p className="mt-1 text-xs text-muted-foreground">Since {format(anniversaryDate, 'MMMM d, yyyy')}</p>
            </div>
          </div>

          {/* Counter cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            <Card className="editorial-card rounded-2xl hover:-translate-y-0.5 hover:shadow-romantic transition-all duration-300">
              <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <p className="font-serif-display text-4xl font-bold text-gradient-rose">
                  {daysTogether.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Days Together</p>
              </CardContent>
            </Card>

            <Card className="editorial-card rounded-2xl hover:-translate-y-0.5 hover:shadow-romantic transition-all duration-300">
              <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <p className="font-serif-display text-4xl font-bold text-gradient-rose">
                  {monthsTogether}
                </p>
                <p className="text-sm text-muted-foreground">Months of Love</p>
              </CardContent>
            </Card>

            <Card className="editorial-card rounded-2xl hover:-translate-y-0.5 hover:shadow-romantic transition-all duration-300">
              <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <p className="font-serif-display text-4xl font-bold text-gradient-rose">
                  {daysUntilAnniversary}
                </p>
                <p className="text-sm text-muted-foreground">Days Until Anniversary</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="border-primary/15 bg-gradient-to-r from-[#fff8f7] to-[#f9ecec] shadow-soft">
              <CardContent className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Our birthdays</p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2">
                    <span className="text-sm font-medium text-wine">Lloyd</span>
                    <span className="text-sm text-muted-foreground">July 22, 1999</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2">
                    <span className="text-sm font-medium text-wine">Judi</span>
                    <span className="text-sm text-muted-foreground">April 21, 2003</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/15 bg-gradient-to-r from-[#fff8f7] to-[#f4e8ec] shadow-soft">
              <CardContent className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">The promise</p>
                <p className="mt-3 font-serif-display text-2xl text-wine">A love that grows sweeter with every chapter.</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We are not just building memories; we are building a forever that feels soft, warm, and beautifully ours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="overflow-hidden rounded-[28px] border border-primary/10 bg-white shadow-soft">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative aspect-video bg-black">
              <video
                className="h-full w-full object-cover"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                controls
                playsInline
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="flex flex-col justify-center bg-gradient-to-br from-[#fff8f7] to-[#f9ecec] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Featured video</p>
              <h2 className="mt-2 font-serif-display text-3xl text-wine sm:text-4xl">Our Love Story</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Subject: the little moments that make us feel most like home to each other.
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Story: every smile, every hand squeeze, and every quiet evening reminds me that love is not only grand gestures but the beautiful rhythm we build together every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-16">
        {/* Featured memory */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              title="A favorite moment"
              subtitle="A little piece of our forever"
              center={false}
            />
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex text-primary">
              <Link href="/gallery">View gallery <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_.85fr]">
            <div className="photo-frame relative overflow-hidden rounded-2xl group">
              {featuredMemory.imagePath && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredMemory.imagePath}
                  alt={featuredMemory.title}
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[27rem]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <Badge className="mb-2 bg-primary/90 text-primary-foreground">Featured</Badge>
                <p className="text-white font-serif-display text-2xl">{featuredMemory.title}</p>
              </div>
            </div>

            <div className="editorial-card rounded-2xl p-6 sm:p-8 flex flex-col justify-center gap-4">
              <p className="text-sm text-muted-foreground">
                {format(new Date(featuredMemory.memoryDate), 'MMMM d, yyyy')}
              </p>
              <p className="font-serif-display text-xl leading-relaxed text-wine sm:text-2xl">{featuredMemory.story}</p>
              {featuredMemory.location && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {featuredMemory.location}
                </p>
              )}
              <div className="flex gap-2 flex-wrap">
                {featuredMemory.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
                ))}
              </div>
              <Button asChild variant="outline" className="w-fit mt-2">
                <Link href={`/memories/${featuredMemory.id}`}>
                  Read full story <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Current chapter & latest memory */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif-display text-2xl flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Current Chapter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-serif-display text-xl font-semibold">
                Chapter {monthsTogether + 1}: {currentChapterTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                You are writing chapter {monthsTogether + 1} of your story together.
                Out of {totalChapters} chapters so far, each one more beautiful than the last.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/timeline">View timeline <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif-display text-2xl flex items-center gap-2">
                <Images className="h-5 w-5 text-primary" />
                Latest Memory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {latestMemory && (
                <>
                  <div className="flex gap-4">
                    {latestMemory.imagePath && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={latestMemory.imagePath}
                        alt={latestMemory.title}
                        className="h-24 w-24 rounded-lg object-cover shadow-soft shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-serif-display text-lg font-semibold truncate">
                        {latestMemory.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(latestMemory.memoryDate), 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {latestMemory.story}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/memories/${latestMemory.id}`}>
                      View memory <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Upcoming special dates */}
        <section>
          <SectionHeading title="Coming Up" subtitle="Special dates on the horizon" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {demoSpecialDates
              .filter((d) => new Date(d.eventDate) > now)
              .slice(0, 3)
              .map((date) => {
                const days = Math.ceil((new Date(date.eventDate).getTime() - now.getTime()) / 86400000);
                return (
                  <Card key={date.id} className="border-primary/15 shadow-soft hover:shadow-romantic transition-shadow">
                    <CardContent className="p-5 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{date.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(date.eventDate), 'MMMM d, yyyy')}
                      </p>
                      {date.notes && <p className="text-sm text-muted-foreground">{date.notes}</p>}
                      <p className="font-serif-display text-2xl font-bold text-primary">
                        {days} days
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            {demoSpecialDates.filter((d) => new Date(d.eventDate) > now).length === 0 && (
              <Card className="col-span-full border-dashed border-border">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No upcoming special dates. Add one in Settings.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Quick shortcuts */}
        <section>
          <SectionHeading title="Explore" subtitle="Jump into your story" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { href: '/timeline', label: 'Timeline', icon: BookOpen, color: 'bg-primary/10 text-primary' },
              { href: '/gallery', label: 'Gallery', icon: Images, color: 'bg-accent/10 text-accent' },
              { href: '/letters', label: 'Letters', icon: Mail, color: 'bg-primary/10 text-primary' },
              { href: '/surprise', label: 'Surprise', icon: Sparkles, color: 'bg-primary/10 text-primary' },
              { href: '/music', label: 'Music', icon: Music, color: 'bg-accent/10 text-accent' },
              { href: '/special-dates', label: 'Dates', icon: Calendar, color: 'bg-primary/10 text-primary' },
            ].map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link key={shortcut.href} href={shortcut.href}>
                  <Card className="border-primary/15 shadow-soft hover:shadow-romantic hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${shortcut.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium">{shortcut.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
