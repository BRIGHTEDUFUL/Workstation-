
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

interface CardActionsProps {
    cards: CardDetails[];
    handleDelete: (cardId: string) => void;
    handleDuplicate: (card: CardDetails) => void;
    handleShare: (card: CardDetails) => void;
}

const CardThumbnail = ({ card }: { card: CardDetails }) => {
    return (
        <div className="relative w-full overflow-hidden border-b aspect-video">
            <CardFace cardDetails={card} />
        </div>
    )
}

export default function CardActions({ cards, handleDelete, handleDuplicate, handleShare }: CardActionsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
              <AlertDialog key={card.id}>
                <Card className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1 bg-card">
                <Link href={`/design?id=${card.id}`}>
                    <CardThumbnail card={card} />
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
                                    variant="destructive"
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
            ))}
        </div>
    )
};

    