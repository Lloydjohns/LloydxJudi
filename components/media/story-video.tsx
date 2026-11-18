'use client';

import { useEffect, useState, type VideoHTMLAttributes } from 'react';
import { resolveStoryMediaUrl } from '@/lib/story-media';

type StoryVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> & { src: string };

export function StoryVideo({ src, className, ...props }: StoryVideoProps) {
  const [resolvedUrl, setResolvedUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setResolvedUrl('');
    setError('');
    resolveStoryMediaUrl(src)
      .then((url) => {
        if (active) setResolvedUrl(url);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load this video.');
      });
    return () => { active = false; };
  }, [src]);

  if (error) return <p role="alert" className={className}>{error}</p>;
  if (!resolvedUrl) return <div role="status" className={className}>Loading video...</div>;
  return <video {...props} src={resolvedUrl} className={className} />;
}
