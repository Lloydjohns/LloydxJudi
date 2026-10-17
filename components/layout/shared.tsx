import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeartDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 py-4', className)}>
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/30" />
      <Heart className="h-4 w-4 text-primary/40 fill-primary/20" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  center = true,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'text-center' : ''}>
      <h2 className="font-serif-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-muted-foreground text-base sm:text-lg">{subtitle}</p>
      )}
      {center && <HeartDivider className="py-3" />}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h3 className="font-serif-display text-xl font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
