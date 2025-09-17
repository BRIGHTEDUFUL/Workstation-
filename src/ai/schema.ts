
import {z} from 'genkit';

export const DesignPlanSchema = z.object({
  category: z.string().describe("Categorize the design style (e.g., 'Business', 'Creative', 'Minimalist', 'Luxury')."),
  styleDescription: z.string().describe('A brief but descriptive summary of the visual style (e.g., "Minimalist black & gold with geometric lines", "Vibrant and clean for a tech startup"). This will be shown to the user.'),
  bgColor: z.string().describe('A hex color code for the primary background color.'),
  textColor: z.string().describe('A hex color code for the main text, ensuring high contrast with bgColor.'),
  accentColor: z.string().describe('A hex color code for accent elements, complementing the other colors.'),
  font: z.string().describe("Suggest a suitable font family from this list: 'var(--font-inter)', 'var(--font-source-code-pro)', 'Arial, sans-serif', 'Georgia, serif', 'Times New Roman, serif'"),
  pattern: z.string().optional().describe("If applicable, suggest a background pattern from this list: 'dots', 'lines', 'grid', 'cross', 'zig-zag', 'carbon-fiber', 'circles', 'triangles', 'wavy'"),
});

export type DesignPlan = z.infer<typeof DesignPlanSchema>;

export const CardElementSchema = z.object({
    id: z.string(),
    component: z.enum(['name', 'title', 'company', 'logo', 'profilePic', 'slogan']),
    x: z.number().optional(),
    y: z.number().optional(),
    text: z.string().optional(),
    fontSize: z.number().optional(),
    fontWeight: z.number().optional(),
    color: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    imageUrl: z.string().optional(),
});

export const CardDetailsSchema = z.object({
    id:z.string(),
    name: z.string(),
    title:z.string(),
    company: z.string(),
    qrUrl: z.string(),
    bgColor: z.string(),
    textColor: z.string(),
    accentColor: z.string(),
    font: z.string(),
    elements: z.array(CardElementSchema),
    layoutId: z.string(),
    designDescription: z.string(),
    logoUrl: z.string().optional(),
    slogan: z.string().optional(),
    category: z.string(),
    backgroundImage: z.string().optional(),
    pattern: z.string().optional(),
    profilePicUrl: z.string().optional(),
    website: z.string().optional(),
});
