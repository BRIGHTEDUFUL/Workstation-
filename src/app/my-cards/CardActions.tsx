
'use client'
import { PlusCircle, Trash, Copy, MoreVertical, Pencil, Share2 } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CardDetails } from '@/components/design/card-data';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import CardFace from '@/components/design/card-face';
import { getPatternStyle } from '@/lib/patterns';

interface CardActionsProps {
    cards: CardDetails[];
    handleDelete: (cardId: string) => void;
    handleDuplicate: (card: CardDetails) => void;
    handleShare: (card: CardDetails) => void;
}

export default function CardActions({ cards, handleDelete, handleDuplicate, handleShare }: CardActionsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => {
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
                    <AlertDialog key={card.id}>
                        <Card className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1 bg-card">
                        <Link href={`/design?id=${card.id}`}>
                            <div className="relative w-full overflow-hidden border-b aspect-video" style={cardStyle}>
                                <CardFace cardDetails={card} />
                            </div>
                        </Link>
                        <CardHeader className="flex-row items-center justify-between p-4">
                            <div>
                                <CardTitle className="text-base">{card.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{card.title}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleShare(card)} disabled={!card.website}><Share2 className="w-4 h-4 mr-2"/>Share</DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/design?id=${card.id}`}><Pencil className="w-4 h-4 mr-2"/>Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDuplicate(card)}><Copy className="w-4 h-4 mr-2"/>Duplicate</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            className='text-destructive focus:bg-destructive focus:text-destructive-foreground'
                                        >
                                            <Trash className="w-4 h-4 mr-2"/>Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your card design.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(card.id)} className="bg-destructive hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </Card>
                    </AlertDialog>
                );
            })}
        </div>
    )
};
