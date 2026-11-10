import './globals.css';
import type { Metadata } from 'next';
import { MusicPlayerProvider } from '@/components/music/music-player-provider';
import { LandingAwareMusicBar } from '@/components/music/landing-aware-music-bar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'A private digital world for two.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-background text-foreground">
        <MusicPlayerProvider>
          {children}
          <LandingAwareMusicBar />
        </MusicPlayerProvider>
        <Toaster />
      </body>
    </html>
  );
}
