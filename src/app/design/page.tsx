

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
import cardLayouts from '@/lib/card-layouts.json';
import { v4 as uuidv4 } from 'uuid';
import { CardDetails, DEFAULT_CARD_DETAILS } from '@/components/design/card-data';
import DesignHeader from '@/components/design/design-header';


function DesignPageContents() {
    const searchParams = useSearchParams();
    const [cardDetails, setCardDetails] = useState<CardDetails>(DEFAULT_CARD_DETAILS);
    const cardFrontRef = useRef<HTMLDivElement>(null);
    const cardBackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getInitialCardDetails = (): CardDetails => {
            const templateId = searchParams.get('template');
            const cardId = searchParams.get('id');
            // @ts-ignore
            const defaultLayout = cardLayouts.layouts.find(l => l.id === 'center-aligned')!;
    
            if (cardId) {
                const savedCards: CardDetails[] = JSON.parse(localStorage.getItem('savedCards') || '[]');
                const cardToEdit = savedCards.find(c => c.id === cardId);
                if (cardToEdit) {
                    // Ensure older cards without a layout get the default one
                    if (!cardToEdit.layoutId) {
                        cardToEdit.layoutId = defaultLayout.id;
                        cardToEdit.elements = defaultLayout.elements;
                    }
                    return cardToEdit;
                }
            }
            
            // Start with default details and always apply the default layout.
            let baseDetails: CardDetails = {
                ...DEFAULT_CARD_DETAILS, 
                elements: defaultLayout.elements,
                layoutId: defaultLayout.id,
            };
            const newCardId = uuidv4();
            let id = newCardId;

            // If a template is used, apply its data over the defaults, but keep the layout.
            if (templateId) {
                const template = placeholderImages.placeholderImages.find(t => t.id === templateId);
                if (template && template.data) {
                    // @ts-ignore
                    baseDetails = { ...baseDetails, ...template.data, category: template.category || baseDetails.category, pattern: template.data.pattern || '' };
                }
            }
            
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(window.location.origin + '/share/' + id)}&bgcolor=${baseDetails.bgColor.substring(1)}&color=${baseDetails.textColor.substring(1)}&qzone=1`;

            return {
                ...baseDetails,
                id: id,
                qrUrl: qrUrl,
            };
        };

        setCardDetails(getInitialCardDetails());
    }, [searchParams]);

    useEffect(() => {
        const handleCardSaved = (event: Event) => {
            const customEvent = event as CustomEvent<CardDetails>;
            if(customEvent.detail.id === cardDetails.id) {
                setCardDetails(customEvent.detail);
            }
        };

        window.addEventListener('card-saved', handleCardSaved);
        return () => {
            window.removeEventListener('card-saved', handleCardSaved);
        };
    }, [cardDetails.id]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <DesignHeader cardDetails={cardDetails} cardFrontRef={cardFrontRef} cardBackRef={cardBackRef} />
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
                       <CardPreview cardFrontRef={cardFrontRef} cardBackRef={cardBackRef} cardDetails={cardDetails} setCardDetails={setCardDetails} />
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
