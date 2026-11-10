export function loadLocalList<T>(key: string, fallback: T[]): T[] {
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value as T[] : fallback;
  } catch {
    return fallback;
  }
}

export function saveLocalList<T>(key: string, value: T[]): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function makeLocalId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
