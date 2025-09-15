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

const DesignPlanSchema = z.object({
  styleDescription: z.string().describe('A brief but descriptive summary of the visual style (e.g., "Minimalist black & gold with geometric lines", "Vibrant watercolor splash on a textured paper background").'),
  bgColor: z.string().describe('A hex color code for the primary background color.'),
  textColor: z.string().describe('A hex color code for the main text, ensuring high contrast with bgColor.'),
  accentColor: z.string().describe('A hex color code for accent elements, complementing the other colors.'),
  font: z.string().describe("Suggest a suitable font family from this list: 'var(--font-inter)', 'var(--font-source-code-pro)', 'Arial, sans-serif', 'Georgia, serif', 'Times New Roman, serif'"),
});


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
- Provide a style description: Briefly summarize the overall aesthetic.

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
    const {output: designPlan} = await ai.run(prompt, input);
    if (!designPlan) {
      throw new Error('Failed to analyze the card image and generate a design plan.');
    }
    
    return {
      designPlan,
      analysis: `AI successfully analyzed the card. Style detected: ${designPlan.styleDescription}.`
    };
  }
);
