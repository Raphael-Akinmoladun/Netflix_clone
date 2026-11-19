'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Movie, MovieListResponse } from '@/lib/constants';
import MovieCard from './MovieCard';
import Spinner from './Spinner';

interface SearchState {
  query: string;
  results?: Movie[];
  error?: string;
}

export default function SearchResults({ query }: { query: string }) {
  // Results are tagged with the query they belong to, so a stale result is never shown
  const [state, setState] = useState<SearchState | null>(null);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    api
      .get<MovieListResponse>(`/movies/search?query=${encodeURIComponent(query)}`)
      .then((data) => !cancelled && setState({ query, results: data.results }))
      .catch((err: Error) => !cancelled && setState({ query, error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!query) return <p className="text-netflix-gray">Use the search icon above to find movies.</p>;

  const current = state?.query === query ? state : null;
  if (current?.error) return <p className="text-netflix-red">{current.error}</p>;
  if (!current?.results) return <Spinner />;
  const results = current.results;

  return (
    <>
      <h1 className="mb-6 text-xl text-netflix-gray">
        Results for <span className="text-white">&ldquo;{query}&rdquo;</span>
      </h1>
      {results.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {results.map((movie) => (
            <MovieCard key={movie.id} id={movie.id} title={movie.title} posterPath={movie.poster_path} />
          ))}
        </div>
      )}
    </>
  );
}
