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
import { DesignPlanSchema } from '@/ai/schema';

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
  designPlan: DesignPlanSchema,
  analysis: z.string().describe("A summary of the AI's analysis of the card design.")
});

export type ImportCardDesignFromImageOutput = z.infer<
  typeof ImportCardDesignFromImageOutputSchema
>;

export async function importCardDesignAction(
  input: ImportCardDesignFromImageInput
): Promise<ImportCardDesignFromImageOutput> {
  return importCardDesignFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importCardDesignFromImagePrompt',
  input: {schema: ImportCardDesignFromImageInputSchema},
  output: {schema: DesignPlanSchema},
  prompt: `You are an AI assistant specialized in analyzing business card designs from images.

You will receive a card design as an image. Analyze its layout, colors, and fonts.
Your task is to extract the key design elements and return them as a structured design plan.

- Analyze the main colors: identify the background color, the primary text color, and a key accent color. Ensure the text and background colors have good contrast.
- Suggest a font: Pick the most appropriate font from the provided list that matches the style of the card.
- Analyze the layout: Based on the position of text and any photo, choose the best layout. The options are 'classic' (photo centered above text), 'modern-left' (photo on left, text on right), 'modern-right' (text on left, photo on right), 'minimalist' (centered text, no photo), or 'no-photo-centered' (centered text, no photo).
- Provide a style description: Briefly summarize the overall aesthetic.
- Categorize the design: Determine the most fitting category for the card design.

Card Design Image: {{media url=fileDataUri}}

Generate a design plan based on this information.
`,
});

const importCardDesignFromImageFlow = ai.defineFlow(
  {
    name: 'importCardDesignFromImageFlow',
    inputSchema: ImportCardDesignFromImageInputSchema,
    outputSchema: ImportCardDesignFromImageOutputSchema,
  },
  async (input) => {
    const {output: designPlan} = await prompt(input);
    if (!designPlan) {
      throw new Error('Failed to analyze the card image and generate a design plan.');
    }
    
    return {
      designPlan,
      analysis: `AI successfully analyzed the card. Layout detected: ${designPlan.layout}. Style detected: ${designPlan.styleDescription}.`
    };
  }
);
