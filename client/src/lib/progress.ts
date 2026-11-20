// "Continue Watching" positions, kept in this browser's localStorage
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'netflix_progress';
const CHANGE_EVENT = 'netflix-progress-change';
const MAX_ENTRIES = 20;

export interface ProgressEntry {
  key: string;
  href: string;
  title: string;
  posterUrl: string | null;
  position: number;
  duration: number;
  updatedAt: number;
}

function readRaw(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function parse(raw: string): ProgressEntry[] {
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function getProgress(key: string): ProgressEntry | undefined {
  return parse(readRaw()).find((entry) => entry.key === key);
}

export function saveProgress(entry: Omit<ProgressEntry, 'updatedAt'>) {
  const others = parse(readRaw()).filter((e) => e.key !== entry.key);
  // Drop titles that are basically finished so they leave the row
  const finished = entry.duration > 0 && entry.position / entry.duration > 0.95;
  const next = finished ? others : [{ ...entry, updatedAt: Date.now() }, ...others];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, MAX_ENTRIES)));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage can be unavailable (private mode, full quota); progress just isn't saved
  }
}

// useSyncExternalStore needs a stable snapshot, so the parsed list is cached by its raw string
let cachedRaw = '';
let cachedList: ProgressEntry[] = [];
const emptyList: ProgressEntry[] = [];

function getSnapshot() {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parse(raw).filter((e) => e.position > 30);
  }
  return cachedList;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function useContinueWatching() {
  return useSyncExternalStore(subscribe, getSnapshot, () => emptyList);
}
