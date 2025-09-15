import {z} from 'genkit';

export const DesignPlanSchema = z.object({
  category: z.string().describe("Categorize the design style (e.g., 'Business', 'Creative', 'Minimalist', 'Luxury')."),
  styleDescription: z.string().describe('A brief but descriptive summary of the visual style (e.g., "Minimalist black & gold with geometric lines", "Vibrant watercolor splash on a textured paper background").'),
  bgColor: z.string().describe('A hex color code for the primary background color.'),
  textColor: z.string().describe('A hex color code for the main text, ensuring high contrast with bgColor.'),
  accentColor: z.string().describe('A hex color code for accent elements, complementing the other colors.'),
  font: z.string().describe("Suggest a suitable font family from this list: 'var(--font-inter)', 'var(--font-source-code-pro)', 'Arial, sans-serif', 'Georgia, serif', 'Times New Roman, serif'"),
  layout: z.enum(['classic', 'modern-left', 'modern-right', 'minimalist', 'no-photo-centered']).describe("Select the most appropriate layout from the available options based on the card image analysis."),
});

export type DesignPlan = z.infer<typeof DesignPlanSchema>;
