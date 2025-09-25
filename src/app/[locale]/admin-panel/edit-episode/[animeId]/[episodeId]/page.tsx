
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { getAnimeById, getEpisodeById } from '@/lib/data';
import type { AnimeSerializable, EpisodeSerializable, EpisodeUpdateFormData } from '@/types/anime';
import { updateEpisode } from '@/lib/episode.actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const editEpisodeSchema = z.object({
  title: z.string().min(1, 'Episode title is required.'),
  videoUrl: z.string().url('Please enter a valid video URL.'),
});

export default function EditEpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [anime, setAnime] = useState<AnimeSerializable | null>(null);
  const [episode, setEpisode] = useState<EpisodeSerializable | null>(null);
  const [loading, setLoading] = useState(true);

  const animeId = typeof params.animeId === 'string' ? params.animeId : '';
  const episodeId = typeof params.episodeId === 'string' ? params.episodeId : '';

  const form = useForm<EpisodeUpdateFormData>({
    resolver: zodResolver(editEpisodeSchema),
    defaultValues: {
      title: '',
      videoUrl: '',
    },
  });

  useEffect(() => {
    if (!animeId || !episodeId) {
      setLoading(false);
      notFound();
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [animeData, episodeData] = await Promise.all([
          getAnimeById(animeId),
          getEpisodeById(animeId, episodeId),
        ]);

        if (!animeData || !episodeData) {
          notFound();
          return;
        }

        setAnime(animeData);
        setEpisode(episodeData);
        form.reset({
          title: episodeData.title,
          videoUrl: episodeData.videoUrl,
        });

      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({ title: 'Error', description: 'Could not load anime and episode data.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animeId, episodeId, toast, form]);

  const onSubmit = async (data: EpisodeUpdateFormData) => {
    if (!animeId || !episodeId) return;

    const result = await updateEpisode(animeId, episodeId, data);

    if (result.success) {
      toast({ title: 'Success', description: 'Episode has been updated.' });
      router.push(`/admin-panel/add-episode/${animeId}`);
    } else {
      toast({ title: 'Error', description: result.error || 'Failed to update episode.', variant: 'destructive' });
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (!anime || !episode) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Edit className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Edit Episode {episode.episodeNumber}</CardTitle>
              </div>
              <CardDescription>
                For anime series: <span className="font-semibold text-foreground">{anime.title}</span>
              </CardDescription>
            </div>
            <Link href={`/admin-panel/add-episode/${animeId}`} passHref>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Episode Management
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Adventure Continues" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-9 w-36" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    </div>
  );
}
