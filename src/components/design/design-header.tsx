
'use client'

import { Download, Share2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from './card-data';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DesignHeaderProps {
    cardDetails: CardDetails;
    cardFrontRef: React.RefObject<HTMLDivElement>;
    cardBackRef: React.RefObject<HTMLDivElement>;
}

const DesignHeader = ({ cardDetails, cardFrontRef, cardBackRef }: DesignHeaderProps) => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    
    const handleExport = async () => {
        const frontNode = cardFrontRef.current;
        const backNode = cardBackRef.current;

        if (!frontNode || !backNode) {
            toast({
                variant: 'destructive',
                title: 'Export Failed',
                description: 'Card elements not found.',
            });
            return;
        }

        try {
            // Export Front
            const frontDataUrl = await toPng(frontNode, { cacheBust: true, pixelRatio: 2 });
            const frontLink = document.createElement('a');
            frontLink.download = `${cardDetails.name.replace(/\s+/g, '-').toLowerCase()}-card-front.png`;
            frontLink.href = frontDataUrl;
            frontLink.click();

            // Export Back: Temporarily remove transform to fix rendering
            const originalTransform = backNode.style.transform;
            backNode.style.transform = 'none';

            const backDataUrl = await toPng(backNode, { cacheBust: true, pixelRatio: 2 });
            
            // Restore transform after export
            backNode.style.transform = originalTransform;

            const backLink = document.createElement('a');
            backLink.download = `${cardDetails.name.replace(/\s+/g, '-').toLowerCase()}-card-back.png`;
            backLink.href = backDataUrl;
            backLink.click();

        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Export Failed',
                description: 'Could not export the card images.',
            });
            // Ensure transform is restored even if export fails
            if (backNode && backNode.style.transform === 'none') {
                backNode.style.transform = 'rotateY(180deg)';
            }
        }
    };

    const handleSave = (redirect: boolean = false) => {
        setIsSaving(true);
        try {
            const savedCards: CardDetails[] = JSON.parse(localStorage.getItem('savedCards') || '[]');
            const existingCardIndex = savedCards.findIndex(c => c.id === cardDetails.id);

            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(window.location.origin + '/share/' + cardDetails.id)}&bgcolor=${cardDetails.bgColor.substring(1)}&color=${cardDetails.textColor.substring(1)}&qzone=1`;

            const cardToSave = {
                ...cardDetails,
                qrUrl
            };

            if (existingCardIndex > -1) {
                savedCards[existingCardIndex] = cardToSave;
            } else {
                savedCards.push(cardToSave);
            }

            localStorage.setItem('savedCards', JSON.stringify(savedCards));
            
            window.dispatchEvent(new CustomEvent('card-saved', { detail: cardToSave }));

            if (redirect) {
                router.push(`/share/${cardDetails.id}`);
            } else {
                 toast({
                    title: 'Card Saved!',
                    description: 'Your design has been saved to "My Cards".',
                });
            }

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
                <Button onClick={() => handleSave(false)} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Card'}
                </Button>
                <Button variant="outline" onClick={() => handleSave(true)}>
                    <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" /> Export
                </Button>
            </div>
        </header>
    );
};

export default DesignHeader;
