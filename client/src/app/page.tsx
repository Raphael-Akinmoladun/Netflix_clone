'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/browse');
  }, [isAuthenticated, isLoading, router]);

  const handleGetStarted = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-black bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/9134db96-10d6-4a64-a619-a21da22f8999/a449fabb-05e4-4c8a-b062-b0bec7d03085/US-en-20240115-trifectadaily-perspective_alpha_website_large.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />

      <header className="relative flex items-center justify-between px-4 py-6 md:px-12">
        <span className="text-3xl font-extrabold text-netflix-red md:text-4xl">NETFLIX</span>
        <Link
          href="/login"
          className="rounded bg-netflix-red px-4 py-1.5 text-sm font-semibold hover:bg-netflix-red-hover"
        >
          Sign In
        </Link>
      </header>

      <main className="relative flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-3xl text-3xl font-extrabold md:text-6xl">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="mt-4 text-lg md:text-2xl">Watch anywhere. Cancel anytime.</p>
        <p className="mt-6 md:text-lg">
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        <form onSubmit={handleGetStarted} className="mt-4 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded border border-white/40 bg-black/60 px-5 py-4 outline-none focus:border-white"
          />
          <button
            type="submit"
            className="rounded bg-netflix-red px-8 py-4 text-lg font-semibold hover:bg-netflix-red-hover md:text-2xl"
          >
            Get Started ›
          </button>
        </form>
      </main>
    </div>
  );
}
