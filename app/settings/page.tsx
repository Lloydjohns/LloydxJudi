'use client';

import { AppShell } from '@/components/layout/app-shell';
import { SectionHeading } from '@/components/layout/shared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, Calendar, Users, Music2, LogOut, Download, Trash2, Save, Plus, Music, Lock } from 'lucide-react';
import { DEMO_COUPLE_NAME, DEMO_ANNIVERSARY_DATE, demoPlaylistTracks } from '@/lib/demo-data';
import { format } from 'date-fns';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <SectionHeading title="Settings" subtitle="Manage your couple's world" />

        <div className="mt-10 space-y-6">
          {/* Couple profile */}
          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif-display text-2xl flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Couple Profile
              </CardTitle>
              <CardDescription>Your shared display name and anniversary date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="couple-name" className="text-sm font-medium">Display Name</Label>
                <Input
                  id="couple-name"
                  defaultValue={DEMO_COUPLE_NAME}
                  className="border-primary/20"
                  placeholder="e.g. Lloyd & Judi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anniversary-date" className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  Anniversary Date
                </Label>
                <Input
                  id="anniversary-date"
                  type="date"
                  defaultValue={DEMO_ANNIVERSARY_DATE}
                  className="border-primary/20"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Owner-only setting. Changes affect chapter calculations.
                </p>
              </div>
              <Button className="bg-gradient-wine text-primary-foreground hover:opacity-90">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif-display text-2xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Members
              </CardTitle>
              <CardDescription>Manage who is part of your couple's world.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-wine text-primary-foreground font-semibold">
                    L
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lloyd</p>
                    <Badge variant="secondary" className="text-xs">Owner</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">
                    J
                  </div>
                  <div>
                    <p className="text-sm font-medium">Judi</p>
                    <Badge variant="outline" className="text-xs">Partner</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                Invite your partner by email. They will receive a secure invitation link.
              </p>
              <div className="flex gap-2">
                <Input placeholder="partner@email.com" className="border-primary/20" />
                <Button variant="outline" className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Playlist management */}
          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif-display text-2xl flex items-center gap-2">
                <Music2 className="h-5 w-5 text-primary" />
                Playlist
              </CardTitle>
              <CardDescription>
                Manage your {demoPlaylistTracks.length} tracks. The playlist supports a maximum of 12 tracks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {demoPlaylistTracks.slice(0, 4).map((track) => (
                <div key={track.id} className="flex items-center gap-3 rounded-lg bg-muted/30 p-2.5">
                  <span className="text-xs font-bold text-muted-foreground w-6">
                    {String(track.position).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">{track.sourceType}</Badge>
                </div>
              ))}
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Music className="h-4 w-4 mr-2" />
                  Manage all 12 tracks
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data & account */}
          <Card className="border-primary/15 shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif-display text-2xl">Data & Account</CardTitle>
              <CardDescription>Export, delete, or sign out of your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export our story
              </Button>
              <Separator />
              <Button variant="outline" className="w-full sm:w-auto">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
              <Separator />
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete all data
              </Button>
              <p className="text-xs text-muted-foreground">
                Deletion is permanent and cannot be undone. All memories, letters, and photos will be removed.
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground pb-4">
            Demo mode. Settings will be functional in Milestone 2 and beyond.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
