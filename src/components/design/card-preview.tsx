
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDetails } from './card-data';
import Image from 'next/image';
import CardFace from './card-face';

// CardBack Component
const CardBack = React.memo(React.forwardRef<HTMLDivElement, { cardDetails: CardDetails, className?: string }>(({ cardDetails, className }, ref) => {
  const style = {
    backgroundColor: cardDetails.bgColor,
  };

  return (
    <div
      ref={ref}
      className={cn("absolute w-full h-full rounded-lg backface-hidden", className)}
      style={{ ...style }}
    >
      <CardContent className="flex flex-col items-center justify-center w-full h-full p-4">
        {cardDetails.logoUrl && (
          <Image
            src={cardDetails.logoUrl}
            alt="Company Logo"
            width={100}
            height={40}
            className="object-contain h-10 mb-4"
          />
        )}
        {cardDetails.qrUrl ? (
          <Image
            src={cardDetails.qrUrl}
            alt="QR Code"
            width={128}
            height={128}
            className="rounded-lg aspect-square"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200/50 rounded-lg animate-pulse" />
        )}
        <p className="mt-4 text-xs text-center px-4" style={{ color: cardDetails.textColor }}>
          {cardDetails.slogan || 'Scan to connect'}
        </p>
      </CardContent>
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
          <div className={cn('absolute w-full h-full', is3D && 'card-3d')}>
            <CardFace cardDetails={cardDetails} ref={cardFrontRef} isPreview={true} />
            <CardBack cardDetails={cardDetails} ref={cardBackRef} className="rotate-y-180" />
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
