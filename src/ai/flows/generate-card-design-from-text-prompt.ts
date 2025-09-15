'use server';
/**
 * @fileOverview Generates a 3D animated card design from a text prompt.
 *
 * - generateCardDesignFromTextPrompt - A function that generates a card design based on a text prompt.
 * - GenerateCardDesignFromTextPromptInput - The input type for the generateCardDesignFromTextPrompt function.
 * - GenerateCardDesignFromTextPromptOutput - The return type for the generateCardDesignFromTextPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCardDesignFromTextPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe('A text prompt describing the desired card design.'),
});
export type GenerateCardDesignFromTextPromptInput = z.infer<
  typeof GenerateCardDesignFromTextPromptInputSchema
>;

const GenerateCardDesignFromTextPromptOutputSchema = z.object({
  cardDesignDataUri: z
    .string()
    .describe(
      'The generated 3D animated card design as a data URI. It must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.')
});
export type GenerateCardDesignFromTextPromptOutput = z.infer<
  typeof GenerateCardDesignFromTextPromptOutputSchema
>;

export async function generateCardDesignFromTextPrompt(
  input: GenerateCardDesignFromTextPromptInput
): Promise<GenerateCardDesignFromTextPromptOutput> {
  return generateCardDesignFromTextPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCardDesignFromTextPromptPrompt',
  input: {schema: GenerateCardDesignFromTextPromptInputSchema},
  output: {schema: GenerateCardDesignFromTextPromptOutputSchema},
  prompt: `You are an expert card designer specializing in 3D animated card designs.

  Based on the following text prompt, generate a 3D animated card design.  Return the design as a data URI.

  Prompt: {{{prompt}}}`,
});

const generateCardDesignFromTextPromptFlow = ai.defineFlow(
  {
    name: 'generateCardDesignFromTextPromptFlow',
    inputSchema: GenerateCardDesignFromTextPromptInputSchema,
    outputSchema: GenerateCardDesignFromTextPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
