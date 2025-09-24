
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Clapperboard } from "lucide-react";
import { addAnime } from "@/lib/anime.actions";
import type { AnimeFormData } from "@/types/anime";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

const animeFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  streamUrl: z.string().url("Please enter a valid URL."),
  coverImage: z
    .any()
    .refine((files) => files?.length > 0, "Cover image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png, .webp and .gif files are accepted."
    ),
  genres: z.string().min(1, "At least one genre is required."),
  rating: z.coerce.number().min(0).max(10).optional(),
  episodes: z.coerce.number().int().min(1, "At least one episode is required."),
});

type AnimeFormValues = z.infer<typeof animeFormSchema>;

export default function AdminPanelPage() {
  const { toast } = useToast();
  const form = useForm<AnimeFormValues>({
    resolver: zodResolver(animeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      streamUrl: "",
      genres: "",
      rating: undefined,
      episodes: undefined,
      coverImage: undefined,
    },
  });

  const coverImageRef = form.register("coverImage");

  const onSubmit = async (data: AnimeFormValues) => {
    const coverImageFile = data.coverImage[0];

    const formData: AnimeFormData = {
        title: data.title,
        description: data.description,
        streamUrl: data.streamUrl,
        genres: data.genres.split(',').map(g => g.trim()),
        rating: data.rating,
        episodes: data.episodes,
        coverImage: coverImageFile,
    };
    
    try {
        await addAnime(formData);
        toast({
            title: "Success!",
            description: "A new anime has been added to the database.",
        });
        form.reset();
    } catch (error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to add anime. Please check the console for details.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
             <Clapperboard className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl">Admin Panel</CardTitle>
                <CardDescription>
                Add a new anime to the streaming platform.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anime Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Attack on Titan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief synopsis of the anime..."
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="streamUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Streaming URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                        </FormControl>
                        <FormDescription>
                            The direct link to the video stream (e.g., YouTube).
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                           <Input type="file" accept={ACCEPTED_IMAGE_TYPES.join(",")} {...coverImageRef} />
                        </FormControl>
                         <FormDescription>
                            Upload the anime's poster/cover image.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Genres</FormLabel>
                        <FormControl>
                        <Input placeholder="Action, Drama, Fantasy" {...field} />
                        </FormControl>
                        <FormDescription>
                            Comma-separated list of genres.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.1" min="0" max="10" placeholder="e.g., 8.8" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="episodes"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Episodes</FormLabel>
                        <FormControl>
                        <Input type="number" min="1" placeholder="e.g., 24" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Uploading..." : "Upload Anime"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    