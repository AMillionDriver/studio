
'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardDescription } from '@/components/ui/card';
import type { AnimeSerializable, EpisodeSerializable } from '@/types/anime';

// Helper to convert YouTube URL to embeddable format
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    const videoUrl = new URL(url);
    if (videoUrl.hostname === 'www.youtube.com' || videoUrl.hostname === 'youtube.com') {
      const videoId = videoUrl.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    } else if (videoUrl.hostname === 'youtu.be') {
      const videoId = videoUrl.pathname.slice(1);
       return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    }
    return null; // Return null for non-YouTube URLs
  } catch (error) {
    console.error("Invalid URL for embedding:", url, error);
    return null;
  }
}

interface VideoPlayerProps {
    anime: AnimeSerializable;
    episodes: EpisodeSerializable[];
}

export function VideoPlayer({ anime, episodes }: VideoPlayerProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Determine the current episode from URL search param 'ep' or default to the first one
    const currentEpisode = useMemo(() => {
        const epNumber = searchParams.get('ep');
        if (epNumber) {
            return episodes.find(e => e.episodeNumber === parseInt(epNumber, 10));
        }
        return episodes[0] || null;
    }, [searchParams, episodes]);

    // Determine the video URL to play
    const videoUrlToPlay = useMemo(() => {
        return currentEpisode?.videoUrl || anime.streamUrl;
    }, [currentEpisode, anime.streamUrl]);

    const embedUrl = useMemo(() => getEmbedUrl(videoUrlToPlay), [videoUrlToPlay]);
    
    return (
        <>
            <Card className="overflow-hidden bg-background">
                {embedUrl ? (
                    <div className="aspect-video w-full bg-black">
                        <iframe
                            key={currentEpisode?.id || anime.id} // Re-render iframe when episode changes
                            src={embedUrl}
                            title={`Player for ${anime.title}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                ) : (
                    <div className="aspect-video w-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground">Video stream not available or invalid URL.</p>
                    </div>
                )}
            </Card>
            {currentEpisode && (
                <CardDescription className="text-lg text-primary font-semibold mt-4">
                    Episode {currentEpisode.episodeNumber}: {currentEpisode.title}
                </CardDescription>
            )}
        </>
    );
}
