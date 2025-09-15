'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from '@/components/ui/scroll-area';
import AiTools from '@/components/design/ai-tools';
import CardPreview from '@/components/design/card-preview';
import LayoutEditor from '@/components/design/layout-editor';
import { useSearchParams } from 'next/navigation';
import placeholderImages from '@/lib/placeholder-images.json';
import { v4 as uuidv4 } from 'uuid';
import { CardDetails, DEFAULT_CARD_DETAILS } from '@/components/design/card-data';
import DesignHeader from '@/components/design/design-header';


function DesignPageContents() {
    const searchParams = useSearchParams();
    const [cardDetails, setCardDetails] = useState<CardDetails>(DEFAULT_CARD_DETAILS);
    const cardPreviewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const templateId = searchParams.get('template');
        const cardId = searchParams.get('id');

        if (cardId) {
            const savedCards: CardDetails[] = JSON.parse(localStorage.getItem('savedCards') || '[]');
            const cardToEdit = savedCards.find(c => c.id === cardId);
            if (cardToEdit) {
                setCardDetails(cardToEdit);
            }
        } else if (templateId) {
            const template = placeholderImages.placeholderImages.find(t => t.id === templateId);
            if (template) {
                // @ts-ignore
                setCardDetails({ ...DEFAULT_CARD_DETAILS, ...template.data, category: template.category, id: uuidv4() });
            }
        } else {
            // New card
             setCardDetails(prev => ({...prev, id: uuidv4()}));
        }

    }, [searchParams]);

     useEffect(() => {
        // Update landing page URL whenever ID changes
        if (cardDetails.id) {
          setCardDetails(prev => ({...prev, landingPageUrl: typeof window !== 'undefined' ? `${window.location.origin}/card/${prev.id}` : `/card/${prev.id}`}));
        }
    }, [cardDetails.id]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <DesignHeader cardDetails={cardDetails} cardPreviewRef={cardPreviewRef} />
            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                    <ScrollArea className="h-full">
                        <div className="p-6 space-y-8">
                            <LayoutEditor cardDetails={cardDetails} setCardDetails={setCardDetails} />
                            <AiTools cardDetails={cardDetails} setCardDetails={setCardDetails} />
                        </div>
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                    <div className="flex items-center justify-center h-full p-8 bg-muted/30">
                       <CardPreview ref={cardPreviewRef} cardDetails={cardDetails} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default function DesignStudio() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DesignPageContents />
        </Suspense>
    )
}
