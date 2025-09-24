
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AnimeCard } from "@/components/anime-card";
import type { AnimeSerializable } from "@/types/anime";
import { Layers } from "lucide-react";

interface RecommendedAnimeProps {
    animes: AnimeSerializable[];
}

export function RecommendedAnime({ animes }: RecommendedAnimeProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Layers className="h-6 w-6 text-primary" />
                    Recommended For You
                </CardTitle>
            </CardHeader>
            <CardContent>
                {animes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
                        {animes.map(recAnime => (
                            <AnimeCard key={recAnime.id} anime={recAnime} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">No recommendations available right now.</p>
                )}
            </CardContent>
        </Card>
    );
}
