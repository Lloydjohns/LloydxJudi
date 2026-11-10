import { differenceInCalendarDays, differenceInMonths, addMonths, format, isAfter, parseISO } from 'date-fns';

export function getMonthsTogether(anniversaryDate: Date, referenceDate: Date = new Date()): number {
  if (isAfter(anniversaryDate, referenceDate)) return 0;
  return Math.max(0, differenceInMonths(referenceDate, anniversaryDate));
}

export function getDaysTogether(anniversaryDate: Date, referenceDate: Date = new Date()): number {
  if (isAfter(anniversaryDate, referenceDate)) return 0;
  return differenceInCalendarDays(referenceDate, anniversaryDate);
}

export function getNextAnniversary(anniversaryDate: Date, referenceDate: Date = new Date()): Date {
  const month = anniversaryDate.getMonth();
  const day = anniversaryDate.getDate();
  const makeAnniversary = (year: number) =>
    new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()));

  const thisYear = makeAnniversary(referenceDate.getFullYear());
  if (differenceInCalendarDays(thisYear, referenceDate) >= 0) return thisYear;
  return makeAnniversary(referenceDate.getFullYear() + 1);
}

export function getDaysUntilNextAnniversary(anniversaryDate: Date, referenceDate: Date = new Date()): number {
  const next = getNextAnniversary(anniversaryDate, referenceDate);
  return differenceInCalendarDays(next, referenceDate);
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
