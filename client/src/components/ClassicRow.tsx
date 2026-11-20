'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useMovieModal } from '@/context/MovieModalContext';
import type { Classic } from '@/lib/constants';

export default function ClassicRow({ title, category }: { title: string; category: string }) {
  const { openClassic } = useMovieModal();
  const [classics, setClassics] = useState<Classic[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get<Classic[]>(`/classics?category=${category}`)
      .then((data) => !cancelled && setClassics(data))
      // A failed row is simply hidden; the rest of the page still works
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [category]);

  if (classics.length === 0) return null;

  return (
    <section className="space-y-2 px-4 md:px-12">
      <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
      <div className="scrollbar-hide flex gap-2 overflow-x-scroll py-4">
        {classics.map((classic) => (
          <button
            key={classic.id}
            onClick={() => openClassic(classic.id)}
            aria-label={classic.title}
            className="group relative aspect-[2/3] w-28 shrink-0 overflow-hidden rounded bg-netflix-dark-card transition-transform duration-300 hover:z-10 hover:scale-105 sm:w-36 md:w-44"
          >
            <Image
              src={classic.posterUrl}
              alt={classic.title}
              fill
              sizes="(max-width: 768px) 33vw, 200px"
              className="object-cover"
            />
            <span className="absolute left-1 top-1 rounded bg-netflix-red px-1 text-[10px] font-bold">FREE</span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-left text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">
              {classic.title}
              {classic.year && <span className="block font-normal text-netflix-light-gray">{classic.year}</span>}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
