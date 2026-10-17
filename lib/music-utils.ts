export function getYouTubeVideoId(sourceUrl: string): string | null {
  try {
    const url = new URL(sourceUrl);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1) || null;
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v');
      if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || null;
      if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || null;
    }
  } catch {
    return null;
  }
  return null;
}

export function getYouTubeAudioEmbedUrl(sourceUrl: string): string | null {
  const videoId = getYouTubeVideoId(sourceUrl);
  if (!videoId) return null;
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    showinfo: '0',
    enablejsapi: '1',
    modestbranding: '1',
    playsinline: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function isSupportedYouTubeUrl(sourceUrl: string): boolean {
  return Boolean(getYouTubeVideoId(sourceUrl));
}
