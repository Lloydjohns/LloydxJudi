'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import type { PlaylistTrack } from '@/lib/types';
import { demoPlaylistTracks } from '@/lib/demo-data';
import { makeLocalId } from '@/lib/local-data';
import { loadCloudValue, saveCloudValue, STORY_COLLECTION_KEYS } from '@/lib/story-cloud';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';

const STORAGE_KEY = STORY_COLLECTION_KEYS.playlist;
const previousDefaultSongs = [
  ['Perfect', 'Ed Sheeran'],
  ['All of Me', 'John Legend'],
  ['A Thousand Years', 'Christina Perri'],
  ["Can't Help Falling in Love", 'Elvis Presley'],
  ['Thinking Out Loud', 'Ed Sheeran'],
  ['Make You Feel My Love', 'Adele'],
  ['Lover', 'Taylor Swift'],
  ['At Last', 'Etta James'],
  ['Just the Way You Are', 'Bruno Mars'],
  ['Marry You', 'Bruno Mars'],
  ['I Will Always Love You', 'Whitney Houston'],
  ['You Are the Best Thing', 'Ray LaMontagne'],
];

export type RepeatMode = 'off' | 'one' | 'all';

function isPlaylistTrack(value: unknown): value is PlaylistTrack {
  if (!value || typeof value !== 'object') return false;
  const track = value as Record<string, unknown>;
  return typeof track.id === 'string'
    && typeof track.coupleId === 'string'
    && typeof track.position === 'number'
    && typeof track.title === 'string'
    && typeof track.artist === 'string'
    && (track.mood === undefined || typeof track.mood === 'string')
    && (track.sourceType === 'file' || track.sourceType === 'spotify' || track.sourceType === 'youtube' || track.sourceType === 'soundcloud')
    && typeof track.sourceUrl === 'string'
    && (track.coverImage === null || typeof track.coverImage === 'string')
    && typeof track.createdAt === 'string';
}

interface MusicPlayerState {
  tracks: PlaylistTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  audioError: string | null;
}

interface MusicPlayerContextValue extends MusicPlayerState {
  isPlaylistReady: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  selectTrack: (index: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  updateTrackSource: (index: number, sourceUrl: string) => void;
  addTrack: (track: Pick<PlaylistTrack, 'title' | 'artist' | 'sourceType' | 'sourceUrl'>) => void;
  updateTrack: (index: number, track: Pick<PlaylistTrack, 'title' | 'artist' | 'sourceType' | 'sourceUrl'>) => void;
  deleteTrack: (index: number) => void;
  currentTrack: PlaylistTrack | null;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<PlaylistTrack[]>(demoPlaylistTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [audioError, setAudioError] = useState<string | null>(null);
  const shuffleOrderRef = useRef<number[]>([]);
  const [hasLoadedTracks, setHasLoadedTracks] = useState(false);
  const [canSaveTracks, setCanSaveTracks] = useState(false);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const currentTrack = tracks[currentTrackIndex] || null;

  useEffect(() => {
    let active = true;
    let loadVersion = 0;
    const loadTracks = async () => {
      const currentVersion = ++loadVersion;
      setCanSaveTracks(false);
      setHasLoadedTracks(false);
      try {
        const savedTracks = await loadCloudValue<unknown>(STORAGE_KEY, demoPlaylistTracks);
        if (!active || currentVersion !== loadVersion) return;
        if (Array.isArray(savedTracks) && savedTracks.every(isPlaylistTrack)) {
          const isPreviousDefault = savedTracks.length === previousDefaultSongs.length
            && savedTracks.every((track, index) => (
              track.id === `pt-${index + 1}`
              && track.title === previousDefaultSongs[index][0]
              && track.artist === previousDefaultSongs[index][1]
            ));
          setTracks(isPreviousDefault ? demoPlaylistTracks : savedTracks);
          setCanSaveTracks(true);
        } else {
          throw new Error('Saved playlist data is invalid.');
        }
        setAudioError(null);
      } catch (cause) {
        if (active && currentVersion === loadVersion) {
          setAudioError(cause instanceof Error ? cause.message : 'Could not load the cloud playlist.');
        }
      } finally {
        if (active && currentVersion === loadVersion) setHasLoadedTracks(true);
      }
    };

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'INITIAL_SESSION' && !session) {
          setHasLoadedTracks(true);
          return;
        }
        if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
          window.setTimeout(() => { void loadTracks(); }, 0);
        }
        if (event === 'SIGNED_OUT') {
          loadVersion += 1;
          setCanSaveTracks(false);
          setTracks(demoPlaylistTracks);
          setHasLoadedTracks(true);
        }
      });
      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } catch (cause) {
      setAudioError(cause instanceof Error ? cause.message : 'Could not connect to the cloud playlist.');
      setHasLoadedTracks(true);
      return () => { active = false; };
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedTracks || !canSaveTracks) return;
    saveQueueRef.current = saveQueueRef.current
      .then(() => saveCloudValue(STORAGE_KEY, tracks))
      .catch((cause: unknown) => {
      setAudioError(cause instanceof Error ? cause.message : 'Could not save the playlist to the cloud.');
      });
  }, [tracks, hasLoadedTracks, canSaveTracks]);

  const getNextIndex = useCallback(
    (direction: 1 | -1) => {
      if (isShuffled && shuffleOrderRef.current.length === tracks.length) {
        const order = shuffleOrderRef.current;
        const currentPos = order.indexOf(currentTrackIndex);
        const nextPos = (currentPos + direction + order.length) % order.length;
        return order[nextPos];
      }
      return tracks.length ? (currentTrackIndex + direction + tracks.length) % tracks.length : 0;
    },
    [isShuffled, tracks.length, currentTrackIndex]
  );

  const play = useCallback(() => {
    if (currentTrack?.sourceType === 'file') {
      setAudioError(null);
    } else {
      setAudioError(null);
    }
    setIsPlaying(true);
  }, [currentTrack]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const selectTrack = useCallback((index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setAudioError(null);
    }
  }, [tracks.length]);

  const next = useCallback(() => {
    if (repeatMode === 'one') {
      setIsPlaying(true);
      return;
    }
    const nextIdx = getNextIndex(1);
    setCurrentTrackIndex(nextIdx);
    setAudioError(null);
  }, [getNextIndex, repeatMode]);

  const previous = useCallback(() => {
    const prevIdx = getNextIndex(-1);
    setCurrentTrackIndex(prevIdx);
    setAudioError(null);
  }, [getNextIndex]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (v > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => {
      if (!prev) {
        const indices = Array.from({ length: tracks.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        shuffleOrderRef.current = indices;
      }
      return !prev;
    });
  }, [tracks.length]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  }, []);

  const updateTrackSource = useCallback((index: number, sourceUrl: string) => {
    setTracks((currentTracks) => currentTracks.map((track, trackIndex) => (
      trackIndex === index
        ? { ...track, sourceUrl, sourceType: 'youtube' }
        : track
    )));
    setAudioError(null);
  }, []);

  const addTrack = useCallback((track: Pick<PlaylistTrack, 'title' | 'artist' | 'sourceType' | 'sourceUrl'>) => {
    setTracks((currentTracks) => [...currentTracks, {
      ...track,
      id: makeLocalId('track'),
      coupleId: 'demo',
      position: currentTracks.length + 1,
      coverImage: null,
      createdAt: new Date().toISOString(),
    }]);
  }, []);

  const updateTrack = useCallback((index: number, track: Pick<PlaylistTrack, 'title' | 'artist' | 'sourceType' | 'sourceUrl'>) => {
    setTracks((currentTracks) => currentTracks.map((item, itemIndex) => (
      itemIndex === index ? { ...item, ...track } : item
    )));
  }, []);

  const deleteTrack = useCallback((index: number) => {
    setTracks((currentTracks) => currentTracks
      .filter((_, itemIndex) => itemIndex !== index)
      .map((track, itemIndex) => ({ ...track, position: itemIndex + 1 })));
    setCurrentTrackIndex((currentIndex) => {
      if (index < currentIndex) return currentIndex - 1;
      if (index === currentIndex) return Math.max(0, currentIndex - 1);
      return currentIndex;
    });
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (!currentTrack) return;
    if (currentTrack.sourceType === 'file' && !currentTrack.sourceUrl) {
      setAudioError('No audio source configured for this track.');
      setIsPlaying(false);
    }
  }, [isPlaying, currentTrack]);

  const value: MusicPlayerContextValue = {
    tracks,
    isPlaylistReady: canSaveTracks,
    currentTrackIndex,
    isPlaying,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    audioError,
    play,
    pause,
    togglePlay,
    next,
    previous,
    selectTrack,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    updateTrackSource,
    addTrack,
    updateTrack,
    deleteTrack,
    currentTrack,
  };

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
}
