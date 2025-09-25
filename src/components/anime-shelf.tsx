
'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface AnimeShelfProps {
  title: string;
  children: React.ReactNode;
}

export function AnimeShelf({ title, children }: AnimeShelfProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-4">{title}</h2>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {/* The children will be the AnimeCard components */}
            {children}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
