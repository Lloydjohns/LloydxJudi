'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AlertCircle, ArrowLeft, ArrowRight, CalendarDays, Check, Clapperboard, Clock3, ExternalLink, Heart, Lock, MapPin, Music2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const STORY_PASSWORD = '11232025';
const ENTRANCE_VIDEO_PATH = '/video/lloydxjudi.mp4';
const restaurantOptions = [
  { name: 'The Penthouse 8747', detail: 'Rooftop dining, skyline views & cocktails', icon: '🌃', image: 'https://lh3.googleusercontent.com/grass-cs/AABkmLfqR8rxVOzFrhhgtUC1fh0tuzmgJQRTXbk5JndwZKbD6fc6_6E-jF_4uL4eAY493WySktf24vlIHukb2j-95TQUWZwXX_w3VlNrK3pXyxNsrXM36TdQ90S0MwSQTpEh7zObe0vDoQ=w408-h408-k-no', location: '8747 Paseo de Roxas, Makati', locationUrl: 'https://www.google.com/maps/search/?api=1&query=The+Penthouse+8747+Makati', menuUrl: 'https://www.google.com/search?q=The+Penthouse+8747+Makati+menu' },
  { name: 'Sumu Niko', detail: 'Japanese-inspired favorites in a cozy setting', icon: '🍣', image: 'https://lh3.googleusercontent.com/grass-cs/AABkmLf5qT-9KjAZ44gKwzTsLSyeFODW8vrCF5wA-aHoRbmiAUkdj_7Z3OWpNULgVbWCTJAxH2R7O4Fgo6B9_NN-8WmsDZ3anTnswJrOznULSuU-sS4BmKljbzgOcRv7inapUNW26tUlM4iMQesG=w408-h307-k-no', location: 'SM North Edsa', locationUrl: 'https://www.google.com/maps/place/Sumo+Niku+SM+North+EDSA+QC/@14.6571881,121.0283981,17z/data=!3m1!4b1!4m6!3m5!1s0x3397b7004356edbf:0x63551a4035b57ac4!8m2!3d14.6571829!4d121.030973!16s%2Fg%2F11zcy45kjs?entry=ttu&g_ep=EgoyMDI2MTEwOC4wIKXMDSoASAFQAw%3D%3D', menuUrl: 'https://www.google.com/search?q=Sumu+Niko+restaurant+menu' },
  { name: "Italianni's BGC", detail: 'Italian-American favorites made for sharing', icon: '🍝', image: 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TPGBmo7QDLvsyzoTi7GOoaBkoqIPjXIfywrdJ8-Z7d_AsZIwkRe-ojqXh3IA4NWjiYSBbEPlohYFT9U_X9gw_WvZW7lBM1hg2oPNmR8FuiCkqGtvhPZqqj1ggWR0OQ9jmJhtOi2eYs_2Y=w224-h298-n-k-no', location: 'Uptown Mall, Taguig', locationUrl: 'Post Proper, Uptown, 3rd Level, Uptown Mall, 9th Ave, corner 36th St, Northside, Taguig, Metro Manila', menuUrl: 'https://www.google.com/search?q=Italiannis+Philippines+menu' },
  { name: 'Roof Manila', detail: 'All-you-can-eat grill, hotpot & buffet favorites', icon: '🥢', image: 'data:image/jpeg;base64,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', location: 'Pacific Skyloft, Lacson Ave, Sampaloc, Manila, 1008 Metro Manila', locationUrl: 'https://www.google.com/maps/place/Roof+Manila/@14.6126933,120.9902639,17z/data=!3m1!4b1!4m6!3m5!1s0x3397b7289840a61b:0x60819291836685a6!8m2!3d14.6126933!4d120.9902639!16s%2Fg%2F11fmbjmdl4?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D', menuUrl: 'https://www.google.com/search?q=Roof+Manila+menu' },
];

function downloadAnniversaryInvite(restaurantName: string, location: string) {
  const escapeIcsText = (value: string) => value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
  const calendarEvent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LloydxJudi//Anniversary Dinner//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:anniversary-dinner-20261122@lloydxjudi',
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    'DTSTART;VALUE=DATE:20261122',
    'DTEND;VALUE=DATE:20261123',
    `SUMMARY:${escapeIcsText(`Anniversary dinner at ${restaurantName}`)}`,
    `LOCATION:${escapeIcsText(location)}`,
    'DESCRIPTION:Our anniversary dinner',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const downloadUrl = URL.createObjectURL(new Blob([calendarEvent], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'anniversary-dinner-2026-11-22.ics';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

const steps = ['A little greeting', 'Pick our dinner', 'The details', 'A note for you', 'Our little film'];

export default function WelcomePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [step, setStep] = useState(0);
  const [restaurant, setRestaurant] = useState<string | null>(null);
  const [guestName] = useState('Judith Peñaflor');
  const [preferredTime] = useState('7:30 PM');
  const [dressCode, setDressCode] = useState('Dressy casual / elegant date night');
  const [specialNotes, setSpecialNotes] = useState('');
  const [choiceSent, setChoiceSent] = useState(false);
  const [choiceError, setChoiceError] = useState<string | null>(null);
  const [deliveryNotice, setDeliveryNotice] = useState<string | null>(null);
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
        body: JSON.stringify({
          restaurant,
          guestName,
          preferredTime,
          dressCode,
          specialNotes,
        }),
      });
      const result: {
        error?: string;
        sentCount?: number;
        hasFailures?: boolean;
      } = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your dinner choice.');
      setChoiceSent(true);
      setPreviewOnly(false);
      setDeliveryNotice(result.hasFailures
        ? 'Your dinner choice is saved. Email updates may be delayed, but I can’t wait for our special night.'
        : 'Your dinner choice is saved. I can’t wait for our special night.');
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
        <section className="relative z-10 w-full max-w-4xl animate-fade-in-up">
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
              <p className="mt-5 text-lg text-white/80">One year filled with love, endless memories — and still counting.</p>
              <p className="mt-3 text-sm leading-6 text-white/60">Thank you for every laugh, every little adventure, and for making ordinary days feel like something special. I’d choose you all over again.</p>
            </div>}

            {step === 1 && <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffb4c7]">A date with me?</p>
              <h1 className="mt-3 font-script text-5xl sm:text-6xl">Let me take you to dinner</h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/65">Choose where you’d love to celebrate our anniversary on November 22, 2026. I’ll take care of the rest.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {restaurantOptions.map((option) => {
                  const selected = restaurant === option.name;
                  return <button key={option.name} type="button" onClick={() => { setRestaurant(option.name); setChoiceSent(false); setChoiceError(null); setDeliveryNotice(null); }} aria-pressed={selected}
                    className={`relative overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-0.5 ${selected ? 'border-[#ffb4c7] bg-[#d96388]/25 shadow-[0_0_24px_rgba(217,99,136,.18)]' : 'border-white/15 bg-white/[0.04] hover:border-white/35'}`}>
                    <Image src={option.image} alt={`${option.name} dining atmosphere`} width={1200} height={600} sizes="(max-width: 640px) 100vw, 50vw" className="h-36 w-full object-cover" />
                    <span className="block p-4">
                      <span className="text-2xl" aria-hidden="true">{option.icon}</span>
                      <span className="mt-2 block pr-6 font-serif-display text-lg">{option.name}</span>
                      <span className="mt-1 block text-xs leading-5 text-white/55">{option.detail}</span>
                    </span>
                    {selected && <Check className="absolute right-4 top-4 h-4 w-4 text-[#ffb4c7]" />}
                  </button>;
                })}
              </div>
              {restaurant && (() => {
                const choice = restaurantOptions.find((option) => option.name === restaurant)!;
                return <div className="mt-5 rounded-2xl border border-white/15 bg-black/10 p-4 text-left sm:p-5">
                  <p className="font-serif-display text-lg">{choice.name}</p>
                  <p className="mt-1 text-xs text-white/60">Sunday, November 22, 2026</p>
                  <p className="mt-2 text-xs text-[#ffb4c7]">Add a few details so the dinner email feels personal and complete.</p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 text-left">
                      <Label htmlFor="guest-name" className="text-xs font-medium uppercase tracking-[0.2em] text-[#ffb4c7]">Guest</Label>
                      <div id="guest-name" className="flex h-11 items-center rounded-xl border border-white/15 bg-white/95 px-3 text-sm font-medium text-[#4d3744]">
                        {guestName}
                      </div>
                    </div>
                    <div className="space-y-2 text-left">
                      <Label htmlFor="preferred-time" className="text-xs font-medium uppercase tracking-[0.2em] text-[#ffb4c7]">Time</Label>
                      <div id="preferred-time" className="flex h-11 items-center rounded-xl border border-white/15 bg-white/95 px-3 text-sm font-medium text-[#4d3744]">
                        {preferredTime}
                      </div>
                    </div>
                    <div className="space-y-2 text-left sm:col-span-2">
                      <Label htmlFor="dress-code" className="text-xs font-medium uppercase tracking-[0.2em] text-[#ffb4c7]">Dress vibe</Label>
                      <Input id="dress-code" value={dressCode} onChange={(event) => setDressCode(event.target.value)} placeholder="Dressy casual / elegant date night" className="h-11 rounded-xl border-white/15 bg-white/95 text-[#4d3744] placeholder:text-[#8b7780]" />
                    </div>
                    <div className="space-y-2 text-left sm:col-span-2">
                      <Label htmlFor="special-notes" className="text-xs font-medium uppercase tracking-[0.2em] text-[#ffb4c7]">Notes for me</Label>
                      <Textarea id="special-notes" value={specialNotes} onChange={(event) => setSpecialNotes(event.target.value)} placeholder="Favorite food, surprise ideas, or anything I should know for the night" className="min-h-[90px] rounded-xl border-white/15 bg-white/95 text-[#4d3744] placeholder:text-[#8b7780]" />
                    </div>
                  </div>

                  <Button type="button" variant="secondary" size="sm" className="mt-4 rounded-lg bg-white/90 text-[#4d3744] hover:bg-white" onClick={() => downloadAnniversaryInvite(choice.name, choice.location)}>
                    <CalendarDays className="mr-2 h-4 w-4" />Add to calendar
                  </Button>
                  <a href={choice.locationUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs leading-5 text-white/75 underline decoration-white/30 underline-offset-4 hover:text-white">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />{choice.location}<ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  <div className="mt-4 rounded-xl bg-white/[0.06] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ffb4c7]">Menu</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">Browse the latest menu and prices for {choice.name}.</p>
                    <a href={choice.menuUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#ffb4c7] underline decoration-[#ffb4c7]/40 underline-offset-4 hover:text-white">
                      View menu<ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>;
              })()}
              {choiceError && <p role="alert" className="mt-4 text-sm text-[#ffb4c7]">{choiceError}</p>}
              {deliveryNotice && step === 1 && <p role="status" className="mt-4 text-sm text-[#ffb4c7]">{deliveryNotice}</p>}
              {previewOnly && <p role="status" className="mt-3 text-xs leading-5 text-white/55">Preview mode: this choice wasn’t emailed or saved. Configure Supabase and Resend to turn on notifications.</p>}
            </div>}

            {step === 2 && <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffb4c7]">A few little details</p>
              <h1 className="mt-3 font-script text-5xl sm:text-6xl">Your dinner invitation</h1>
              {deliveryNotice && <p role="status" className="mx-auto mt-5 max-w-lg rounded-xl border border-white/10 bg-black/10 p-4 text-left text-sm leading-6 text-white/75">{deliveryNotice}</p>}
              <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/10 bg-black/10 p-5 text-left sm:p-7">
                <p className="text-xs text-white/50">To: {guestName}</p>
                <p className="mt-1 text-xs text-white/50">Subject: Our anniversary dinner</p>
                <div className="my-5 border-t border-white/10" />
                <p className="font-script text-2xl text-[#ffb4c7]">Dear Judith,</p>
                <p className="mt-3 text-sm leading-7 text-white/80">I’d love to celebrate our anniversary with a special dinner together. Let’s dress up, enjoy a lovely evening, and make another beautiful memory. Here are our plans:</p>
                <div className="mt-5 space-y-2 rounded-xl bg-white/[0.06] p-4 text-sm leading-6 text-white/75">
                  <p><span className="font-semibold text-[#ffb4c7]">Date:</span> Sunday, November 22, 2026</p>
                  <p><span className="font-semibold text-[#ffb4c7]">Time:</span> 7:30 PM</p>
                  {restaurant && <p><span className="font-semibold text-[#ffb4c7]">Restaurant:</span> {restaurant}</p>}
                  {restaurant && <p><span className="font-semibold text-[#ffb4c7]">Location:</span> {restaurantOptions.find((option) => option.name === restaurant)?.location}</p>}
                  <p><span className="font-semibold text-[#ffb4c7]">Dress vibe:</span> {dressCode}</p>
                </div>
                <p className="mt-5 text-sm leading-7 text-white/80">I’ll take care of the reservation and let you know if there are any updates. I’m looking forward to spending this special night with you.</p>
                <p className="mt-5 text-sm text-white/70">With all my love,</p>
                <p className="mt-1 font-script text-2xl text-[#ffb4c7]">Lloydie ♡</p>
              </div>
            </div>}

            {step === 3 && <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#ffb4c7]">Just for you</p>
              <h1 className="mt-3 font-script text-5xl sm:text-6xl">A message from me</h1>
              <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/10 bg-black/10 p-5 text-left sm:p-7">
                <p className="font-script text-2xl text-[#ffb4c7]">My love,</p>
                <p className="mt-3 text-sm leading-7 text-white/80">Happy first anniversary. This year with you has given me so many moments I want to keep close. Thank you for being withme thru ups and down, when we both laugh, for making anywhere feel like home and safe. I love you, and I can’t wait for everything still ahead of us.</p>
                <p className="mt-5 font-script text-2xl text-[#ffb4c7]">Lloydie </p>
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
              {step < steps.length - 1 ? <Button onClick={step === 1 ? (choiceError ? () => { setPreviewOnly(true); setStep(2); } : continueFromRestaurant) : () => setStep((current) => current + 1)} disabled={(step === 1 && (!restaurant || sendingChoice || choiceSent))} className="rounded-xl bg-[#d96388] text-white hover:bg-[#e37699] disabled:opacity-40">{sendingChoice ? 'Sending…' : step === 1 ? (choiceSent ? 'Sent' : choiceError ? 'Continue preview' : 'Email my choice & continue') : 'Next'}<ArrowRight className="ml-2 h-4 w-4" /></Button> : <Button onClick={finish} className="rounded-xl bg-[#d96388] text-white hover:bg-[#e37699]">Explore our story<Sparkles className="ml-2 h-4 w-4" /></Button>}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-white/35">{steps.map((label, index) => <span key={label} className={index === step ? 'text-[#ffb4c7]' : ''}>{label}</span>)}</div>
        </section>
      )}
    </main>
  );
}
