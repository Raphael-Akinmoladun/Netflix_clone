'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import MovieModal from '@/components/MovieModal';
import ClassicModal from '@/components/ClassicModal';

type OpenTitle = { kind: 'movie'; id: number } | { kind: 'classic'; id: string };

interface MovieModalContextType {
  openMovie: (id: number) => void;
  openClassic: (id: string) => void;
  closeMovie: () => void;
}

const MovieModalContext = createContext<MovieModalContextType | undefined>(undefined);

export function MovieModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<OpenTitle | null>(null);
  const close = () => setOpen(null);

  return (
    <MovieModalContext
      value={{
        openMovie: (id) => setOpen({ kind: 'movie', id }),
        openClassic: (id) => setOpen({ kind: 'classic', id }),
        closeMovie: close,
      }}
    >
      {children}
      {open?.kind === 'movie' && <MovieModal key={open.id} movieId={open.id} onClose={close} />}
      {open?.kind === 'classic' && <ClassicModal key={open.id} classicId={open.id} onClose={close} />}
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
