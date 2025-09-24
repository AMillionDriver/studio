
"use client";

import { useEffect, useState } from "react";
import { getAnimes } from "@/lib/firebase/firestore";
import type { AnimeSerializable } from "@/types/anime";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAnime } from "@/lib/anime.actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

export function AnimeList() {
  const [animes, setAnimes] = useState<AnimeSerializable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        const animeData = await getAnimes();
        setAnimes(animeData);
        setError(null);
      } catch (err) {
        console.error("Error fetching animes for admin list:", err);
        setError("Failed to load anime list.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnimes();
  }, []); 

  const handleDelete = async (animeId: string, animeTitle: string) => {
    const result = await deleteAnime(animeId);
    if (result.success) {
      toast({
        title: "Anime Deleted",
        description: `"${animeTitle}" has been removed.`,
      });
      // Refresh the list
      setAnimes((prevAnimes) => prevAnimes.filter((a) => a.id !== animeId));
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete anime.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
        <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }
  
  if (animes.length === 0) {
    return <p className="text-muted-foreground">No anime has been uploaded yet.</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genres</TableHead>
            <TableHead className="text-center">Episodes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {animes.map((anime) => (
            <TableRow key={anime.id}>
              <TableCell className="font-medium">{anime.title}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {anime.genres.slice(0, 3).map((g) => (
                    <Badge key={g} variant="secondary">
                      {g}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-center">{anime.episodes}</TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin-panel/edit/${anime.id}`}>
                    <Edit className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        <strong className="mx-1">{anime.title}</strong>
                        from the database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(anime.id, anime.title)}
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
  );
}
