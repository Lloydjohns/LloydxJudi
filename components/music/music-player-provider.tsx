'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import type { PlaylistTrack } from '@/lib/types';
import { demoPlaylistTracks } from '@/lib/demo-data';
import { makeLocalId, saveLocalList } from '@/lib/local-data';

const STORAGE_KEY = 'llodxjudi-playlist';

export type RepeatMode = 'off' | 'one' | 'all';

function isPlaylistTrack(value: unknown): value is PlaylistTrack {
  if (!value || typeof value !== 'object') return false;
  const track = value as Record<string, unknown>;
  return typeof track.id === 'string'
    && typeof track.coupleId === 'string'
    && typeof track.position === 'number'
    && typeof track.title === 'string'
    && typeof track.artist === 'string'
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

  const currentTrack = tracks[currentTrackIndex] || null;

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      try {
        const savedTracks: unknown = JSON.parse(raw);
        if (Array.isArray(savedTracks) && savedTracks.every(isPlaylistTrack)) {
          setTracks(savedTracks);
        } else {
          setAudioError('Saved playlist data is invalid.');
        }
      } catch {
        setAudioError('Saved playlist data could not be read.');
      }
    }
    setHasLoadedTracks(true);
  }, []);

  useEffect(() => {
    if (hasLoadedTracks) saveLocalList(STORAGE_KEY, tracks);
  }, [tracks, hasLoadedTracks]);

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
