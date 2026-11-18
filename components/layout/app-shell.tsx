'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Footer } from './footer';
import { Navbar } from './navbar';
import { Button } from '@/components/ui/button';
import { getSupabaseBrowserClient } from '@/lib/supabase-client';
import { syncLocalStoryData } from '@/lib/story-cloud';

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const verifyAccount = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!data.user) {
          router.replace('/auth/sign-in');
          return;
        }
        await syncLocalStoryData();
        if (active) setReady(true);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not connect to your account.');
      }
    };
    void verifyAccount();
    return () => { active = false; };
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8f7] px-4">
        {error ? (
          <div className="max-w-lg rounded-xl border border-destructive/30 bg-white p-6 text-center shadow-soft">
            <p role="alert" className="text-sm text-destructive">{error}</p>
            <Button asChild className="mt-4"><Link href="/auth/sign-in">Go to sign in</Link></Button>
          </div>
        ) : <p className="text-sm text-muted-foreground">Connecting to your shared story...</p>}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-24">{children}</main>
      <Footer />
    </div>
  );
}
