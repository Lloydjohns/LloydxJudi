'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CalendarDays, Save } from 'lucide-react';
import type { LoveLetter } from '@/lib/types';
import { loadLocalList, makeLocalId, saveLocalList } from '@/lib/local-data';

const STORAGE_KEY = 'llodxjudi-letters';

export default function NewLetterPage() {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [revealAt, setRevealAt] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentEditId = new URLSearchParams(window.location.search).get('edit');
    setEditId(currentEditId);
    if (!currentEditId) return;
    const letter = loadLocalList<LoveLetter>(STORAGE_KEY, []).find((item) => item.id === currentEditId);
    if (!letter) return;
    setTitle(letter.title);
    setBody(letter.body);
    setRevealAt(letter.revealAt?.slice(0, 10) ?? '');
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) return;

    const current = loadLocalList<LoveLetter>(STORAGE_KEY, []);
    const existing = current.find((letter) => letter.id === editId);
    const letter: LoveLetter = {
      id: existing?.id ?? makeLocalId('letter'),
      coupleId: 'demo',
      title: trimmedTitle,
      body: trimmedBody,
      recipientUserId: null,
      revealAt: revealAt || null,
      createdBy: 'demo',
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    const next = existing
      ? current.map((item) => item.id === existing.id ? letter : item)
      : [letter, ...current];
    saveLocalList(STORAGE_KEY, next);
    setSaved(true);
    window.setTimeout(() => router.push('/letters'), 500);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fff8f7] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Button asChild variant="ghost" size="sm" className="mb-5">
            <Link href="/letters"><ArrowLeft className="mr-2 h-4 w-4" /> Back to letters</Link>
          </Button>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">A note from the heart</p>
          <h1 className="mt-2 font-script text-5xl text-wine sm:text-7xl">{editId ? 'Edit Your Letter' : 'Write a Letter'}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Put the words you want to keep close into a letter.</p>

          <Card className="mt-8 border-primary/15 shadow-soft">
            <CardContent className="p-5 sm:p-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="letter-title">Title</Label>
                  <Input id="letter-title" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} placeholder="A little note for you" className="border-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="letter-body">Your letter</Label>
                  <Textarea id="letter-body" value={body} onChange={(event) => setBody(event.target.value)} required rows={10} placeholder="Dear love..." className="min-h-64 border-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reveal-at" className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Optional reveal date
                  </Label>
                  <Input id="reveal-at" type="date" value={revealAt} onChange={(event) => setRevealAt(event.target.value)} className="border-primary/20" />
                </div>
                <Button type="submit" className="w-full bg-gradient-wine text-white hover:opacity-90">
                  <Save className="mr-2 h-4 w-4" />
                  {saved ? 'Saved...' : editId ? 'Update letter' : 'Save letter'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            The next chapter starts whenever you are ready.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
