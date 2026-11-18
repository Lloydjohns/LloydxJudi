'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { unlockSharedStory } from '@/lib/story-access';

export default function AccessPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await unlockSharedStory(accessCode);
      router.replace('/home');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not unlock the shared story.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <Card className="border-primary/20 shadow-romantic bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-wine shadow-soft">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>
            <div>
              <CardTitle className="font-serif-display text-3xl">Our Private Story</CardTitle>
              <CardDescription className="mt-2">Enter our shared access code to continue.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="access-code" className="text-sm font-medium">Shared access code</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="access-code"
                    type="password"
                    autoComplete="current-password"
                    value={accessCode}
                    onChange={(event) => setAccessCode(event.target.value)}
                    className="pl-9 border-primary/20"
                    placeholder="Enter the code"
                    required
                  />
                </div>
              </div>
              {error && <p role="alert" className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-wine text-primary-foreground hover:opacity-90 shadow-soft"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Unlocking our story...' : 'Unlock Our Story'}
              </Button>
            </form>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Use the same access code on each device to open your shared story.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
