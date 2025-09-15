'use server';
/**
 * @fileOverview Generates a card background design from a text prompt.
 *
 * - generateCardBackgroundAction - A function that generates a card background based on a text prompt.
 * - GenerateCardBackgroundFromPromptInput - The input type for the generateCardBackgroundFromPrompt function.
 * - GenerateCardBackgroundFromPromptOutput - The return type for the generateCardBackgroundFromPrompt function.
 */

import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {Genkit, genkit} from 'genkit';

const GenerateCardBackgroundFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe('A text prompt describing the desired card background design.'),
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

export async function generateCardBackgroundAction(
  input: GenerateCardBackgroundFromPromptInput,
  apiKey: string
): Promise<GenerateCardBackgroundFromPromptOutput> {
  const dynamicAi = genkit({
    plugins: [googleAI({apiKey})],
  });
  return generateCardBackgroundFromPromptFlow(input, dynamicAi);
}

async function generateCardBackgroundFromPromptFlow(
  input: GenerateCardBackgroundFromPromptInput,
  aiInstance: Genkit
): Promise<GenerateCardBackgroundFromPromptOutput> {
  const {media} = await aiInstance.generate({
    model: googleAI.model('imagen-4.0-fast-generate-001'),
    prompt: `A modern, professional, high-quality 3D business card background with the following theme: ${input.prompt}. The design should be suitable as a background, avoiding text or logos.`,
  });
  const url = media?.url;
  if (!url) {
    throw new Error('Image generation failed.');
  }
  return {
    backgroundImageDataUri: url,
  };
}
