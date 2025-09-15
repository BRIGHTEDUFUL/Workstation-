
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import CardPreview from '@/components/design/card-preview';
import { CardDetails, DEFAULT_CARD_DETAILS } from '@/components/design/card-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Instagram, Facebook, Music, Globe, Mail, Phone, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { CardHubLogo } from '@/components/icons';

const SocialLink = ({ href, icon: Icon, label }: { href?: string, icon: React.ElementType, label: string }) => {
    if (!href) return null;
    return (
        <Button variant="outline" asChild>
            <a href={href} target="_blank" rel="noopener noreferrer">
                <Icon className="w-4 h-4 mr-2" /> {label}
            </a>
        </Button>
    )
};


export default function SharePage() {
    const params = useParams();
    const { id } = params;
    const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const cardFrontRef = useRef<HTMLDivElement>(null);
    const cardBackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        if (id) {
            const savedCards: CardDetails[] = JSON.parse(localStorage.getItem('savedCards') || '[]');
            const cardToView = savedCards.find(c => c.id === id);
            setCardDetails(cardToView || null);
        }
    }, [id]);

    if (!isMounted) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-muted/30">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">Loading Card...</p>
                </div>
            </div>
        );
    }

    if (!cardDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted/30">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">404</h1>
                    <p className="text-lg text-muted-foreground">Card not found.</p>
                     <Button asChild className='mt-4'>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    // Dummy setter function as preview is not editable here
    const setDummyCardDetails = () => {};

    return (
        <div className="min-h-screen bg-muted/20">
            <div className="container max-w-4xl py-12 mx-auto">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                    <div className="flex flex-col items-center">
                         <CardPreview
                            cardFrontRef={cardFrontRef}
                            cardBackRef={cardBackRef}
                            cardDetails={cardDetails}
                            setCardDetails={setDummyCardDetails as React.Dispatch<React.SetStateAction<CardDetails>>}
                        />
                    </div>
                    <div className='flex flex-col justify-center'>
                         <Card className="w-full">
                            <CardHeader className="flex flex-col items-center text-center">
                                {cardDetails.profilePicUrl && (
                                <Avatar className="w-24 h-24 mb-4 border-2" style={{borderColor: cardDetails.accentColor}}>
                                    <AvatarImage src={cardDetails.profilePicUrl} alt={cardDetails.name} />
                                    <AvatarFallback>{cardDetails.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                )}
                                <CardTitle className="text-3xl">{cardDetails.name}</CardTitle>
                                <CardDescription className='text-lg' style={{color: cardDetails.accentColor}}>{cardDetails.title}</CardDescription>
                                <p className='pt-1 text-muted-foreground'>{cardDetails.company}</p>
                            </CardHeader>
                            <CardContent className="space-y-4 text-center">
                                {cardDetails.landingPageBio && <p className="text-foreground">{cardDetails.landingPageBio}</p>}
                                
                                <div className="flex flex-wrap justify-center gap-2">
                                    <SocialLink href={cardDetails.website} icon={Globe} label="Website" />
                                    <SocialLink href={`mailto:${cardDetails.email}`} icon={Mail} label="Email" />
                                    <SocialLink href={`tel:${cardDetails.phone}`} icon={Phone} label="Call" />
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <SocialLink href={cardDetails.linkedin} icon={Linkedin} label="LinkedIn" />
                                    <SocialLink href={cardDetails.twitter} icon={Twitter} label="Twitter / X" />
                                    <SocialLink href={cardDetails.instagram} icon={Instagram} label="Instagram" />
                                    <SocialLink href={cardDetails.facebook} icon={Facebook} label="Facebook" />
                                    <SocialLink href={cardDetails.tiktok} icon={Music} label="TikTok" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
             <footer className="py-6 mt-8 text-center bg-background text-muted-foreground">
                <div className="container flex items-center justify-center gap-2">
                    <p>Powered by</p>
                    <CardHubLogo className="w-6 h-6" />
                    <p className="font-semibold text-foreground">CardHub</p>
                    <p> &mdash; </p>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/design">Create Your Own <ExternalLink className="w-3 h-3 ml-2"/></Link>
                    </Button>
                </div>
            </footer>
        </div>
    );
}

