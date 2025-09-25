
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
import { Calendar as CalendarIcon, Youtube, Instagram, Facebook } from "lucide-react";
import { addAnime } from "@/lib/anime.actions";
import type { AnimeFormData } from "@/types/anime";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { AnimeList } from "@/components/anime-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListVideo, UploadCloud, Link as LinkIcon, User, VenetianMask } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { XIcon } from "@/components/icons/x-icon";


const animeFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  streamUrl: z.string().url("Please enter a valid URL."),
  genres: z.string().min(1, "At least one genre is required."),
  rating: z.string().optional(),
  releaseDate: z.date().optional(),
  coverImageUploadMethod: z.enum(['url', 'upload']),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  coverImageFile: z.instanceof(FileList).optional(),
  creatorName: z.string().optional(),
  creatorYoutube: z.string().url().optional().or(z.literal('')),
  creatorInstagram: z.string().url().optional().or(z.literal('')),
  creatorTwitter: z.string().url().optional().or(z.literal('')),
  creatorFacebook: z.string().url().optional().or(z.literal('')),
}).refine(data => {
    if (data.coverImageUploadMethod === 'url') {
        return !!data.coverImageUrl && z.string().url().safeParse(data.coverImageUrl).success;
    }
    return true;
}, {
    message: "A valid URL is required.",
    path: ["coverImageUrl"],
}).refine(data => {
    if (data.coverImageUploadMethod === 'upload') {
        return data.coverImageFile && data.coverImageFile.length > 0;
    }
    return true;
}, {
    message: "A file is required for upload.",
    path: ["coverImageFile"],
});


export default function AdminDashboardPage() {
  const { toast } = useToast();
  const form = useForm<AnimeFormData>({
    resolver: zodResolver(animeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      streamUrl: "",
      genres: "",
      rating: "",
      releaseDate: undefined,
      coverImageUploadMethod: 'url',
      coverImageUrl: "",
      creatorName: "",
      creatorYoutube: "",
      creatorInstagram: "",
      creatorTwitter: "",
      creatorFacebook: "",
    },
  });

  const uploadMethod = form.watch('coverImageUploadMethod');

  const onSubmit = async (data: AnimeFormData) => {
    const formData = new FormData();
    
    // Append all form data to FormData object
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'coverImageFile' && value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    try {
        const result = await addAnime(formData);
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
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Anime Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage all anime on the platform.</p>
        </div>

        <Tabs defaultValue="anime-list">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="anime-list"><ListVideo className="mr-2 h-4 w-4" />Anime List</TabsTrigger>
                <TabsTrigger value="add-new"><UploadCloud className="mr-2 h-4 w-4" />Add New Anime</TabsTrigger>
            </TabsList>
            <TabsContent value="anime-list">
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Anime Series</CardTitle>
                        <CardDescription>Browse, edit, or delete existing anime.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnimeList />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="add-new">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Anime</CardTitle>
                        <CardDescription>Fill out the form below to add a new anime to the database.</CardDescription>
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
                                                <Input placeholder="e.g., MAPPA" {...field} />
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
                                                    <Input placeholder="https://youtube.com/..." {...field} />
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
                                                    <Input placeholder="https://instagram.com/..." {...field} />
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
                                                    <Input placeholder="https://x.com/..." {...field} />
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
                                                    <Input placeholder="https://facebook.com/..." {...field} />
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
                                      <FormLabel>Streaming URL (Episode 1)</FormLabel>
                                      <FormControl>
                                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                                      </FormControl>
                                      <FormDescription>
                                          The direct link to the video stream.
                                      </FormDescription>
                                      <FormMessage />
                                  </FormItem>
                                  )}
                              />
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
                                                <FormLabel className="font-normal">URL</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                <RadioGroupItem value="upload" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Upload File</FormLabel>
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
                                                <FormLabel>Cover Image File</FormLabel>
                                                <FormControl>
                                                    <Input type="file" accept="image/png, image/jpeg, image/gif" onChange={e => onChange(e.target.files)} {...rest} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
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
                                  <FormItem className="flex flex-col pt-2">
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
                                      <FormLabel>Rating (Optional)</FormLabel>
                                      <FormControl>
                                      <Input type="number" step="0.1" min="0" max="10" placeholder="e.g., 8.8" {...field} />
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
            </TabsContent>
        </Tabs>
    </div>
  );
}
