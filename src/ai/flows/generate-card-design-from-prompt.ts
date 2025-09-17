
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
import { DesignPlanSchema } from '@/ai/schema';
import { getCompanyInfo } from '@/ai/tools/company-info-tool';

const GenerateCardDesignFromPromptInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired card design.'),
  name: z.string().describe("The user's name for the card."),
  title: z.string().describe("The user's title for the card."),
  company: z.string().describe("The user's company for the card."),
  websiteUrl: z.string().optional().describe('The URL of the company website.'),
});
export type GenerateCardDesignFromPromptInput = z.infer<
  typeof GenerateCardDesignFromPromptInputSchema
>;

const GenerateCardDesignFromPromptOutputSchema = z.object({
  designPlan: DesignPlanSchema,
  backgroundImageDataUri: z
    .string().optional()
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
  tools: [getCompanyInfo],
  prompt: `You are a professional business card designer. Your task is to create a design plan based on the user's request.

Analyze the user's prompt and details to create a cohesive and professional design plan. The plan should include a category, a style description for an image generator, appropriate colors, a font, and optionally a background pattern from the provided list.

If the user provides a website URL, use the getCompanyInfo tool to retrieve information about the company. Use this information (like brand colors or description) to heavily influence your design choices to ensure the card is on-brand.

User Prompt: "{{prompt}}"
Card Details:
- Name: {{name}}
- Title: {{title}}
- Company: {{company}}
{{#if websiteUrl}}- Website: {{websiteUrl}}{{/if}}

Generate a design plan based on this information. Ensure the colors have good contrast and the font is appropriate for the described style. If the prompt mentions a pattern (like 'dots', 'lines', 'grid'), set the pattern field. If the prompt asks for a background image, leave the pattern field empty.`,
});

const generateCardDesignFromPromptFlow = ai.defineFlow(
  {
    name: 'generateCardDesignFromPromptFlow',
    inputSchema: GenerateCardDesignFromPromptInputSchema,
    outputSchema: GenerateCardDesignFromPromptOutputSchema,
  },
  async (input) => {
    // Step 1: Generate the design plan (colors, fonts, etc.)
    const {output: designPlan} = await designPlanPrompt(input);

    if (!designPlan) {
      throw new Error('Failed to generate design plan.');
    }
    
    // Step 2: Return the design plan.
    // Background image generation is disabled for free-tier key compatibility.
    return {
      designPlan,
      backgroundImageDataUri: '',
    };
  }
);
