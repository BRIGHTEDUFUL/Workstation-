'use client'

import React, { useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from '@/components/ui/scroll-area';
import AiTools from './ai-tools';
import CardPreview from './card-preview';
import LayoutEditor from './layout-editor';
import { Download, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export type CardDetails = {
    id: string;
    name: string;
    title: string;
    company: string;
    qrUrl: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    font: string;
    designDescription: string;
    logoUrl?: string;
    slogan?: string;
    
    // Landing page fields
    landingPageBio?: string;
    phone?: string;
    email?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    profilePicUrl?: string;
};

const DesignPage = () => {
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        id: '1',
        name: 'Your Name',
        title: 'Your Title',
        company: 'Your Company',
        qrUrl: 'https://firebase.google.com',
        bgColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6',
        font: 'Inter',
        designDescription: 'A clean and modern business card design with a white background, dark text, and blue accents. It features a prominent name and title on the front, and a QR code on the back.',
        profilePicUrl: "https://picsum.photos/seed/user-avatar/100/100"
    });

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <header className="flex items-center justify-between p-4 border-b shrink-0">
                <h1 className="text-xl font-bold">Design Studio</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/card/${cardDetails.id}`} target="_blank">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Link>
                    </Button>
                    <Button>
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
            </header>
            <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                    <ScrollArea className="h-full">
                        <div className="p-6 space-y-8">
                            <LayoutEditor cardDetails={cardDetails} setCardDetails={setCardDetails} />
                            <AiTools cardDetails={cardDetails} setCardDetails={setCardDetails} />
                        </div>
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70}>
                    <div className="flex items-center justify-center h-full p-8 bg-muted/30">
                       <CardPreview cardDetails={cardDetails} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default DesignPage;
