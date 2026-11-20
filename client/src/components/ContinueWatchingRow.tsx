'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContinueWatching } from '@/lib/progress';

export default function ContinueWatchingRow() {
  const entries = useContinueWatching();
  if (entries.length === 0) return null;

  return (
    <section className="space-y-2 px-4 md:px-12">
      <h2 className="text-lg font-semibold md:text-xl">Continue Watching</h2>
      <div className="scrollbar-hide flex gap-2 overflow-x-scroll py-4">
        {entries.map((entry) => (
          <Link
            key={entry.key}
            href={entry.href}
            className="group w-28 shrink-0 transition-transform duration-300 hover:z-10 hover:scale-105 sm:w-36 md:w-44"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-t bg-netflix-dark-card">
              {entry.posterUrl ? (
                <Image src={entry.posterUrl} alt={entry.title} fill sizes="200px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center p-2 text-center text-sm">{entry.title}</span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-4xl opacity-0 transition-opacity group-hover:opacity-100">
                ▶
              </span>
            </div>
            <div className="h-1 rounded-b bg-white/30">
              <div
                className="h-full bg-netflix-red"
                style={{ width: `${Math.min((entry.position / entry.duration) * 100, 100)}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
