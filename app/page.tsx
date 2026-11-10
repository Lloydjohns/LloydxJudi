'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clapperboard, Clock3, Heart, Lock, MapPin, Music2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STORY_PASSWORD = '11232025';
const ENTRANCE_VIDEO_PATH = '/video.mp4';
const restaurantOptions = [
  { name: 'Italian', restaurantName: 'Italian restaurant', detail: 'Pasta, candlelight & a long dinner', icon: '🍝', image: '', date: 'Date to be confirmed', location: 'Location to be added', menu: 'Menu details to be added.' },
  { name: 'Japanese', restaurantName: 'Japanese restaurant', detail: 'A cozy dinner with all our favorites', icon: '🍣', image: '', date: 'Date to be confirmed', location: 'Location to be added', menu: 'Menu details to be added.' },
  { name: 'Steakhouse', restaurantName: 'Steakhouse', detail: 'A classic, special-occasion evening', icon: '🥂', image: '', date: 'Date to be confirmed', location: 'Location to be added', menu: 'Menu details to be added.' },
  { name: 'Rooftop', restaurantName: 'Rooftop restaurant', detail: 'Dinner with a beautiful view', icon: '🌙', image: '', date: 'Date to be confirmed', location: 'Location to be added', menu: 'Menu details to be added.' },
];

const steps = ['A little greeting', 'Pick our dinner', 'The details', 'A note for you', 'Our little film'];

export default function WelcomePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [restaurant, setRestaurant] = useState<string | null>(null);
  const [choiceSent, setChoiceSent] = useState(false);
  const [choiceError, setChoiceError] = useState<string | null>(null);
  const [sendingChoice, setSendingChoice] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password !== STORY_PASSWORD) {
      setError('That password didn’t open our story. Try again.');
      return;
    }
    setUnlocked(true);
  };

  const finish = () => router.push('/home');

  const continueFromRestaurant = async () => {
    if (!restaurant) return;
    setChoiceError(null);
    setSendingChoice(true);
    try {
      const response = await fetch('/api/restaurant-choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your dinner choice.');
      setChoiceSent(true);
      setPreviewOnly(false);
      setStep(2);
    } catch (submitError) {
      setChoiceError(submitError instanceof Error ? submitError.message : 'Could not send your dinner choice.');
    } finally {
      setSendingChoice(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#241a27] px-5 py-10 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(126,70,96,.42),transparent_58%),linear-gradient(145deg,#241a27,#382333_55%,#1c1720)]" aria-hidden="true" />
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#d96388]/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#b87a9b]/10 blur-3xl" aria-hidden="true" />

      {!unlocked ? (
        <section className="relative z-10 w-full max-w-md animate-fade-in-up text-center">
          <p className="mb-8 font-script text-2xl text-white/80">Our Story <span aria-hidden="true">♡</span></p>
          <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 shadow-[0_0_40px_rgba(217,99,136,.16)]">
            <Heart className="h-6 w-6 fill-[#ef86a5]/80 text-[#ef86a5]" aria-hidden="true" />
          </div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/55">A little world for two</p>
          <h1 className="font-script text-6xl leading-tight text-white drop-shadow-lg sm:text-7xl">Our Love Story</h1>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-white/65">Enter the password to unlock your anniversary surprise.</p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-sm space-y-3">
            <Label htmlFor="story-password" className="sr-only">Password</Label>
            <Input id="story-password" type="password" autoComplete="current-password" placeholder="Password" value={password}
              onChange={(event) => { setPassword(event.target.value); setError(null); }}
              className="h-12 rounded-xl border border-white/15 bg-white/95 px-4 text-center text-[#4d3744] shadow-xl placeholder:text-[#8b7780] focus-visible:ring-2 focus-visible:ring-[#d8678b]"
              aria-invalid={Boolean(error)} aria-describedby={error ? 'welcome-error' : undefined} required />
            {error && <p id="welcome-error" role="alert" className="flex items-center justify-center gap-2 rounded-lg bg-black/30 px-3 py-2 text-xs text-white"><AlertCircle className="h-4 w-4 shrink-0 text-[#ffb4c7]" />{error}</p>}
            <Button type="submit" className="h-12 w-full rounded-xl bg-[#d96388] text-white shadow-[0_8px_28px_rgba(217,99,136,.35)] transition-all hover:bg-[#e37699] hover:shadow-[0_10px_34px_rgba(217,99,136,.5)]">
              <Lock className="mr-2 h-4 w-4" />Unlock Our Story
            </Button>
          </form>
          <p className="mt-10 text-xs text-white/40">The best part of my life is you. <span aria-hidden="true">♡</span></p>
        </section>
      ) : (
        <section className="relative z-10 w-full max-w-2xl animate-fade-in-up">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="font-script text-xl text-white/80">Our Story <span aria-hidden="true">♡</span></p>
            <p className="text-xs font-medium tracking-wide text-white/55">{step + 1} / {steps.length}</p>
          </div>
          <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#ef86a5] transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>

          <div className="rounded-[28px] border border-white/15 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-md sm:p-10">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#ef86a5]/15 text-[#ffb4c7]">
              {step === 0 && <Heart className="h-6 w-6 fill-current" />}
              {step === 1 && <MapPin className="h-6 w-6" />}
              {step === 2 && <Clock3 className="h-6 w-6" />}
              {step === 3 && <Music2 className="h-6 w-6" />}
              {step === 4 && <Clapperboard className="h-6 w-6" />}
            </div>

            {step === 0 && <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffb4c7]">To my favorite person</p>
              <h1 className="mt-4 font-script text-5xl leading-tight sm:text-7xl">Happy 1st Anniversary</h1>
              <p className="mt-5 text-lg text-white/80">One year of us, and my favorite chapter is still the one we’re writing now.</p>
              <p className="mt-3 text-sm leading-6 text-white/60">Thank you for every laugh, every little adventure, and for making ordinary days feel like something special. I’d choose you all over again.</p>
            </div>}

            {step === 1 && <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffb4c7]">A date with me?</p>
              <h1 className="mt-3 font-script text-5xl sm:text-6xl">Let me take you to dinner</h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/65">Choose the kind of place you’d love for our anniversary date. I’ll take care of the rest.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {restaurantOptions.map((option) => {
                  const selected = restaurant === option.name;
                  return <button key={option.name} type="button" onClick={() => { setRestaurant(option.name); setChoiceSent(false); setChoiceError(null); }} aria-pressed={selected}
                    className={`relative rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${selected ? 'border-[#ffb4c7] bg-[#d96388]/25 shadow-[0_0_24px_rgba(217,99,136,.18)]' : 'border-white/15 bg-white/[0.04] hover:border-white/35'}`}>
                    <span className="text-2xl" aria-hidden="true">{option.icon}</span>
                    <span className="mt-2 block font-serif-display text-lg">{option.name}</span>
                    <span className="mt-1 block text-xs leading-5 text-white/55">{option.detail}</span>
                    {selected && <Check className="absolute right-4 top-4 h-4 w-4 text-[#ffb4c7]" />}
                  </button>;
                })}
              </div>
              {restaurant && (() => {
                const choice = restaurantOptions.find((option) => option.name === restaurant)!;
                return <div className="mt-5 overflow-hidden rounded-2xl border border-white/15 bg-black/10 text-left sm:flex">
                  <div className="flex min-h-36 items-center justify-center bg-gradient-to-br from-[#6f4053] to-[#342332] px-5 sm:w-2/5">
                    {choice.image ? <img src={choice.image} alt={choice.restaurantName} className="h-40 w-full object-cover sm:h-full" /> : <div className="text-center"><span className="text-4xl" aria-hidden="true">{choice.icon}</span><p className="mt-2 text-xs text-white/55">Restaurant image will appear here</p></div>}
                  </div>
                  <div className="space-y-3 p-4 sm:flex-1 sm:p-5">
                    <div><p className="font-serif-display text-lg">{choice.restaurantName}</p><p className="mt-1 text-xs text-white/60">{choice.date}</p></div>
                    <p className="text-xs leading-5 text-white/70"><MapPin className="mr-1 inline h-3.5 w-3.5" />{choice.location}</p>
                    <div className="rounded-xl bg-white/[0.06] p-3"><p className="text-[10px] font-semibold uppercase tracking-widest text-[#ffb4c7]">Menu</p><p className="mt-1 text-xs leading-5 text-white/65">{choice.menu}</p></div>
                  </div>
                </div>;
              })()}
              {choiceError && <p role="alert" className="mt-4 text-sm text-[#ffb4c7]">{choiceError}</p>}
              {previewOnly && <p role="status" className="mt-3 text-xs leading-5 text-white/55">Preview mode: this choice wasn’t emailed or saved. Configure Supabase and Resend to turn on notifications.</p>}
            </div>}

            {step === 2 && <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffb4c7]">A few little details</p>
              <h1 className="mt-3 font-script text-5xl sm:text-6xl">Dress up for our date</h1>
              <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/10 bg-black/10 p-5 text-left">
                <p className="text-sm leading-7 text-white/80">Let’s make it a special night, so please wear a formal suit. I’ll let you know the call time soon so we can get ready and head out together.</p>
                <p className="mt-4 text-xs leading-5 text-white/50">Date, restaurant reservation, and call time can be filled in once they’re confirmed.</p>
              </div>
            </div>}

            {step === 3 && <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffb4c7]">Just for you</p>
              <h1 className="mt-3 font-script text-5xl sm:text-6xl">A message from me</h1>
              <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/10 bg-black/10 p-5 text-left sm:p-7">
                <p className="font-script text-2xl text-[#ffb4c7]">My love,</p>
                <p className="mt-3 text-sm leading-7 text-white/80">Happy first anniversary. This year with you has given me so many moments I want to keep close. Thank you for being my person, for making me laugh, and for making anywhere feel like home. I love you, and I can’t wait for everything still ahead of us.</p>
                <p className="mt-5 font-script text-2xl text-[#ffb4c7]">Always yours ♡</p>
              </div>
            </div>}

            {step === 4 && <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffb4c7]">Press play when you’re ready</p>
              <h1 className="mt-3 font-script text-5xl sm:text-6xl">A little film of us</h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/65">One more place for our favorite moments together.</p>
              <video className="mt-6 aspect-video w-full rounded-2xl bg-black object-contain" src={ENTRANCE_VIDEO_PATH} controls playsInline preload="metadata">
                Your browser does not support video playback.
              </video>
            </div>}

            <div className="mt-9 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
              {step > 0 ? <Button variant="ghost" onClick={() => setStep((current) => current - 1)} className="text-white/70 hover:bg-white/10 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button> : <span />}
              {step < steps.length - 1 ? <Button onClick={step === 1 ? (choiceError ? () => { setPreviewOnly(true); setStep(2); } : continueFromRestaurant) : () => setStep((current) => current + 1)} disabled={(step === 1 && (!restaurant || sendingChoice || choiceSent))} className="rounded-xl bg-[#d96388] text-white hover:bg-[#e37699] disabled:opacity-40">{sendingChoice ? 'Sending…' : step === 1 ? (choiceSent ? 'Sent' : choiceError ? 'Continue preview' : 'Send choice & continue') : 'Next'}<ArrowRight className="ml-2 h-4 w-4" /></Button> : <Button onClick={finish} className="rounded-xl bg-[#d96388] text-white hover:bg-[#e37699]">Explore our story<Sparkles className="ml-2 h-4 w-4" /></Button>}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-white/35">{steps.map((label, index) => <span key={label} className={index === step ? 'text-[#ffb4c7]' : ''}>{label}</span>)}</div>
        </section>
      )}
    </main>
  );
}
