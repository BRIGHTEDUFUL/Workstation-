
'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import placeholderImages from '@/lib/placeholder-images.json';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CardFace from '@/components/design/card-face';
import { CardDetails } from '@/components/design/card-data';
import { getPatternStyle } from '@/lib/patterns';

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templates = placeholderImages.placeholderImages.filter(img =>
    img.id.startsWith('template-')
  );

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category || 'General')))];

  const categoryOrder = [
    'All',
    'Business',
    'Personal',
    'Creative',
    '3D',
    'Event',
    'Membership',
    'Student',
    'Medical',
    'General',
  ];

  const sortedCategories = categories.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => (t.category || 'General') === selectedCategory);

  const templatesByCategory = filteredTemplates.reduce(
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

  const displayedCategories = Object.keys(templatesByCategory).sort((a, b) => {
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
        <div className="flex flex-wrap gap-2 mb-8">
          {sortedCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-10">
          {displayedCategories.map(category => (
            <div key={category}>
               {selectedCategory === 'All' && (
                <h2 className="mb-6 text-xl font-semibold tracking-tight">
                    {category} Cards
                </h2>
               )}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templatesByCategory[category].map(template => {
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
                  } else if (!cardDetails.pattern) {
                    // This ensures cards without patterns have a solid background color
                    cardStyle.backgroundColor = cardDetails.bgColor;
                  }


                  return (
                    <Card
                      key={template.id}
                      className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1"
                    >
                      <CardContent className="relative p-0 border-b aspect-video" style={cardStyle}>
                        <CardFace cardDetails={cardDetails} />
                      </CardContent>
                      <CardFooter className="flex-wrap items-center justify-between p-4 bg-card">
                        <p className="font-semibold">{template.description}</p>
                        <Button asChild size="sm" className="mt-2 ml-auto sm:mt-0">
                          <Link href={`/design?template=${template.id}`}>Use Template</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
