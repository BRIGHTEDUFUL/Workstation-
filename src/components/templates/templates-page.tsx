'use client';
import {
    Card,
    CardContent,
    CardFooter
  } from '@/components/ui/card';
import placeholderImages from '@/lib/placeholder-images.json';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
  
  const TemplatesPage = () => {
    const templates = placeholderImages.placeholderImages.filter(img => img.id.startsWith('template-'));
  
    return (
      <div className="flex flex-col h-screen">
        <header className="p-6 border-b shrink-0 border-border">
          <h1 className="text-2xl font-bold tracking-tight">Template Library</h1>
          <p className="text-muted-foreground">
            Choose a starting point for your next amazing card design.
          </p>
        </header>
  
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1">
                <CardContent className="relative p-0 aspect-video">
                  <Image
                    src={template.imageUrl}
                    alt={template.description}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={template.imageHint}
                  />
                </CardContent>
                <CardFooter className="p-4 bg-card">
                  <p className="font-semibold">{template.description}</p>
                  <Button asChild size="sm" className="ml-auto">
                    <Link href="/design">Use Template</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  };
  
  export default TemplatesPage;
  
