'use client';

import { useRef } from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '@/lib/constants';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const row = rowRef.current;
    if (!row) return;
    const amount = row.clientWidth * 0.8;
    row.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  return (
    <section className="group/row relative space-y-2 px-4 md:px-12">
      <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scroll('left')}
          className="absolute inset-y-0 -left-4 z-20 hidden w-10 items-center justify-center bg-black/50 text-3xl opacity-0 transition-opacity group-hover/row:opacity-100 md:-left-12 md:flex md:w-12"
        >
          ‹
        </button>
        <div ref={rowRef} className="scrollbar-hide flex gap-2 overflow-x-scroll py-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              className="w-28 sm:w-36 md:w-44"
            />
          ))}
        </div>
        <button
          aria-label="Scroll right"
          onClick={() => scroll('right')}
          className="absolute inset-y-0 -right-4 z-20 hidden w-10 items-center justify-center bg-black/50 text-3xl opacity-0 transition-opacity group-hover/row:opacity-100 md:-right-12 md:flex md:w-12"
        >
          ›
        </button>
      </div>
    </section>
  );
}
