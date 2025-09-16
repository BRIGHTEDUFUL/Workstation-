
'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDetails } from './card-data';
import Image from 'next/image';
import { getPatternStyle } from '@/lib/patterns';
import CardFace from './card-face';

// CardBack Component
const CardBack = React.forwardRef<HTMLDivElement, { cardDetails: CardDetails }>(({ cardDetails }, ref) => {
  const style = {
    backgroundColor: cardDetails.bgColor,
    color: cardDetails.textColor,
    fontFamily: cardDetails.font,
    ...getPatternStyle(cardDetails.pattern, cardDetails.accentColor),
    ...(cardDetails.backgroundImage && !cardDetails.pattern && {
        backgroundImage: `url(${cardDetails.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    })
  };

  return (
    <div
      ref={ref}
      className="absolute w-full h-full rounded-lg backface-hidden rotate-y-180"
      style={{ ...style }}
    >
      <CardContent className="flex flex-col items-center justify-center p-0 w-full h-full">
        {cardDetails.qrUrl ? (
          <Image
            src={cardDetails.qrUrl}
            alt="QR Code"
            width={128}
            height={128}
            className="rounded-lg"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200/50 rounded-lg animate-pulse" />
        )}
        <p className="mt-4 text-xs text-center px-4">{cardDetails.slogan || 'Scan to connect'}</p>
      </CardContent>
    </div>
  );
});
CardBack.displayName = 'CardBack';

// Main CardPreview Component
interface CardPreviewProps {
  cardDetails: CardDetails;
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
          <CardFace cardDetails={cardDetails} ref={cardFrontRef} isPreview={true} />
          <CardBack cardDetails={cardDetails} ref={cardBackRef} />
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
