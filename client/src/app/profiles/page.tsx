'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const profiles = [
  { name: 'Main', color: 'bg-blue-600' },
  { name: 'Kids', color: 'bg-yellow-500' },
];

export default function ProfilesPage() {
  const { user } = useAuth();
  const mainName = user?.email.split('@')[0] ?? 'Main';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-3xl md:text-5xl">Who&apos;s watching?</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {profiles.map((profile, i) => (
          <Link key={profile.name} href="/browse" className="group flex flex-col items-center gap-3">
            <div
              className={`flex h-24 w-24 items-center justify-center rounded text-4xl font-bold ring-white group-hover:ring-4 md:h-36 md:w-36 ${profile.color}`}
            >
              {(i === 0 ? mainName : profile.name)[0].toUpperCase()}
            </div>
            <span className="text-netflix-gray group-hover:text-white">
              {i === 0 ? mainName : profile.name}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
