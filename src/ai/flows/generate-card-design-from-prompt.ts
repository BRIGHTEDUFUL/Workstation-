'use server';
/**
 * @fileOverview Orchestrates the AI-powered generation of a complete card design from a text prompt.
 *
 * - generateCardDesignAction - A server action that takes a user prompt and details, and returns a full card design.
 * - GenerateCardDesignFromPromptInput - The input type for the generateCardDesignFromPrompt function.
 * - GenerateCardDesignFromPromptOutput - The return type for the generateCardDesignFromPrompt function.
 */

import {ai} from '@/ai/config';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GenerateCardDesignFromPromptInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired card design.'),
  name: z.string().describe("The user's name for the card."),
  title: z.string().describe("The user's title for the card."),
  company: z.string().describe("The user's company for the card."),
});
export type GenerateCardDesignFromPromptInput = z.infer<
  typeof GenerateCardDesignFromPromptInputSchema
>;

const DesignPlanSchema = z.object({
  category: z.string().describe("Categorize the design style (e.g., 'Business', 'Creative', 'Minimalist', 'Luxury')."),
  styleDescription: z.string().describe('A brief but descriptive summary of the visual style for the image generator (e.g., "Minimalist black & gold with geometric lines", "Vibrant watercolor splash on a textured paper background").'),
  bgColor: z.string().describe('A hex color code for the primary background color.'),
  textColor: z.string().describe('A hex color code for the main text, ensuring high contrast with bgColor.'),
  accentColor: z.string().describe('A hex color code for accent elements, complementing the other colors.'),
  font: z.string().describe("Suggest a suitable font family from this list: 'var(--font-inter)', 'var(--font-source-code-pro)', 'Arial, sans-serif', 'Georgia, serif', 'Times New Roman, serif'"),
});

const GenerateCardDesignFromPromptOutputSchema = z.object({
  designPlan: DesignPlanSchema,
  backgroundImageDataUri: z
    .string()
    .describe(
      "The generated card background image as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCardDesignFromPromptOutput = z.infer<
  typeof GenerateCardDesignFromPromptOutputSchema
>;

export async function generateCardDesignAction(
  input: GenerateCardDesignFromPromptInput,
): Promise<GenerateCardDesignFromPromptOutput> {
  return generateCardDesignFromPromptFlow(input);
}

const designPlanPrompt = ai.definePrompt({
  name: 'designPlanPrompt',
  input: {schema: GenerateCardDesignFromPromptInputSchema},
  output: {schema: DesignPlanSchema},
  prompt: `You are a professional business card designer. Your task is to create a design plan based on the user's request.

Analyze the user's prompt and details to create a cohesive and professional design plan. The plan should include a category, a style description for an image generator, appropriate colors, and a font.

User Prompt: "{{prompt}}"
Card Details:
- Name: {{name}}
- Title: {{title}}
- Company: {{company}}

Generate a design plan based on this information. Ensure the colors have good contrast and the font is appropriate for the described style.`,
});

const generateCardDesignFromPromptFlow = ai.defineFlow(
  {
    name: 'generateCardDesignFromPromptFlow',
    inputSchema: GenerateCardDesignFromPromptInputSchema,
    outputSchema: GenerateCardDesignFromPromptOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the design plan (colors, fonts, etc.)
    const {output: designPlan} = await ai.run(designPlanPrompt, input);

    if (!designPlan) {
      throw new Error('Failed to generate design plan.');
    }

    // Step 2: Generate the background image based on the plan
    const {media} = await ai.generate({
      model: googleAI.model('imagen-4.0-fast-generate-001'),
      prompt: `A modern, professional, high-quality 3D business card background with the following theme: ${designPlan.styleDescription}. The design should be suitable as a background, avoiding text or logos.`,
    });

    const url = media?.url;
    if (!url) {
      throw new Error('Image generation failed.');
    }

    // Step 3: Combine and return the results
    return {
      designPlan,
      backgroundImageDataUri: url,
    };
  }
);
