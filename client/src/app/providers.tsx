'use client';

import { AuthProvider } from '@/context/AuthContext';
import { MovieModalProvider } from '@/context/MovieModalContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MovieModalProvider>{children}</MovieModalProvider>
    </AuthProvider>
  );
}
