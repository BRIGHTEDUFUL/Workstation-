'use client';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { CardDetails } from '@/components/design/card-data';
import CardActions from './CardActions';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export default function MyCards() {
    const [cards, setCards] = useState<CardDetails[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const { toast } = useToast();

     useEffect(() => {
        setIsMounted(true);
        // On client mount, read from localStorage to hydrate the state
        const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
        setCards(savedCards);
    }, []);

    const handleDelete = (cardId: string) => {
        const updatedCards = cards.filter(card => card.id !== cardId);
        localStorage.setItem('savedCards', JSON.stringify(updatedCards));
        setCards(updatedCards);
        toast({
            title: "Card Deleted",
            description: "The card has been removed from your collection.",
        });
    };
    
    const handleDuplicate = (cardToDuplicate: CardDetails) => {
      const newCard = {
        ...cardToDuplicate,
        id: uuidv4(), // Assign a new unique ID
        name: `${cardToDuplicate.name} (Copy)`,
      };

      // Update landing page and QR code URLs for the new card
      newCard.landingPageUrl = `${window.location.origin}/card/${newCard.id}`;
      newCard.qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(newCard.landingPageUrl)}&bgcolor=${newCard.bgColor.substring(1)}&color=${newCard.textColor.substring(1)}&qzone=1`;


      const updatedCards = [...cards, newCard];
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      setCards(updatedCards);
      toast({
        title: 'Card Duplicated',
        description: 'A copy of the card has been added to your collection.',
      });
    };

    if (!isMounted) {
        return (
          <div className="flex flex-col h-screen">
            <header className="flex items-center justify-between p-6 border-b shrink-0 border-border">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">My Cards</h1>
                <p className="text-muted-foreground">Manage your saved card designs.</p>
              </div>
              <Link href="/design">
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Card
                </Button>
              </Link>
            </header>
            <main className="flex-1 p-6 overflow-auto">
              <p>Loading cards...</p>
            </main>
          </div>
        )
    }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-6 border-b shrink-0 border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Cards</h1>
          <p className="text-muted-foreground">
            Manage your saved card designs.
          </p>
        </div>
        <Link href="/design">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Card
          </Button>
        </Link>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <CardActions cards={cards} handleDelete={handleDelete} handleDuplicate={handleDuplicate} />
      </main>
    </div>
  );
};
