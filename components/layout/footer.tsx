import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-blush/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <span className="font-serif-display text-lg font-semibold">Our Story</span>
          </div>
          <p className="text-sm text-muted-foreground">
            A private world for two, built with love.
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground sm:text-left">
          Demo mode. Authentication and data persistence arrive in Milestone 2.
        </p>
      </div>
    </footer>
  );
}
