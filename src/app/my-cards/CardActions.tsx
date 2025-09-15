
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
import Image from 'next/image';
import type { CardDetails } from '@/components/design/card-data';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { getPatternStyle } from '@/lib/patterns';
import cardLayouts from '@/lib/card-layouts.json';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CardActionsProps {
    cards: CardDetails[];
    handleDelete: (cardId: string) => void;
    handleDuplicate: (card: CardDetails) => void;
    handleShare: (card: CardDetails) => void;
}


const CardPreview = ({ card }: { card: CardDetails }) => {
    const layout = cardLayouts.layouts.find(l => l.id === card.layoutId) || cardLayouts.layouts[0];
    const elements = card.elements || [];
    
    const baseStyle = {
        backgroundColor: card.bgColor,
        fontFamily: card.font,
        ...getPatternStyle(card.pattern, card.accentColor),
        ...(card.backgroundImage && !card.pattern && {
            backgroundImage: `url(${card.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }),
    };

    const nameElement = elements.find(e => e.component === 'name') || { fontSize: 2.2, fontWeight: 700 };
    const titleElement = elements.find(e => e.component === 'title') || { fontSize: 1.4, fontWeight: 400 };
    const companyElement = elements.find(e => e.component === 'company') || { fontSize: 1.1, fontWeight: 400 };
    const logoElement = elements.find(e => e.component === 'logo');
    const profilePicElement = elements.find(e => e.component === 'profilePic');


    if (layout.id.startsWith('split-')) {
        const isVertical = layout.id.includes('vertical');
        const splitSectionStyle = {
            backgroundColor: card.accentColor,
            color: card.bgColor, // Invert color for contrast
        };
        const textSectionStyle = {
            color: card.textColor,
        };

        const SplitSection = (
            <div
                className={cn("flex flex-col p-4", isVertical ? 'w-2/5' : 'h-2/5', 'items-center justify-center')}
                 style={{...splitSectionStyle, justifyContent: layout.justifyContent as any, alignItems: layout.textAlign === 'center' ? 'center' : 'flex-start', textAlign: layout.textAlign as any }}
            >
                {logoElement && card.logoUrl && (
                    <Image src={card.logoUrl} alt="Company Logo" width={80} height={30} className="object-contain" />
                )}
            </div>
        );

        const TextSection = (
            <div
                className={cn("flex flex-col p-4", isVertical ? 'w-3/5' : 'h-3/5')}
                style={{...textSectionStyle, justifyContent: layout.justifyContent as any, alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'), textAlign: layout.textAlign as any,}}
            >
                {profilePicElement && card.profilePicUrl && (
                    <div className="mb-2">
                        <Avatar className="w-12 h-12 border-2" style={{ borderColor: card.textColor }}>
                            <AvatarImage src={card.profilePicUrl} />
                            <AvatarFallback>{card.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                )}
                 <h3 className="font-bold text-lg" style={{ color: card.textColor }}>
                    {card.name}
                </h3>
                <p className="text-sm" style={{ color: card.accentColor }}>
                    {card.title}
                </p>
                <p className="text-xs mt-1" style={{ color: card.textColor }}>
                    {card.company}
                </p>
            </div>
        );

        return (
            <div className={cn("relative w-full overflow-hidden border-b aspect-video flex", isVertical ? 'flex-row' : 'flex-col')} style={baseStyle}>
                {layout.id.endsWith('-reverse') ? <>{TextSection}{SplitSection}</> : <>{SplitSection}{TextSection}</>}
            </div>
        );
    }
    

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: layout.textAlign === 'center' ? 'center' : (layout.textAlign === 'right' ? 'flex-end' : 'flex-start'),
        justifyContent: layout.justifyContent as any,
        textAlign: layout.textAlign as any,
        height: '100%',
        padding: '1rem',
        color: card.textColor,
    };

    return (
        <div className="relative w-full overflow-hidden border-b aspect-video" style={baseStyle}>
            <div style={containerStyle}>
                 {profilePicElement && card.profilePicUrl && (
                    <div className="mb-2">
                        <Avatar className="w-12 h-12 border-2" style={{ borderColor: card.accentColor }}>
                            <AvatarImage src={card.profilePicUrl} />
                            <AvatarFallback>{card.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                )}
                <div className="flex flex-col">
                    <h3 className="font-bold text-lg" style={{ color: card.textColor }}>
                        {card.name}
                    </h3>
                    <p className="text-sm" style={{ color: card.accentColor }}>
                        {card.title}
                    </p>
                    <p className="text-xs mt-1" style={{ color: card.textColor }}>
                        {card.company}
                    </p>
                </div>
                 {logoElement && card.logoUrl && (
                    <div className="mt-auto">
                        <Image src={card.logoUrl} alt="Company Logo" width={80} height={20} className="object-contain h-5" />
                    </div>
                )}
            </div>
        </div>
    )
}


export default function CardActions({ cards, handleDelete, handleDuplicate, handleShare }: CardActionsProps) {

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
              <AlertDialog key={card.id}>
                <Card className="overflow-hidden transition-all duration-300 ease-in-out shadow-sm group hover:shadow-lg hover:-translate-y-1 bg-card">
                <Link href={`/design?id=${card.id}`}>
                    <CardPreview card={card} />
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
                                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
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
