'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import type { PlaylistTrack } from '@/lib/types';
import { demoPlaylistTracks } from '@/lib/demo-data';

export type RepeatMode = 'off' | 'one' | 'all';

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

  const currentTrack = tracks[currentTrackIndex] || null;

  const getNextIndex = useCallback(
    (direction: 1 | -1) => {
      if (isShuffled && shuffleOrderRef.current.length === tracks.length) {
        const order = shuffleOrderRef.current;
        const currentPos = order.indexOf(currentTrackIndex);
        const nextPos = (currentPos + direction + order.length) % order.length;
        return order[nextPos];
      }
      return (currentTrackIndex + direction + tracks.length) % tracks.length;
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
    currentTrack,
  };

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
}
