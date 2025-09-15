
'use client'

import React, { useState, useEffect, useRef } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from '@/components/ui/scroll-area';
import AiTools from './ai-tools';
import CardPreview from './card-preview';
import LayoutEditor from './layout-editor';
import { Download, Share2, Save } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import placeholderImages from '@/lib/placeholder-images.json';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';


export type CardDetails = {
    id: string;
    name: string;
    title:string;
    company: string;
    qrUrl: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    font: string;
    designDescription: string;
    logoUrl?: string;
    slogan?: string;
    category?: string;
    backgroundImage?: string;
    
    // Landing page fields
    landingPageUrl?: string;
    profilePicUrl?: string;
    landingPageBio?: string;
    email?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;

    // Category specific fields
    policyNumber?: string;
    planType?: string;
    eventName?: string;
    eventDate?: string;
    accessLevel?: string;
    memberId?: string;
    studentId?: string;
};

export const DEFAULT_CARD_DETAILS: CardDetails = {
    id: '1',
    name: 'Your Name',
    title: 'Your Title',
    company: 'Your Company',
    qrUrl: 'https://firebase.google.com',
    bgColor: '#ffffff',
    textColor: '#111827',
    accentColor: '#3b82f6',
    font: 'Inter',
    category: 'Business',
    designDescription: 'A clean and modern business card design with a white background, dark text, and blue accents. It features a prominent name and title on the front, and a QR code on the back.',
    profilePicUrl: "https://picsum.photos/seed/user-avatar/100/100",
    landingPageUrl: typeof window !== 'undefined' ? `${window.location.origin}/card/1` : '/card/1',
};

const DesignPage = () => {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [cardDetails, setCardDetails] = useState<CardDetails>(DEFAULT_CARD_DETAILS);
    const cardPreviewRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);

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
        setCardDetails(prev => ({...prev, landingPageUrl: typeof window !== 'undefined' ? `${window.location.origin}/card/${prev.id}` : `/card/${prev.id}`}));
    }, [cardDetails.id]);

    const handleExport = async () => {
        if (!cardPreviewRef.current) return;

        try {
            const dataUrl = await toPng(cardPreviewRef.current, { cacheBust: true });
            const link = document.createElement('a');
            link.download = `${cardDetails.name.replace(/\s+/g, '-').toLowerCase()}-card.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Export Failed',
                description: 'Could not export the card image.',
            });
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        try {
            const savedCards: CardDetails[] = JSON.parse(localStorage.getItem('savedCards') || '[]');
            const existingCardIndex = savedCards.findIndex(c => c.id === cardDetails.id);

            if (existingCardIndex > -1) {
                // Update existing card
                savedCards[existingCardIndex] = cardDetails;
            } else {
                // Add new card
                savedCards.push(cardDetails);
            }

            localStorage.setItem('savedCards', JSON.stringify(savedCards));

            toast({
                title: 'Card Saved!',
                description: 'Your design has been saved to "My Cards".',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: 'Could not save your card design.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <header className="flex items-center justify-between p-4 border-b shrink-0">
                <h1 className="text-xl font-bold">Design Studio</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Card'}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`/card/${cardDetails.id}`} target="_blank">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Link>
                    </Button>
                    <Button onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
            </header>
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

export default DesignPage;
