'use client'
import { PlusCircle, Trash, Copy, MoreVertical } from 'lucide-react';
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
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import type { CardDetails } from '@/components/design/card-data';

interface CardActionsProps {
    cards: CardDetails[];
    handleDelete: (cardId: string) => void;
    handleDuplicate: (card: CardDetails) => void;
}

export default function CardActions({ cards, handleDelete, handleDuplicate }: CardActionsProps) {

    if (cards.length === 0) {
        return (
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
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.id} className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1 bg-card">
                <Link href={`/design?id=${card.id}`}>
                    <div
                        className="relative w-full overflow-hidden border-b aspect-video"
                        style={{
                        backgroundColor: card.bgColor,
                        color: card.textColor,
                        fontFamily: card.font,
                        backgroundImage: card.backgroundImage
                            ? `url(${card.backgroundImage})`
                            : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/20">
                        {card.profilePicUrl && (
                            <Image
                            src={card.profilePicUrl}
                            alt={card.name}
                            width={40}
                            height={40}
                            className="mb-2 rounded-full"
                            />
                        )}
                        <h3 className="font-bold" style={{ color: card.textColor }}>
                            {card.name}
                        </h3>
                        <p className="text-sm" style={{ color: card.accentColor }}>
                            {card.title}
                        </p>
                        </div>
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
                            <DropdownMenuItem asChild>
                                <Link href={`/design?id=${card.id}`}><Pencil className="w-4 h-4 mr-2"/>Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(card)}><Copy className="w-4 h-4 mr-2"/>Duplicate</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm font-normal text-destructive hover:bg-destructive hover:text-destructive-foreground">
                                        <Trash className="w-4 h-4 mr-2"/>Delete
                                    </Button>
                                </AlertDialogTrigger>
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
                            </AlertDialog>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                </Card>
            ))}
        </div>
    )
};
