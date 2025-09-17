
'use server';

/**
 * @fileOverview Orchestrates the AI-powered generation of a card design plan from a text prompt.
 *
 * - generateCardDesignAction - A server action that takes a user prompt and details, and returns a design plan.
 * - GenerateCardDesignFromPromptInput - The input type for the generateCardDesignFromPrompt function.
 * - GenerateCardDesignFromPromptOutput - The return type for the generateCardDesignFromPrompt function.
 */

import {ai} from '@/ai/server';
import {z} from 'genkit';
import { DesignPlanSchema } from '@/ai/schema';
import { getCompanyInfo } from '../tools/get-company-info';


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
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are a professional business card designer. Your task is to create a design plan that complements the user's provided details and prompt.

Analyze the user's prompt and the card content (name, title, company) to create a cohesive and professional design plan. The plan must include a category, a style description, appropriate colors, a font, and optionally a background pattern.

If the user provides a website URL, use the getCompanyInfo tool to retrieve information about the company. Use this information (like brand colors or description) to heavily influence your design choices to ensure the card is on-brand.

User Prompt: "{{prompt}}"
Card Details:
- Name: {{name}}
- Title: {{title}}
- Company: {{company}}
{{#if websiteUrl}}- Website: {{websiteUrl}}{{/if}}

Generate a design plan based on this information. Ensure the colors have good contrast and the font is appropriate for the described style. Do not suggest background images, only patterns from the available list if applicable.`,
});

const generateCardDesignFromPromptFlow = ai.defineFlow(
  {
    name: 'generateCardDesignFromPromptFlow',
    inputSchema: GenerateCardDesignFromPromptInputSchema,
    outputSchema: GenerateCardDesignFromPromptOutputSchema,
  },
  async (input) => {
    // Generate the design plan (colors, fonts, etc.)
    const {output: designPlan} = await designPlanPrompt(input);

    if (!designPlan) {
      throw new Error('Failed to generate design plan.');
    }
    
    return {
      designPlan,
    };
  }
);
