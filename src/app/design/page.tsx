
'use client'

import React, { useState, useEffect, Suspense } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from '@/components/ui/scroll-area';
import AiTools from '@/components/design/ai-tools';
import CardPreview from '@/components/design/card-preview';
import EditorPanel from '@/components/design/editor-panel';
import { useSearchParams } from 'next/navigation';
import placeholderImages from '@/lib/placeholder-images.json';
import cardLayouts from '@/lib/card-layouts.json';
import { v4 as uuidv4 } from 'uuid';
import { CardDetails, DEFAULT_CARD_DETAILS } from '@/components/design/card-data';
import DesignHeader from '@/components/design/design-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function DesignPageContents() {
    const searchParams = useSearchParams();
    const [cardDetails, setCardDetails] = useState<CardDetails>(DEFAULT_CARD_DETAILS);
    
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
            
            let baseDetails: CardDetails = {
                ...DEFAULT_CARD_DETAILS, 
                elements: defaultLayout.elements,
                layoutId: defaultLayout.id,
            };
            const newCardId = uuidv4();
            let id = newCardId;

            if (templateId) {
                const template = placeholderImages.placeholderImages.find(t => t.id === templateId);
                if (template && template.data) {
                    // @ts-ignore
                    baseDetails = { ...baseDetails, ...template.data, category: template.category || baseDetails.category, pattern: template.data.pattern || '' };
                }
            }
            
            const qrUrl = '';

            return {
                ...baseDetails,
                id: id,
                website: '',
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
            <DesignHeader cardDetails={cardDetails} />

            {/* Desktop: 3-panel layout */}
            <div className="flex-1 hidden min-h-0 md:flex">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                        <ScrollArea className="h-full">
                            <EditorPanel cardDetails={cardDetails} setCardDetails={setCardDetails} />
                        </ScrollArea>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <div className="flex items-center justify-center w-full h-full p-8 bg-muted/30">
                            <CardPreview cardDetails={cardDetails} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                        <ScrollArea className="h-full">
                            <div className="p-6">
                                <AiTools cardDetails={cardDetails} setCardDetails={setCardDetails} />
                            </div>
                        </ScrollArea>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            {/* Mobile: Tab-based layout */}
            <div className="flex flex-col flex-1 min-h-0 md:hidden">
                <Tabs defaultValue="preview" className="flex flex-col flex-1 min-h-0">
                    <TabsContent value="editor" className="flex-1 overflow-auto">
                        <ScrollArea className="h-full">
                           <EditorPanel cardDetails={cardDetails} setCardDetails={setCardDetails} />
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="preview" className="flex-1 overflow-auto bg-muted/30">
                        <div className="flex flex-col items-center justify-center h-full p-8">
                            <CardPreview cardDetails={cardDetails} />
                        </div>
                    </TabsContent>
                    <TabsContent value="ai" className="flex-1 overflow-auto">
                        <ScrollArea className="h-full">
                            <div className="p-6">
                                <AiTools cardDetails={cardDetails} setCardDetails={setCardDetails} />
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsList className="grid w-full grid-cols-3 mt-auto border-t">
                        <TabsTrigger value="editor" className="py-3 rounded-none">Editor</TabsTrigger>
                        <TabsTrigger value="preview" className="py-3 rounded-none">Preview</TabsTrigger>

                        <TabsTrigger value="ai" className="py-3 rounded-none">AI Tools</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
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
