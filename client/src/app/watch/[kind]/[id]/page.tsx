import { notFound } from 'next/navigation';
import WatchScreen, { type WatchKind } from '@/components/WatchScreen';

const KINDS: WatchKind[] = ['movie', 'classic'];

export default async function WatchPage({ params }: PageProps<'/watch/[kind]/[id]'>) {
  const { kind, id } = await params;
  if (!KINDS.includes(kind as WatchKind)) notFound();

  return <WatchScreen kind={kind as WatchKind} id={id} />;
}
