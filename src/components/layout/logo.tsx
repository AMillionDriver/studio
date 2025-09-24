import Link from 'next/link';
import { Clapperboard } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Clapperboard className="h-6 w-6 text-primary" />
      <span className="font-bold inline-block text-lg">AniStream</span>
    </Link>
  );
}
