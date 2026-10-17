import type { Memory, Chapter, SpecialDate, PlaylistTrack } from './types';
import { getChapterTitle } from './date-utils';

export const DEMO_ANNIVERSARY_DATE = '2025-11-23';
export const DEMO_COUPLE_NAME = 'Lloyd & Judi';

export const demoMemories: Memory[] = [
  {
    id: 'mem-1',
    coupleId: 'demo',
    chapterId: 'ch-1',
    title: 'The Day We Met',
    memoryDate: '2025-11-23',
    story:
      'It was a cold February evening when our paths crossed for the first time. Neither of us knew that this single moment would change everything. You smiled at me from across the room, and I felt like the whole world slowed down just for us.',
    imagePath:
      'https://images.pexels.com/photos/1024963/pexels-photo-1024963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Downtown Cafe',
    tags: ['milestone', 'first-date'],
    createdBy: 'demo',
    createdAt: '2025-11-23T20:00:00Z',
    updatedAt: '2025-11-23T20:00:00Z',
  },
  {
    id: 'mem-2',
    coupleId: 'demo',
    chapterId: 'ch-1',
    title: 'Our First Walk Together',
    memoryDate: '2024-02-20',
    story:
      'We walked along the beach, talking for hours about everything and nothing. The sunset painted the sky in shades of pink and gold, and I remember thinking I never wanted this moment to end.',
    imagePath:
      'https://images.pexels.com/photos/17929227/pexels-photo-17929227.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Sunset Beach',
    tags: ['travel', 'milestone'],
    createdBy: 'demo',
    createdAt: '2024-02-20T19:00:00Z',
    updatedAt: '2024-02-20T19:00:00Z',
  },
  {
    id: 'mem-3',
    coupleId: 'demo',
    chapterId: 'ch-2',
    title: 'Dinner by Candlelight',
    memoryDate: '2024-03-08',
    story:
      'You surprised me with a candlelit dinner at home. You had cooked my favorite meal, set the table with flowers you picked yourself, and played our song on the speaker. I fell in love with you all over again that night.',
    imagePath:
      'https://images.pexels.com/photos/6288706/pexels-photo-6288706.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Home',
    tags: ['milestone', 'funny'],
    createdBy: 'demo',
    createdAt: '2024-03-08T21:00:00Z',
    updatedAt: '2024-03-08T21:00:00Z',
  },
  {
    id: 'mem-4',
    coupleId: 'demo',
    chapterId: 'ch-3',
    title: 'Our First Trip Together',
    memoryDate: '2024-04-12',
    story:
      'We packed our bags and explored the city for the first time as a couple. Every corner held a new adventure, every street a new memory. You navigated us through winding alleys and hidden cafes, and I followed happily, knowing anywhere with you was home.',
    imagePath:
      'https://images.pexels.com/photos/7968592/pexels-photo-7968592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Old Town',
    tags: ['travel', 'milestone'],
    createdBy: 'demo',
    createdAt: '2024-04-12T18:00:00Z',
    updatedAt: '2024-04-12T18:00:00Z',
  },
  {
    id: 'mem-5',
    coupleId: 'demo',
    chapterId: 'ch-4',
    title: 'Conquering the Mountain',
    memoryDate: '2024-05-18',
    story:
      'We hiked to the top of the mountain together. You held my hand the entire way up, never once letting me feel like I could not make it. When we reached the summit and looked out at the valley below, I knew there was no one else I would rather face the world with.',
    imagePath:
      'https://images.pexels.com/photos/4763005/pexels-photo-4763005.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Blue Ridge Mountains',
    tags: ['travel', 'milestone'],
    createdBy: 'demo',
    createdAt: '2024-05-18T16:00:00Z',
    updatedAt: '2024-05-18T16:00:00Z',
  },
  {
    id: 'mem-6',
    coupleId: 'demo',
    chapterId: 'ch-5',
    title: 'The Unexpected Gift',
    memoryDate: '2024-06-03',
    story:
      'You came home with a bouquet of pink flowers for no reason at all. When I asked what the occasion was, you simply said, "Just because it is Tuesday, and I love you." It is the small, unexpected gestures that make me fall for you more each day.',
    imagePath:
      'https://images.pexels.com/photos/39219356/pexels-photo-39219356.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Home',
    tags: ['milestone'],
    createdBy: 'demo',
    createdAt: '2024-06-03T17:30:00Z',
    updatedAt: '2024-06-03T17:30:00Z',
  },
  {
    id: 'mem-7',
    coupleId: 'demo',
    chapterId: 'ch-6',
    title: 'Laughter in the Rain',
    memoryDate: '2024-07-15',
    story:
      'We got caught in a sudden downpour on our way to the restaurant. Instead of running for cover, you started dancing in the rain, pulling me in, spinning me around. We were soaked to the bone, laughing so hard we could barely breathe. It was the best dinner we never had.',
    imagePath:
      'https://images.pexels.com/photos/4778607/pexels-photo-4778607.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'City Center',
    tags: ['funny'],
    createdBy: 'demo',
    createdAt: '2024-07-15T20:00:00Z',
    updatedAt: '2024-07-15T20:00:00Z',
  },
  {
    id: 'mem-8',
    coupleId: 'demo',
    chapterId: 'ch-7',
    title: 'Sunset Embrace',
    memoryDate: '2024-08-22',
    story:
      'We found a quiet spot on the hill overlooking the city. As the sun dipped below the horizon, you pulled me close and whispered the most beautiful words I have ever heard. The sky blazed in shades of rose and amber, as if the universe itself was celebrating us.',
    imagePath:
      'https://images.pexels.com/photos/20339544/pexels-photo-20339544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Sunset Hill',
    tags: ['milestone', 'travel'],
    createdBy: 'demo',
    createdAt: '2024-08-22T19:30:00Z',
    updatedAt: '2024-08-22T19:30:00Z',
  },
  {
    id: 'mem-9',
    coupleId: 'demo',
    chapterId: 'ch-8',
    title: 'Hands Intertwined',
    memoryDate: '2024-09-10',
    story:
      'A quiet afternoon at the beach, just the two of us. No grand plans, no special occasion, just the warmth of your hand in mine and the sound of the waves. These are the moments I treasure the most, the ones where nothing happens and everything matters.',
    imagePath:
      'https://images.pexels.com/photos/7233077/pexels-photo-7233077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Crescent Bay',
    tags: ['milestone'],
    createdBy: 'demo',
    createdAt: '2024-09-10T15:00:00Z',
    updatedAt: '2024-09-10T15:00:00Z',
  },
  {
    id: 'mem-10',
    coupleId: 'demo',
    chapterId: 'ch-9',
    title: 'City Lights and You',
    memoryDate: '2024-10-05',
    story:
      'We wandered through the city at night, taking in the lights, the sounds, the energy. You pulled me into a photo booth and we made the silliest faces. Those four tiny strips of paper now sit on my nightstand, a reminder of the happiest version of myself.',
    imagePath:
      'https://images.pexels.com/photos/7968964/pexels-photo-7968964.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Downtown',
    tags: ['travel', 'funny'],
    createdBy: 'demo',
    createdAt: '2024-10-05T21:00:00Z',
    updatedAt: '2024-10-05T21:00:00Z',
  },
];

export function getDemoChapters(anniversaryDate: Date): Chapter[] {
  const totalChapters = 12;
  const chapters: Chapter[] = [];
  for (let i = 1; i <= totalChapters; i++) {
    const chapterMemories = demoMemories.filter((m) => m.chapterId === `ch-${i}`);
    const coverImage = chapterMemories[0]?.imagePath || null;
    chapters.push({
      id: `ch-${i}`,
      coupleId: 'demo',
      monthNumber: i,
      title: getChapterTitle(i),
      intro:
        i === 1
          ? 'Where it all began. The first chapter of our story, filled with firsts and butterflies.'
          : i === 2
            ? 'We started finding our rhythm, learning the little things about each other.'
            : i === 3
              ? 'Deeper connections and the comfort of knowing this was something special.'
              : `Chapter ${i} of our ongoing adventure together.`,
      coverImage,
      monthlyLetter: i <= 3 ? getDemoLetter(i) : null,
      revealAt: null,
      createdAt: anniversaryDate.toISOString(),
    });
  }
  return chapters;
}

function getDemoLetter(month: number): string {
  const letters: Record<number, string> = {
    1: 'My dearest,\n\nThis first month has been nothing short of magical. Every moment with you feels like a dream I never want to wake from. You have brought so much light into my life, and I cannot wait to see where this journey takes us.\n\nForever yours,\nMe',
    2: 'My love,\n\nTwo months in, and I am more certain than ever that we are something special. The way you laugh at my jokes, the way you hold my hand without thinking, the way you make even the most ordinary days feel extraordinary. You are my favorite person.\n\nYours always,\nMe',
    3: 'My darling,\n\nThree months have passed, and I find myself falling deeper every day. You have seen my imperfections and loved me harder for them. I could not ask for a better partner in this beautiful chaos we call life.\n\nWith all my heart,\nMe',
  };
  return letters[month] || '';
}

export const demoSpecialDates: SpecialDate[] = [
  {
    id: 'sd-1',
    coupleId: 'demo',
    title: 'Our Anniversary',
    eventDate: '2025-11-23',
    notes: 'The day our story began.',
    createdBy: 'demo',
    createdAt: '2025-11-23T00:00:00Z',
  },
  {
    id: 'sd-2',
    coupleId: 'demo',
    title: "Lloyd's Birthday",
    eventDate: '1999-07-22',
    notes: 'The day my favorite person entered the world.',
    createdBy: 'demo',
    createdAt: '2025-11-23T00:00:00Z',
  },
  {
    id: 'sd-3',
    coupleId: 'demo',
    title: "Judi's Birthday",
    eventDate: '2003-04-21',
    notes: 'The day the love of my life was born.',
    createdBy: 'demo',
    createdAt: '2025-11-23T00:00:00Z',
  },
  {
    id: 'sd-4',
    coupleId: 'demo',
    title: 'Our First Trip',
    eventDate: '2024-04-12',
    notes: 'Old Town adventure.',
    createdBy: 'demo',
    createdAt: '2025-11-23T00:00:00Z',
  },
];

const romanticSongs: Array<{ title: string; artist: string; sourceUrl: string }> = [
  { title: 'Perfect', artist: 'Ed Sheeran', sourceUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g' },
  { title: 'All of Me', artist: 'John Legend', sourceUrl: 'https://www.youtube.com/watch?v=450p7goxZqg' },
  { title: 'A Thousand Years', artist: 'Christina Perri', sourceUrl: 'https://www.youtube.com/watch?v=rtOvBOTyX00' },
  { title: "Can't Help Falling in Love", artist: 'Elvis Presley', sourceUrl: 'https://www.youtube.com/watch?v=vGJTaP6anOU' },
  { title: 'Thinking Out Loud', artist: 'Ed Sheeran', sourceUrl: 'https://www.youtube.com/watch?v=lp-EO5I60KA' },
  { title: 'Make You Feel My Love', artist: 'Adele', sourceUrl: 'https://www.youtube.com/watch?v=0put0_a--Ng' },
  { title: 'Lover', artist: 'Taylor Swift', sourceUrl: 'https://www.youtube.com/watch?v=-BjZmE2gtdo' },
  { title: 'At Last', artist: 'Etta James', sourceUrl: 'https://www.youtube.com/watch?v=1qJU8G7gR_g' },
  { title: 'Just the Way You Are', artist: 'Bruno Mars', sourceUrl: 'https://www.youtube.com/watch?v=LQ54WQr3G1E' },
  { title: 'Marry You', artist: 'Bruno Mars', sourceUrl: 'https://www.youtube.com/watch?v=4ivHu2q1oP0' },
  { title: 'I Will Always Love You', artist: 'Whitney Houston', sourceUrl: 'https://www.youtube.com/watch?v=3JWTkaa7sYw' },
  { title: 'You Are the Best Thing', artist: 'Ray LaMontagne', sourceUrl: 'https://www.youtube.com/watch?v=A5rFKOyYp7M' },
];

export const demoPlaylistTracks: PlaylistTrack[] = romanticSongs.map((song, index) => ({
  id: `pt-${index + 1}`,
  coupleId: 'demo',
  position: index + 1,
  title: song.title,
  artist: song.artist,
  sourceType: 'youtube' as const,
  sourceUrl: song.sourceUrl,
  coverImage: null,
  createdAt: new Date().toISOString(),
}));
