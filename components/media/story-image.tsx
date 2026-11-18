'use client';

import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { resolveStoryMediaUrl } from '@/lib/story-media';

type StoryImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { src: string };

export function StoryImage({ src, alt, className, ...props }: StoryImageProps) {
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
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load this image.');
      });
    return () => { active = false; };
  }, [src]);

  if (error) {
    return <div role="img" aria-label={`${alt}: ${error}`} className={className}>{error}</div>;
  }
  if (!resolvedUrl) {
    return <div role="img" aria-label={`Loading ${alt}`} className={className} />;
  }
  return <img {...props} src={resolvedUrl} alt={alt} className={className} />;
}
