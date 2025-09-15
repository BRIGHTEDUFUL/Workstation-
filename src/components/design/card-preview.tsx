'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDetails } from './design-page';

interface CardPreviewProps {
  cardDetails: CardDetails;
}

const CardPreview = ({ cardDetails }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(cardDetails.qrUrl)}&bgcolor=${cardDetails.bgColor.substring(1)}&color=${cardDetails.textColor.substring(1)}&qzone=1`;

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
          <Card
            className="absolute flex flex-col items-center justify-center w-full h-full p-6 text-center shadow-lg backface-hidden"
            style={{ 
              backgroundColor: cardDetails.bgColor, 
              color: cardDetails.textColor,
              fontFamily: cardDetails.font,
            }}
          >
            <CardContent className='p-0'>
              <div className="w-16 h-1 mb-4" style={{ backgroundColor: cardDetails.accentColor }}></div>
              <h2 className="text-3xl font-bold" style={{ color: cardDetails.textColor }}>{cardDetails.name}</h2>
              <p className="text-lg" style={{ color: cardDetails.accentColor }}>{cardDetails.title}</p>
            </CardContent>
          </Card>

          {/* Card Back */}
          <Card
            className="absolute flex flex-col items-center justify-center w-full h-full p-6 shadow-lg backface-hidden rotate-y-180"
            style={{ backgroundColor: cardDetails.bgColor }}
          >
            <CardContent className="flex flex-col items-center justify-center p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="QR Code"
                width={128}
                height={128}
                className="rounded-lg"
              />
              <p className="mt-4 text-xs" style={{color: cardDetails.textColor}}>Scan to connect</p>
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
