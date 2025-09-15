'use client'
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

const DashboardPage = () => {
    const cards = placeholderImages.placeholderImages.filter(img => img.id.startsWith('card-'));

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-6 border-b shrink-0 border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here are your saved card designs.
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
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card, index) => (
              <Card key={index} className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-0">
                  <Image
                    src={card.imageUrl}
                    alt={card.description}
                    width={400}
                    height={225}
                    className="object-cover w-full h-auto aspect-[16/9] transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={card.imageHint}
                  />
                </CardContent>
                <CardHeader>
                  <CardTitle>Card Design {index + 1}</CardTitle>
                  <CardDescription>Last updated: 2 days ago</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/design">Edit</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Duplicate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed rounded-lg border-border bg-muted/20">
            <h2 className="text-xl font-semibold">No Cards Yet</h2>
            <p className="mt-2 text-muted-foreground">
              Get started by creating a new card design.
            </p>
            <Link href="/design" className="mt-4">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Card
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
