
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Edit, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface EditPageProps {
  params: {
    id: string;
  };
}

const editFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  coverImageUrl: z.string().url("Please enter a valid image URL."),
});

export default function EditAnimePage({ params }: EditPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initialTitle, setInitialTitle] = useState("");

  const form = useForm<AnimeUpdateFormData>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImageUrl: "",
    },
  });

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
          title: anime.title,
          description: anime.description,
          coverImageUrl: anime.coverImageUrl,
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
    const result = await updateAnime(animeId, data);
    if (result.success) {
      toast({
        title: "Update Successful",
        description: "The anime details have been updated.",
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

  const { isSubmitting, isDirty, isValid } = form.formState;

  if (loading) {
    return (
        <div className="container mx-auto py-10 px-4 md:px-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
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
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                    <Edit className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Edit Anime</CardTitle>
                </div>
                <CardDescription>
                  Update the details for &quot;{initialTitle}&quot;.
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
                        className="resize-y min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm text-muted-foreground">
                Other fields like genres, episodes, and stream URL are not editable here to maintain data consistency.
              </p>

              <Button type="submit" disabled={isSubmitting || !isDirty || !isValid}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
