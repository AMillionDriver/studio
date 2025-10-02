
import { getAnimeById, getAnimes, getEpisodesForAnime, getUserInteraction } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tv, Calendar, Clapperboard, VenetianMask, Youtube, Instagram, Facebook, Shield } from 'lucide-react';
import { RelatedAnime } from '@/components/related-anime';
import { EpisodeSelector } from '@/components/episode-selector';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { XIcon } from '@/components/icons/x-icon';
import { VideoPlayer } from '@/components/video-player';
import { Suspense } from 'react';
import Loading from './loading';
import { ExpandableText } from '@/components/expandable-text';
import { CommentSection } from '@/components/comments/comment-section';
import { getSession } from '@/lib/session';
import { InteractionButtons } from '@/components/interaction-buttons';
import { incrementAnimeViews } from '@/lib/anime.actions';

async function WatchPageContent({ animeId }: { animeId: string }) {
    if (!animeId) {
        notFound();
    }
    
    const session = await getSession();

    // Increment views and fetch data in parallel
    // The increment function now internally checks if it should increment
    const [anime, episodes, allAnimes, userInteraction] = await Promise.all([
        getAnimeById(animeId),
        getEpisodesForAnime(animeId),
        getAnimes(),
        session?.uid ? getUserInteraction(animeId, session.uid) : Promise.resolve(null),
        session?.uid ? incrementAnimeViews(animeId, session.uid) : Promise.resolve(),
    ]);

    if (!anime) {
        notFound();
    }
    
    // Filter out the current anime from the full list to create a recommendation pool
    const recommendationPool = allAnimes.filter(a => a.id !== animeId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <VideoPlayer anime={anime} episodes={episodes} />

                {/* Anime Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">{anime.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {anime.genres.map((genre) => (
                                <Badge key={genre} variant="secondary">{genre}</Badge>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                            {anime.rating && (
                                <div className="flex items-center gap-1">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span className='font-semibold'>{anime.rating}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Tv className="h-4 w-4" />
                                <span>TV Series</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clapperboard className="h-4 w-4" />
                                <span>{anime.episodes} Episodes</span>
                            </div>
                            {anime.releaseDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(anime.releaseDate).getFullYear()}</span>
                                </div>
                            )}
                        </div>

                        <InteractionButtons
                            animeId={anime.id}
                            initialLikes={anime.likes || 0}
                            initialDislikes={anime.dislikes || 0}
                            initialViews={anime.views || 0}
                            userVote={userInteraction?.vote || null}
                            userId={session?.uid}
                        />
                        
                        <ExpandableText text={anime.description} maxLength={300} />

                        {anime.creator && anime.creator.name && (
                            <>
                                <Separator className="my-6" />
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <VenetianMask className="h-5 w-5 text-primary" />
                                        About the Creator
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <p className="font-medium text-foreground">{anime.creator.name}</p>
                                        <div className="flex items-center gap-2">
                                            {anime.creator.socials.youtube && (
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={anime.creator.socials.youtube} target="_blank">
                                                        <Youtube className="h-5 w-5 text-red-500" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {anime.creator.socials.instagram && (
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={anime.creator.socials.instagram} target="_blank">
                                                        <Instagram className="h-5 w-5 text-pink-500" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {anime.creator.socials.twitter && (
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={anime.creator.socials.twitter} target="_blank">
                                                        <XIcon className="h-5 w-5" />
                                                    </Link>
                                                </Button>
                                            )}
                                            {anime.creator.socials.facebook && (
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={anime.creator.socials.facebook} target="_blank">
                                                        <Facebook className="h-5 w-5 text-blue-600" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Separator className="mt-6" />
                            </>
                        )}
                        
                        {episodes.length > 0 && (
                            <div className="mt-6">
                                <EpisodeSelector episodes={episodes} />
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                {/* Comment Section */}
                <CommentSection animeId={anime.id} />
            </div>

            {/* Related Anime Sidebar */}
            <div className="lg:col-span-1">
                <RelatedAnime 
                    currentAnime={anime}
                    allAnimes={recommendationPool}
                />
            </div>
        </div>
    );
}

export default function WatchPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Suspense fallback={<Loading />}>
                <WatchPageContent animeId={params.id} />
            </Suspense>
        </div>
    );
}
