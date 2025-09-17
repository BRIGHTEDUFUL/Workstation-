
'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CardFace from '@/components/design/card-face';
import { getPatternStyle } from '@/lib/patterns';
import type { CardDetails } from '@/ai/schema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SubmissionCardPreviewProps {
  cardDetails: CardDetails;
}

export default function SubmissionCardPreview({ cardDetails }: SubmissionCardPreviewProps) {
    const cardStyle: React.CSSProperties = {
        ...getPatternStyle(cardDetails.pattern, cardDetails.accentColor),
        backgroundColor: cardDetails.bgColor,
    };
    if (cardDetails.backgroundImage && !cardDetails.pattern) {
        cardStyle.backgroundImage = `url(${cardDetails.backgroundImage})`;
        cardStyle.backgroundSize = 'cover';
        cardStyle.backgroundPosition = 'center';
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div 
                    className="w-24 h-14 rounded-md border overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                    style={cardStyle}
                >
                    <div className="transform scale-[0.25] origin-top-left">
                         <div className="w-96 h-56">
                            <CardFace cardDetails={cardDetails} />
                        </div>
                    </div>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl">
                <div className="aspect-video w-full rounded-lg border" style={cardStyle}>
                     <CardFace cardDetails={cardDetails} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                     <Button asChild>
                        <Link href={`/design?id=${cardDetails.id}`}>
                           Review & Edit
                        </Link>
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
