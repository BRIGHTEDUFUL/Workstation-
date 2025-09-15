
'use server';
/**
 * @fileOverview Generates a custom-styled QR code using AI.
 *
 * - generateQrCodeDesignAction - A server action that takes a URL and a design prompt to create a styled QR code.
 * - GenerateQrCodeDesignInput - The input type for the QR code generation function.
 * - GenerateQrCodeDesignOutput - The return type for the QR code generation function.
 */

import {ai} from '@/ai/config';
import {z} from 'genkit';
import QRCode from 'qrcode';

const GenerateQrCodeDesignInputSchema = z.object({
  url: z.string().url().describe('The URL the QR code should point to.'),
  prompt: z.string().describe('A text prompt describing the desired QR code style.'),
});
export type GenerateQrCodeDesignInput = z.infer<
  typeof GenerateQrCodeDesignInputSchema
>;

const GenerateQrCodeDesignOutputSchema = z.object({
  qrCodeDataUri: z
    .string()
    .describe(
      "The generated QR code image as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateQrCodeDesignOutput = z.infer<
  typeof GenerateQrCodeDesignOutputSchema
>;

export async function generateQrCodeDesignAction(
  input: GenerateQrCodeDesignInput
): Promise<GenerateQrCodeDesignOutput> {
  return generateQrCodeDesignFlow(input);
}


const generateQrCodeDesignFlow = ai.defineFlow(
  {
    name: 'generateQrCodeDesignFlow',
    inputSchema: GenerateQrCodeDesignInputSchema,
    outputSchema: GenerateQrCodeDesignOutputSchema,
  },
  async ({ url, prompt }) => {
    // 1. Generate a standard, high-quality QR code as a buffer
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'H', // High error correction to improve scannability after stylization
      scale: 10,
      margin: 2,
      color: {
        dark: '#000000FF',
        light: '#FFFFFFFF',
      },
    });
    const baseQrCodeDataUri = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;

    // 2. Use the image-to-image model to stylize the QR code
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            {media: {url: baseQrCodeDataUri, contentType: 'image/png'}},
            {text: `Apply the following style to this QR code: "${prompt}". The QR code functionality must be preserved. The final image must be a scannable QR code with clear distinction between dark and light modules.`},
        ],
        config: {
            responseModalities: ['IMAGE'], 
        },
    });

    if (!media || !media.url) {
      throw new Error('QR code stylization failed. The model did not return an image.');
    }
    
    return {
      qrCodeDataUri: media.url,
    };
  }
);
