'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDetails } from './design-page';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CardPreviewProps {
  cardDetails: CardDetails;
}

const CardPreview = ({ cardDetails }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  React.useEffect(() => {
    // We need to construct the URL on the client side to get access to window.location.origin
    const landingPageUrl = `${window.location.origin}/card/${cardDetails.id}`;
    const generatedQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(landingPageUrl)}&bgcolor=${cardDetails.bgColor.substring(1)}&color=${cardDetails.textColor.substring(1)}&qzone=1`;
    setQrCodeUrl(generatedQrCodeUrl);
  }, [cardDetails.id, cardDetails.bgColor, cardDetails.textColor]);
  
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

  return (
    <div className="w-full max-w-lg">
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
            <div className='p-0 flex flex-col items-center justify-center h-full'>
              <Avatar className="w-16 h-16 mb-4 border-2" style={{borderColor: cardDetails.accentColor}}>
                <AvatarImage src={cardDetails.profilePicUrl} />
                <AvatarFallback>{cardDetails.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-3xl font-bold" style={{ color: cardDetails.textColor }}>{cardDetails.name}</h2>
              <p className="text-lg" style={{ color: cardDetails.accentColor }}>{cardDetails.title}</p>
              <p className="text-sm mt-1">{cardDetails.company}</p>
            </div>
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
