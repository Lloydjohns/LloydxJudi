'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading } from '@/components/layout/shared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, Calendar, Users, Music2, Download, Save, Plus, Music, Lock } from 'lucide-react';
import { DEMO_COUPLE_NAME, DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';

const PROFILE_KEY = 'llodxjudi-couple-profile';

export default function SettingsPage() {
  const [coupleName, setCoupleName] = useState(DEMO_COUPLE_NAME);
  const [anniversaryDate, setAnniversaryDate] = useState(DEMO_ANNIVERSARY_DATE);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return;
    try {
      const profile = JSON.parse(raw) as { name?: string; anniversaryDate?: string };
      if (profile.name) setCoupleName(profile.name);
      if (profile.anniversaryDate) setAnniversaryDate(profile.anniversaryDate);
    } catch {
      setCoupleName(DEMO_COUPLE_NAME);
      setAnniversaryDate(DEMO_ANNIVERSARY_DATE);
    }
  }, []);

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: coupleName.trim(), anniversaryDate }));
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2000);
  };

  const invitePartner = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`${coupleName || 'Our Story'} — join me`);
    const body = encodeURIComponent('I would love for you to join me in our shared story.');
    window.location.href = `mailto:${partnerEmail.trim()}?subject=${subject}&body=${body}`;
  };

  const exportStory = () => {
    try {
      const keys = [
        'llodxjudi-memories',
        'llodxjudi-letters',
        'llodxjudi-special-dates',
        'llodxjudi-playlist',
        'llodxjudi-timeline-events',
      ];
      const story = Object.fromEntries(
        keys.map((key) => {
          const raw = localStorage.getItem(key);
          return [key, raw ? JSON.parse(raw) : []];
        })
      );
      const blob = new Blob([JSON.stringify({
        couple: { name: coupleName, anniversaryDate },
        exportedAt: new Date().toISOString(),
        ...story,
      }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'our-story.json';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      window.alert(error instanceof Error ? `Could not export our story: ${error.message}` : 'Could not export our story.');
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <SectionHeading title="Settings" subtitle="Manage your couple's world" />

        <div className="mt-10 space-y-6">
          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif-display text-2xl">
                <Heart className="h-5 w-5 text-primary" />
                Couple Profile
              </CardTitle>
              <CardDescription>Your shared display name and anniversary date.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="couple-name">Display Name</Label>
                  <Input id="couple-name" value={coupleName} onChange={(event) => setCoupleName(event.target.value)} required className="border-primary/20" placeholder="e.g. Lloyd & Judi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anniversary-date" className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    Anniversary Date
                  </Label>
                  <Input id="anniversary-date" type="date" value={anniversaryDate} onChange={(event) => setAnniversaryDate(event.target.value)} required className="border-primary/20" />
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Saved in this browser.
                  </p>
                </div>
                <Button type="submit" className="bg-gradient-wine text-primary-foreground hover:opacity-90">
                  <Save className="mr-2 h-4 w-4" />
                  {profileSaved ? 'Changes saved' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif-display text-2xl">
                <Users className="h-5 w-5 text-primary" />
                Members
              </CardTitle>
              <CardDescription>Invite your partner to share your story.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-wine font-semibold text-primary-foreground">L</div>
                <div><p className="text-sm font-medium">Lloyd</p><Badge variant="secondary" className="text-xs">Owner</Badge></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 font-semibold text-accent">J</div>
                <div><p className="text-sm font-medium">Judi</p><Badge variant="outline" className="text-xs">Partner</Badge></div>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">This opens your email app with an invitation message ready to send.</p>
              <form onSubmit={invitePartner} className="flex gap-2">
                <Input type="email" required value={partnerEmail} onChange={(event) => setPartnerEmail(event.target.value)} placeholder="partner@email.com" aria-label="Partner email" className="border-primary/20" />
                <Button type="submit" variant="outline" className="shrink-0">
                  <Plus className="mr-1 h-4 w-4" /> Invite
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif-display text-2xl">
                <Music2 className="h-5 w-5 text-primary" />
                Playlist
              </CardTitle>
              <CardDescription>Add, edit, and remove songs from your playlist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/music"><Music className="mr-2 h-4 w-4" /> Manage playlist</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif-display text-2xl">Our Story</CardTitle>
              <CardDescription>Download a backup of your story data saved in this browser.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" onClick={exportStory} className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export our story
              </Button>
            </CardContent>
          </Card>

          <p className="pb-4 text-center text-xs text-muted-foreground">
            Your story data is stored locally in this browser.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
