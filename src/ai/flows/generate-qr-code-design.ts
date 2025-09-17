
'use server';
/**
 * @fileOverview Generates a standard QR code.
 *
 * - generateQrCodeDesignAction - A server action that takes a URL and a design prompt to create a styled QR code.
 * - GenerateQrCodeDesignInput - The input type for the QR code generation function.
 * - GenerateQrCodeDesignOutput - The return type for the QR code generation function.
 */

import {z} from 'genkit';
import QRCode from 'qrcode';

const GenerateQrCodeDesignInputSchema = z.object({
  url: z.string().url().describe('The URL the QR code should point to.'),
  prompt: z.string().describe('A text prompt describing the desired QR code style or a key for a static style.'),
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
  // Default QR Code options
  const qrCodeOptions: QRCode.QRCodeToBufferOptions = {
    errorCorrectionLevel: 'H',
    scale: 10,
    margin: 2,
    color: {
        dark: '#000000FF',
        light: '#FFFFFFFF',
    },
  };
  
  const baseQrCodeBuffer = await QRCode.toBuffer(input.url, qrCodeOptions);
  const baseQrCodeDataUri = `data:image/png;base64,${baseQrCodeBuffer.toString('base64')}`;

  return { qrCodeDataUri: baseQrCodeDataUri };
}
