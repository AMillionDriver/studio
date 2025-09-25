
"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { getAnimeById } from "@/lib/firebase/firestore";
import { updateAnime } from "@/lib/anime.actions";
import type { AnimeUpdateFormData } from "@/types/anime";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Edit, ArrowLeft, Calendar as CalendarIcon, Youtube, Instagram, Facebook, VenetianMask } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { XIcon } from "@/components/icons/x-icon";


const editFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  streamUrl: z.string().url("Please enter a valid URL."),
  genres: z.string().min(1, "At least one genre is required."),
  rating: z.string().optional(),
  releaseDate: z.date().optional(),
  
  creatorName: z.string().optional(),
  creatorYoutube: z.string().url().optional().or(z.literal('')),
  creatorInstagram: z.string().url().optional().or(z.literal('')),
  creatorTwitter: z.string().url().optional().or(z.literal('')),
  creatorFacebook: z.string().url().optional().or(z.literal('')),

  coverImageUploadMethod: z.enum(['url', 'upload']),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  coverImageFile: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList)).optional(),
}).refine(data => {
    if (data.coverImageUploadMethod === 'url' && !data.coverImageFile) { // only validate if not switching to file
        return !!data.coverImageUrl && z.string().url().safeParse(data.coverImageUrl).success;
    }
    return true;
}, {
    message: "A valid URL is required.",
    path: ["coverImageUrl"],
}).refine(data => {
    if (data.coverImageUploadMethod === 'upload') {
        // file is optional on edit, only require if a file is being uploaded
        return true; 
    }
    return true;
});


export default function EditAnimePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialTitle, setInitialTitle] = useState("");

  const form = useForm<AnimeUpdateFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: "",
      description: "",
      streamUrl: "",
      genres: "",
      rating: "",
      releaseDate: undefined,
      creatorName: "",
      creatorYoutube: "",
      creatorInstagram: "",
      creatorTwitter: "",
      creatorFacebook: "",
      coverImageUploadMethod: 'url',
      coverImageUrl: "",
      coverImageFile: undefined,
    },
  });

  const uploadMethod = form.watch('coverImageUploadMethod');
  const animeId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (!animeId) {
        setLoading(false);
        notFound();
        return;
    };

    const fetchAnime = async () => {
      try {
        setLoading(true);
        const anime = await getAnimeById(animeId);
        if (!anime) {
          return notFound();
        }
        form.reset({
          title: anime.title || "",
          description: anime.description || "",
          streamUrl: anime.streamUrl || "",
          genres: anime.genres.join(', ') || "",
          rating: anime.rating?.toString() || "",
          releaseDate: anime.releaseDate ? new Date(anime.releaseDate) : undefined,
          coverImageUploadMethod: 'url',
          coverImageUrl: anime.coverImageUrl || "",
          creatorName: anime.creator?.name || "",
          creatorYoutube: anime.creator?.socials?.youtube || "",
          creatorInstagram: anime.creator?.socials?.instagram || "",
          creatorTwitter: anime.creator?.socials?.twitter || "",
          creatorFacebook: anime.creator?.socials?.facebook || "",
        });
        setInitialTitle(anime.title);
      } catch (error) {
        console.error("Failed to fetch anime", error);
        toast({
          title: "Error",
          description: "Could not load anime data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [animeId, form, toast]);

  const onSubmit = async (data: AnimeUpdateFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'coverImageFile' && value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]);
        } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    const result = await updateAnime(animeId, formData);
    if (result.success) {
      toast({
        title: "Update Successful",
        description: `The details for "${data.title}" have been updated.`,
      });
      router.push("/admin-panel");
    } else {
      toast({
        title: "Update Failed",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const { isSubmitting, isDirty } = form.formState;

  if (loading) {
    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                    <Edit className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Edit Anime Series</CardTitle>
                </div>
                <CardDescription>
                  Update the main details for the series &quot;{initialTitle}&quot;.
                </CardDescription>
              </div>
              <Link href="/admin-panel" passHref>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                   Back to Panel
                </Button>
              </Link>
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
                      <Input placeholder="e.g., Attack on Titan" {...field} value={field.value ?? ''} />
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
                        className="resize-y min-h-[120px]"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator/>

              <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><VenetianMask />Creator / Studio Information</h3>
                  <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="creatorName"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Creator/Studio Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="e.g., MAPPA" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                              control={form.control}
                              name="creatorYoutube"
                              render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="flex items-center gap-2"><Youtube className="text-red-500" /> YouTube</FormLabel>
                                  <FormControl>
                                      <Input placeholder="https://youtube.com/..." {...field} value={field.value ?? ''}/>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="creatorInstagram"
                              render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="flex items-center gap-2"><Instagram className="text-pink-500"/> Instagram</FormLabel>
                                  <FormControl>
                                      <Input placeholder="https://instagram.com/..." {...field} value={field.value ?? ''}/>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="creatorTwitter"
                              render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="flex items-center gap-2"><XIcon className="h-4 w-4"/> X / Twitter</FormLabel>
                                  <FormControl>
                                      <Input placeholder="https://x.com/..." {...field} value={field.value ?? ''}/>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="creatorFacebook"
                              render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="flex items-center gap-2"><Facebook className="text-blue-600"/> Facebook</FormLabel>
                                  <FormControl>
                                      <Input placeholder="https://facebook.com/..." {...field} value={field.value ?? ''}/>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                      </div>
                  </div>
              </div>

              <Separator/>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="streamUrl"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Streaming URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://www.youtube.com/watch?v=..." {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>
                            The direct link to the main video stream.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="space-y-4">
                  <FormField
                      control={form.control}
                      name="coverImageUploadMethod"
                      render={({ field }) => (
                          <FormItem className="space-y-3">
                          <FormLabel>Cover Image Method</FormLabel>
                          <FormControl>
                              <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                              >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                  <RadioGroupItem value="url" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Keep or Update URL</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                  <RadioGroupItem value="upload" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Upload New File</FormLabel>
                              </FormItem>
                              </RadioGroup>
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                      />
                  {uploadMethod === 'url' ? (
                      <FormField
                          control={form.control}
                          name="coverImageUrl"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Cover Image URL</FormLabel>
                              <FormControl>
                                  <Input placeholder="https://example.com/image.jpg" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                  ) : (
                      <FormField
                          control={form.control}
                          name="coverImageFile"
                          render={({ field: { onChange, value, ...rest } }) => (
                              <FormItem>
                                  <FormLabel>New Cover Image File</FormLabel>
                                  <FormControl>
                                      <Input type="file" accept="image/png, image/jpeg, image/gif" onChange={e => onChange(e.target.files)} {...rest} />
                                  </FormControl>
                                  <FormDescription>Leave blank to keep the current image.</FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Genres</FormLabel>
                        <FormControl>
                        <Input placeholder="Action, Drama, Fantasy" {...field} value={field.value ?? ''} />
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
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Release Date</FormLabel>
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
                            disabled={(date) => date < new Date("1990-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                        <Input type="number" step="0.1" min="0" max="10" placeholder="e.g., 8.8" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                To manage individual episodes, go back to the anime list and use the episode management options.
              </p>

              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    