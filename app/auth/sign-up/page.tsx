'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Mail, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { syncLocalStoryData } from '@/lib/story-cloud';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/sign-in`,
        },
      });
      if (signUpError) throw signUpError;
      if (!data.session) {
        setMessage('Check your email to confirm the account, then sign in on each device.');
        setLoading(false);
        return;
      }
      await syncLocalStoryData();
      router.replace('/home');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create your account.');
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
              <CardTitle className="font-serif-display text-3xl">Begin Your Story</CardTitle>
              <CardDescription className="mt-2">Create an account to start your private world for two.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 border-primary/20"
                    placeholder="Lloyd"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 border-primary/20"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 border-primary/20"
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                  />
                </div>
              </div>
              {error && <p role="alert" className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
              {message && <p role="status" className="flex items-start gap-2 text-sm text-primary"><Mail className="mt-0.5 h-4 w-4 shrink-0" />{message}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-wine text-primary-foreground hover:opacity-90 shadow-soft"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Already have an account?</span>
              <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Use this same account to sign in on your laptop, computer, and phone.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
