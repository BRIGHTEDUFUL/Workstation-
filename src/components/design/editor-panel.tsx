
'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import type { CardDetails } from './card-data';
import { Button } from '../ui/button';
import { Upload, Globe } from 'lucide-react';
import cardLayouts from '@/lib/card-layouts.json';
import PatternSelector from './pattern-selector';
import { generateQrCodeDesignAction } from '@/ai/flows/generate-qr-code-design';
import { useToast } from '@/hooks/use-toast';

interface EditorPanelProps {
    cardDetails: CardDetails;
    setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const EditorPanel = React.memo(({ cardDetails, setCardDetails }: EditorPanelProps) => {
    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [isGeneratingQr, setIsGeneratingQr] = useState(false);
    const { toast } = useToast();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    }, [setCardDetails]);

    const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Trigger QR generation on website URL change
        if (name === 'website') {
            generateQrCode(value);
        }
    }, [setCardDetails]);

    const handleSelectChange = useCallback((name: string, value: string) => {
        setCardDetails(prev => ({ ...prev, [name]: value as any }));
    }, [setCardDetails]);

    const handleLayoutChange = useCallback((layoutId: string) => {
        const selectedLayout = cardLayouts.layouts.find(l => l.id === layoutId);
        if (selectedLayout) {
            setCardDetails(prev => ({
                ...prev,
                // @ts-ignore
                elements: selectedLayout.elements,
                layoutId: selectedLayout.id
            }));
        }
    }, [setCardDetails]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: 'profilePicUrl' | 'logoUrl') => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUri = e.target?.result as string;
                setCardDetails(prev => ({ ...prev, [fieldName]: dataUri }));
            };
            reader.readAsDataURL(file);
        }
        if(event.target) {
            event.target.value = '';
        }
    };
    
    const generateQrCode = useCallback(async (url: string) => {
        if (!url) {
            setCardDetails(prev => ({ ...prev, qrUrl: '' }));
            return;
        }

        setIsGeneratingQr(true);
        try {
            const result = await generateQrCodeDesignAction({ url, prompt: 'default-qr' });
            setCardDetails(prev => ({
                ...prev,
                qrUrl: result.qrCodeDataUri,
            }));
        } catch (error) {
            console.error('Failed to generate QR code:', error);
            toast({
                variant: 'destructive',
                title: 'QR Code Generation Failed',
                description: 'Could not generate the QR code. Please try again.',
            });
        } finally {
            setIsGeneratingQr(false);
        }
    }, [setCardDetails, toast]);
    
    // Effect to generate QR code when component loads with a website url
    useEffect(() => {
        if (cardDetails.website && !cardDetails.qrUrl) {
            generateQrCode(cardDetails.website);
        }
    }, [cardDetails.website, cardDetails.qrUrl]);

    return (
        <div className="p-6 space-y-8">
            <Accordion type="multiple" defaultValue={['card-content', 'card-style']} className="w-full">
                <AccordionItem value="card-content">
                    <AccordionTrigger className='text-base font-semibold'>Card Content</AccordionTrigger>
                    <AccordionContent>
                        <Card className="border-0 shadow-none">
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" defaultValue={cardDetails.name} onChange={handleInputChange} placeholder="e.g. Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title / Position</Label>
                                    <Input id="title" name="title" defaultValue={cardDetails.title} onChange={handleInputChange} placeholder="e.g. Software Engineer" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company / Organization</Label>
                                    <Input id="company" name="company" defaultValue={cardDetails.company} onChange={handleInputChange} placeholder="e.g. Acme Inc." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website URL (for QR Code)</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input id="website" name="website" defaultValue={cardDetails.website || ''} onChange={handleInputChange} onBlur={handleInputBlur} placeholder="https://your-website.com" className="pl-10" disabled={isGeneratingQr} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Profile Picture</Label>
                                    <Input id="profilePicUrl" type="file" className="hidden" ref={profilePicInputRef} onChange={(e) => handleFileChange(e, 'profilePicUrl')} accept="image/*" />
                                    <Button variant="outline" className="w-full" onClick={() => profilePicInputRef.current?.click()}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Profile Picture
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <Label>Company Logo</Label>
                                    <Input id="logoUrl" type="file" className="hidden" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'logoUrl')} accept="image/*" />
                                    <Button variant="outline" className="w-full" onClick={() => logoInputRef.current?.click()}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Logo
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slogan">Footer Slogan (Back of Card)</Label>
                                    <Input id="slogan" name="slogan" defaultValue={cardDetails.slogan || ''} onChange={handleInputChange} placeholder="e.g. Innovative Solutions" />
                                </div>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="card-style">
                    <AccordionTrigger className='text-base font-semibold'>Card Style</AccordionTrigger>
                    <AccordionContent>
                        <Card className="border-0 shadow-none">
                            <CardContent className="space-y-6 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={cardDetails.category} onValueChange={(value) => handleSelectChange('category', value)}>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Business">Business</SelectItem>
                                            <SelectItem value="Creative">Creative</SelectItem>
                                            <SelectItem value="Personal">Personal</SelectItem>
                                            <SelectItem value="Medical">Medical</SelectItem>
                                            <SelectItem value="Event">Event</SelectItem>
                                            <SelectItem value="Membership">Membership</SelectItem>
                                            <SelectItem value="Student">Student</SelectItem>
                                            <SelectItem value="3D">3D</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="layout">Layout</Label>
                                    <Select onValueChange={handleLayoutChange} value={cardDetails.layoutId}>
                                        <SelectTrigger id="layout">
                                            <SelectValue placeholder="Select a layout" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cardLayouts.layouts.map(layout => (
                                                <SelectItem key={layout.id} value={layout.id}>{layout.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bgColor">Background</Label>
                                        <Input id="bgColor" name="bgColor" type="color" value={cardDetails.bgColor} onChange={handleInputChange} className="p-1 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="textColor">Text</Label>
                                        <Input id="textColor" name="textColor" type="color" value={cardDetails.textColor} onChange={handleInputChange} className="p-1 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="accentColor">Accent</Label>
                                        <Input id="accentColor" name="accentColor" type="color" value={cardDetails.accentColor} onChange={handleInputChange} className="p-1 h-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Background Pattern</Label>
                                    <PatternSelector cardDetails={cardDetails} setCardDetails={setCardDetails} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="font">Font</Label>
                                    <Select value={cardDetails.font} onValueChange={(value) => handleSelectChange('font', value)}>
                                        <SelectTrigger id="font">
                                            <SelectValue placeholder="Select a font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="var(--font-inter)">Inter</SelectItem>
                                            <SelectItem value="var(--font-source-code-pro)">Source Code Pro</SelectItem>
                                            <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                                            <SelectItem value="Georgia, serif">Georgia</SelectItem>
                                            <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="qr-code">
                    <AccordionTrigger className='text-base font-semibold'>QR Code</AccordionTrigger>
                    <AccordionContent>
                        <Card className="border-0 shadow-none">
                            <CardContent className="pt-6">
                                <p className="text-sm text-muted-foreground">
                                    A QR code will be automatically generated when you add a website URL.
                                </p>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
});

EditorPanel.displayName = 'EditorPanel';
export default EditorPanel;
