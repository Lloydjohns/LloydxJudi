import { demoMemories, getDemoChapters } from '@/lib/demo-data';
import type { Chapter, Memory, TimelineChapterOverride } from '@/lib/types';

export type TimelineChapter = Chapter & Partial<Pick<TimelineChapterOverride, 'startDate' | 'endDate'>>;

export function getTimelineChapters(
  anniversaryDate: Date,
  overrides: TimelineChapterOverride[] = [],
  memories: Memory[] = demoMemories
): TimelineChapter[] {
  const baseChapters = getDemoChapters(anniversaryDate);
  const chapters: TimelineChapter[] = baseChapters.map((chapter) => {
    const override = overrides.find((item) => item.chapterId === chapter.id);
    if (override) return { ...chapter, ...override };
    const coverImage = memories.find((memory) => memory.chapterId === chapter.id)?.imagePath ?? null;
    return { ...chapter, coverImage };
  });
  const knownChapterIds = new Set(baseChapters.map((chapter) => chapter.id));

  for (const override of overrides) {
    if (knownChapterIds.has(override.chapterId)) continue;
    const idMonthNumber = Number(/^ch-(\d+)$/.exec(override.chapterId)?.[1]);
    const monthNumber = override.monthNumber ?? idMonthNumber;
    if (!Number.isInteger(monthNumber) || monthNumber <= baseChapters.length || override.chapterId !== `ch-${monthNumber}`) continue;

    chapters.push({
      id: override.chapterId,
      coupleId: 'demo',
      monthNumber,
      title: override.title,
      intro: override.intro,
      coverImage: override.coverImage,
      monthlyLetter: override.monthlyLetter,
      revealAt: null,
      createdAt: anniversaryDate.toISOString(),
      startDate: override.startDate,
      endDate: override.endDate,
    });
  }

  return chapters.sort((a, b) => a.monthNumber - b.monthNumber);
}
