'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading, EmptyState } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, PenLine, Pencil, Trash2 } from 'lucide-react';
import { getDemoChapters, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';
import { format } from 'date-fns';
import type { LoveLetter } from '@/lib/types';
import { saveLocalList } from '@/lib/local-data';

const STORAGE_KEY = 'llodxjudi-letters';

export default function LettersPage() {
  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const chapters = getDemoChapters(new Date(DEMO_ANNIVERSARY_DATE));
    const demoLetters: LoveLetter[] = chapters.filter((chapter) => chapter.monthlyLetter).map((chapter) => ({
      id: `demo-letter-${chapter.id}`,
      coupleId: 'demo',
      title: `Month ${chapter.monthNumber}: ${chapter.title}`,
      body: chapter.monthlyLetter ?? '',
      recipientUserId: null,
      revealAt: null,
      createdBy: 'demo',
      createdAt: chapter.createdAt,
    }));
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoLetters));
      setLetters(demoLetters);
      setSelectedId(demoLetters[0]?.id ?? null);
      return;
    }
    try {
      const parsed = JSON.parse(saved) as LoveLetter[];
      setLetters(Array.isArray(parsed) ? parsed : demoLetters);
      setSelectedId(parsed[0]?.id ?? null);
    } catch {
      setLetters(demoLetters);
      setSelectedId(demoLetters[0]?.id ?? null);
    }
  }, []);

  const selected = letters.find((letter) => letter.id === selectedId) ?? letters[0];
  const removeLetter = (letter: LoveLetter) => {
    if (!window.confirm(`Delete “${letter.title}”?`)) return;
    const next = letters.filter((item) => item.id !== letter.id);
    saveLocalList(STORAGE_KEY, next);
    setLetters(next);
    setSelectedId(next[0]?.id ?? null);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fff8f7] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading title="Our Letters" subtitle="Little notes for the moments we want to hold onto forever." center={false} />
            <Button asChild className="w-fit bg-gradient-wine text-white hover:opacity-90">
              <Link href="/letters/new"><PenLine className="mr-2 h-4 w-4" /> Write a letter</Link>
            </Button>
          </div>
          {!letters.length ? <EmptyState icon={Mail} title="No letters yet" message="Write the first note for your story." /> :
            <div className="grid gap-6 lg:grid-cols-[.8fr_1.5fr]">
              <div className="space-y-3">
                {letters.map((letter) => <Card key={letter.id} className={`border-primary/15 ${selected?.id === letter.id ? 'bg-primary/5' : 'bg-white/70'}`}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <button className="min-w-0 flex-1 text-left" onClick={() => setSelectedId(letter.id)}>
                      <Badge variant="secondary" className="mb-2">{letter.createdBy === 'demo' ? 'Memory' : 'Your letter'}</Badge>
                      <p className="font-serif-display text-lg font-semibold text-wine">{letter.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{letter.body}</p>
                    </button>
                    <div className="flex shrink-0 flex-col gap-1">
                      <Button asChild size="icon" variant="ghost" aria-label={`Edit ${letter.title}`}><Link href={`/letters/new?edit=${encodeURIComponent(letter.id)}`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button size="icon" variant="ghost" aria-label={`Delete ${letter.title}`} onClick={() => removeLetter(letter)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>)}
              </div>
              {selected && <Card className="relative overflow-hidden border-primary/15 bg-[#f3e3dd] shadow-romantic">
                <CardContent className="min-h-[420px] p-7 sm:p-12">
                  <p className="text-xs text-muted-foreground">Private between us</p>
                  <h2 className="mt-8 font-script text-5xl text-wine sm:text-6xl">My Love,</h2>
                  <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{selected.title}</p>
                  {selected.revealAt && <p className="mt-3 text-xs text-primary">Opens {format(new Date(selected.revealAt), 'MMMM d, yyyy')}</p>}
                  <div className="my-6 h-px bg-primary/20" />
                  <p className="whitespace-pre-line font-serif-display text-xl leading-relaxed text-wine/90">{selected.body}</p>
                  <p className="mt-10 border-t border-primary/15 pt-5 font-script text-2xl text-primary">With all my heart ♡</p>
                </CardContent>
              </Card>}
            </div>}
        </div>
      </div>
    </AppShell>
  );
}
