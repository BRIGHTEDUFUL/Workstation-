
'use client';

import React, { useState, forwardRef, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDetails, CardElement } from './card-data';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


// CardFront Component
interface CardFrontProps {
  cardDetails: CardDetails;
  setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
  onDragStart: () => void;
  onDragEnd: () => void;
}
const CardFront = forwardRef<HTMLDivElement, CardFrontProps>(({ cardDetails, setCardDetails, onDragStart, onDragEnd }, ref) => {
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0, mouseX: 0, mouseY: 0 });
  const cardRef = ref as React.RefObject<HTMLDivElement>;

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    onDragStart(); // Notify parent to disable tilt
    const element = cardDetails.elements.find(el => el.id === elementId);
    if (element && cardRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        setDraggingElement(elementId);
        setInitialPos({ 
            x: element.x, 
            y: element.y, 
            mouseX: (e.clientX - cardRect.left) / cardRect.width * 100,
            mouseY: (e.clientY - cardRect.top) / cardRect.height * 100
        });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!draggingElement || !cardRef.current) return;

        const cardRect = cardRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - cardRect.left) / cardRect.width * 100;
        const mouseY = (e.clientY - cardRect.top) / cardRect.height * 100;
        
        const dx = mouseX - initialPos.mouseX;
        const dy = mouseY - initialPos.mouseY;

        setCardDetails(prev => ({
            ...prev,
            elements: prev.elements.map(el =>
                el.id === draggingElement
                    ? { ...el, x: initialPos.x + dx, y: initialPos.y + dy }
                    : el
            )
        }));
    };

    const handleMouseUp = () => {
        setDraggingElement(null);
        onDragEnd(); // Notify parent to re-enable tilt
    };
    
    if (draggingElement) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
}, [draggingElement, initialPos, setCardDetails, cardRef, onDragStart, onDragEnd]);

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

  const renderElement = (element: CardElement) => {
    const elementStyle = {
      left: `${element.x}%`,
      top: `${element.y}%`,
      transform: 'translate(-50%, -50%)',
      position: 'absolute' as 'absolute',
      width: element.width ? `${element.width}%` : 'auto',
      cursor: draggingElement ? 'grabbing' : 'grab',
    };

    let content;
    switch (element.component) {
      case 'name':
        content = <h2 className="font-bold" style={{ fontSize: `${element.fontSize}vw`, fontWeight: element.fontWeight, color: element.color || cardDetails.textColor }}>{cardDetails.name}</h2>;
        break;
      case 'title':
        content = <p className="text-lg" style={{ fontSize: `${element.fontSize}vw`, fontWeight: element.fontWeight, color: element.color || cardDetails.accentColor }}>{cardDetails.title}</p>;
        break;
      case 'company':
        content = <p className="text-sm" style={{ fontSize: `${element.fontSize}vw`, fontWeight: element.fontWeight, color: element.color || cardDetails.textColor }}>{cardDetails.company}</p>;
        break;
      case 'profilePic':
        content = (
            <Avatar className={cn("border-2 w-16 h-16")} style={{ borderColor: cardDetails.accentColor }}>
              <AvatarImage src={cardDetails.profilePicUrl} />
              <AvatarFallback>{cardDetails.name.charAt(0)}</AvatarFallback>
            </Avatar>
        );
        break;
      case 'logo':
        content = cardDetails.logoUrl ? <Image src={cardDetails.logoUrl} alt="Company Logo" width={80} height={20} className="object-contain h-5" /> : null;
        break;
      default:
        content = null;
    }

    return (
        <div key={element.id} onMouseDown={(e) => handleMouseDown(e, element.id)} style={elementStyle}>
            {content}
        </div>
    )
  };

  return (
    <div
      ref={ref}
      className="absolute flex flex-col w-full h-full p-8 shadow-lg backface-hidden rounded-lg"
      style={style}
    >
      <div className="relative w-full h-full">
        {cardDetails.elements.map(renderElement)}
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
    transform: 'rotateY(180deg)'
  };
  
  return (
    <div
      ref={ref}
      className="absolute flex flex-col items-center justify-center w-full h-full p-6 shadow-lg backface-hidden rounded-lg"
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
  setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
  cardFrontRef: React.RefObject<HTMLDivElement>;
  cardBackRef: React.RefObject<HTMLDivElement>;
}

const CardPreview = ({ cardDetails, setCardDetails, cardFrontRef, cardBackRef }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current || isFlipped || isDragging) return;

    const { left, top, width, height } = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((height / 2 - y) / (height / 2)) * -8; // Max rotation 8 degrees
    const rotateY = ((x - width / 2) / (width / 2)) * 8; // Max rotation 8 degrees

    cardContainerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardContainerRef.current && !isDragging) {
      cardContainerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-transparent">
        <div className="perspective-1000">
          <div
            ref={cardContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
              'relative w-full aspect-[1.7/1] transition-transform duration-300 preserve-3d',
              { 'rotate-y-180': isFlipped }
            )}
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            <CardFront 
              ref={cardFrontRef} 
              cardDetails={cardDetails} 
              setCardDetails={setCardDetails}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
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
