
/**
 * @fileOverview Generates a card image on the server using Puppeteer.
 *
 * - generateCardImageAction - A server action that takes card details and returns an image data URI.
 */
import { z } from 'genkit';
import { ai } from '@/ai/server';
import { CardDetailsSchema } from '../schema';
import * as puppeteer from 'puppeteer';
import { getPatternStyle } from '@/lib/patterns';
import cardLayouts from '@/lib/card-layouts.json';

const GenerateCardImageInputSchema = z.object({
  cardDetails: CardDetailsSchema,
  face: z.enum(['front', 'back']),
  dpi: z.number().default(300),
});

const GenerateCardImageOutputSchema = z.object({
  imageDataUri: z.string(),
});

export async function generateCardImageAction(
  input: z.infer<typeof GenerateCardImageInputSchema>
): Promise<z.infer<typeof GenerateCardImageOutputSchema>> {
  return generateCardImageFlow(input);
}

const getFontFamily = (font: string | undefined): string => {
    if (!font) return 'Inter, sans-serif';
    if (font.startsWith('var(--font-')) {
        const fontName = font.match(/--font-([^)]+)/)?.[1];
        switch(fontName) {
            case 'inter': return 'Inter, sans-serif';
            case 'source-code-pro': return "'Source Code Pro', monospace";
            default: return 'sans-serif';
        }
    }
    return font;
};

const getCss = (cardDetails: z.infer<typeof CardDetailsSchema>) => {
    const { pattern, accentColor, bgColor, font } = cardDetails;
    const patternStyle = getPatternStyle(pattern, accentColor);

    let backgroundStyles = `background-color: ${bgColor};`;
    if (patternStyle.backgroundImage) {
        backgroundStyles += `
            background-image: ${patternStyle.backgroundImage};
            background-size: ${patternStyle.backgroundSize || 'auto'};
        `;
    } else if (cardDetails.backgroundImage) {
        backgroundStyles += `
            background-image: url(${cardDetails.backgroundImage});
            background-size: cover;
            background-position: center;
        `;
    }

    return `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Source+Code+Pro:wght@400;700&family=Georgia&family=Times+New+Roman&family=Arial&display=swap');
        body {
            font-family: ${getFontFamily(font)};
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
        .card-container {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
            ${backgroundStyles}
        }
    `;
}

const getFrontHtml = (cardDetails: z.infer<typeof CardDetailsSchema>) => {
    const layout = cardLayouts.layouts.find(l => l.id === cardDetails.layoutId) || cardLayouts.layouts[0];
    const elements = cardDetails.elements || [];

    const nameElement = elements.find(e => e.component === 'name') || { fontSize: 2.2, fontWeight: 700 };
    const titleElement = elements.find(e => e.component === 'title') || { fontSize: 1.4, fontWeight: 400 };
    const companyElement = elements.find(e => e.component === 'company') || { fontSize: 1.1, fontWeight: 400 };
    const logoElement = elements.find(e => e.component === 'logo');
    const profilePicElement = elements.find(e => e.component === 'profilePic');

    const containerStyle: React.CSSProperties = {
        fontFamily: getFontFamily(cardDetails.font),
        display: 'flex', flexDirection: 'column',
        alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'),
        justifyContent: layout.justifyContent as any, textAlign: layout.textAlign as any,
        height: '100%', width: '100%', padding: '1rem', boxSizing: 'border-box',
        color: cardDetails.textColor
    };

    const stylesToString = (styles: React.CSSProperties) => Object.entries(styles).map(([key, value]) => `${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}: ${value};`).join(' ');

    return `
        <div class="card-container">
            <div style="${stylesToString(containerStyle)}">
                ${profilePicElement && cardDetails.profilePicUrl ? `
                    <div style="margin-bottom: 1rem;">
                        <img src="${cardDetails.profilePicUrl}" style="width: 4rem; height: 4rem; border-radius: 50%; object-fit: cover; border: 2px solid ${cardDetails.accentColor}" />
                    </div>
                ` : ''}
                <div style="display: flex; flex-direction: column;">
                    <h2 style="font-size: clamp(0.8rem, ${nameElement.fontSize || 2.2}vw, 2.5rem); font-weight: ${nameElement.fontWeight || 700}; margin: 0; padding: 0;">${cardDetails.name}</h2>
                    <p style="font-size: clamp(0.8rem, ${titleElement.fontSize || 1.4}vw, 2.5rem); font-weight: ${titleElement.fontWeight || 400}; color: ${cardDetails.accentColor}; margin: 0; padding: 0; margin-top: 0.25rem;">${cardDetails.title}</p>
                    <p style="margin-top: 0.5rem; font-size: clamp(0.8rem, ${companyElement.fontSize || 1.1}vw, 2.5rem); font-weight: ${companyElement.fontWeight || 400}; margin: 0; padding: 0;">${cardDetails.company}</p>
                </div>
                ${logoElement && cardDetails.logoUrl ? `
                    <div style="margin-top: auto;">
                        <img src="${cardDetails.logoUrl}" style="object-fit: contain; height: 1.5rem; max-height: 1.5rem; width: auto; max-width: 6rem;" />
                    </div>
                `: ''}
            </div>
        </div>
    `;
};


const getBackHtml = (cardDetails: z.infer<typeof CardDetailsSchema>) => {
    const backStyle: React.CSSProperties = {
        backgroundColor: cardDetails.bgColor, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', boxSizing: 'border-box', color: cardDetails.textColor
    };

    const stylesToString = (styles: React.CSSProperties) => Object.entries(styles).map(([key, value]) => `${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}: ${value};`).join(' ');

    return `
        <div style="${stylesToString(backStyle)}">
            ${cardDetails.logoUrl ? `
                <img src="${cardDetails.logoUrl}" alt="Company Logo" style="max-height: 2rem; max-width: 5rem; object-fit: contain; margin-bottom: 1rem;" />
            ` : ''}
            ${cardDetails.website && cardDetails.qrUrl ? `
                <img src="${cardDetails.qrUrl}" alt="QR Code" style="width: 6rem; height: 6rem; border-radius: 0.25rem;" />
            ` : '<div style="width: 6rem; height: 6rem;"></div>'}
            ${cardDetails.slogan ? `
                <p style="margin-top: 1rem; text-align: center; font-size: 0.65rem; margin: 0; padding: 0;">
                    ${cardDetails.slogan}
                </p>
            ` : ''}
        </div>
    `;
};

const generateCardImageFlow = ai.defineFlow(
  {
    name: 'generateCardImageFlow',
    inputSchema: GenerateCardImageInputSchema,
    outputSchema: GenerateCardImageOutputSchema,
  },
  async ({ cardDetails, face, dpi }) => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    const cardWidthInches = 3.5;
    const cardHeightInches = 2;
    const width = cardWidthInches * dpi;
    const height = cardHeightInches * dpi;

    await page.setViewport({ width, height });

    const html = face === 'front' ? getFrontHtml(cardDetails) : getBackHtml(cardDetails);
    const css = getCss(cardDetails);

    await page.setContent(`
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
            </body>
        </html>
    `, { waitUntil: 'networkidle0' });

    const imageDataUri = await page.screenshot({
        encoding: 'base64',
        type: 'png',
        fullPage: true
    });
    
    await browser.close();

    return {
      imageDataUri: `data:image/png;base64,${imageDataUri}`,
    };
  }
);
