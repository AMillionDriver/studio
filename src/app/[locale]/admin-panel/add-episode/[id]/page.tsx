
'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { getAnimeById, getEpisodesForAnime } from '@/lib/data';
import type { AnimeSerializable, EpisodeFormData, EpisodeSerializable } from '@/types/anime';
import { addEpisodeToAnime, deleteEpisode } from '@/lib/episode.actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Film, ListVideo, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const episodeFormSchema = z.object({
  episodeNumber: z.string().min(1, 'Episode number is required.'),
  title: z.string().min(1, 'Episode title is required.'),
  videoUrl: z.string().url('Please enter a valid video URL.'),
});

export default function AddEpisodePage() {
  const params = useParams();
  const { toast } = useToast();
  const [anime, setAnime] = useState<AnimeSerializable | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeSerializable[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<EpisodeFormData>({
    resolver: zodResolver(episodeFormSchema),
    defaultValues: {
      episodeNumber: '',
      title: '',
      videoUrl: '',
    },
  });

  const animeId = typeof params.id === 'string' ? params.id : '';

  const fetchAndSetData = async () => {
    if (!animeId) {
        setLoading(false);
        notFound();
        return;
    }
    setLoading(true);
    try {
        const [animeData, episodesData] = await Promise.all([
            getAnimeById(animeId),
            getEpisodesForAnime(animeId),
        ]);
        
        if (!animeData) {
            notFound();
            return;
        }
        setAnime(animeData);
        setEpisodes(episodesData);
        // Automatically set the next episode number in the form
        form.setValue('episodeNumber', (episodesData.length + 1).toString());

    } catch (error) {
        console.error('Failed to fetch data:', error);
        toast({ title: 'Error', description: 'Could not load anime and episode data.', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId]);
  
  const onSubmit = async (data: EpisodeFormData) => {
    if (!animeId) return;

    const result = await addEpisodeToAnime(animeId, data);

    if (result.success) {
      toast({ title: 'Success', description: 'New episode has been added.' });
      form.reset();
      // Refresh episode list after adding a new one
      await fetchAndSetData();
    } else {
      toast({ title: 'Error', description: result.error || 'Failed to add episode.', variant: 'destructive' });
    }
  };

  const handleDelete = async (episodeId: string) => {
    if (!animeId) return;
    const result = await deleteEpisode(animeId, episodeId);

    if (result.success) {
        toast({
            title: 'Episode Deleted',
            description: 'The episode has been successfully removed.',
        });
        // Refresh episode list after deletion
        await fetchAndSetData();
    } else {
        toast({
            title: 'Error',
            description: result.error || 'Failed to delete the episode.',
            variant: 'destructive',
        });
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (!anime) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                  <Film className="h-7 w-7 text-primary" />
                  <div>
                    <h1 className="text-2xl font-bold">Manage Episodes</h1>
                    <p className="text-muted-foreground">For anime: <span className="font-semibold text-foreground">{anime.title}</span></p>
                  </div>
              </div>
            </div>
            <Link href="/admin-panel" passHref>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                <ArrowLeft className="mr-2 h-4 w-4" />
                 Back to Panel
              </Button>
            </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5"/>Add New Episode</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="episodeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Episode Number</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Episode Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., The Adventure Begins" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

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

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Adding...' : 'Add Episode'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListVideo className="h-5 w-5"/>Episode History</CardTitle>
            <CardDescription>
                {episodes.length > 0 ? `A total of ${episodes.length} episode(s) have been uploaded for this anime.` : 'No episodes have been uploaded for this anime yet.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {episodes.length > 0 ? (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Episode</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Date Uploaded</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {episodes.map(ep => (
                                <TableRow key={ep.id}>
                                    <TableCell className="font-medium">{ep.episodeNumber}</TableCell>
                                    <TableCell>{ep.title}</TableCell>
                                    <TableCell>{format(new Date(ep.createdAt), 'dd MMM yyyy')}</TableCell>
                                    <TableCell className="text-right">
                                      <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin-panel/edit-episode/${animeId}/${ep.id}`}>
                                            <Edit className="h-4 w-4"/>
                                        </Link>
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete episode {ep.episodeNumber}: &quot;{ep.title}&quot;.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(ep.id)}
                                                    className="bg-destructive hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No episodes found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PageSkeleton() {
    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-80" />
                    </div>
                    <Skeleton className="h-9 w-32" />
                </div>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
    );
}
