'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthFormProps {
  mode: 'login' | 'signup';
  initialEmail?: string;
}

export default function AuthForm({ mode, initialEmail = '' }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignup && password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        await register(email, password);
        router.push('/profiles');
      } else {
        await login(email, password);
        const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
        router.push(callbackUrl?.startsWith('/') ? callbackUrl : '/profiles');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded bg-[#333] px-5 py-4 text-sm outline-none placeholder:text-netflix-gray focus:bg-[#454545]';

  return (
    <div className="relative flex min-h-screen flex-col bg-black bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/9134db96-10d6-4a64-a619-a21da22f8999/a449fabb-05e4-4c8a-b062-b0bec7d03085/US-en-20240115-trifectadaily-perspective_alpha_website_large.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60" />
      <header className="relative px-4 py-6 md:px-12">
        <Link href="/" className="text-3xl font-extrabold text-netflix-red md:text-4xl">NETFLIX</Link>
      </header>

      <main className="relative flex flex-1 items-start justify-center px-4 pb-20">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 rounded bg-black/75 px-8 py-12 md:px-16"
        >
          <h1 className="mb-6 text-3xl font-bold">{isSignup ? 'Sign Up' : 'Sign In'}</h1>

          {error && <p className="rounded bg-[#e87c03] px-4 py-3 text-sm text-white">{error}</p>}

          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          {isSignup && (
            <input
              type="password"
              required
              minLength={6}
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded bg-netflix-red py-3 font-semibold hover:bg-netflix-red-hover disabled:opacity-60"
          >
            {submitting ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
          </button>

          <p className="pt-6 text-netflix-gray">
            {isSignup ? 'Already have an account? ' : 'New to Netflix? '}
            <Link href={isSignup ? '/login' : '/signup'} className="text-white hover:underline">
              {isSignup ? 'Sign in now.' : 'Sign up now.'}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
