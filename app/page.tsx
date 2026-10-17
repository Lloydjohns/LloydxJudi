'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CalendarDays, Heart, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEMO_ANNIVERSARY_DATE } from '@/lib/demo-data';

const coverImage =
  'https://images.pexels.com/photos/1024963/pexels-photo-1024963.jpeg?auto=compress&cs=tinysrgb&h=1600&w=2400';

export default function WelcomePage() {
  const router = useRouter();
  const [dateValue, setDateValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!dateValue) {
      setError('Please enter your anniversary date.');
      return;
    }

    if (dateValue !== DEMO_ANNIVERSARY_DATE) {
      setError('That date does not match our anniversary. Try again, darling.');
      return;
    }

    setUnlocking(true);
    window.setTimeout(() => router.push('/home'), 1400);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#241a27] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(39,24,43,.42),rgba(39,24,43,.2)_42%,rgba(28,17,31,.84))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,transparent_0%,rgba(32,19,35,.28)_65%,rgba(25,14,28,.72)_100%)]" />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-16">
        <header className="flex items-center justify-between">
          <p className="font-script text-xl tracking-wide text-white/90 sm:text-2xl">Our Story ♡</p>
          <p className="hidden text-[10px] uppercase tracking-[0.32em] text-white/60 sm:block">
            A private place for two
          </p>
        </header>

        <section className="flex flex-1 items-center justify-center py-16 text-center sm:justify-start sm:text-left lg:pl-[8%]">
          <div className="max-w-xl animate-fade-in-up">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.42em] text-white/65">
              Our little world
            </p>
            <h1 className="font-script text-6xl leading-[0.92] text-white drop-shadow-lg sm:text-8xl lg:text-9xl">
              Enter Our
              <br />
              Love Story <span className="font-serif-display text-4xl sm:text-5xl">♡</span>
            </h1>
            <p className="mx-auto mt-7 max-w-xs text-sm leading-6 text-white/75 sm:mx-0 sm:max-w-sm">
              Before you step into our little world, please enter the date our forever began.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-sm space-y-3 sm:mx-0">
              <div className="relative">
                <Label htmlFor="anniversary" className="sr-only">Anniversary date</Label>
                <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e5663]" />
                <Input
                  id="anniversary"
                  type="date"
                  value={dateValue}
                  onChange={(event) => {
                    setDateValue(event.target.value);
                    setError(null);
                  }}
                  className="h-12 rounded-xl border-0 bg-white pl-11 text-[#4d3744] shadow-xl placeholder:text-[#8b7780] focus-visible:ring-2 focus-visible:ring-[#d8678b]"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'welcome-error' : 'welcome-hint'}
                  required
                />
              </div>
              <p id="welcome-hint" className="text-left text-[11px] text-white/60">Demo date: February 14, 2024</p>
              {error && (
                <p id="welcome-error" role="alert" className="flex items-center gap-2 rounded-lg bg-black/30 px-3 py-2 text-left text-xs text-white">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#ffb4c7]" /> {error}
                </p>
              )}
              <Button
                type="submit"
                disabled={unlocking}
                className="h-12 w-full rounded-xl bg-[#d96388] text-white shadow-[0_8px_28px_rgba(217,99,136,.35)] transition-all hover:bg-[#e37699] hover:shadow-[0_10px_34px_rgba(217,99,136,.5)]"
              >
                {unlocking ? <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> : <Lock className="mr-2 h-4 w-4" />}
                {unlocking ? 'Opening our story...' : 'Unlock Our Story ♡'}
              </Button>
            </form>
          </div>
        </section>

        <footer className="flex items-end justify-between gap-4 text-[11px] text-white/55">
          <p className="max-w-[220px] leading-5">The best part of my life is you.</p>
          <Heart className="h-5 w-5 fill-white/70 text-white/70" aria-hidden="true" />
          <p className="hidden max-w-[220px] text-right leading-5 sm:block">Forever starts with one small moment.</p>
        </footer>
      </div>

      {unlocking && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#241a27]/85 backdrop-blur-sm animate-fade-in">
          <div className="text-center">
            <Heart className="mx-auto h-16 w-16 animate-scale-in fill-[#ef86a5] text-[#ef86a5]" />
            <p className="mt-5 font-script text-3xl text-white">Welcome to our story</p>
          </div>
        </div>
      )}
    </main>
  );
}
