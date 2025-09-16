
'use client';

import { ArrowRight, Brush, Library, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CardDetails } from '@/components/design/card-data';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import CardFace from '@/components/design/card-face';
import { getPatternStyle } from '@/lib/patterns';

function RecentCards() {
  const [recentCards, setRecentCards] = useState<CardDetails[]>([]);

  useEffect(() => {
    // On client mount, read from localStorage to hydrate the state
    const savedCards: CardDetails[] = JSON.parse(
      localStorage.getItem('savedCards') || '[]'
    );
    // Get the 3 most recently added cards
    const sortedCards = savedCards.slice().reverse().slice(0, 3);
    setRecentCards(sortedCards);
  }, []);

  if (recentCards.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Your recently designed cards will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recentCards.map(card => {
          const cardStyle: React.CSSProperties = {
            ...getPatternStyle(card.pattern, card.accentColor),
            backgroundColor: card.bgColor,
          };
           if (card.backgroundImage && !card.pattern) {
            cardStyle.backgroundImage = `url(${card.backgroundImage})`;
            cardStyle.backgroundSize = 'cover';
            cardStyle.backgroundPosition = 'center';
          }
        return (
            <Link key={card.id} href={`/design?id=${card.id}`}>
            <div
                className="relative w-full overflow-hidden transition-all duration-300 ease-in-out border rounded-lg shadow-sm group aspect-video hover:shadow-lg hover:-translate-y-1"
                style={cardStyle}
            >
                <CardFace cardDetails={card} isPreview={false} />
            </div>
            </Link>
        )
      })}
    </div>
  );
}

function TemplateSuggestions() {
  const templates = placeholderImages.placeholderImages
    .filter(img => img.id.startsWith('template-'))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map(template => {
        const cardDetails = {
            ...template.data,
            id: template.id,
            elements: [],
            layoutId: 'center-aligned'
        } as unknown as CardDetails;

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
            <Card
            key={template.id}
            className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1"
            >
            <CardContent className="relative p-0 aspect-video" style={cardStyle}>
                <CardFace cardDetails={cardDetails} isPreview={false} />
            </CardContent>
            <CardHeader className="flex-row items-center justify-between p-4">
                <p className="font-semibold">{template.description}</p>
                <Button asChild size="sm">
                <Link href={`/design?template=${template.id}`}>Use</Link>
                </Button>
            </CardHeader>
            </Card>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex flex-col items-start justify-between gap-4 p-6 border-b sm:flex-row sm:items-center shrink-0 border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's a quick overview.
          </p>
        </div>
        <div className="flex flex-col w-full gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Button asChild variant="outline" className='w-full sm:w-auto'>
            <Link href="/templates">
              <Library className="w-4 h-4 mr-2" />
              Browse Templates
            </Link>
          </Button>
          <Button asChild className='w-full sm:w-auto'>
            <Link href="/design">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Card
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Recent Cards</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-cards">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <RecentCards />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Start from a Template</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/templates">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <TemplateSuggestions />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
