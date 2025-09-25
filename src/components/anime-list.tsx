
"use client";

import { useEffect, useState } from "react";
import { getAnimes } from "@/lib/data";
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
import { Trash2, Edit, Plus, ChevronDown } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AnimeEpisodeList } from "./anime-episode-list";

export function AnimeList() {
  const [animes, setAnimes] = useState<AnimeSerializable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCollapsibleId, setOpenCollapsibleId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnimes = async () => {
      setLoading(true);
      try {
        const animeData = await getAnimes(undefined, 'updatedAt', 'desc'); // Sort by most recently updated
        setAnimes(animeData);
        setError(null);
      } catch (err) {
        console.error("Error fetching animes for admin list:", err);
        setError("Failed to load anime list.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAnimes();
  }, []);

  const handleDelete = async (animeId: string, animeTitle: string) => {
    const result = await deleteAnime(animeId);
    if (result.success) {
      toast({
        title: "Anime Deleted",
        description: `"${animeTitle}" has been removed.`,
      });
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
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (animes.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No anime has been uploaded yet. Start by adding one!</p>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Genres</TableHead>
            <TableHead className="text-center">Episodes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {animes.map((anime) => (
          <Collapsible
            key={anime.id}
            asChild
            open={openCollapsibleId === anime.id}
            onOpenChange={() => setOpenCollapsibleId(prevId => prevId === anime.id ? null : anime.id)}
          >
            <TableBody className="border-b">
              <TableRow className="data-[state=open]:bg-muted/50">
                <TableCell>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-9 p-0 data-[state=open]:rotate-180">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">Toggle episodes for {anime.title}</span>
                    </Button>
                  </CollapsibleTrigger>
                </TableCell>
                <TableCell className="font-medium">{anime.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {anime.genres.slice(0, 3).map((g) => (
                      <Badge key={g} variant="secondary">{g}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">{anime.episodes}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin-panel/edit/${anime.id}`}>
                      <Edit className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Edit Anime</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin-panel/add-episode/${anime.id}`}>
                      <Plus className="h-4 w-4 text-green-500" />
                      <span className="sr-only">Add Episode</span>
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
                          This action cannot be undone. This will permanently delete <strong className="mx-1">{anime.title}</strong> and all its episodes from the database.
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
              <CollapsibleContent asChild>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableCell colSpan={5}>
                    {openCollapsibleId === anime.id && <AnimeEpisodeList animeId={anime.id} />}
                  </TableCell>
                </TableRow>
              </CollapsibleContent>
            </TableBody>
          </Collapsible>
        ))}
      </Table>
    </div>
  );
}
