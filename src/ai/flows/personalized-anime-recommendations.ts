
'use server';

/**
 * @fileOverview This file contains AI flows for anime recommendations and genre suggestions.
 * - suggestGenres: An AI flow that suggests genres based on an anime's title and description.
 * - getPersonalizedRecommendations: An AI flow that provides personalized anime recommendations based on a user's preferences.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

//+++++++++++++++ GENRE SUGGESTION FLOW +++++++++++++++//

const SuggestGenresInputSchema = z.object({
  title: z.string().describe('The title of the anime.'),
  description: z.string().describe('The description or synopsis of the anime.'),
});

const SuggestGenresOutputSchema = z.object({
  genres: z.array(z.string()).describe('A list of suggested genres for the anime.'),
});

export type SuggestGenresInput = z.infer<typeof SuggestGenresInputSchema>;
export type SuggestGenresOutput = z.infer<typeof SuggestGenresOutputSchema>;

export async function suggestGenres(input: SuggestGenresInput): Promise<SuggestGenresOutput> {
  const suggestGenresFlow = ai.defineFlow(
    {
      name: 'suggestGenresFlow',
      inputSchema: SuggestGenresInputSchema,
      outputSchema: SuggestGenresOutputSchema,
    },
    async (flowInput) => {
      const prompt = ai.definePrompt({
          name: 'suggestGenresPrompt',
          input: { schema: SuggestGenresInputSchema },
          output: { schema: SuggestGenresOutputSchema },
          prompt: `You are an expert in anime and manga genres. Based on the provided title and description, suggest a list of relevant genres.

          Your response must be a valid JSON object matching the output schema.
          
          Anime Title: {{{title}}}
          Anime Description: {{{description}}}
          
          Return a list of 3 to 5 of the most relevant genres. Use common and recognizable genre names. For example: "Aksi", "Petualangan", "Fantasi", "Sci-Fi", "Slice of Life", "Romansa", "Misteri", "Isekai".`,
      });
      
      const { output } = await prompt(flowInput);
      return output || { genres: [] };
    }
  );
  return await suggestGenresFlow(input);
}


//+++++++++++++++ PERSONALIZED RECOMMENDATION FLOW +++++++++++++++//

const PersonalizedRecommendationsInputSchema = z.object({
  watchedTitles: z.array(z.string()).describe("A list of anime titles the user has watched and liked."),
  allTitles: z.array(z.string()).describe("A comprehensive list of all available anime titles to recommend from."),
});

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.object({
    title: z.string().describe("The title of the recommended anime."),
    reason: z.string().describe("A brief, one-sentence explanation of why this anime is recommended based on the user's watch history."),
  })).describe("A list of personalized anime recommendations."),
});

export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;


export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  const recommendationsFlow = ai.defineFlow(
    {
      name: 'recommendationsFlow',
      inputSchema: PersonalizedRecommendationsInputSchema,
      outputSchema: PersonalizedRecommendationsOutputSchema,
    },
    async (flowInput) => {
        const prompt = ai.definePrompt({
          name: 'personalizedRecommendationsPrompt',
          input: { schema: PersonalizedRecommendationsInputSchema },
          output: { schema: PersonalizedRecommendationsOutputSchema },
          prompt: `You are an advanced AI recommendation engine for an anime streaming platform. Your goal is to provide highly personalized anime recommendations.

          Analyze the user's watch history to understand their tastes. Consider genres, themes, animation style, and narrative structure.
          
          User's Watched/Liked Anime:
          {{#each watchedTitles}}- {{{this}}}
          {{/each}}

          List of all available anime to recommend from (do not recommend titles the user has already watched):
          {{#each allTitles}}- {{{this}}}
          {{/each}}

          Based on this, provide 5 new anime recommendations from the available list. For each recommendation, provide a compelling, one-sentence reason why the user would like it, directly connecting it to their watch history.
          
          Example reasoning: "Karena Anda menyukai 'Attack on Titan' dengan tema gelap dan aksi brutalnya, Anda mungkin akan menikmati 'Vinland Saga'."
          
          Return your response as a valid JSON object matching the output schema.`,
        });

      const { output } = await prompt(flowInput);
      return output || { recommendations: [] };
    }
  );
  return await recommendationsFlow(input);
}
