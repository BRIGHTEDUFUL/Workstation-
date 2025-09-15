'use server';
/**
 * @fileOverview Generates contextual design prompt suggestions based on a card category.
 *
 * - generateDesignSuggestionsAction - A server action that takes a category and returns a list of design prompts.
 * - GenerateDesignSuggestionsInput - The input type for the generateDesignSuggestions function.
 * - GenerateDesignSuggestionsOutput - The return type for the generateDesignSuggestions function.
 */

import {ai} from '@/ai/config';
import {z} from 'genkit';

const GenerateDesignSuggestionsInputSchema = z.object({
  category: z.string().describe('The category of the business card (e.g., "Business", "Creative", "Medical").'),
});
export type GenerateDesignSuggestionsInput = z.infer<
  typeof GenerateDesignSuggestionsInputSchema
>;

const GenerateDesignSuggestionsOutputSchema = z.object({
    suggestions: z.array(z.string()).describe('A list of 3-4 creative and relevant design prompt suggestions.'),
});
export type GenerateDesignSuggestionsOutput = z.infer<
  typeof GenerateDesignSuggestionsOutputSchema
>;

export async function generateDesignSuggestionsAction(
  input: GenerateDesignSuggestionsInput
): Promise<GenerateDesignSuggestionsOutput> {
  return generateDesignSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDesignSuggestionsPrompt',
  input: {schema: GenerateDesignSuggestionsInputSchema},
  output: {schema: GenerateDesignSuggestionsOutputSchema},
  prompt: `You are a creative assistant. Your task is to generate a few (3 or 4) brief, creative, and distinct design prompts for a business card background image. The prompts should be tailored to the following category:

Category: "{{category}}"

The prompts should be suitable for a text-to-image generator. Focus on visual descriptions. For example: "A photorealistic, dark carbon fiber weave background, 4k, professional" or "A vibrant, abstract explosion of watercolor paint".`,
});


const generateDesignSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateDesignSuggestionsFlow',
    inputSchema: GenerateDesignSuggestionsInputSchema,
    outputSchema: GenerateDesignSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate design suggestions.');
    }
    return output;
  }
);
