
'use client';

import React from 'react';
import type { CardDetails } from '@/ai/schema';
import cardLayouts from '@/lib/card-layouts.json';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CardFaceProps {
  cardDetails: CardDetails;
}

const CardFace = ({ cardDetails }: CardFaceProps) => {
  const layout = cardLayouts.layouts.find(l => l.id === cardDetails.layoutId) || cardLayouts.layouts[0];
  const elements = cardDetails.elements || [];

  const nameElement = elements.find(e => e.component === 'name') || { fontSize: 2.2, fontWeight: 700 };
  const titleElement = elements.find(e => e.component === 'title') || { fontSize: 1.4, fontWeight: 400 };
  const companyElement = elements.find(e => e.component === 'company') || { fontSize: 1.1, fontWeight: 400 };
  const logoElement = elements.find(e => e.component === 'logo');
  const profilePicElement = elements.find(e => e.component === 'profilePic');

  const fontSize = (vw: number | undefined) => `clamp(0.8rem, ${vw || 1}vw, 2.5rem)`;

  const renderImage = (url: string | undefined, alt: string, isLogo: boolean = false) => {
    if (!url) return null;
    const width = isLogo ? 100 : 80;
    const height = isLogo ? 25 : 80;
    return <Image src={url} alt={alt} width={width} height={height} className={cn("object-contain", isLogo ? "h-6" : "")} />;
  }

  const renderAvatar = (url: string | undefined, name: string) => {
    if (!url) return null;
    const sizeClass = "w-20 h-20";
    return (
        <Avatar className={cn("border-2", sizeClass)} style={{ borderColor: cardDetails.accentColor }}>
            <AvatarImage src={url} />
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
              <h2 className="font-bold" style={{ fontSize: fontSize(nameElement.fontSize), fontWeight: nameElement.fontWeight, color: cardDetails.textColor }}>
                  {cardDetails.name}
              </h2>
              <p style={{ fontSize: fontSize(titleElement.fontSize), fontWeight: titleElement.fontWeight, color: cardDetails.accentColor }}>
                  {cardDetails.title}
              </p>
              <p className="mt-2" style={{ fontSize: fontSize(companyElement.fontSize), fontWeight: companyElement.fontWeight, color: cardDetails.textColor }}>
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
    padding: '1.5rem',
  };

  return (
    <div
      className={"w-full h-full"}
      style={containerStyle}
    >
      {profilePicElement && cardDetails.profilePicUrl && (
        <div className={"mb-4"}>
          {renderAvatar(cardDetails.profilePicUrl, cardDetails.name)}
        </div>
      )}
      
      <div className="flex flex-col">
        <h2 className="font-bold" style={{ fontSize: fontSize(nameElement.fontSize), fontWeight: nameElement.fontWeight, color: cardDetails.textColor }}>
          {cardDetails.name}
        </h2>
        <p style={{ fontSize: fontSize(titleElement.fontSize), fontWeight: titleElement.fontWeight, color: cardDetails.accentColor }}>
          {cardDetails.title}
        </p>
        <p className="mt-2" style={{ fontSize: fontSize(companyElement.fontSize), fontWeight: companyElement.fontWeight, color: cardDetails.textColor }}>
          {cardDetails.company}
        </p>
      </div>

      {logoElement && cardDetails.logoUrl && (
        <div className={"mt-auto"}>
          {renderImage(cardDetails.logoUrl, "Company Logo", true)}
        </div>
      )}
    </div>
  );
};

CardFace.displayName = 'CardFace';

export default CardFace;
