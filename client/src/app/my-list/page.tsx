'use client';

import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import Spinner from '@/components/Spinner';
import { api } from '@/lib/api';
import type { WatchlistMovie } from '@/lib/constants';

export default function MyListPage() {
  const [movies, setMovies] = useState<WatchlistMovie[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api
      .get<WatchlistMovie[]>('/watchlist')
      .then(setMovies)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (tmdbId: number) => {
    await api.delete(`/watchlist/${tmdbId}`);
    setMovies((prev) => prev?.filter((m) => m.tmdbId !== tmdbId) ?? null);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 pt-28 md:px-12">
        <h1 className="mb-6 text-2xl font-semibold md:text-3xl">My List</h1>
        {error && <p className="text-netflix-red">{error}</p>}
        {!error && movies === null && <Spinner />}
        {movies?.length === 0 && (
          <p className="text-netflix-gray">You haven&apos;t added any titles to your list yet.</p>
        )}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {movies?.map((movie) => (
            <div key={movie._id} className="group relative">
              <MovieCard id={movie.tmdbId} title={movie.title} posterPath={movie.posterPath ?? null} className="w-full" />
              <button
                onClick={() => remove(movie.tmdbId)}
                aria-label={`Remove ${movie.title}`}
                className="absolute right-1 top-1 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/80 text-sm opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
