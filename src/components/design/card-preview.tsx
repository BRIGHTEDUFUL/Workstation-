
'use client';

import React, { useState, forwardRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDetails } from './card-data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


// CardFront Component
interface CardFrontProps {
  cardDetails: CardDetails;
}
const CardFront = forwardRef<HTMLDivElement, CardFrontProps>(({ cardDetails }, ref) => {
  const style = {
    backgroundColor: cardDetails.bgColor,
    color: cardDetails.textColor,
    fontFamily: cardDetails.font,
    ...(cardDetails.backgroundImage && {
      backgroundImage: `url(${cardDetails.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
  };

  const hasPhoto = !['no-photo-centered', 'minimalist'].includes(cardDetails.layout);

  const renderContent = () => {
    const textContent = (
      <div className={cn("text-center", ['modern-left', 'modern-right'].includes(cardDetails.layout) && 'text-left')}>
        <h2 className={cn("font-bold", cardDetails.layout === 'minimalist' ? 'text-4xl' : 'text-3xl')} style={{ color: cardDetails.textColor }}>{cardDetails.name}</h2>
        <p className={cn(cardDetails.layout === 'minimalist' ? 'text-xl' : 'text-lg')} style={{ color: cardDetails.accentColor }}>{cardDetails.title}</p>
        { cardDetails.layout !== 'minimalist' && <p className="text-sm mt-1">{cardDetails.company}</p> }
      </div>
    );

    const avatar = hasPhoto && (
      <Avatar className={cn(
          "border-2",
          cardDetails.layout === 'classic' && "w-16 h-16 mb-4",
          (cardDetails.layout === 'modern-left' || cardDetails.layout === 'modern-right') && "w-20 h-20",
        )} style={{borderColor: cardDetails.accentColor}}>
        <AvatarImage src={cardDetails.profilePicUrl} />
        <AvatarFallback>{cardDetails.name.charAt(0)}</AvatarFallback>
      </Avatar>
    );

    switch (cardDetails.layout) {
      case 'modern-left':
        return (
          <div className='p-0 flex items-center justify-start h-full gap-6'>
            {avatar}
            {textContent}
          </div>
        );
      case 'modern-right':
        return (
          <div className='p-0 flex items-center justify-end h-full gap-6'>
            {textContent}
            {avatar}
          </div>
        );
      case 'no-photo-centered':
      case 'minimalist':
         return (
          <div className='p-0 flex flex-col items-center justify-center h-full'>
            {textContent}
          </div>
        );
      case 'classic':
      default:
        return (
          <div className='p-0 flex flex-col items-center justify-center h-full'>
            {avatar}
            {textContent}
          </div>
        );
    }
  };

  return (
    <div
      ref={ref}
      className="absolute flex flex-col w-full h-full p-8 shadow-lg backface-hidden rounded-lg"
      style={style}
    >
      {cardDetails.logoUrl && cardDetails.layout !== 'minimalist' && (
        <div className="absolute top-6 left-8">
            <Image src={cardDetails.logoUrl} alt="Company Logo" width={80} height={20} className="object-contain h-5" />
        </div>
      )}
      {renderContent()}
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
    transform: 'rotateY(180deg)'
  };
  
  return (
    <div
      ref={ref}
      className="absolute flex flex-col items-center justify-center w-full h-full p-6 shadow-lg backface-hidden"
      style={style}
    >
      <CardContent className="flex flex-col items-center justify-center p-0">
        {qrCodeUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
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
  cardFrontRef: React.RefObject<HTMLDivElement>;
  cardBackRef: React.RefObject<HTMLDivElement>;
}

const CardPreview = ({ cardDetails, cardFrontRef, cardBackRef }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-lg">
      <div className="bg-transparent">
        <div className="perspective-1000">
          <div
            className={cn(
              'relative w-full aspect-[1.7/1] transition-transform duration-700 preserve-3d',
              { 'rotate-y-180': isFlipped }
            )}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <CardFront ref={cardFrontRef} cardDetails={cardDetails} />
            <CardBack ref={cardBackRef} cardDetails={cardDetails} />
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
