
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

    // AI stylization is disabled for free-tier key compatibility.
    // Return the standard QR code for now.
    return {
      qrCodeDataUri: baseQrCodeDataUri,
    };
  }
);
