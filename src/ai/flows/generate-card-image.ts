
'use server';

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
import { DEFAULT_CARD_DETAILS } from '../schema';

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
    // Handle both 'var(--font-inter)' and direct font family names
    const match = font.match(/--font-([^)]+)/);
    if (match) {
        switch(match[1]) {
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

    let backgroundStyles = `background-color: ${bgColor || '#ffffff'};`;
    if (patternStyle.backgroundImage) {
        backgroundStyles += `
            background-image: ${patternStyle.backgroundImage};
            background-size: ${patternStyle.backgroundSize || 'auto'};
        `;
    } else if (cardDetails.backgroundImage && cardDetails.backgroundImage.startsWith('data:image')) {
        backgroundStyles += `
            background-image: url(${cardDetails.backgroundImage});
            background-size: cover;
            background-position: center;
        `;
    }

    return `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Source+Code+Pro:wght@400;700&family=Georgia&family=Times+New+Roman&family=Arial&display=swap');
        * {
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }
        html, body {
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
        img {
            max-width: 100%;
            height: auto;
        }
    `;
}

const getFrontHtml = (cardDetails: z.infer<typeof CardDetailsSchema>) => {
    const layout = cardLayouts.layouts.find(l => l.id === cardDetails.layoutId) || cardLayouts.layouts[0];
    const elements = cardDetails.elements?.length ? cardDetails.elements : (layout.elements || []);

    const getElementStyle = (component: string, defaultStyle: React.CSSProperties) => {
        const element = elements.find(e => e.component === component);
        return {
            fontSize: `clamp(0.8rem, ${element?.fontSize || (defaultStyle as any).fontSize}vw, 2.5rem)`,
            fontWeight: element?.fontWeight || (defaultStyle as any).fontWeight,
        };
    };

    const nameStyle = getElementStyle('name', { fontSize: 2.2, fontWeight: 700 });
    const titleStyle = getElementStyle('title', { fontSize: 1.4, fontWeight: 400 });
    const companyStyle = getElementStyle('company', { fontSize: 1.1, fontWeight: 400 });

    const logoElement = elements.find(e => e.component === 'logo');
    const profilePicElement = elements.find(e => e.component === 'profilePic');

    const containerStyle: React.CSSProperties = {
        fontFamily: getFontFamily(cardDetails.font),
        display: 'flex', flexDirection: 'column',
        alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'),
        justifyContent: layout.justifyContent as any, textAlign: layout.textAlign as any,
        height: '100%', width: '100%', padding: '1.5rem',
        color: cardDetails.textColor || DEFAULT_CARD_DETAILS.textColor
    };

    const stylesToString = (styles: React.CSSProperties) => Object.entries(styles).map(([key, value]) => `${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}: ${value};`).join(' ');

    const renderImage = (url: string | undefined, alt: string, styles: React.CSSProperties = {}) => {
        if (!url || !url.startsWith('data:image')) return '';
        // Use the full data URI in the src attribute
        return `<img src="${url}" alt="${alt}" style="${stylesToString(styles)}" />`;
    }

    return `
        <div class="card-container">
            <div style="${stylesToString(containerStyle)}">
                ${(profilePicElement && cardDetails.profilePicUrl) ? `
                    <div style="margin-bottom: 1rem;">
                        ${renderImage(cardDetails.profilePicUrl, 'Profile Picture', { width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${cardDetails.accentColor || DEFAULT_CARD_DETAILS.accentColor}` })}
                    </div>
                ` : ''}
                <div style="display: flex; flex-direction: column;">
                    <h2 style="font-size: ${nameStyle.fontSize}; font-weight: ${nameStyle.fontWeight}; margin: 0; padding: 0;">${cardDetails.name || ''}</h2>
                    <p style="font-size: ${titleStyle.fontSize}; font-weight: ${titleStyle.fontWeight}; color: ${cardDetails.accentColor || DEFAULT_CARD_DETAILS.accentColor}; margin: 0.25rem 0 0 0; padding: 0;">${cardDetails.title || ''}</p>
                    <p style="margin-top: 0.5rem; font-size: ${companyStyle.fontSize}; font-weight: ${companyStyle.fontWeight}; margin: 0.5rem 0 0 0; padding: 0;">${cardDetails.company || ''}</p>
                </div>
                ${(logoElement && cardDetails.logoUrl) ? `
                    <div style="margin-top: auto;">
                        ${renderImage(cardDetails.logoUrl, 'Company Logo', { objectFit: 'contain', height: '1.5rem', maxHeight: '1.5rem', width: 'auto', maxWidth: '6rem' })}
                    </div>
                `: ''}
            </div>
        </div>
    `;
};


const getBackHtml = (cardDetails: z.infer<typeof CardDetailsSchema>) => {
    const backStyle: React.CSSProperties = {
        backgroundColor: cardDetails.bgColor || DEFAULT_CARD_DETAILS.bgColor,
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', color: cardDetails.textColor || DEFAULT_CARD_DETAILS.textColor
    };

    const stylesToString = (styles: React.CSSProperties) => Object.entries(styles).map(([key, value]) => `${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}: ${value};`).join(' ');

    const renderImage = (url: string | undefined, alt: string, styles: React.CSSProperties = {}) => {
        if (!url || !url.startsWith('data:image')) return '';
        return `<img src="${url}" alt="${alt}" style="${stylesToString(styles)}" />`;
    }

    return `
        <div style="${stylesToString(backStyle)}">
            ${cardDetails.logoUrl ? renderImage(cardDetails.logoUrl, 'Company Logo', { maxHeight: '2rem', maxWidth: '5rem', objectFit: 'contain', marginBottom: '1rem' }) : ''}
            ${(cardDetails.website && cardDetails.qrUrl) ? renderImage(cardDetails.qrUrl, 'QR Code', { width: '6rem', height: '6rem', borderRadius: '0.25rem' }) : '<div style="width: 6rem; height: 6rem;"></div>'}
            ${cardDetails.slogan ? `<p style="margin-top: 1rem; text-align: center; font-size: 0.65rem; margin: 0; padding: 0;">${cardDetails.slogan}</p>` : ''}
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
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'] });
        const page = await browser.newPage();

        const cardWidthInches = 3.5;
        const cardHeightInches = 2;
        const width = cardWidthInches * dpi;
        const height = cardHeightInches * dpi;

        await page.setViewport({ width, height });

        const html = face === 'front' ? getFrontHtml(cardDetails) : getBackHtml(cardDetails);
        const css = getCss(cardDetails);

        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `, { waitUntil: 'networkidle0' });
        
        // Additional wait to ensure all resources (especially fonts and images) are fully loaded and rendered
        await page.waitForNetworkIdle({ idleTime: 250, timeout: 5000 });

        const imageDataUri = await page.screenshot({
            encoding: 'base64',
            type: 'png',
            fullPage: true,
            omitBackground: false,
        });
        
        return {
          imageDataUri: `data:image/png;base64,${imageDataUri}`,
        };
    } catch (error) {
        console.error('Error generating card image with Puppeteer:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate card image for ${face}. Puppeteer error: ${error.message}`);
        }
        throw new Error(`Failed to generate card image for ${face} due to an unknown Puppeteer error.`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
  }
);
