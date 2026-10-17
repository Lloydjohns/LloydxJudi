import { differenceInDays, differenceInMonths, addMonths, format, isAfter, parseISO } from 'date-fns';

export function getMonthsTogether(anniversaryDate: Date, referenceDate: Date = new Date()): number {
  if (isAfter(anniversaryDate, referenceDate)) return 0;
  return Math.max(0, differenceInMonths(referenceDate, anniversaryDate));
}

export function getDaysTogether(anniversaryDate: Date, referenceDate: Date = new Date()): number {
  if (isAfter(anniversaryDate, referenceDate)) return 0;
  return differenceInDays(referenceDate, anniversaryDate);
}

export function getNextAnniversary(anniversaryDate: Date, referenceDate: Date = new Date()): Date {
  const ref = referenceDate;
  let next = new Date(anniversaryDate.getFullYear(), ref.getMonth(), anniversaryDate.getDate());

  if (anniversaryDate.getDate() > 28) {
    const testMonth = ref.getMonth();
    const testDate = new Date(anniversaryDate.getFullYear(), testMonth + 1, 0);
    if (testDate.getDate() < anniversaryDate.getDate()) {
      next = testDate;
    }
  }

  if (!isAfter(next, ref)) {
    next = addMonths(next, 1);
  }

  return next;
}

export function getDaysUntilNextAnniversary(anniversaryDate: Date, referenceDate: Date = new Date()): number {
  const next = getNextAnniversary(anniversaryDate, referenceDate);
  return differenceInDays(next, referenceDate);
}

export function getChapterStartDate(anniversaryDate: Date, monthNumber: number): Date {
  if (monthNumber <= 1) return new Date(anniversaryDate);
  const base = addMonths(anniversaryDate, monthNumber - 1);
  return base;
}

export function getChapterEndDate(anniversaryDate: Date, monthNumber: number): Date {
  return addMonths(getChapterStartDate(anniversaryDate, monthNumber), 1);
}

export function getTotalChapters(anniversaryDate: Date, referenceDate: Date = new Date()): number {
  return getMonthsTogether(anniversaryDate, referenceDate) + 1;
}

export function formatChapterDateRange(anniversaryDate: Date, monthNumber: number): string {
  const start = getChapterStartDate(anniversaryDate, monthNumber);
  const end = new Date(getChapterEndDate(anniversaryDate, monthNumber).getTime() - 86400000);
  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
}

export function getChapterTitle(monthNumber: number): string {
  const titles = [
    'The Beginning',
    'Getting to Know You',
    'Falling Deeper',
    'Finding Our Rhythm',
    'Growing Together',
    'Settling In',
    'Adventures Begin',
    'Deepening Bonds',
    'New Discoveries',
    'Hearts Entwined',
    'Seasons of Us',
    'A Year of Love',
    'Continuing the Journey',
    'Stronger Together',
    'Unbreakable Bond',
    'Love in Bloom',
    'Beautiful Routines',
    'Milestones and Memories',
    'Ever After',
    'Forever and Always',
    'Still Growing',
    'Endless Joy',
    'Our Perfect Chaos',
    'Treasuring Each Day',
  ];
  if (monthNumber <= titles.length) return titles[monthNumber - 1];
  return `Month ${monthNumber}`;
}

export function isChapterUnlocked(anniversaryDate: Date, monthNumber: number, referenceDate: Date = new Date()): boolean {
  const chapterStart = getChapterStartDate(anniversaryDate, monthNumber);
  return !isAfter(chapterStart, referenceDate);
}

export function parseDateSafe(dateStr: string): Date | null {
  try {
    const d = parseISO(dateStr);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
}
