'use client'

import { Download, Share2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from './card-data';
import { useState } from 'react';

interface DesignHeaderProps {
    cardDetails: CardDetails;
    cardPreviewRef: React.RefObject<HTMLDivElement>;
}

const DesignHeader = ({ cardDetails, cardPreviewRef }: DesignHeaderProps) => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
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

            // Ensure the landing page URL is up-to-date before saving
            const cardToSave = {
                ...cardDetails,
                landingPageUrl: `${window.location.origin}/card/${cardDetails.id}`
            };

            if (existingCardIndex > -1) {
                // Update existing card
                savedCards[existingCardIndex] = cardToSave;
            } else {
                // Add new card
                savedCards.push(cardToSave);
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
    );
};

export default DesignHeader;
