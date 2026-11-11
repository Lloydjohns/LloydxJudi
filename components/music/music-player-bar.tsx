'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMusicPlayer } from './music-player-provider';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Music2,
  ListMusic,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlaylistTrack } from '@/lib/types';
import { getYouTubeAudioEmbedUrl, getYouTubeVideoId } from '@/lib/music-utils';

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadingPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (apiLoadingPromise) return apiLoadingPromise;
  apiLoadingPromise = new Promise<void>((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const existing = document.getElementById('youtube-iframe-api');
    if (!existing) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
  });
  return apiLoadingPromise;
}

export function MusicPlayerBar() {
  const {
    tracks,
    currentTrackIndex,
    isPlaying,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    audioError,
    togglePlay,
    next,
    previous,
    selectTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    currentTrack,
  } = useMusicPlayer();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentVideoIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);
  const pendingPlayRef = useRef(false);

  const youtubeVideoId = currentTrack?.sourceType === 'youtube'
    ? getYouTubeVideoId(currentTrack.sourceUrl)
    : null;

  const isYouTube = currentTrack?.sourceType === 'youtube';
  const isFile = currentTrack?.sourceType === 'file';

  useEffect(() => {
    if (!isYouTube || !youtubeVideoId) return;
    if (!containerRef.current) return;

    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current || !youtubeVideoId) return;

      if (currentVideoIdRef.current === youtubeVideoId && playerRef.current) {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
        return;
      }

      currentVideoIdRef.current = youtubeVideoId;

      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }

      const div = document.createElement('div');
      div.style.width = '200px';
      div.style.height = '200px';
      div.style.position = 'absolute';
      div.style.opacity = '0.01';
      div.style.pointerEvents = 'none';
      div.style.zIndex = '-1';
      containerRef.current.appendChild(div);

      playerRef.current = new window.YT.Player(div, {
        videoId: youtubeVideoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          playsinline: 1,
          controls: 0,
        },
        events: {
          onReady: (e: any) => {
            const p = e.target;
            try { p.setVolume(isMuted ? 0 : Math.round(volume * 100)); } catch {}
            p.playVideo();
          },
          onStateChange: (e: any) => {
            const YT = window.YT;
            if (!YT) return;
            if (e.data === YT.PlayerState.ENDED) {
              next();
            }
            if (e.data === YT.PlayerState.PLAYING) {
              isPlayingRef.current = true;
            }
            if (e.data === YT.PlayerState.PAUSED) {
              isPlayingRef.current = false;
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [youtubeVideoId, isYouTube]);

  useEffect(() => {
    if (!playerRef.current || !youtubeVideoId) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch {}
  }, [isPlaying, youtubeVideoId]);

  useEffect(() => {
    if (!playerRef.current) return;
    try {
      playerRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
    } catch {}
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
  }, []);

  const handlePlay = useCallback(() => {
    if (currentTrack?.sourceType === 'file') {
      if (!currentTrack.sourceUrl) return;
    }
    togglePlay();
  }, [currentTrack, togglePlay]);

  if (!currentTrack) return null;

  const isEmbeddable = isYouTube || currentTrack.sourceType === 'spotify';
  const isSpotify = currentTrack.sourceType === 'spotify';

  return (
    <>
      {showPlaylist && (
        <PlaylistDrawer
          tracks={tracks}
          currentIndex={currentTrackIndex}
          onSelect={(i) => {
            selectTrack(i);
            setShowPlaylist(false);
          }}
          onClose={() => setShowPlaylist(false)}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg shadow-romantic">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-wine text-primary-foreground shadow-soft">
              <Music2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">
                {currentTrack.title}
              </p>
              <p className="truncate text-xs text-muted-foreground leading-tight">
                {currentTrack.artist}
              </p>
            </div>
            {audioError && (
              <p className="hidden text-xs text-destructive sm:block">{audioError}</p>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 hidden sm:inline-flex', isShuffled && 'text-primary')}
              onClick={toggleShuffle}
              aria-label={isShuffled ? 'Disable shuffle' : 'Enable shuffle'}
              aria-pressed={isShuffled}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={previous}
              aria-label="Previous track"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
              onClick={handlePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={next}
              aria-label="Next track"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 hidden sm:inline-flex', repeatMode !== 'off' && 'text-primary')}
              onClick={cycleRepeat}
              aria-label={`Repeat: ${repeatMode}`}
              aria-pressed={repeatMode !== 'off'}
            >
              {repeatMode === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </Button>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(v) => setVolume(v[0] / 100)}
              className="w-24"
              aria-label="Volume"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setShowPlaylist(true)}
            aria-label="Show playlist"
          >
            <ListMusic className="h-4 w-4" />
          </Button>
        </div>

        <div ref={containerRef} className="sr-only" aria-hidden="true" />

        {isSpotify && isPlaying && (
          <div className="border-t border-border bg-blush/30 px-3 py-2">
            <div className="mx-auto max-w-7xl flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                <Music2 className="h-3 w-3" /> Playing via Spotify:
              </span>
              <iframe
                src={`${currentTrack.sourceUrl}?utm_source=our-story&autoplay=1`}
                width="100%"
                height="72"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-md"
                title={`${currentTrack.title} - ${currentTrack.artist}`}
              />
            </div>
          </div>
        )}

        {isFile && isPlaying && !currentTrack.sourceUrl && (
          <div className="border-t border-border bg-destructive/5 px-3 py-2">
            <p className="mx-auto max-w-7xl text-xs text-destructive">
              No audio file has been uploaded for this track yet. Add one in Settings.
            </p>
          </div>
        )}
        {isFile && isPlaying && currentTrack.sourceUrl && (
          <audio
            autoPlay
            src={currentTrack.sourceUrl}
            onEnded={next}
            className="hidden"
          />
        )}
      </div>
    </>
  );
}

function PlaylistDrawer({
  tracks,
  currentIndex,
  onSelect,
  onClose,
}: {
  tracks: PlaylistTrack[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Playlist">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[80vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-card shadow-romantic animate-scale-in flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="font-serif-display text-xl font-semibold">Our Playlist</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close playlist">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto px-2 py-2">
          {tracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => onSelect(index)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted',
                index === currentIndex && 'bg-primary/10'
              )}
            >
              <span className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                index === currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}>
                {track.position}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-sm font-medium', index === currentIndex && 'text-primary')}>
                  {track.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
                {track.mood && <p className="truncate text-xs text-muted-foreground/75">{track.mood}</p>}
              </div>
              <span className="text-xs uppercase text-muted-foreground">{track.sourceType}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
