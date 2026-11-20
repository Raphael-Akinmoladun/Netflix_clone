import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CATALOG, CATALOG_BY_ID, type CatalogEntry } from './classics.catalog.js';

const ARCHIVE_BASE = 'https://archive.org';
const CACHE_TTL_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 20_000;

export type ClassicCategory = keyof typeof CATALOG;

export interface ClassicSummary {
  id: string;
  title: string;
  year: number | null;
  posterUrl: string;
}

export interface ClassicDetails extends ClassicSummary {
  overview: string;
  videoUrl: string;
  runtimeMinutes: number | null;
}

interface ArchiveFile {
  name: string;
  format?: string;
  size?: string;
  length?: string;
}

@Injectable()
export class ArchiveService {
  private cache = new Map<string, { expires: number; value: unknown }>();

  getCategory(category: ClassicCategory): ClassicSummary[] {
    return CATALOG[category].map((e) => this.toSummary(e));
  }

  // Only catalog titles can be played, so nothing outside the hand-picked list is reachable
  async getDetails(id: string): Promise<ClassicDetails> {
    const catalogEntry = CATALOG_BY_ID.get(id);
    if (!catalogEntry) {
      throw new NotFoundException('Title not found');
    }

    return this.cached(`details:${id}`, async () => {
      const data = await this.request<{
        metadata?: { description?: string | string[] };
        files?: ArchiveFile[];
      }>(new URL(`${ARCHIVE_BASE}/metadata/${encodeURIComponent(id)}`));

      const video = this.pickVideo(data.files ?? []);
      if (!video) {
        throw new NotFoundException('No playable video for this title');
      }

      const description = data.metadata?.description ?? '';
      return {
        ...this.toSummary(catalogEntry),
        overview: this.stripHtml(Array.isArray(description) ? description.join(' ') : description),
        videoUrl: `${ARCHIVE_BASE}/download/${encodeURIComponent(id)}/${video.name
          .split('/')
          .map(encodeURIComponent)
          .join('/')}`,
        runtimeMinutes: this.toMinutes(video.length),
      };
    });
  }

  private toSummary(e: CatalogEntry): ClassicSummary {
    return {
      id: e.id,
      title: e.title,
      year: e.year,
      posterUrl: `${ARCHIVE_BASE}/services/img/${encodeURIComponent(e.id)}`,
    };
  }

  // Prefer full-quality H.264, then MPEG4, skipping small "ipod"/preview encodes when possible
  private pickVideo(files: ArchiveFile[]): ArchiveFile | undefined {
    const mp4s = files.filter((f) => f.name.toLowerCase().endsWith('.mp4'));
    const rank = (f: ArchiveFile) => {
      const format = (f.format ?? '').toLowerCase();
      if (format === 'h.264') return 0;
      if (format === 'mpeg4') return 1;
      if (format.includes('mpeg4')) return 2;
      return 3;
    };
    return mp4s.sort((a, b) => rank(a) - rank(b) || Number(b.size ?? 0) - Number(a.size ?? 0))[0];
  }

  // File lengths come as seconds ("5400.03") or as "01:30:00"
  private toMinutes(length?: string): number | null {
    if (!length) return null;
    const seconds = length.includes(':')
      ? length.split(':').reduce((total, part) => total * 60 + Number(part), 0)
      : Number(length);
    return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds / 60) : null;
  }

  private stripHtml(text: string) {
    return text
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  private async request<T>(url: URL): Promise<T> {
    const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!response.ok) {
      throw new HttpException(`Internet Archive error: ${response.statusText}`, response.status);
    }
    return response.json() as Promise<T>;
  }

  // The Internet Archive API is slow, so results are kept in memory for an hour
  private async cached<T>(key: string, load: () => Promise<T>): Promise<T> {
    const hit = this.cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value as T;
    const value = await load();
    this.cache.set(key, { expires: Date.now() + CACHE_TTL_MS, value });
    return value;
  }
}
