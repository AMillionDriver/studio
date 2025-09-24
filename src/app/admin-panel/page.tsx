
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
import { Clapperboard, UserPlus, Calendar as CalendarIcon } from "lucide-react";
import { addAnime } from "@/lib/anime.actions";
import type { AnimeFormData } from "@/types/anime";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { AnimeList } from "@/components/anime-list";

const animeFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  streamUrl: z.string().url("Please enter a valid URL."),
  coverImageUrl: z.string().url("Please enter a valid image URL."),
  genres: z.string().min(1, "At least one genre is required."),
  rating: z.string().optional(),
  episodes: z.string().min(1, "At least one episode is required."),
  releaseDate: z.date().optional(),
});


export default function AdminPanelPage() {
  const { toast } = useToast();
  const form = useForm<AnimeFormData>({
    resolver: zodResolver(animeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      streamUrl: "",
      coverImageUrl: "",
      genres: "",
      rating: "",
      episodes: "",
      releaseDate: undefined,
    },
  });

  const onSubmit = async (data: AnimeFormData) => {
    try {
        const result = await addAnime(data);
        if (result.success) {
            toast({
                title: "Success!",
                description: "A new anime has been added to the database.",
            });
            form.reset();
        } else {
             toast({
                title: "Error",
                description: result.error || "Failed to add anime. Please try again.",
                variant: "destructive",
            });
        }
    } catch (error) {
        console.error(error);
        toast({
            title: "Client-side Error",
            description: "An unexpected error occurred on the client. Please check the console.",
            variant: "destructive",
        });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid gap-8 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clapperboard className="h-8 w-8 text-primary" />
              <div>
                  <CardTitle className="text-2xl">Anime Management</CardTitle>
                  <CardDescription>
                  Add, remove, and manage anime on the platform.
                  </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimeList />
          </CardContent>
        </Card>
        
        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Upload New Anime</CardTitle>
            <CardDescription>Fill out the form below to add a new anime.</CardDescription>
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
                      name="coverImageUrl"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Cover Image URL</FormLabel>
                          <FormControl>
                             <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                           <FormDescription>
                              URL for the anime's poster/cover image.
                          </FormDescription>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Release Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1990-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Set a future date to schedule the anime's release.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <FormControl>
                          <Input type="number" step="0.1" min="0" max="10" placeholder="e.g., 8.8" {...field} />
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
                          <Input type="number" min="1" placeholder="e.g., 24" {...field} />
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

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Create new users and manage their roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/admin-panel/users" passHref>
                <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create New User
                </Button>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

