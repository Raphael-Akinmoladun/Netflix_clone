'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import Footer from '@/components/Footer';
import Spinner from '@/components/Spinner';
import { api } from '@/lib/api';
import { FEATURED_GENRES, type Movie, type MovieListResponse } from '@/lib/constants';

interface Row {
  title: string;
  movies: Movie[];
}

const rowSources = [
  { title: 'Trending Now', path: '/movies/trending' },
  { title: 'Popular on Netflix', path: '/movies/popular' },
  { title: 'Top Rated', path: '/movies/top-rated' },
  ...FEATURED_GENRES.map((g) => ({ title: g.name, path: `/movies/genre/${g.id}` })),
];

export default function BrowsePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all(
      rowSources.map(async ({ title, path }) => {
        const data = await api.get<MovieListResponse>(path);
        return { title, movies: data.results };
      }),
    )
      .then((loaded) => {
        setRows(loaded);
        const candidates = loaded[0].movies.filter((m) => m.backdrop_path);
        setFeatured(candidates[Math.floor(Math.random() * candidates.length)] ?? null);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      {error && (
        <p className="px-4 pt-32 text-center text-netflix-red">
          Could not load movies: {error}. Is the server running and is your TMDB key set?
        </p>
      )}
      {!error && rows.length === 0 && <div className="pt-32"><Spinner /></div>}
      {featured && <HeroSection movie={featured} />}
      <div className={`relative space-y-6 pb-10 ${featured ? '-mt-24 md:-mt-40' : 'pt-24'}`}>
        {rows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))}
      </div>
      {rows.length > 0 && <Footer />}
    </div>
  );
}
