
'use client';

import React from 'react';
import type { CardDetails } from './card-data';
import cardLayouts from '@/lib/card-layouts.json';
import { getPatternStyle } from '@/lib/patterns';

// Helper to get a proxied URL for an image to avoid canvas tainting.
const getProxiedUrl = (url: string | undefined) => {
    if (!url) return '';
    // Data URIs don't need proxying.
    if (url.startsWith('data:')) return url;
    // Proxy all other URLs.
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
};

// Helper to parse font family from CSS variable
const getFontFamily = (font: string | undefined): string => {
    if (!font) return 'Inter, sans-serif';
    if (font.includes('--font-inter')) return 'Inter, sans-serif';
    if (font.includes('--font-source-code-pro')) return "'Source Code Pro', monospace";
    return font;
};

// Simplified renderer for just the content on the card front.
const ExportableCardFace = ({ cardDetails }: { cardDetails: CardDetails }) => {
    const layout = cardLayouts.layouts.find(l => l.id === cardDetails.layoutId) || cardLayouts.layouts[0];
    const elements = cardDetails.elements || [];

    const nameElement = elements.find(e => e.component === 'name') || { fontSize: 2.2, fontWeight: 700 };
    const titleElement = elements.find(e => e.component === 'title') || { fontSize: 1.4, fontWeight: 400 };
    const companyElement = elements.find(e => e.component === 'company') || { fontSize: 1.1, fontWeight: 400 };
    const logoElement = elements.find(e => e.component === 'logo');
    const profilePicElement = elements.find(e => e.component === 'profilePic');

    const fontSize = (vw: number | undefined) => `clamp(0.5rem, ${vw || 1}vw, 2rem)`;

    const renderImage = (url: string | undefined, alt: string, styles: React.CSSProperties) => {
        if (!url) return null;
        return <img src={getProxiedUrl(url)} alt={alt} style={styles} crossOrigin="anonymous"/>;
    };

    const renderAvatar = (url: string | undefined, name: string) => {
        if (!url) return null;
        return <img src={getProxiedUrl(url)} alt={name} style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${cardDetails.accentColor}` }} crossOrigin="anonymous"/>;
    };

    if (layout.id.startsWith('split-')) {
        const isVertical = layout.id.includes('vertical');
        const splitSectionStyle: React.CSSProperties = {
            backgroundColor: cardDetails.accentColor, color: cardDetails.bgColor, display: 'flex', flexDirection: 'column', padding: '24px',
            justifyContent: layout.justifyContent as any, alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'), textAlign: layout.textAlign as any,
            width: isVertical ? '40%' : '100%', height: isVertical ? '100%' : '40%', boxSizing: 'border-box'
        };
        const textSectionStyle: React.CSSProperties = {
            color: cardDetails.textColor, display: 'flex', flexDirection: 'column', padding: '24px',
            justifyContent: layout.justifyContent as any, alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'), textAlign: layout.textAlign as any,
            width: isVertical ? '60%' : '100%', height: isVertical ? '100%' : '60%', boxSizing: 'border-box'
        };

        const SplitSection = (<div style={splitSectionStyle}>{logoElement && cardDetails.logoUrl && renderImage(cardDetails.logoUrl, "Company Logo", { objectFit: 'contain', height: '1.5rem', maxHeight: '1.5rem', width: 'auto', maxWidth: '6rem' })}</div>);
        const TextSection = (
            <div style={textSectionStyle}>
                {profilePicElement && cardDetails.profilePicUrl && <div style={{ marginBottom: '1rem' }}>{renderAvatar(cardDetails.profilePicUrl, cardDetails.name)}</div>}
                <h2 style={{ fontSize: fontSize(nameElement.fontSize), fontWeight: nameElement.fontWeight, color: cardDetails.textColor, margin: 0, padding: 0 }}>{cardDetails.name}</h2>
                <p style={{ fontSize: fontSize(titleElement.fontSize), fontWeight: titleElement.fontWeight, color: cardDetails.accentColor, margin: 0, padding: 0, marginTop: '0.25rem' }}>{cardDetails.title}</p>
                <p style={{ fontSize: fontSize(companyElement.fontSize), fontWeight: companyElement.fontWeight, color: cardDetails.textColor, marginTop: '0.5rem', margin: 0, padding: 0 }}>{cardDetails.company}</p>
            </div>
        );

        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden', flexDirection: isVertical ? 'row' : 'column', fontFamily: getFontFamily(cardDetails.font) }}>
                {layout.id.endsWith('-reverse') ? <>{TextSection}{SplitSection}</> : <>{SplitSection}{TextSection}</>}
            </div>
        );
    }
    
    const containerStyle: React.CSSProperties = {
        fontFamily: getFontFamily(cardDetails.font), display: 'flex', flexDirection: 'column',
        alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'),
        justifyContent: layout.justifyContent as any, textAlign: layout.textAlign as any,
        height: '100%', width: '100%', padding: '1rem', boxSizing: 'border-box'
    };

    return (
        <div style={containerStyle}>
            {profilePicElement && cardDetails.profilePicUrl && <div style={{ marginBottom: '1rem' }}>{renderAvatar(cardDetails.profilePicUrl, cardDetails.name)}</div>}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: fontSize(nameElement.fontSize), fontWeight: nameElement.fontWeight, color: cardDetails.textColor, margin: 0, padding: 0 }}>{cardDetails.name}</h2>
                <p style={{ fontSize: fontSize(titleElement.fontSize), fontWeight: titleElement.fontWeight, color: cardDetails.accentColor, margin: 0, padding: 0, marginTop: '0.25rem' }}>{cardDetails.title}</p>
                <p style={{ fontSize: fontSize(companyElement.fontSize), fontWeight: companyElement.fontWeight, color: cardDetails.textColor, marginTop: '0.5rem', margin: 0, padding: 0 }}>{cardDetails.company}</p>
            </div>
            {logoElement && cardDetails.logoUrl && <div style={{ marginTop: 'auto' }}>{renderImage(cardDetails.logoUrl, "Company Logo", { objectFit: 'contain', height: '1.5rem', maxHeight: '1.5rem', width: 'auto', maxWidth: '6rem' })}</div>}
        </div>
    );
};


/**
 * A component designed specifically for off-screen rendering to generate images.
 * It uses simple `<img>` tags and proxied URLs to ensure `html-to-image` can capture it cleanly.
 */
const ExportableCard = React.forwardRef<HTMLDivElement, { cardDetails: CardDetails; face: 'front' | 'back' }>(({ cardDetails, face }, ref) => {
    // Standard business card dimensions at 96 DPI: 3.5in x 2in = 336x192px
    const cardStyle: React.CSSProperties = {
        width: `336px`, height: `192px`,
        fontFamily: getFontFamily(cardDetails.font),
        position: 'relative', overflow: 'hidden',
    };

    const renderFront = () => {
        const frontStyle: React.CSSProperties = {
            ...getPatternStyle(cardDetails.pattern, cardDetails.accentColor),
            backgroundColor: cardDetails.bgColor,
            width: '100%', height: '100%', position: 'relative',
        };

        if (cardDetails.backgroundImage && !cardDetails.pattern) {
            // Use the proxied URL for background images
            frontStyle.backgroundImage = `url(${getProxiedUrl(cardDetails.backgroundImage)})`;
            frontStyle.backgroundSize = 'cover';
            frontStyle.backgroundPosition = 'center';
        }
        
        return (
            <div style={frontStyle}>
                <ExportableCardFace cardDetails={cardDetails} />
            </div>
        );
    };

    const renderBack = () => {
        const backStyle: React.CSSProperties = {
            backgroundColor: cardDetails.bgColor, width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', boxSizing: 'border-box'
        };

        return (
            <div style={backStyle}>
                {cardDetails.logoUrl && (
                    <img
                        src={getProxiedUrl(cardDetails.logoUrl)}
                        alt="Company Logo"
                        style={{ maxHeight: '2rem', maxWidth: '5rem', objectFit: 'contain', marginBottom: '1rem' }}
                        crossOrigin="anonymous"
                    />
                )}
                {cardDetails.website && cardDetails.qrUrl ? (
                    // QR codes are generated as data URIs, so they don't need proxying.
                    <img
                        src={cardDetails.qrUrl}
                        alt="QR Code"
                        style={{ width: '6rem', height: '6rem', borderRadius: '0.25rem' }}
                        crossOrigin="anonymous"
                    />
                ) : (
                    <div style={{ width: '6rem', height: '6rem' }}></div>
                )}
                {cardDetails.slogan && (
                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.65rem', color: cardDetails.textColor, margin: 0, padding: 0 }}>
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
