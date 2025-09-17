
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CardDetails } from './card-data';
import CardFace from './card-face';
import { getPatternStyle } from '@/lib/patterns';

// CardFront Component
const CardFront = React.forwardRef<HTMLDivElement, { cardDetails: CardDetails }>(({ cardDetails }, ref) => {
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
      <CardFace cardDetails={cardDetails} />
    </div>
  );
});
CardFront.displayName = 'CardFront';


// CardBack Component
const CardBack = React.memo(React.forwardRef<HTMLDivElement, { cardDetails: CardDetails }>(({ cardDetails }, ref) => {
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
           <img
            src={cardDetails.logoUrl}
            alt="Company Logo"
            width={100}
            height={40}
            className="object-contain h-10 mb-4"
            crossOrigin="anonymous"
          />
        )}
        {cardDetails.website && cardDetails.qrUrl ? (
          <img
            src={cardDetails.qrUrl}
            alt="QR Code"
            width={128}
            height={128}
            className="rounded-lg aspect-square"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex items-center justify-center w-32 h-32 p-2 text-center">
             <span className="text-xs text-muted-foreground"></span>
          </div>
        )}
         {cardDetails.slogan && (
            <p 
                className="mt-4 text-sm text-center"
                style={{ color: cardDetails.textColor, fontFamily: cardDetails.font }}
            >
                {cardDetails.slogan}
            </p>
        )}
      </div>
    </div>
  );
}));
CardBack.displayName = 'CardBack';

// Main CardPreview Component
interface CardPreviewProps {
  cardDetails: CardDetails;
}

const CardPreview = React.memo(({ cardDetails }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const is3D = cardDetails.category === '3D';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState({});

  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!is3D || !wrapperRef.current) {
        setTransformStyle({});
        return;
    }
    
    const el = wrapperRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      const rotateX = (y - 0.5) * -15; // -7.5 to 7.5 deg
      const rotateY = (x - 0.5) * 15;  // -7.5 to 7.5 deg
      setTransformStyle({
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      });
    };

    const handleMouseLeave = () => {
      setTransformStyle({
          transform: 'rotateX(0deg) rotateY(0deg)'
      });
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
          ref={wrapperRef}
          className={cn(
            'relative w-full h-full transition-transform duration-300',
            is3D ? "card-3d-wrapper" : ""
          )}
          style={transformStyle}
        >
          <div className={cn(
            'relative w-full h-full transition-transform duration-700 preserve-3d',
            { 'rotate-y-180': isFlipped },
          )}>
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
