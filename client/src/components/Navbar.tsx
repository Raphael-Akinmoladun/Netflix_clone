'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Debounce search navigation
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav
      className={`fixed top-0 z-40 flex w-full items-center justify-between px-4 py-4 transition-colors duration-500 md:px-12 ${
        scrolled ? 'bg-netflix-dark' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center gap-8">
        <Link href="/browse" className="text-2xl font-extrabold tracking-tight text-netflix-red md:text-3xl">
          NETFLIX
        </Link>
        <div className="hidden gap-5 text-sm md:flex">
          <Link href="/browse" className="hover:text-netflix-light-gray">Home</Link>
          <Link href="/my-list" className="hover:text-netflix-light-gray">My List</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {searchOpen && (
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => !query && setSearchOpen(false)}
              placeholder="Titles, genres..."
              className="w-36 border border-white bg-black/80 px-2 py-1 text-sm outline-none md:w-56"
            />
          )}
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((open) => !open)}
            className="p-1"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-sm font-bold uppercase"
            aria-label="Account menu"
          >
            {user?.email[0] ?? '?'}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 border border-netflix-dark-card bg-black/95 py-2 text-sm">
              <p className="truncate px-4 py-2 text-netflix-gray">{user?.email}</p>
              <Link href="/profiles" className="block px-4 py-2 hover:underline">Manage Profiles</Link>
              <Link href="/my-list" className="block px-4 py-2 hover:underline md:hidden">My List</Link>
              <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:underline">
                Sign out of Netflix
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
