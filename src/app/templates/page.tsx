'use client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import placeholderImages from '@/lib/placeholder-images.json';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Templates() {
  const templates = placeholderImages.placeholderImages.filter(img =>
    img.id.startsWith('template-')
  );

  const templatesByCategory = templates.reduce(
    (acc, template) => {
      const category = template.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    },
    {} as Record<string, typeof templates>
  );

  const categoryOrder = [
    'Business',
    'Personal',
    'Creative',
    'Event',
    'Membership',
    'Student',
    'Medical',
  ];

  const sortedCategories = Object.keys(templatesByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="flex flex-col h-screen">
      <header className="p-6 border-b shrink-0 border-border">
        <h1 className="text-2xl font-bold tracking-tight">Template Library</h1>
        <p className="text-muted-foreground">
          Choose a starting point for your next amazing card design.
        </p>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="space-y-10">
          {sortedCategories.map(category => (
            <div key={category}>
              <h2 className="mb-6 text-xl font-semibold tracking-tight">
                {category} Cards
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {templatesByCategory[category].map(template => (
                  <Card
                    key={template.id}
                    className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1"
                  >
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
                        <Link href={`/design?template=${template.id}`}>Use Template</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
