export interface Couple {
  id: string;
  name: string;
  anniversaryDate: string;
  createdBy: string;
  createdAt: string;
}

export interface Chapter {
  id: string;
  coupleId: string;
  monthNumber: number;
  title: string;
  intro: string;
  coverImage: string | null;
  monthlyLetter: string | null;
  revealAt: string | null;
  createdAt: string;
}

export interface Memory {
  id: string;
  coupleId: string;
  chapterId: string;
  chapterName?: string;
  title: string;
  memoryDate: string;
  story: string;
  imagePath: string | null;
  videoPath?: string | null;
  location: string | null;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoveLetter {
  id: string;
  coupleId: string;
  title: string;
  body: string;
  recipientUserId: string | null;
  revealAt: string | null;
  createdBy: string;
  createdAt: string;
}

export interface SpecialDate {
  id: string;
  coupleId: string;
  title: string;
  eventDate: string;
  notes: string | null;
  createdBy: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  eventDate: string;
  story: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TrackSourceType = 'file' | 'spotify' | 'youtube' | 'soundcloud';

export interface PlaylistTrack {
  id: string;
  coupleId: string;
  position: number;
  title: string;
  artist: string;
  sourceType: TrackSourceType;
  sourceUrl: string;
  coverImage: string | null;
  createdAt: string;
}

export interface CoupleMember {
  coupleId: string;
  userId: string;
  role: 'owner' | 'partner';
  joinedAt: string;
}
