'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import MovieModal from '@/components/MovieModal';

interface MovieModalContextType {
  openMovie: (id: number) => void;
  closeMovie: () => void;
}

const MovieModalContext = createContext<MovieModalContextType | undefined>(undefined);

export function MovieModalProvider({ children }: { children: ReactNode }) {
  const [movieId, setMovieId] = useState<number | null>(null);

  return (
    <MovieModalContext value={{ openMovie: setMovieId, closeMovie: () => setMovieId(null) }}>
      {children}
      {movieId !== null && <MovieModal key={movieId} movieId={movieId} onClose={() => setMovieId(null)} />}
    </MovieModalContext>
  );
}

export function useMovieModal() {
  const context = useContext(MovieModalContext);
  if (context === undefined) {
    throw new Error('useMovieModal must be used within a MovieModalProvider');
  }
  return context;
}
