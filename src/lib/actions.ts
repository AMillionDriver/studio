'use server';

import { z } from 'zod';
import { personalizedAnimeRecommendations } from '@/ai/flows/personalized-anime-recommendations';
import { getAnimes } from './firebase/firestore';
import { seedDatabase } from './firebase/seed';

const recommendationSchema = z.object({
  viewingHistory: z.string().min(1, 'Please enter at least one anime title.'),
  preferredGenres: z.string().min(1, 'Please enter at least one genre.'),
});

export type RecommendationState = {
  form: {
    viewingHistory: string;
    preferredGenres: string;
  };
  status: 'idle' | 'loading' | 'success' | 'error';
  recommendations?: string[];
  error?: string;
  genres?: string[];
};

export async function getRecommendations(
  prevState: RecommendationState,
  formData: FormData
): Promise<RecommendationState> {

  const viewingHistory = formData.get('viewingHistory') as string;
  const preferredGenres = formData.get('preferredGenres') as string;

  const validatedFields = recommendationSchema.safeParse({
    viewingHistory,
    preferredGenres,
  });

  if (!validatedFields.success) {
    const firstError = validatedFields.error.errors[0];
    return {
      ...prevState,
      status: 'error',
      error: `${firstError.path[0]}: ${firstError.message}`,
    };
  }
  
  try {
    const result = await personalizedAnimeRecommendations({
      viewingHistory: validatedFields.data.viewingHistory,
      preferredGenres: validatedFields.data.preferredGenres,
      numberOfRecommendations: 5,
    });
    
    return {
      ...prevState,
      status: 'success',
      recommendations: result.recommendations,
      error: undefined,
    };
  } catch (e: any) {
    return {
      ...prevState,
      status: 'error',
      error: e.message || 'An unknown error occurred.',
    };
  }
}

export async function getInitialRecommendationState(): Promise<RecommendationState> {
  const animes = await getAnimes();
  const allGenres = [...new Set(animes.flatMap(anime => anime.genres))];

  return {
    form: {
      viewingHistory: 'Attack on Titan, Naruto',
      preferredGenres: 'Action, Sci-Fi',
    },
    status: 'idle',
    genres: allGenres,
  };
}

export async function seedInitialData() {
  try {
    const result = await seedDatabase();
    return { success: true, message: `Successfully seeded ${result.count} anime shows.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
