
'use client';

import React, { useState, forwardRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDetails } from './card-data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import cardLayouts from '@/lib/card-layouts.json';
import { getPatternStyle } from '@/lib/patterns';

// CardFront Component
interface CardFrontProps {
  cardDetails: CardDetails;
}
const CardFront = forwardRef<HTMLDivElement, CardFrontProps>(({ cardDetails }, ref) => {
  const layout = cardLayouts.layouts.find(l => l.id === cardDetails.layoutId) || cardLayouts.layouts[0];

  const baseStyle = {
    backgroundColor: cardDetails.bgColor,
    color: cardDetails.textColor,
    fontFamily: cardDetails.font,
    ...getPatternStyle(cardDetails.pattern, cardDetails.accentColor),
    ...(cardDetails.backgroundImage && !cardDetails.pattern && {
      backgroundImage: `url(${cardDetails.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  const nameElement = cardDetails.elements.find(e => e.component === 'name') || { fontSize: 2.2, fontWeight: 700 };
  const titleElement = cardDetails.elements.find(e => e.component === 'title') || { fontSize: 1.4, fontWeight: 400 };
  const companyElement = cardDetails.elements.find(e => e.component === 'company') || { fontSize: 1.1, fontWeight: 400 };
  const logoElement = cardDetails.elements.find(e => e.component === 'logo');
  const profilePicElement = cardDetails.elements.find(e => e.component === 'profilePic');

  if (layout.id.startsWith('split-')) {
    const isVertical = layout.id.includes('vertical');
    const splitSectionStyle = {
      backgroundColor: cardDetails.accentColor,
      color: cardDetails.bgColor, // Invert color for contrast
    };
    const textSectionStyle = {
      color: cardDetails.textColor,
    };

    const SplitSection = (
      <div
        className={cn("flex flex-col p-4", isVertical ? 'w-2/5' : 'h-2/5')}
        style={{ ...splitSectionStyle, justifyContent: layout.justifyContent as any, alignItems: layout.textAlign === 'center' ? 'center' : 'flex-start', textAlign: layout.textAlign as any }}
      >
        {logoElement && cardDetails.logoUrl && (
          <Image src={cardDetails.logoUrl} alt="Company Logo" width={100} height={40} className="object-contain" />
        )}
      </div>
    );

    const TextSection = (
      <div
        className={cn("flex flex-col p-8", isVertical ? 'w-3/5' : 'h-3/5')}
        style={{ ...textSectionStyle, justifyContent: layout.justifyContent as any, alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'), textAlign: layout.textAlign as any }}
      >
        {profilePicElement && cardDetails.profilePicUrl && (
          <div className="mb-4">
            <Avatar className={cn("border-2 w-20 h-20")} style={{ borderColor: cardDetails.textColor }}>
              <AvatarImage src={cardDetails.profilePicUrl} />
              <AvatarFallback>{cardDetails.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        )}
        <h2 className="font-bold" style={{ fontSize: `clamp(1rem, ${nameElement.fontSize}vw, 2.5rem)`, fontWeight: nameElement.fontWeight }}>
          {cardDetails.name}
        </h2>
        <p className="text-lg" style={{ fontSize: `clamp(0.8rem, ${titleElement.fontSize}vw, 1.5rem)`, fontWeight: titleElement.fontWeight }}>
          {cardDetails.title}
        </p>
        <p className="text-sm mt-2" style={{ fontSize: `clamp(0.7rem, ${companyElement.fontSize}vw, 1.2rem)`, fontWeight: companyElement.fontWeight }}>
          {cardDetails.company}
        </p>
      </div>
    );

    return (
      <div className={cn("absolute w-full h-full shadow-lg rounded-lg overflow-hidden flex", isVertical ? 'flex-row' : 'flex-col')} style={{ ...baseStyle }}>
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
    padding: '1rem',
  };

  return (
    <div
      className={cn("absolute w-full h-full p-8 shadow-lg rounded-lg")}
      style={{ ...baseStyle }}
    >
      <div className="relative w-full h-full">
        <div style={containerStyle}>
          {profilePicElement && cardDetails.profilePicUrl && (
            <div className="mb-4">
              <Avatar className={cn("border-2 w-20 h-20")} style={{ borderColor: cardDetails.accentColor }}>
                <AvatarImage src={cardDetails.profilePicUrl} />
                <AvatarFallback>{cardDetails.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
          
          <div className="flex flex-col">
            <h2 className="font-bold" style={{ fontSize: `clamp(1rem, ${nameElement.fontSize}vw, 2.5rem)`, fontWeight: nameElement.fontWeight, color: cardDetails.textColor }}>
              {cardDetails.name}
            </h2>
            <p className="text-lg" style={{ fontSize: `clamp(0.8rem, ${titleElement.fontSize}vw, 1.5rem)`, fontWeight: titleElement.fontWeight, color: cardDetails.accentColor }}>
              {cardDetails.title}
            </p>
            <p className="text-sm mt-2" style={{ fontSize: `clamp(0.7rem, ${companyElement.fontSize}vw, 1.2rem)`, fontWeight: companyElement.fontWeight, color: cardDetails.textColor }}>
              {cardDetails.company}
            </p>
          </div>

          {logoElement && cardDetails.logoUrl && (
            <div className="mt-auto">
              <Image src={cardDetails.logoUrl} alt="Company Logo" width={100} height={25} className="object-contain h-6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
CardFront.displayName = 'CardFront';

// CardBack Component
interface CardBackProps {
  cardDetails: CardDetails;
}
const CardBack = forwardRef<HTMLDivElement, CardBackProps>(({ cardDetails }, ref) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    setQrCodeUrl(cardDetails.qrUrl);
  }, [cardDetails.qrUrl]);

  const style = {
    backgroundColor: cardDetails.bgColor,
    color: cardDetails.textColor,
    fontFamily: cardDetails.font,
  };

  return (
    <div
      className="absolute w-full h-full p-6 shadow-lg rounded-lg"
      style={{ ...style }}
    >
      <CardContent className="flex flex-col items-center justify-center p-0 w-full h-full">
        {qrCodeUrl ? (
          <Image
            src={qrCodeUrl}
            alt="QR Code"
            width={128}
            height={128}
            className="rounded-lg"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse" />
        )}
        <p className="mt-4 text-xs text-center whitespace-nowrap">{cardDetails.slogan || 'Scan to connect'}</p>
      </CardContent>
    </div>
  );
});
CardBack.displayName = 'CardBack';

// Main CardPreview Component
interface CardPreviewProps {
  cardDetails: CardDetails;
  setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
  cardFrontRef: React.RefObject<HTMLDivElement>;
  cardBackRef: React.RefObject<HTMLDivElement>;
}

const CardPreview = ({ cardDetails, cardFrontRef, cardBackRef }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-lg">
        <div className="relative w-full aspect-[1.7/1] perspective-1000">
            <div
            className={cn(
                'relative w-full h-full transition-transform duration-700 preserve-3d',
                { 'rotate-y-180': isFlipped }
            )}
            >
            <div ref={cardFrontRef} className="absolute w-full h-full backface-hidden">
                <CardFront cardDetails={cardDetails} />
            </div>
            <div ref={cardBackRef} className="absolute w-full h-full backface-hidden rotate-y-180">
                <CardBack cardDetails={cardDetails} />
            </div>
            </div>
        </div>

      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Flip Card
        </Button>
      </div>
    </div>
  );
};

export default CardPreview;
