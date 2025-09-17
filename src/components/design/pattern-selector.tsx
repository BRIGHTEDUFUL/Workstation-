
'use client';

import React from 'react';
import { patterns, getPatternStyle } from '@/lib/patterns';
import { CardDetails } from '@/ai/schema';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface PatternSelectorProps {
  cardDetails: CardDetails;
  setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const PatternSelector = ({ cardDetails, setCardDetails }: PatternSelectorProps) => {
  const handleSelectPattern = (patternId: string) => {
    setCardDetails((prev) => ({
      ...prev,
      pattern: prev.pattern === patternId ? undefined : patternId,
      backgroundImage: undefined, // Patterns and images are mutually exclusive
    }));
  };

  return (
    <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-2 p-1">
                 <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        'h-14 w-14 shrink-0 rounded-md border-2',
                        !cardDetails.pattern ? 'border-primary' : 'border-transparent'
                    )}
                    onClick={() => handleSelectPattern('')}
                 >
                     <X className="w-6 h-6 text-muted-foreground" />
                     <span className="sr-only">No Pattern</span>
                 </Button>
                {patterns.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => handleSelectPattern(p.id)}
                        className={cn(
                            'h-14 w-14 shrink-0 cursor-pointer rounded-md border-2 transition-all',
                            cardDetails.pattern === p.id ? 'border-primary' : 'border-border'
                        )}
                        style={{
                            backgroundColor: cardDetails.bgColor,
                            ...getPatternStyle(p.id, cardDetails.accentColor),
                        }}
                        title={p.name}
                    />
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );
};

export default PatternSelector;
