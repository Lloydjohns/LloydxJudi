'use client';

import { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/layout/app-shell';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Music2, Play, Pause, ExternalLink, Info, Disc3, Heart, Headphones, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useMusicPlayer } from '@/components/music/music-player-provider';
import { cn } from '@/lib/utils';
import { isSupportedYouTubeUrl } from '@/lib/music-utils';
import type { TrackSourceType } from '@/lib/types';

const SOURCE_LABELS: Record<TrackSourceType, string> = {
  file: 'Audio File',
  spotify: 'Spotify',
  youtube: 'YouTube',
  soundcloud: 'SoundCloud',
};

const HERO_IMAGE = 'https://images.pexels.com/photos/1024963/pexels-photo-1024963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const VINYL_IMAGE = 'https://images.pexels.com/photos/5764281/pexels-photo-5764281.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const CANDLE_IMAGE = 'https://images.pexels.com/photos/6822851/pexels-photo-6822851.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

function FloatingHearts() {
  const hearts = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 10,
      size: 10 + Math.random() * 16,
      opacity: 0.08 + Math.random() * 0.12,
    }))
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {hearts.current.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-[-40px] text-rose-400"
          style={{
            left: `${h.left}%`,
            animation: `float-heart ${h.duration}s ease-in-out ${h.delay}s infinite`,
            opacity: h.opacity,
          }}
        >
          <Heart style={{ width: h.size, height: h.size }} fill="currentColor" />
        </div>
      ))}
    </div>
  );
}

export default function MusicPage() {
  const { tracks, currentTrackIndex, selectTrack, isPlaying, togglePlay, currentTrack, updateTrackSource, addTrack, updateTrack, deleteTrack } = useMusicPlayer();
  const [sourceValue, setSourceValue] = useState('');
  const [sourceMessage, setSourceMessage] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [editingTrackIndex, setEditingTrackIndex] = useState<number | null>(null);
  const [trackForm, setTrackForm] = useState({ title: '', artist: '', sourceType: 'youtube' as TrackSourceType, sourceUrl: '' });
  const [trackMessage, setTrackMessage] = useState<string | null>(null);

  const resetTrackForm = () => {
    setEditingTrackIndex(null);
    setTrackForm({ title: '', artist: '', sourceType: 'youtube', sourceUrl: '' });
  };

  const saveTrack = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const track = {
      title: trackForm.title.trim(),
      artist: trackForm.artist.trim(),
      sourceType: trackForm.sourceType,
      sourceUrl: trackForm.sourceUrl.trim(),
    };
    if (!track.title || !track.artist || !track.sourceUrl) {
      setTrackMessage('Add a title, artist, and source URL.');
      return;
    }
    if (editingTrackIndex === null) addTrack(track);
    else updateTrack(editingTrackIndex, track);
    resetTrackForm();
    setTrackMessage(editingTrackIndex === null ? 'Song added to your playlist.' : 'Song updated.');
  };

  const editTrack = (index: number) => {
    const track = tracks[index];
    setEditingTrackIndex(index);
    setTrackForm({
      title: track.title,
      artist: track.artist,
      sourceType: track.sourceType,
      sourceUrl: track.sourceUrl,
    });
    setTrackMessage(null);
  };

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AppShell>
      <div className="relative min-h-screen bg-[#1a0f1f] text-[#fff6f5]">
        <FloatingHearts />

        {/* Ambient glow orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#e77d9c]/10 blur-[120px]"
          />
          <div
            className="absolute top-1/2 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#c44a6e]/10 blur-[140px]"
          />
          <div
            className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#8b3a52]/10 blur-[100px]"
          />
        </div>

        {/* Hero section with parallax */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${HERO_IMAGE})`,
              transform: `translateY(${scrollY * 0.35}px) scale(1.1)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f1f]/60 via-[#1a0f1f]/50 to-[#1a0f1f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f1f]/40 via-transparent to-[#1a0f1f]/40" />

          <div className="relative z-10 px-4 text-center animate-fade-in-up">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <Headphones className="h-8 w-8 text-[#f6b2c5]" />
              </div>
            </div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[#e77d9c]/80">Our Soundtrack</p>
            <h1 className="font-script text-5xl text-white drop-shadow-lg sm:text-7xl">
              Our Music
            </h1>
            <p className="mt-4 max-w-md mx-auto text-sm text-white/70 leading-relaxed">
              Every love story has a melody. These are the songs that became ours &mdash;
              the ones we played on repeat, danced to in the kitchen, and hummed when we missed each other.
            </p>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#e77d9c]/60" />
              <Heart className="h-4 w-4 text-[#e77d9c] fill-[#e77d9c]" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#e77d9c]/60" />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-white/50 uppercase tracking-widest">Scroll to listen</span>
              <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2">
                <div className="h-2 w-1 rounded-full bg-white/50 animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* Now Playing spotlight section */}
        <section className="relative z-10 -mt-16 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Card className="overflow-hidden border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl">
              <div className="relative">
                <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
                  {/* Vinyl record visual */}
                  <div className="relative flex h-48 items-center justify-center overflow-hidden sm:h-full bg-gradient-to-br from-[#2a1820] to-[#1a0f1f]">
                    <div
                      className={cn(
                        'h-32 w-32 rounded-full bg-cover bg-center shadow-2xl sm:h-36 sm:w-36',
                        isPlaying && currentTrackIndex >= 0 && 'animate-spin'
                      )}
                      style={{
                        backgroundImage: `url(${VINYL_IMAGE})`,
                        animationDuration: '4s',
                      }}
                    />
                    <div className="absolute h-10 w-10 rounded-full bg-[#1a0f1f] border-2 border-white/20" />
                    <div className="absolute h-2 w-2 rounded-full bg-[#e77d9c]" />
                  </div>

                  {/* Track info */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#e77d9c]/20 text-[#f6b2c5] border-[#e77d9c]/30 text-xs">
                        Now Playing
                      </Badge>
                      <span className="text-xs text-white/40">
                        Track {currentTrackIndex + 1} of {tracks.length}
                      </span>
                    </div>
                    <h2 className="mt-3 font-serif-display text-2xl font-semibold text-white sm:text-3xl">
                      {currentTrack?.title || 'Select a song'}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {currentTrack?.artist || '—'}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <Button
                        size="icon"
                        className="h-12 w-12 rounded-full bg-[#e77d9c] text-white hover:bg-[#ef91ad] shadow-lg"
                        onClick={() => {
                          if (!currentTrack) {
                            selectTrack(0);
                          } else {
                            togglePlay();
                          }
                        }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                      </Button>
                      <p className="text-xs text-white/50">
                        {isPlaying ? 'Playing audio only &mdash; no video' : 'Press play to listen'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Quote section */}
        <section className="relative z-10 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Heart className="mx-auto h-6 w-6 text-[#e77d9c]/50 fill-[#e77d9c]/50" />
            <blockquote className="mt-4 font-serif-display text-xl italic text-white/80 sm:text-2xl leading-relaxed">
              &ldquo;And in her smile I see something more beautiful than the stars.&rdquo;
            </blockquote>
            <cite className="mt-3 block text-sm text-white/40 not-italic">&mdash; Beth Revis</cite>
          </div>
        </section>

        {/* YouTube source card */}
        <section className="relative z-10 px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Card className="border-white/10 bg-white/[0.06] backdrop-blur-md shadow-none">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e77d9c]/15">
                    <Music2 className="h-5 w-5 text-[#e77d9c]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">Add a YouTube source</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/55">
                      Select a track below, paste a YouTube link, and save it to that slot.
                      The player plays audio only &mdash; no video will be shown.
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <div className="flex-1">
                        <Label htmlFor="youtube-source" className="sr-only">YouTube source URL</Label>
                        <Input
                          id="youtube-source"
                          value={sourceValue}
                          onChange={(e) => { setSourceValue(e.target.value); setSourceMessage(null); }}
                          placeholder="https://youtube.com/watch?v=..."
                          className="border-white/15 bg-black/20 text-white placeholder:text-white/40"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => {
                          if (!isSupportedYouTubeUrl(sourceValue)) {
                            setSourceMessage('Paste a valid YouTube video link.');
                            return;
                          }
                          updateTrackSource(currentTrackIndex, sourceValue);
                          setSourceValue('');
                          setSourceMessage(`Saved to track ${currentTrackIndex + 1}.`);
                        }}
                        className="bg-[#e77d9c] text-white hover:bg-[#ef91ad]"
                      >
                        Save source
                      </Button>
                    </div>
                    {sourceMessage && (
                      <p className="mt-2 text-xs text-[#f6b2c5]">{sourceMessage}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="relative z-10 px-4 pt-8 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Card className="border-white/10 bg-white/[0.06] text-white shadow-none">
              <CardContent className="p-5 sm:p-6">
                <h3 className="font-serif-display text-xl font-semibold">{editingTrackIndex === null ? 'Add a song' : 'Edit song'}</h3>
                <form onSubmit={saveTrack} className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="track-title" className="text-white/75">Title</Label>
                    <Input id="track-title" required value={trackForm.title} onChange={(event) => setTrackForm({ ...trackForm, title: event.target.value })} className="mt-1 border-white/15 bg-black/20 text-white" placeholder="Song title" />
                  </div>
                  <div>
                    <Label htmlFor="track-artist" className="text-white/75">Artist</Label>
                    <Input id="track-artist" required value={trackForm.artist} onChange={(event) => setTrackForm({ ...trackForm, artist: event.target.value })} className="mt-1 border-white/15 bg-black/20 text-white" placeholder="Artist name" />
                  </div>
                  <div>
                    <Label htmlFor="track-source-type" className="text-white/75">Source type</Label>
                    <select id="track-source-type" value={trackForm.sourceType} onChange={(event) => setTrackForm({ ...trackForm, sourceType: event.target.value as TrackSourceType })} className="mt-1 flex h-10 w-full rounded-md border border-white/15 bg-[#1a0f1f] px-3 text-sm text-white">
                      <option value="youtube">YouTube</option>
                      <option value="spotify">Spotify</option>
                      <option value="soundcloud">SoundCloud</option>
                      <option value="file">Audio file URL</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="track-source-url" className="text-white/75">Source URL</Label>
                    <Input id="track-source-url" type="url" required value={trackForm.sourceUrl} onChange={(event) => setTrackForm({ ...trackForm, sourceUrl: event.target.value })} className="mt-1 border-white/15 bg-black/20 text-white" placeholder="https://..." />
                  </div>
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    <Button type="submit" className="bg-[#e77d9c] text-white hover:bg-[#ef91ad]">
                      {editingTrackIndex === null ? <Plus className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                      {editingTrackIndex === null ? 'Add song' : 'Save changes'}
                    </Button>
                    {editingTrackIndex !== null && <Button type="button" variant="outline" onClick={resetTrackForm} className="border-white/20 text-white hover:bg-white/10"><X className="mr-2 h-4 w-4" />Cancel</Button>}
                  </div>
                </form>
                {trackMessage && <p className="mt-3 text-xs text-[#f6b2c5]" role="status">{trackMessage}</p>}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Track list */}
        <section className="relative z-10 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-[#e77d9c]/40 to-transparent" />
              <h3 className="font-serif-display text-lg font-semibold text-white/90 whitespace-nowrap">
                The Playlist
              </h3>
              <div className="h-px flex-1 bg-gradient-to-l from-[#e77d9c]/40 to-transparent" />
            </div>

            <div className="space-y-3">
              {tracks.map((track, index) => {
                const isActive = index === currentTrackIndex;
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border transition-all duration-300',
                      isActive
                        ? 'border-[#e77d9c]/40 bg-gradient-to-r from-[#e77d9c]/15 to-transparent shadow-lg'
                        : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                    )}
                  >
                    {/* Equalizer bars for active track */}
                    {isActive && isPlaying && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-end gap-0.5 opacity-70">
                        {[0, 1, 2, 3].map((bar) => (
                          <div
                            key={bar}
                            className="w-1 rounded-full bg-[#e77d9c]"
                            style={{
                              height: '24px',
                              animation: `eq-bar ${0.6 + bar * 0.15}s ease-in-out infinite alternate`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                      {/* Play button / number */}
                      <button
                        onClick={() => {
                          if (isCurrent) togglePlay();
                          else selectTrack(index);
                        }}
                        className={cn(
                          'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all',
                          isActive
                            ? 'bg-[#e77d9c] text-white shadow-md'
                            : 'bg-white/8 text-white/50 hover:bg-[#e77d9c]/20 hover:text-[#f6b2c5]'
                        )}
                        aria-label={isActive && isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                      >
                        {isActive && isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </button>

                      {/* Track number badge */}
                      <span className={cn(
                        'hidden sm:block text-xs font-bold tabular-nums',
                        isActive ? 'text-[#e77d9c]' : 'text-white/30'
                      )}>
                        {String(track.position).padStart(2, '0')}
                      </span>

                      {/* Vinyl icon */}
                      <div className={cn(
                        'hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all',
                        isActive
                          ? 'bg-gradient-wine text-white'
                          : 'bg-white/5 text-white/30 group-hover:text-white/50'
                      )}>
                        <Disc3 className={cn('h-5 w-5', isActive && isPlaying && 'animate-spin')} style={isActive && isPlaying ? { animationDuration: '3s' } : undefined} />
                      </div>

                      {/* Title & artist */}
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          'truncate text-sm font-semibold transition-colors',
                          isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                        )}>
                          {track.title}
                        </p>
                        <p className="truncate text-xs text-white/45 mt-0.5">{track.artist}</p>
                        {track.mood && <p className="truncate text-xs text-[#f6b2c5]/65 mt-0.5">{track.mood}</p>}
                      </div>

                      {/* Source badge */}
                      <Badge
                        variant="outline"
                        className={cn(
                          'hidden sm:inline-flex text-xs capitalize border-white/15',
                          isActive ? 'text-[#f6b2c5] border-[#e77d9c]/30' : 'text-white/40'
                        )}
                      >
                        {SOURCE_LABELS[track.sourceType]}
                      </Badge>

                      {/* External link */}
                      {track.sourceType !== 'file' && (
                        <a
                          href={track.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/30 hover:text-[#e77d9c] transition-colors p-1"
                          aria-label={`Open ${track.title} in ${SOURCE_LABELS[track.sourceType]}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-white/60 hover:text-white" aria-label={`Edit ${track.title}`} onClick={() => editTrack(index)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/60 hover:text-red-300"
                        aria-label={`Delete ${track.title}`}
                        onClick={() => {
                          if (!window.confirm(`Delete “${track.title}” from the playlist?`)) return;
                          deleteTrack(index);
                          if (editingTrackIndex === index) resetTrackForm();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Romantic divider image */}
        <section className="relative z-10 my-16 h-48 overflow-hidden sm:h-64">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${CANDLE_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f1f] via-transparent to-[#1a0f1f]" />
          <div className="relative flex h-full items-center justify-center">
            <p className="font-script text-3xl text-white/90 drop-shadow-lg sm:text-4xl">
              ...and the music plays on
            </p>
          </div>
        </section>

        {/* Info card */}
        <section className="relative z-10 px-4 pb-12 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Card className="border-white/10 bg-white/[0.04] text-white shadow-none">
              <CardContent className="p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-[#e77d9c] shrink-0 mt-0.5" />
                <div className="text-sm text-white/55 space-y-1">
                  <p>
                    Your playlist has {tracks.length} tracks. The player bar at the bottom stays active
                    as you navigate the app.
                  </p>
                  <p>
                    YouTube tracks play audio only &mdash; no video is shown.
                    Manage track sources in Settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer spacer for player bar */}
        <div className="h-24" />
      </div>
    </AppShell>
  );
}
