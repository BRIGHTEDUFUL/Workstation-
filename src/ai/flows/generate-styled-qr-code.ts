
'use server';
/**
 * @fileOverview Generates an artistically styled QR code from a prompt and URL.
 *
 * - generateStyledQrCodeAction - A server action that takes a URL and a style prompt and returns a stylized QR code image.
 * - GenerateStyledQrCodeInput - The input type for the flow.
 * - GenerateStyledQrCodeOutput - The return type for the flow.
 */

import { ai } from '@/ai/server';
import { z } from 'genkit';
import QRCode from 'qrcode';

const GenerateStyledQrCodeInputSchema = z.object({
  websiteUrl: z.string().url().describe('The website URL the QR code should point to.'),
  prompt: z.string().describe('A text prompt describing the desired artistic style of the QR code.'),
});
export type GenerateStyledQrCodeInput = z.infer<typeof GenerateStyledQrCodeInputSchema>;

const GenerateStyledQrCodeOutputSchema = z.object({
  qrCodeDataUri: z.string().describe('The generated styled QR code as a base64 data URI.'),
});
export type GenerateStyledQrCodeOutput = z.infer<typeof GenerateStyledQrCodeOutputSchema>;


export async function generateStyledQrCodeAction(
  input: GenerateStyledQrCodeInput
): Promise<GenerateStyledQrCodeOutput> {
  return generateStyledQrCodeFlow(input);
}


const generateStyledQrCodeFlow = ai.defineFlow(
  {
    name: 'generateStyledQrCodeFlow',
    inputSchema: GenerateStyledQrCodeInputSchema,
    outputSchema: GenerateStyledQrCodeOutputSchema,
  },
  async ({ websiteUrl, prompt }) => {
    // 1. Generate a standard QR code image buffer.
    const qrCodeBuffer = await QRCode.toBuffer(websiteUrl, {
      errorCorrectionLevel: 'H',
      scale: 10,
      margin: 1,
      color: {
        dark: '#000000FF',
        light: '#FFFFFFFF',
      },
    });
    const initialQrCodeDataUri = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;

    // 2. Use an image-to-image model to style the QR code.
    const { media: styledQrCode } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            { media: { url: initialQrCodeDataUri } },
            { text: `Re-style this QR code to look like: ${prompt}. IMPORTANT: The final image MUST be a valid and scannable QR code that resolves to the original data.` },
        ],
        config: {
            responseModalities: ['IMAGE'],
        },
    });
    
    if (!styledQrCode?.url) {
      throw new Error('Failed to generate styled QR code image.');
    }

    return {
      qrCodeDataUri: styledQrCode.url,
    };
  }
);
