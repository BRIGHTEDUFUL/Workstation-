
'use client';

import React from 'react';
import type { CardDetails } from './card-data';
import { getPatternStyle } from '@/lib/patterns';
import cardLayouts from '@/lib/card-layouts.json';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CardFaceProps {
  cardDetails: CardDetails;
  isPreview?: boolean;
}

const CardFace = React.forwardRef<HTMLDivElement, CardFaceProps>(({ cardDetails, isPreview = false }, ref) => {
  const layout = cardLayouts.layouts.find(l => l.id === cardDetails.layoutId) || cardLayouts.layouts[0];
  const elements = cardDetails.elements || [];

  const baseStyle = {
    backgroundColor: cardDetails.bgColor,
    fontFamily: cardDetails.font,
    ...getPatternStyle(cardDetails.pattern, cardDetails.accentColor),
    ...(cardDetails.backgroundImage && !cardDetails.pattern && {
      backgroundImage: `url(${cardDetails.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  const nameElement = elements.find(e => e.component === 'name') || { fontSize: 2.2, fontWeight: 700 };
  const titleElement = elements.find(e => e.component === 'title') || { fontSize: 1.4, fontWeight: 400 };
  const companyElement = elements.find(e => e.component === 'company') || { fontSize: 1.1, fontWeight: 400 };
  const logoElement = elements.find(e => e.component === 'logo');
  const profilePicElement = elements.find(e => e.component === 'profilePic');

  // Use vw for scaling in preview, but fixed rem for thumbnails
  const fontSize = (vw: number, rem: string) => isPreview ? `clamp(0.8rem, ${vw}vw, 2.5rem)` : rem;

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
                  <Image src={cardDetails.logoUrl} alt="Company Logo" width={isPreview ? 100 : 80} height={isPreview ? 40 : 30} className="object-contain" />
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
                      <Avatar className={cn("border-2", isPreview ? "w-20 h-20" : "w-12 h-12")} style={{ borderColor: cardDetails.textColor }}>
                          <AvatarImage src={cardDetails.profilePicUrl} />
                          <AvatarFallback>{cardDetails.name.charAt(0)}</AvatarFallback>
                      </Avatar>
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
          <div ref={ref} className={cn("absolute w-full h-full backface-hidden overflow-hidden flex", isVertical ? 'flex-row' : 'flex-col', isPreview && "rounded-lg")} style={baseStyle}>
              {layout.id.endsWith('-reverse') ? <>{TextSection}{SplitSection}</> : <>{SplitSection}{TextSection}</>}
          </div>
      );
  }
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'),
    justifyContent: layout.justifyContent as any,
    textAlign: layout.textAlign as any,
    height: '100%',
    padding: isPreview ? '1.5rem' : '1rem',
  };

  return (
    <div
      ref={ref}
      className={cn("absolute w-full h-full backface-hidden", isPreview && "rounded-lg")}
      style={{ ...baseStyle }}
    >
      <div style={containerStyle}>
        {profilePicElement && cardDetails.profilePicUrl && (
          <div className="mb-4">
            <Avatar className={cn("border-2", isPreview ? "w-20 h-20" : "w-12 h-12")} style={{ borderColor: cardDetails.accentColor }}>
              <AvatarImage src={cardDetails.profilePicUrl} />
              <AvatarFallback>{cardDetails.name.charAt(0)}</AvatarFallback>
            </Avatar>
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
          <div className="mt-auto">
            <Image src={cardDetails.logoUrl} alt="Company Logo" width={isPreview ? 100 : 80} height={isPreview ? 25 : 20} className={cn("object-contain", isPreview ? "h-6" : "h-5")} />
          </div>
        )}
      </div>
    </div>
  );
});

CardFace.displayName = 'CardFace';
export default CardFace;
