'use client';

import Image from 'next/image';
import { useMovieModal } from '@/context/MovieModalContext';
import { TMDB_POSTER_W500 } from '@/lib/constants';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  className?: string;
}

export default function MovieCard({ id, title, posterPath, className = '' }: MovieCardProps) {
  const { openMovie } = useMovieModal();

  return (
    <button
      onClick={() => openMovie(id)}
      className={`group relative aspect-[2/3] shrink-0 overflow-hidden rounded bg-netflix-dark-card transition-transform duration-300 hover:z-10 hover:scale-105 ${className}`}
      aria-label={title}
    >
      {posterPath ? (
        <Image
          src={`${TMDB_POSTER_W500}${posterPath}`}
          alt={title}
          fill
          sizes="(max-width: 768px) 33vw, 200px"
          className="object-cover"
        />
      ) : (
        <span className="flex h-full items-center justify-center p-2 text-center text-sm">{title}</span>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 text-left text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">
        {title}
      </div>
    </button>
  );
}
