import type { Memory, Chapter, SpecialDate, PlaylistTrack } from './types';
import { getChapterTitle } from './date-utils';

export const DEMO_ANNIVERSARY_DATE = '2025-11-23';
export const DEMO_COUPLE_NAME = 'Bebi';

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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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
      'https://ik.imagekit.io/xui68oltcf/Bebi/Messenger_creation_DA10D127-4CD2-48D6-BDF1-6DA20BFEEAAC.jpeg?updatedAt=1794319102789',
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

const romanticSongs: Array<{ title: string; artist: string; mood: string; sourceUrl: string }> = [
  { title: 'Those Eyes', artist: 'New West', mood: 'Sweet, romantic', sourceUrl: 'https://www.youtube.com/watch?v=CPh_YsRhILc' },
  { title: 'Glue Song', artist: 'beabadoobee', mood: 'Cute, innocent love', sourceUrl: 'https://www.youtube.com/watch?v=y1cBhJLNNXU' },
  { title: 'Until I Found You', artist: 'Stephen Sanchez', mood: 'Deep romance', sourceUrl: 'https://www.youtube.com/watch?v=GxldQ9eX2wo' },
  { title: 'Beautiful Things', artist: 'Benson Boone', mood: 'Cherishing someone', sourceUrl: 'https://www.youtube.com/watch?v=HU08BcK5SUY' },
  { title: 'Daylight', artist: 'Taylor Swift', mood: 'Being deeply in love', sourceUrl: 'https://www.youtube.com/watch?v=u9raS7-NisU' },
  { title: 'I Like Me Better', artist: 'Lauv', mood: 'Young love', sourceUrl: 'https://www.youtube.com/watch?v=a7fzkqLozwA' },
  { title: 'Double Take', artist: 'dhruv', mood: 'Crush', sourceUrl: 'https://www.youtube.com/watch?v=myh5xtfUG-I' },
  { title: 'Every Summertime', artist: 'NIKI', mood: 'Summer romance', sourceUrl: 'https://www.youtube.com/watch?v=OXtZfPZIex4' },
  { title: 'Lover', artist: 'Taylor Swift', mood: 'Forever love', sourceUrl: 'https://www.youtube.com/watch?v=cvUAzpn48xA' },
  { title: 'Best Part', artist: 'Daniel Caesar ft. H.E.R.', mood: 'Intimate romance', sourceUrl: 'https://www.youtube.com/watch?v=vBy7FaapGRo' },
  { title: 'Until I Found You (Em Beihold Version)', artist: 'Stephen Sanchez & Em Beihold', mood: 'Dreamy', sourceUrl: 'https://www.youtube.com/watch?v=kPlSyYtE63M' },
  { title: 'Snooze', artist: 'SZA', mood: 'Devoted love', sourceUrl: 'https://www.youtube.com/watch?v=Sv5yCzPCkv8' },
];

export const demoPlaylistTracks: PlaylistTrack[] = romanticSongs.map((song, index) => ({
  id: `pt-${index + 1}`,
  coupleId: 'demo',
  position: index + 1,
  title: song.title,
  artist: song.artist,
  mood: song.mood,
  sourceType: 'youtube' as const,
  sourceUrl: song.sourceUrl,
  coverImage: null,
  createdAt: new Date().toISOString(),
}));
