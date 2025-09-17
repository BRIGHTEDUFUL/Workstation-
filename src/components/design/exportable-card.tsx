
'use client'

import React from 'react';
import type { CardDetails } from './card-data';
import cardLayouts from '@/lib/card-layouts.json';
import { getPatternStyle } from '@/lib/patterns';

interface ExportableCardProps {
  cardDetails: CardDetails;
  face: 'front' | 'back';
}

const ExportableCard = React.forwardRef<HTMLDivElement, ExportableCardProps>(({ cardDetails, face }, ref) => {
    // Standard business card: 3.5 x 2 inches. At 96 DPI, this is 336x192 px.
    const baseWidth = 336;
    const baseHeight = 192;

    const getProxiedUrl = (url: string | undefined) => {
        if (!url) return '';
        // If it's a data URI, use it directly
        if (url.startsWith('data:')) {
            return url;
        }
        // Otherwise, proxy it to avoid CORS issues
        return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    };

    const getFontFamily = (font: string) => {
        if (font.startsWith('var(--font-')) {
            return font.replace('var(--font-', '').replace(')', '').replace(/-/g, ' ');
        }
        return font.split(',')[0].replace(/'/g, "");
    }

    const cardStyle: React.CSSProperties = {
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        fontFamily: getFontFamily(cardDetails.font),
        position: 'relative',
        overflow: 'hidden',
    };

    const renderFront = () => {
        const layout = cardLayouts.layouts.find(l => l.id === cardDetails.layoutId) || cardLayouts.layouts[0];
        const elements = cardDetails.elements || [];
        
        const frontStyle: React.CSSProperties = {
            ...getPatternStyle(cardDetails.pattern, cardDetails.accentColor),
            backgroundColor: cardDetails.bgColor,
            width: '100%',
            height: '100%',
            position: 'relative',
        };

        if (cardDetails.backgroundImage && !cardDetails.pattern) {
            frontStyle.backgroundImage = `url(${getProxiedUrl(cardDetails.backgroundImage)})`;
            frontStyle.backgroundSize = 'cover';
            frontStyle.backgroundPosition = 'center';
        }
        
        const containerStyle: React.CSSProperties = {
            fontFamily: getFontFamily(cardDetails.font),
            display: 'flex',
            flexDirection: 'column',
            alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'),
            justifyContent: layout.justifyContent as any,
            textAlign: layout.textAlign as any,
            height: '100%',
            width: '100%',
            padding: '1rem',
            boxSizing: 'border-box',
            color: cardDetails.textColor,
        };

        const getFontSize = (vw: number | undefined) => `${(vw || 1) * 0.01 * baseHeight * 0.5}px`;

        const nameElement = elements.find(e => e.component === 'name') || { fontSize: 2.2, fontWeight: 700 };
        const titleElement = elements.find(e => e.component === 'title') || { fontSize: 1.4, fontWeight: 400 };
        const companyElement = elements.find(e => e.component === 'company') || { fontSize: 1.1, fontWeight: 400 };
        const logoElement = elements.find(e => e.component === 'logo');
        const profilePicElement = elements.find(e => e.component === 'profilePic');


        return (
            <div style={frontStyle}>
                <div style={containerStyle}>
                    {profilePicElement && cardDetails.profilePicUrl && (
                        <div style={{ marginBottom: '1rem' }}>
                             <img 
                                src={getProxiedUrl(cardDetails.profilePicUrl)} 
                                alt={cardDetails.name} 
                                style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${cardDetails.accentColor}` }} 
                             />
                        </div>
                    )}
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: getFontSize(nameElement.fontSize), fontWeight: nameElement.fontWeight, margin: 0, padding: 0, lineHeight: 1.2 }}>
                            {cardDetails.name}
                        </h2>
                        <p style={{ fontSize: getFontSize(titleElement.fontSize), fontWeight: titleElement.fontWeight, color: cardDetails.accentColor, margin: 0, padding: 0, lineHeight: 1.2 }}>
                            {cardDetails.title}
                        </p>
                        <p style={{ fontSize: getFontSize(companyElement.fontSize), fontWeight: companyElement.fontWeight, marginTop: '0.25rem', marginBlock: 0, padding: 0, lineHeight: 1.2 }}>
                            {cardDetails.company}
                        </p>
                     </div>
                     {logoElement && cardDetails.logoUrl && (
                        <div style={{ marginTop: 'auto' }}>
                           <img 
                                src={getProxiedUrl(cardDetails.logoUrl)} 
                                alt="Company Logo" 
                                style={{ maxHeight: '1.5rem', maxWidth: '4rem', objectFit: 'contain' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderBack = () => {
        const backStyle: React.CSSProperties = {
            backgroundColor: cardDetails.bgColor,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            boxSizing: 'border-box'
        };

        return (
            <div style={backStyle}>
                {cardDetails.logoUrl && (
                    <img
                        src={getProxiedUrl(cardDetails.logoUrl)}
                        alt="Company Logo"
                        style={{ maxHeight: '2rem', maxWidth: '5rem', objectFit: 'contain', marginBottom: '1rem' }}
                    />
                )}
                {cardDetails.website && cardDetails.qrUrl ? (
                    <img
                        src={cardDetails.qrUrl} // QR is a data URI, no proxy needed
                        alt="QR Code"
                        style={{ width: '6rem', height: '6rem', borderRadius: '0.25rem' }}
                    />
                ) : (
                    <div style={{ width: '6rem', height: '6rem' }}></div>
                )}
                {cardDetails.slogan && (
                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.65rem', color: cardDetails.textColor, fontFamily: getFontFamily(cardDetails.font) }}>
                        {cardDetails.slogan}
                    </p>
                )}
            </div>
        );
    };

    return (
      <div ref={ref} style={cardStyle}>
        {face === 'front' ? renderFront() : renderBack()}
      </div>
    );
});

ExportableCard.displayName = 'ExportableCard';
export default ExportableCard;

