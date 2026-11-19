import Navbar from '@/components/Navbar';
import SearchResults from '@/components/SearchResults';

export default async function SearchPage({ searchParams }: PageProps<'/search'>) {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q : '';

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 pt-28 md:px-12">
        <SearchResults query={query} />
      </main>
    </div>
  );
}
