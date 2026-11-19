'use client';

import Image from 'next/image';
import { useMovieModal } from '@/context/MovieModalContext';
import { TMDB_BACKDROP_ORIGINAL, type Movie } from '@/lib/constants';

export default function HeroSection({ movie }: { movie: Movie }) {
  const { openMovie } = useMovieModal();

  return (
    <header className="relative h-[56vw] max-h-[85vh] min-h-[420px] w-full">
      {movie.backdrop_path && (
        <Image
          src={`${TMDB_BACKDROP_ORIGINAL}${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-netflix-dark to-transparent" />

      <div className="absolute bottom-[20%] left-4 max-w-xl space-y-4 md:left-12">
        <h1 className="text-3xl font-extrabold drop-shadow-lg md:text-6xl">{movie.title}</h1>
        <p className="line-clamp-3 text-sm drop-shadow md:text-lg">{movie.overview}</p>
        <div className="flex gap-3">
          <button
            onClick={() => openMovie(movie.id)}
            className="flex items-center gap-2 rounded bg-white px-5 py-2 font-semibold text-black hover:bg-white/75 md:px-8"
          >
            ▶ Play
          </button>
          <button
            onClick={() => openMovie(movie.id)}
            className="flex items-center gap-2 rounded bg-gray-500/70 px-5 py-2 font-semibold hover:bg-gray-500/50 md:px-8"
          >
            ⓘ More Info
          </button>
        </div>
      </div>
    </header>
  );
}
