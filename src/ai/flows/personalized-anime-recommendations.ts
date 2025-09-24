// src/ai/flows/personalized-anime-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized anime recommendations based on viewing history and preferred genres.
 *
 * - personalizedAnimeRecommendations - A function that generates anime recommendations.
 * - PersonalizedAnimeRecommendationsInput - The input type for the personalizedAnimeRecommendations function.
 * - PersonalizedAnimeRecommendationsOutput - The return type for the personalizedAnimeRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAnimeRecommendationsInputSchema = z.object({
  viewingHistory: z
    .string()
    .describe(
      'A comma-separated list of anime titles the user has watched, e.g., "Attack on Titan, Naruto, One Piece".'
    ),
  preferredGenres: z
    .string()
    .describe(
      'A comma-separated list of the user\'s preferred anime genres, e.g., "Action, Adventure, Sci-Fi".'
    ),
  numberOfRecommendations: z
    .number()
    .default(3)
    .describe('The number of anime recommendations to return.'),
});
export type PersonalizedAnimeRecommendationsInput = z.infer<
  typeof PersonalizedAnimeRecommendationsInputSchema
>;

const PersonalizedAnimeRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of personalized anime recommendations.'),
});
export type PersonalizedAnimeRecommendationsOutput = z.infer<
  typeof PersonalizedAnimeRecommendationsOutputSchema
>;

export async function personalizedAnimeRecommendations(
  input: PersonalizedAnimeRecommendationsInput
): Promise<PersonalizedAnimeRecommendationsOutput> {
  return personalizedAnimeRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedAnimeRecommendationsPrompt',
  input: {schema: PersonalizedAnimeRecommendationsInputSchema},
  output: {schema: PersonalizedAnimeRecommendationsOutputSchema},
  prompt: `You are an AI anime recommendation expert.

Based on the user's viewing history and preferred genres, provide {{numberOfRecommendations}} personalized anime recommendations.

Viewing History: {{{viewingHistory}}}
Preferred Genres: {{{preferredGenres}}}

Recommendations:`,
});

const personalizedAnimeRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedAnimeRecommendationsFlow',
    inputSchema: PersonalizedAnimeRecommendationsInputSchema,
    outputSchema: PersonalizedAnimeRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
