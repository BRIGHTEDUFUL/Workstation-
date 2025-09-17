

'use client'

import { Download, Share2, Save, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toBlob } from 'html-to-image';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from './card-data';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface DesignHeaderProps {
    cardDetails: CardDetails;
    cardFrontRef: React.RefObject<HTMLDivElement>;
    cardBackRef: React.RefObject<HTMLDivElement>;
}

const DesignHeader = ({ cardDetails, cardFrontRef, cardBackRef }: DesignHeaderProps) => {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const isMobile = useIsMobile();
    
    const downloadImage = async (node: HTMLDivElement, filename: string) => {
      try {
        const blob = await toBlob(node, { cacheBust: true, pixelRatio: 2, skipAutoScale: true });
        if (!blob) {
          throw new Error('Failed to create blob.');
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url); // Clean up the object URL
      } catch (error) {
         console.error(`Failed to export ${filename}:`, error);
         throw error; // re-throw to be caught by the main handler
      }
    };

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
            await downloadImage(frontNode, `${cardDetails.name.replace(/\s+/g, '-').toLowerCase()}-card-front.png`);
            
            // Wait a moment before starting the next download to prevent browser issues
            await new Promise(resolve => setTimeout(resolve, 500));

            // Export Back
            await downloadImage(backNode, `${cardDetails.name.replace(/\s+/g, '-').toLowerCase()}-card-back.png`);

        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Export Failed',
                description: 'An error occurred while generating the card images.',
            });
        }
    };

    const handleSave = (share: boolean = false) => {
        setIsSaving(true);
        try {
            const savedCards: CardDetails[] = JSON.parse(localStorage.getItem('savedCards') || '[]');
            const existingCardIndex = savedCards.findIndex(c => c.id === cardDetails.id);

            let cardToSave = { ...cardDetails };

            if (existingCardIndex > -1) {
                savedCards[existingCardIndex] = cardToSave;
            } else {
                savedCards.unshift(cardToSave);
            }

            localStorage.setItem('savedCards', JSON.stringify(savedCards));
            
            window.dispatchEvent(new CustomEvent('card-saved', { detail: cardToSave }));

            if (share) {
                if (cardDetails.website) {
                    navigator.clipboard.writeText(cardDetails.website);
                    toast({
                        title: 'Link Copied!',
                        description: 'The website link has been copied to your clipboard.',
                    });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'No Website URL',
                        description: 'Please add a website URL in the editor to share.',
                    });
                }
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

    const ActionButtons = () => (
        <>
            <Button onClick={() => handleSave(false)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Card'}
            </Button>
            <Button variant="outline" onClick={() => handleSave(true)} disabled={!cardDetails.website}>
                <Share2 className="w-4 h-4 mr-2" /> Share
            </Button>
            <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" /> Export
            </Button>
        </>
    )

    return (
        <header className="flex items-center justify-between p-4 border-b shrink-0">
            <h1 className="text-lg font-bold sm:text-xl">Design Studio</h1>
            {isMobile ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                         <DropdownMenuItem onClick={() => handleSave(false)} disabled={isSaving}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Card'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSave(true)} disabled={!cardDetails.website}>
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExport}>
                            <Download className="w-4 h-4 mr-2" /> Export
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center gap-2">
                   <ActionButtons />
                </div>
            )}
        </header>
    );
};

export default DesignHeader;
