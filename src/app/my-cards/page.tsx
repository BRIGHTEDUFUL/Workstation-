'use server';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Image from 'next/image';
import type { CardDetails } from '@/components/design/card-data';
import CardActions from './CardActions';

// This is a placeholder for a server-side data fetching function.
// In a real app, this would fetch from a database.
// For this prototype, we are returning an empty array as localStorage is not available on the server.
async function getSavedCards(): Promise<CardDetails[]> {
    // In a real app, you would fetch this data from a database.
    // e.g., return await db.cards.findMany({ where: { userId: user.id } });
    return [];
}


export default async function MyCards() {
    // We call the async function to get the cards.
    // In this prototype, it will be empty on the server. The client will hydrate it.
    const cards = await getSavedCards();

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
        <CardActions initialCards={cards} />
      </main>
    </div>
  );
};
