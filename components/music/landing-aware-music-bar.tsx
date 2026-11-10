'use client';

import { usePathname } from 'next/navigation';
import { MusicPlayerBar } from './music-player-bar';

export function LandingAwareMusicBar() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return <MusicPlayerBar />;
}
