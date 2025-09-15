'use server';
/**
 * @fileOverview Generates a card background design from a text prompt.
 *
 * - generateCardBackgroundFromPrompt - A function that generates a card background based on a text prompt.
 * - GenerateCardBackgroundFromPromptInput - The input type for the generateCardBackgroundFromPrompt function.
 * - GenerateCardBackgroundFromPromptOutput - The return type for the generateCardBackgroundFromPrompt function.
 */

import {runWithApiKey} from '@/ai/genkit';
import {ai} from '@/ai/config';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GenerateCardBackgroundFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe('A text prompt describing the desired card background design.'),
  apiKey: z.string().optional(),
});
export type GenerateCardBackgroundFromPromptInput = z.infer<
  typeof GenerateCardBackgroundFromPromptInputSchema
>;

const GenerateCardBackgroundFromPromptOutputSchema = z.object({
  backgroundImageDataUri: z
    .string()
    .describe(
      "The generated card background image as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCardBackgroundFromPromptOutput = z.infer<
  typeof GenerateCardBackgroundFromPromptOutputSchema
>;

export async function generateCardBackgroundFromPrompt(
  input: GenerateCardBackgroundFromPromptInput
): Promise<GenerateCardBackgroundFromPromptOutput> {
  return runWithApiKey(generateCardBackgroundFromPromptFlow, input, input.apiKey);
}

const generateCardBackgroundFromPromptFlow = ai.defineFlow(
  {
    name: 'generateCardBackgroundFromPromptFlow',
    inputSchema: GenerateCardBackgroundFromPromptInputSchema,
    outputSchema: GenerateCardBackgroundFromPromptOutputSchema,
  },
  async ({prompt}) => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A modern, professional, high-quality 3D business card background with the following theme: ${prompt}. The design should be suitable as a background, avoiding text or logos.`,
    });
    const url = media?.url;
    if (!url) {
      throw new Error('Image generation failed.');
    }
    return {
      backgroundImageDataUri: url,
    };
  }
);
