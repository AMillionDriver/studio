
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { EpisodeSerializable } from "@/types/anime";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Layers } from "lucide-react";

interface EpisodeSelectorProps {
    episodes: EpisodeSerializable[];
}

export function EpisodeSelector({ episodes }: EpisodeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!episodes || episodes.length === 0) {
    return null;
  }

  const currentEpisodeNumber = searchParams.get('ep') 
    ? parseInt(searchParams.get('ep')!, 10) 
    : episodes[0]?.episodeNumber;

  const handleEpisodeSelect = (episode: EpisodeSerializable) => {
    const params = new URLSearchParams(searchParams);
    params.set('ep', episode.episodeNumber.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Layers className="h-5 w-5 text-primary" />
          Episodes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex flex-wrap gap-2">
              {episodes.map((ep) => (
                <Button
                  key={ep.id}
                  variant={currentEpisodeNumber === ep.episodeNumber ? "default" : "outline"}
                  onClick={() => handleEpisodeSelect(ep)}
                  className="min-w-[40px] flex-shrink-0"
                >
                  {ep.episodeNumber}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
