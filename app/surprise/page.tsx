'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Calendar, MapPin, ArrowRight, Heart } from 'lucide-react';
import { demoMemories } from '@/lib/demo-data';
import { format } from 'date-fns';
import type { Memory } from '@/lib/types';
import { loadCloudValue, STORY_COLLECTION_KEYS } from '@/lib/story-cloud';
import { StoryImage } from '@/components/media/story-image';

export default function SurprisePage() {
  const [memories, setMemories] = useState<Memory[]>(demoMemories);
  const [randomMemory, setRandomMemory] = useState<Memory | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    loadCloudValue<Memory[]>(STORY_COLLECTION_KEYS.memories, demoMemories)
      .then((savedMemories) => { if (active) setMemories(savedMemories); })
      .catch((cause: unknown) => {
        if (!active) return;
        setMemories([]);
        setLoadError(cause instanceof Error ? cause.message : 'Could not load your memories.');
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const revealSurprise = () => {
    if (!memories.length) return;
    setIsRevealing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * memories.length);
      setRandomMemory(memories[randomIndex]);
      setIsRevealing(false);
    }, 800);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-wine shadow-soft animate-pulse-soft">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-4 font-serif-display text-4xl font-semibold text-gradient-rose">
            Surprise Memory
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Let fate choose a memory from your story to revisit.
          </p>
        </div>

        <div className="mt-10">
          {loadError && <p role="alert" className="mb-4 text-center text-sm text-destructive">{loadError}</p>}
          {!randomMemory && !isRevealing && (
            <Card className="border-primary/15 shadow-soft bg-blush/20">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-6">
                  <Heart className="h-12 w-12 text-primary/40 fill-primary/20" />
                  <p className="text-base text-muted-foreground max-w-sm">
                    Your surprise memory is waiting. Tap below to reveal a random moment from your story.
                  </p>
                  <Button
                    onClick={revealSurprise}
                    size="lg"
                    className="bg-gradient-wine text-primary-foreground hover:opacity-90 shadow-soft"
                    disabled={isLoading || memories.length === 0}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {isLoading ? 'Loading memories...' : memories.length ? 'Reveal Surprise' : 'No memories yet'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isRevealing && (
            <Card className="border-primary/15 shadow-romantic">
              <CardContent className="p-16 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Sparkles className="h-16 w-16 text-primary animate-pulse" />
                  </div>
                  <p className="font-serif-display text-xl text-primary animate-pulse-soft">
                    Finding your moment...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {randomMemory && !isRevealing && (
            <div className="animate-fade-in-up">
              <Card className="border-primary/20 shadow-romantic overflow-hidden">
                {randomMemory.imagePath && (
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <StoryImage src={randomMemory.imagePath} alt={randomMemory.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary/90 text-primary-foreground">
                        <Sparkles className="h-3 w-3 mr-1" /> Surprise
                      </Badge>
                    </div>
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <h2 className="font-serif-display text-2xl font-semibold">
                      {randomMemory.title}
                    </h2>
                    <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(randomMemory.memoryDate), 'MMMM d, yyyy')}
                    </p>
                    {randomMemory.location && (
                      <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {randomMemory.location}
                      </p>
                    )}
                  </div>

                  <p className="text-base leading-relaxed text-foreground/90">
                    {randomMemory.story}
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {randomMemory.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="capitalize">
                        {tag.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button asChild variant="outline">
                      <Link href={`/memories/${randomMemory.id}`}>
                        Read full story <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button onClick={revealSurprise} variant="ghost">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reveal another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
