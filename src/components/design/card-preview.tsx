'use client';

import React, { useState, forwardRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDetails } from './card-data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CardPreviewProps {
  cardDetails: CardDetails;
}

const CardPreview = forwardRef<HTMLDivElement, CardPreviewProps>(({ cardDetails }, ref) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // The QR code is now generated from the qrUrl field, which is managed and saved in the design header.
    setQrCodeUrl(cardDetails.qrUrl);
  }, [cardDetails.qrUrl]);
  
  const frontStyle = {
      backgroundColor: cardDetails.bgColor,
      color: cardDetails.textColor,
      fontFamily: cardDetails.font,
      ...(cardDetails.backgroundImage && {
          backgroundImage: `url(${cardDetails.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
      })
  };

  const backStyle = {
      backgroundColor: cardDetails.bgColor,
      color: cardDetails.textColor,
      fontFamily: cardDetails.font,
  };

  const hasPhoto = cardDetails.layout !== 'no-photo-centered';

  const renderContent = () => {
    const textContent = (
      <div className={cn("text-center", cardDetails.layout === 'modern-left' && 'text-left')}>
        <h2 className="text-3xl font-bold" style={{ color: cardDetails.textColor }}>{cardDetails.name}</h2>
        <p className="text-lg" style={{ color: cardDetails.accentColor }}>{cardDetails.title}</p>
        <p className="text-sm mt-1">{cardDetails.company}</p>
      </div>
    );

    const avatar = hasPhoto && (
      <Avatar className={cn(
          "border-2",
          cardDetails.layout === 'classic' && "w-16 h-16 mb-4",
          cardDetails.layout === 'modern-left' && "w-20 h-20",
          cardDetails.layout === 'no-photo-centered' && 'hidden'
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
      case 'no-photo-centered':
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
  }

  return (
    <div className="w-full max-w-lg">
      <div ref={ref} className="bg-transparent">
        <div className="perspective-1000">
          <div
            className={cn(
              'relative w-full aspect-[1.7/1] transition-transform duration-700 preserve-3d',
              { 'rotate-y-180': isFlipped }
            )}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Card Front */}
            <div
              className="absolute flex flex-col w-full h-full p-8 shadow-lg backface-hidden rounded-lg"
              style={frontStyle}
            >
              {cardDetails.logoUrl && (
                  <div className="absolute top-6 left-8">
                      <Image src={cardDetails.logoUrl} alt="Company Logo" width={80} height={20} className="object-contain h-5" />
                  </div>
              )}
              {renderContent()}
            </div>

            {/* Card Back */}
            <Card
              className="absolute flex flex-col items-center justify-center w-full h-full p-6 shadow-lg backface-hidden rotate-y-180"
              style={backStyle}
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
                <p className="mt-4 text-xs" style={{color: cardDetails.textColor}}>{cardDetails.slogan || 'Scan to connect'}</p>
              </CardContent>
            </Card>
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
