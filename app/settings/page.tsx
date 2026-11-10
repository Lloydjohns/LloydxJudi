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
import { Heart, Calendar, Users, Music2, Download, Save, Plus, Music, Lock, FileText, QrCode } from 'lucide-react';
import {
  DEMO_COUPLE_NAME,
  DEMO_ANNIVERSARY_DATE,
  demoMemories,
  demoSpecialDates,
  demoPlaylistTracks,
  getDemoChapters,
} from '@/lib/demo-data';
import type { LoveLetter, Memory, TimelineEvent } from '@/lib/types';
import { downloadStoryPdf } from '@/lib/story-pdf';

const PROFILE_KEY = 'llodxjudi-couple-profile';

function getDefaultLetters(): LoveLetter[] {
  return getDemoChapters(new Date(DEMO_ANNIVERSARY_DATE))
    .filter((chapter) => chapter.monthlyLetter)
    .map((chapter) => ({
      id: `demo-letter-${chapter.id}`,
      coupleId: 'demo',
      title: `Month ${chapter.monthNumber}: ${chapter.title}`,
      body: chapter.monthlyLetter ?? '',
      recipientUserId: null,
      revealAt: null,
      createdBy: 'demo',
      createdAt: chapter.createdAt,
    }));
}

export default function SettingsPage() {
  const [coupleName, setCoupleName] = useState(DEMO_COUPLE_NAME);
  const [anniversaryDate, setAnniversaryDate] = useState(DEMO_ANNIVERSARY_DATE);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [inviteStatus, setInviteStatus] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

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

  const readList = <T,>(key: string, fallback: T[]): T[] => {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error(`Saved ${key} data is not a list.`);
    return parsed as T[];
  };

  const getStoryCollections = () => ({
    memories: readList<Memory>('llodxjudi-memories', demoMemories),
    letters: readList<LoveLetter>('llodxjudi-letters', getDefaultLetters()),
    specialDates: readList('llodxjudi-special-dates', demoSpecialDates),
    playlist: readList('llodxjudi-playlist', demoPlaylistTracks),
    timelineEvents: readList<TimelineEvent>('llodxjudi-timeline-events', []),
  });

  const invitePartner = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSendingInvite(true);
    setInviteStatus('');
    try {
      const response = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: partnerEmail.trim(), coupleName }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not send invitation.');
      setInviteStatus('Invitation sent successfully.');
      setPartnerEmail('');
    } catch (error) {
      setInviteStatus(error instanceof Error ? error.message : 'Could not send invitation.');
    } finally {
      setSendingInvite(false);
    }
  };

  const exportStory = () => {
    try {
      const collections = getStoryCollections();
      const blob = new Blob([JSON.stringify({
        couple: { name: coupleName, anniversaryDate },
        exportedAt: new Date().toISOString(),
        'llodxjudi-memories': collections.memories,
        'llodxjudi-letters': collections.letters,
        'llodxjudi-special-dates': collections.specialDates,
        'llodxjudi-playlist': collections.playlist,
        'llodxjudi-timeline-events': collections.timelineEvents,
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

  const downloadQrCode = async () => {
    setExportStatus('');
    try {
      const { default: QRCode } = await import('qrcode');
      const dataUrl = await QRCode.toDataURL(window.location.origin, { errorCorrectionLevel: 'M', margin: 1, width: 512 });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'our-story-qr.png';
      link.click();
      setExportStatus('QR code downloaded. It opens this app.');
    } catch (error) {
      setExportStatus(error instanceof Error ? `Could not create QR code: ${error.message}` : 'Could not create QR code.');
    }
  };

  const downloadPdf = async () => {
    setExportStatus('');
    try {
      const collections = getStoryCollections();
      const rawProfile = localStorage.getItem(PROFILE_KEY);
      const profile = rawProfile ? JSON.parse(rawProfile) as { name?: string; anniversaryDate?: string } : {};
      await downloadStoryPdf({
        couple: {
          name: profile.name || coupleName,
          anniversaryDate: profile.anniversaryDate || anniversaryDate,
        },
        memories: collections.memories,
        letters: collections.letters,
        timelineEvents: collections.timelineEvents,
      });
      setExportStatus('PDF downloaded. Scan its QR code to open this app.');
    } catch (error) {
      setExportStatus(error instanceof Error ? `Could not create PDF: ${error.message}` : 'Could not create PDF.');
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
              <p className="text-sm text-muted-foreground">Send your partner an invitation email using the configured email service.</p>
              <form onSubmit={invitePartner} className="flex gap-2">
                <Input type="email" required value={partnerEmail} onChange={(event) => setPartnerEmail(event.target.value)} placeholder="partner@email.com" aria-label="Partner email" className="border-primary/20" />
                <Button type="submit" variant="outline" className="shrink-0" disabled={sendingInvite}>
                  <Plus className="mr-1 h-4 w-4" /> {sendingInvite ? 'Sending...' : 'Invite'}
                </Button>
              </form>
              {inviteStatus && <p role="status" className="text-sm text-muted-foreground">{inviteStatus}</p>}
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
              <CardDescription>Download your browser-saved story, a QR code to this app, or a PDF with your photos and messages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button type="button" variant="outline" onClick={exportStory} className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export story data (JSON)
                </Button>
                <Button type="button" variant="outline" onClick={downloadQrCode} className="w-full sm:w-auto">
                  <QrCode className="mr-2 h-4 w-4" />
                  Download QR code
                </Button>
                <Button type="button" variant="outline" onClick={downloadPdf} className="w-full sm:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Download story PDF
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">The QR code opens this app and does not transfer browser-only story data. Photos blocked by their host may appear as image links in the PDF.</p>
              {exportStatus && <p role="status" className="text-sm text-muted-foreground">{exportStatus}</p>}
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
