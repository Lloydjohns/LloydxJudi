'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { HeartDivider } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ChevronLeft, ChevronRight, Lock, Mail, PenLine, Sparkles } from 'lucide-react';
import { getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import { format } from 'date-fns';

export default function LettersPage() {
  const chapters = getDemoChapters(new Date(DEMO_ANNIVERSARY_DATE));
  const letters = chapters.filter((chapter) => chapter.monthlyLetter);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = letters[selectedIndex];

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fff8f7] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Words from my heart</p>
              <h1 className="mt-2 font-script text-5xl text-wine sm:text-7xl">Our Letters</h1>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Little notes for the moments we want to hold onto forever.</p>
            </div>
            <Button asChild className="w-fit bg-gradient-wine text-white hover:opacity-90">
              <Link href="/letters/new"><PenLine className="mr-2 h-4 w-4" /> Write a letter</Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[.8fr_1.5fr]">
            <div className="space-y-3">
              {letters.map((letter, index) => (
                <button
                  key={letter.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${selectedIndex === index ? 'border-primary bg-primary/10 shadow-soft' : 'border-primary/10 bg-white/70 hover:border-primary/30'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Month {letter.monthNumber}</p>
                      <p className="mt-1 font-serif-display text-xl font-semibold text-wine">{letter.title}</p>
                    </div>
                    <Mail className="mt-1 h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{format(new Date(DEMO_ANNIVERSARY_DATE), 'MMMM d, yyyy')}</p>
                </button>
              ))}
              <div className="rounded-2xl border border-dashed border-primary/20 bg-white/40 p-4 text-center">
                <Lock className="mx-auto h-5 w-5 text-primary/50" />
                <p className="mt-2 text-xs text-muted-foreground">Future letters will appear here as your story grows.</p>
              </div>
            </div>

            {selected && (
              <Card className="relative overflow-hidden border-primary/15 bg-[#f3e3dd] shadow-romantic">
                <div className="absolute right-6 top-5 rotate-12 text-primary/25"><HeartDivider /></div>
                <CardContent className="min-h-[520px] p-7 sm:p-12">
                  <div className="flex items-center justify-between gap-4">
                    <Badge className="bg-primary text-white">Month {selected.monthNumber}</Badge>
                    <span className="text-xs text-muted-foreground">Private between us</span>
                  </div>
                  <h2 className="mt-10 font-script text-5xl leading-none text-wine sm:text-6xl">My Love,</h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{selected.title}</p>
                  <HeartDivider className="justify-start" />
                  <p className="whitespace-pre-line font-serif-display text-xl leading-relaxed text-wine/90 sm:text-2xl">{selected.monthlyLetter}</p>
                  <div className="mt-10 flex items-center justify-between border-t border-primary/15 pt-5">
                    <span className="font-script text-2xl text-primary">With all my heart ♡</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="border-primary/20 bg-white/50" onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))} disabled={selectedIndex === 0} aria-label="Previous letter"><ChevronLeft className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" className="border-primary/20 bg-white/50" onClick={() => setSelectedIndex(Math.min(letters.length - 1, selectedIndex + 1))} disabled={selectedIndex === letters.length - 1} aria-label="Next letter"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
