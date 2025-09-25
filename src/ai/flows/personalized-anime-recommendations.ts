'use server';

/**
 * @fileOverview This file contains AI flows for anime recommendations and genre suggestions.
 * - suggestGenres: An AI flow that suggests genres based on an anime's title and description.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Schema for the input of the genre suggestion flow
const SuggestGenresInputSchema = z.object({
  title: z.string().describe('The title of the anime.'),
  description: z.string().describe('The description or synopsis of the anime.'),
});

// Schema for the output of the genre suggestion flow
const SuggestGenresOutputSchema = z.object({
  genres: z.array(z.string()).describe('A list of suggested genres for the anime.'),
});

export type SuggestGenresInput = z.infer<typeof SuggestGenresInputSchema>;
export type SuggestGenresOutput = z.infer<typeof SuggestGenresOutputSchema>;

/**
 * An asynchronous function that takes an anime's title and description,
 * and returns a list of suggested genres using an AI model.
 * @param input - An object containing the anime title and description.
 * @returns A promise that resolves to an object containing an array of genre strings.
 */
export async function suggestGenres(input: SuggestGenresInput): Promise<SuggestGenresOutput> {
  // Define the prompt for the AI model
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

  // Define the AI flow
  const suggestGenresFlow = ai.defineFlow(
    {
      name: 'suggestGenresFlow',
      inputSchema: SuggestGenresInputSchema,
      outputSchema: SuggestGenresOutputSchema,
    },
    async (flowInput) => {
      const { output } = await prompt(flowInput);
      return output || { genres: [] };
    }
  );

  // Execute the flow and return the result
  return await suggestGenresFlow(input);
}
