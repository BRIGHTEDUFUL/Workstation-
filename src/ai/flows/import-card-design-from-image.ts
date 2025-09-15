'use server';
/**
 * @fileOverview Imports an existing card design from an image or PDF file and recreates it as an editable design.
 *
 * - importCardDesignAction - A server action that handles the card design import process.
 * - ImportCardDesignFromImageInput - The input type for the importCardDesignFromImage function.
 * - ImportCardDesignFromImageOutput - The return type for the importCardDesignFromImage function.
 */

import {ai} from '@/ai/config';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {Genkit, genkit} from 'genkit';

const ImportCardDesignFromImageInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The card design image or PDF file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImportCardDesignFromImageInput = z.infer<
  typeof ImportCardDesignFromImageInputSchema
>;

const ImportCardDesignFromImageOutputSchema = z.object({
  designDescription: z
    .string()
    .describe(
      'A detailed description of the imported card design, suitable for recreating it as an editable design.'
    ),
});
export type ImportCardDesignFromImageOutput = z.infer<
  typeof ImportCardDesignFromImageOutputSchema
>;

export async function importCardDesignAction(
  input: ImportCardDesignFromImageInput,
  apiKey: string,
): Promise<ImportCardDesignFromImageOutput> {
  const dynamicAi = genkit({
    plugins: [googleAI({apiKey})],
  });
  return importCardDesignFromImageFlow(input, dynamicAi);
}

const prompt = ai.definePrompt({
  name: 'importCardDesignFromImagePrompt',
  input: {schema: ImportCardDesignFromImageInputSchema},
  output: {schema: ImportCardDesignFromImageOutputSchema},
  prompt: `You are an AI assistant specialized in recreating card designs from existing images or PDF files.

You will receive a card design as a data URI. Analyze the design and provide a detailed description of the card's layout, colors, fonts, patterns, and any other relevant design elements.

This description should be comprehensive enough to allow a designer to recreate the card as an editable design.

Card Design: {{media url=fileDataUri}}

Provide a detailed description of the card design:
`,
});

async function importCardDesignFromImageFlow(
  input: ImportCardDesignFromImageInput,
  aiInstance: Genkit,
): Promise<ImportCardDesignFromImageOutput> {
  const {output} = await prompt(input, {ai: aiInstance});
  return output!;
}
