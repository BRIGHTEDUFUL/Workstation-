
'use client';

import React from 'react';
import type { CardDetails } from './card-data';
import cardLayouts from '@/lib/card-layouts.json';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CardFaceProps {
  cardDetails: CardDetails;
  isPreview?: boolean;
  isExport?: boolean;
}

const getProxiedUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
};

const CardFace = ({ cardDetails, isPreview = false, isExport = false }: CardFaceProps) => {
  const layout = cardLayouts.layouts.find(l => l.id === cardDetails.layoutId) || cardLayouts.layouts[0];
  const elements = cardDetails.elements || [];

  const nameElement = elements.find(e => e.component === 'name') || { fontSize: 2.2, fontWeight: 700 };
  const titleElement = elements.find(e => e.component === 'title') || { fontSize: 1.4, fontWeight: 400 };
  const companyElement = elements.find(e => e.component === 'company') || { fontSize: 1.1, fontWeight: 400 };
  const logoElement = elements.find(e => e.component === 'logo');
  const profilePicElement = elements.find(e => e.component === 'profilePic');

  // Use vw for scaling in preview, but fixed rem for thumbnails
  const fontSize = (vw: number | undefined, rem: string) => isPreview ? `clamp(0.8rem, ${vw || 1}vw, 2.5rem)` : rem;

  const renderImage = (url: string | undefined, alt: string, isLogo: boolean = false) => {
    if (!url) return null;
    if (isExport) {
        return <img src={getProxiedUrl(url)} alt={alt} style={{ objectFit: 'contain', height: isLogo ? '1.5rem' : 'auto', maxHeight: '1.5rem', width: 'auto', maxWidth: isLogo ? '6rem' : '100%' }} />;
    }
    const width = isLogo ? (isPreview ? 100 : 80) : (isPreview ? 80 : 48);
    const height = isLogo ? (isPreview ? 25 : 20) : (isPreview ? 80 : 48);
    return <Image src={url} alt={alt} width={width} height={height} className={cn("object-contain", isLogo ? (isPreview ? "h-6" : "h-5") : "")} crossOrigin="anonymous" />;
  }

  const renderAvatar = (url: string | undefined, name: string) => {
    if (!url) return null;

    if (isExport) {
        return <img src={getProxiedUrl(url)} alt={name} style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${cardDetails.accentColor}` }} />;
    }

    const sizeClass = isPreview ? "w-20 h-20" : "w-12 h-12";
    return (
        <Avatar className={cn("border-2", sizeClass)} style={{ borderColor: cardDetails.accentColor }}>
            <AvatarImage src={url} crossOrigin="anonymous" />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
    );
  }

  if (layout.id.startsWith('split-')) {
      const isVertical = layout.id.includes('vertical');
      const splitSectionStyle = {
          backgroundColor: cardDetails.accentColor,
          color: cardDetails.bgColor,
      };
      const textSectionStyle = {
          color: cardDetails.textColor,
      };

      const SplitSection = (
          <div
              className={cn("flex flex-col p-6", isVertical ? 'w-2/5' : 'h-2/5')}
              style={{...splitSectionStyle, justifyContent: layout.justifyContent as any, alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'), textAlign: layout.textAlign as any }}
          >
              {logoElement && cardDetails.logoUrl && (
                  renderImage(cardDetails.logoUrl, "Company Logo", true)
              )}
          </div>
      );

      const TextSection = (
          <div
              className={cn("flex flex-col p-6", isVertical ? 'w-3/5' : 'h-3/5')}
              style={{...textSectionStyle, justifyContent: layout.justifyContent as any, alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'), textAlign: layout.textAlign as any,}}
          >
              {profilePicElement && cardDetails.profilePicUrl && (
                  <div className="mb-4">
                      {renderAvatar(cardDetails.profilePicUrl, cardDetails.name)}
                  </div>
              )}
              <h2 className="font-bold" style={{ fontSize: fontSize(nameElement.fontSize, '1.125rem'), fontWeight: nameElement.fontWeight, color: cardDetails.textColor }}>
                  {cardDetails.name}
              </h2>
              <p style={{ fontSize: fontSize(titleElement.fontSize, '0.875rem'), fontWeight: titleElement.fontWeight, color: cardDetails.accentColor }}>
                  {cardDetails.title}
              </p>
              <p className="mt-2" style={{ fontSize: fontSize(companyElement.fontSize, '0.75rem'), fontWeight: companyElement.fontWeight, color: cardDetails.textColor }}>
                  {cardDetails.company}
              </p>
          </div>
      );

      return (
          <div className={cn("w-full h-full overflow-hidden flex", isVertical ? 'flex-row' : 'flex-col')} style={{ fontFamily: cardDetails.font }}>
              {layout.id.endsWith('-reverse') ? <>{TextSection}{SplitSection}</> : <>{SplitSection}{TextSection}</>}
          </div>
      );
  }
  
  const containerStyle: React.CSSProperties = {
    fontFamily: cardDetails.font,
    display: 'flex',
    flexDirection: 'column',
    alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'),
    justifyContent: layout.justifyContent as any,
    textAlign: layout.textAlign as any,
    height: '100%',
    width: '100%',
    padding: isPreview ? '1.5rem' : '1rem',
  };

  return (
    <div
      className={cn("w-full h-full")}
      style={containerStyle}
    >
      {profilePicElement && cardDetails.profilePicUrl && (
        <div className={cn(isExport ? "" : "mb-4")}>
          {renderAvatar(cardDetails.profilePicUrl, cardDetails.name)}
        </div>
      )}
      
      <div className="flex flex-col">
        <h2 className="font-bold" style={{ fontSize: fontSize(nameElement.fontSize, '1.125rem'), fontWeight: nameElement.fontWeight, color: cardDetails.textColor }}>
          {cardDetails.name}
        </h2>
        <p style={{ fontSize: fontSize(titleElement.fontSize, '0.875rem'), fontWeight: titleElement.fontWeight, color: cardDetails.accentColor }}>
          {cardDetails.title}
        </p>
        <p className="mt-2" style={{ fontSize: fontSize(companyElement.fontSize, '0.75rem'), fontWeight: companyElement.fontWeight, color: cardDetails.textColor }}>
          {cardDetails.company}
        </p>
      </div>

      {logoElement && cardDetails.logoUrl && (
        <div className={cn(isExport ? "" : "mt-auto")}>
          {renderImage(cardDetails.logoUrl, "Company Logo", true)}
        </div>
      )}
    </div>
  );
};

CardFace.displayName = 'CardFace';
export default CardFace;
