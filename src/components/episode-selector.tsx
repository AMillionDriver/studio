
'use client';

import type { EpisodeSerializable } from "@/types/anime";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface EpisodeSelectorProps {
    episodes: EpisodeSerializable[];
    currentEpisodeNumber: number;
    onEpisodeSelect: (episode: EpisodeSerializable) => void;
}

export function EpisodeSelector({ episodes, currentEpisodeNumber, onEpisodeSelect }: EpisodeSelectorProps) {
  if (!episodes || episodes.length === 0) {
    return null;
  }

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
                  onClick={() => onEpisodeSelect(ep)}
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
