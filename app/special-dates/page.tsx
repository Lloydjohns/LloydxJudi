'use client';

import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading, EmptyState } from '@/components/layout/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Cake, MapPin, Gift, Heart, Save, Pencil, Trash2, X } from 'lucide-react';
import { demoSpecialDates } from '@/lib/demo-data';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { makeLocalId, saveLocalList } from '@/lib/local-data';

const STORAGE_KEY = 'llodxjudi-special-dates';

export default function SpecialDatesPage() {
  const now = new Date();
  const [customDates, setCustomDates] = useState<typeof demoSpecialDates>([]);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoSpecialDates));
      setCustomDates(demoSpecialDates);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as typeof demoSpecialDates;
      setCustomDates(Array.isArray(parsed) ? parsed : []);
    } catch {
      setCustomDates([]);
    }
  }, []);

  const sortedDates = useMemo(() => {
    return [...customDates].sort(
      (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  }, [customDates]);

  const upcoming = sortedDates.filter((d) => new Date(d.eventDate) > now);
  const past = sortedDates.filter((d) => new Date(d.eventDate) <= now).reverse();

  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('birthday')) return Cake;
    if (lower.includes('anniversary')) return Heart;
    if (lower.includes('trip') || lower.includes('travel')) return MapPin;
    return Gift;
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !eventDate) return;

    const newDate = {
      id: editingId ?? makeLocalId('special-date'),
      coupleId: 'demo',
      title: title.trim(),
      eventDate,
      notes: notes.trim() || null,
      createdBy: 'demo',
      createdAt: new Date().toISOString(),
    };

    const next = editingId
      ? customDates.map((date) => date.id === editingId ? { ...newDate, createdAt: date.createdAt } : date)
      : [newDate, ...customDates];
    saveLocalList(STORAGE_KEY, next);
    setCustomDates(next);
    setTitle('');
    setEventDate('');
    setNotes('');
    setEditingId(null);
  };

  const editDate = (date: (typeof demoSpecialDates)[number]) => {
    setEditingId(date.id);
    setTitle(date.title);
    setEventDate(date.eventDate);
    setNotes(date.notes ?? '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteDate = (id: string) => {
    if (!window.confirm('Delete this special date?')) return;
    const next = customDates.filter((date) => date.id !== id);
    saveLocalList(STORAGE_KEY, next);
    setCustomDates(next);
    if (editingId === id) {
      setEditingId(null);
      setTitle(''); setEventDate(''); setNotes('');
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            title="Special Dates"
            subtitle="The days that matter most to us"
            center={false}
          />
        </div>

        <Card className="mt-8 border-primary/15 shadow-soft">
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date-title">Date title</Label>
                <Input
                  id="date-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Our anniversary, birthday, trip"
                  className="border-primary/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date-value">Date</Label>
                  <Input
                    id="date-value"
                    type="date"
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                    className="border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-notes">Notes</Label>
                  <Input
                    id="date-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="A little love note"
                    className="border-primary/20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
              <Button type="submit" className="bg-gradient-wine text-white hover:opacity-90">
                <Save className="mr-2 h-4 w-4" /> {editingId ? 'Update date' : 'Save date'}
              </Button>
              {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setTitle(''); setEventDate(''); setNotes(''); }}><X className="mr-2 h-4 w-4" />Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-10">
          <h2 className="font-serif-display text-2xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Coming Up
          </h2>
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No upcoming special dates. Add one to start counting down.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((date) => {
                const Icon = getIcon(date.title);
                const days = Math.ceil((new Date(date.eventDate).getTime() - now.getTime()) / 86400000);
                return (
                  <Card key={date.id} className="border-primary/15 shadow-soft hover:shadow-romantic transition-shadow">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-wine text-primary-foreground shadow-soft">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif-display text-lg font-semibold truncate">
                          {date.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(date.eventDate), 'MMMM d, yyyy')}
                        </p>
                        {date.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{date.notes}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-serif-display text-3xl font-bold text-gradient-rose">
                          {days}
                        </p>
                        <p className="text-xs text-muted-foreground">days</p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <Button size="icon" variant="ghost" aria-label={`Edit ${date.title}`} onClick={() => editDate(date)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label={`Delete ${date.title}`} onClick={() => deleteDate(date.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="font-serif-display text-2xl font-semibold mb-4">
            Cherished Days
          </h2>
          {past.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No past dates"
              message="Your special dates will appear here after they pass."
            />
          ) : (
            <div className="space-y-3">
              {past.map((date) => {
                const Icon = getIcon(date.title);
                const daysAgo = Math.floor((now.getTime() - new Date(date.eventDate).getTime()) / 86400000);
                return (
                  <Card key={date.id} className="border-border/60 shadow-soft opacity-80">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif-display text-base font-semibold truncate">
                          {date.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(date.eventDate), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {daysAgo} days ago
                      </Badge>
                      <div className="flex shrink-0 flex-col gap-1">
                        <Button size="icon" variant="ghost" aria-label={`Edit ${date.title}`} onClick={() => editDate(date)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label={`Delete ${date.title}`} onClick={() => deleteDate(date.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
