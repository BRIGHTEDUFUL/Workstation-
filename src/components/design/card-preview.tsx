
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CardDetails } from './card-data';
import Image from 'next/image';
import CardFace from './card-face';
import { getPatternStyle } from '@/lib/patterns';

// CardFront Component
const CardFront = React.memo(React.forwardRef<HTMLDivElement, { cardDetails: CardDetails }>(({ cardDetails }, ref) => {
  const frontStyle: React.CSSProperties = {
    ...getPatternStyle(cardDetails.pattern, cardDetails.accentColor),
    backgroundColor: cardDetails.bgColor,
  };
  if (cardDetails.backgroundImage && !cardDetails.pattern) {
    frontStyle.backgroundImage = `url(${cardDetails.backgroundImage})`;
    frontStyle.backgroundSize = 'cover';
    frontStyle.backgroundPosition = 'center';
  }

  return (
    <div
      ref={ref}
      className="absolute w-full h-full rounded-lg backface-hidden"
      style={frontStyle}
    >
      <CardFace cardDetails={cardDetails} isPreview={true} />
    </div>
  );
}));
CardFront.displayName = 'CardFront';


// CardBack Component
const CardBack = React.memo(React.forwardRef<HTMLDivElement, { cardDetails: CardDetails }>(({ cardDetails }, ref) => {
  // The back of the card should only ever have a solid background color, and never inherit the front's image or pattern.
  const backStyle: React.CSSProperties = {
    backgroundColor: cardDetails.bgColor,
  };

  return (
    <div
      ref={ref}
      className={cn("absolute w-full h-full rounded-lg backface-hidden rotate-y-180")}
      style={backStyle}
    >
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        {cardDetails.logoUrl && (
          <Image
            src={cardDetails.logoUrl}
            alt="Company Logo"
            width={100}
            height={40}
            className="object-contain h-10 mb-4"
          />
        )}
        {cardDetails.website && cardDetails.qrUrl ? (
          <Image
            src={cardDetails.qrUrl}
            alt="QR Code"
            width={128}
            height={128}
            className="rounded-lg aspect-square"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200/50 rounded-lg animate-pulse flex items-center justify-center text-center p-2">
             <span className="text-xs text-muted-foreground">Enter a website URL in the editor to generate a QR code.</span>
          </div>
        )}
        {cardDetails.website && <p className="mt-2 text-xs" style={{fontFamily: cardDetails.font, color: cardDetails.textColor}}>{cardDetails.website}</p>}
        <p className="mt-4 text-xs text-center px-4" style={{ fontFamily: cardDetails.font, color: cardDetails.textColor }}>
          {cardDetails.slogan || (cardDetails.website ? 'Scan to connect' : '')}
        </p>
      </div>
    </div>
  );
}));
CardBack.displayName = 'CardBack';

// Main CardPreview Component
interface CardPreviewProps {
  cardDetails: CardDetails;
  cardFrontRef: React.RefObject<HTMLDivElement>;
  cardBackRef: React.RefObject<HTMLDivElement>;
}

const CardPreview = React.memo(({ cardDetails, cardFrontRef, cardBackRef }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const is3D = cardDetails.category === '3D';
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!is3D || !wrapperRef.current) return;
    
    const el = wrapperRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      const rotateX = (y - 0.5) * -15; // -7.5 to 7.5 deg
      const rotateY = (x - 0.5) * 15;  // -7.5 to 7.5 deg
      el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [is3D]);

  return (
    <div className="w-full max-w-lg">
       <div className={cn("relative w-full aspect-[1.7/1] perspective-1000", is3D && 'p-4')}>
        <div 
          ref={is3D ? wrapperRef : null}
          className={cn(
            'relative w-full h-full transition-transform duration-700 preserve-3d',
            { 'rotate-y-180': isFlipped },
            is3D && "card-3d-wrapper"
          )}
        >
          {/* This container holds both faces as siblings */}
          <div className={cn('absolute w-full h-full', is3D && 'card-3d')}>
            <CardFront cardDetails={cardDetails} ref={cardFrontRef} />
            <CardBack cardDetails={cardDetails} ref={cardBackRef} />
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
});

CardPreview.displayName = 'CardPreview';
export default CardPreview;
