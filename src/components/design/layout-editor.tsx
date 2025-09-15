'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import type { CardDetails } from './design-page';

interface LayoutEditorProps {
    cardDetails: CardDetails;
    setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const LayoutEditor = ({ cardDetails, setCardDetails }: LayoutEditorProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (name: string, value: string) => {
        setCardDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleFontChange = (value: string) => {
        setCardDetails(prev => ({ ...prev, font: value }));
    };

    return (
        <Accordion type="multiple" defaultValue={['card-content', 'landing-page']} className="w-full">
            <AccordionItem value="card-content">
                <AccordionTrigger className='text-base font-semibold'>Card Content</AccordionTrigger>
                <AccordionContent>
                    <Card className="border-0 shadow-none">
                        <CardContent className="space-y-6 pt-6">
                             <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={cardDetails.name} onChange={handleInputChange} placeholder="e.g. Jane Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Title / Position</Label>
                                <Input id="title" name="title" value={cardDetails.title} onChange={handleInputChange} placeholder="e.g. Software Engineer" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company / Organization</Label>
                                <Input id="company" name="company" value={cardDetails.company} onChange={handleInputChange} placeholder="e.g. Acme Inc." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profilePicUrl">Profile Picture URL</Label>
                                <Input id="profilePicUrl" name="profilePicUrl" value={cardDetails.profilePicUrl} onChange={handleInputChange} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slogan">Footer Slogan (Back of Card)</Label>
                                <Input id="slogan" name="slogan" value={cardDetails.slogan || ''} onChange={handleInputChange} placeholder="e.g. Creating the future." />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bgColor">Background</Label>
                                    <Input id="bgColor" type="color" value={cardDetails.bgColor} onChange={(e) => handleColorChange('bgColor', e.target.value)} className="p-1 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="textColor">Text</Label>
                                    <Input id="textColor" type="color" value={cardDetails.textColor} onChange={(e) => handleColorChange('textColor', e.target.value)} className="p-1 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accentColor">Accent</Label>
                                    <Input id="accentColor" type="color" value={cardDetails.accentColor} onChange={(e) => handleColorChange('accentColor', e.target.value)} className="p-1 h-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="font">Font</Label>
                                <Select value={cardDetails.font} onValueChange={handleFontChange}>
                                    <SelectTrigger id="font">
                                        <SelectValue placeholder="Select a font" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="'Inter', sans-serif">Inter</SelectItem>
                                        <SelectItem value="'Source Code Pro', monospace">Source Code Pro</SelectItem>
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
            <AccordionItem value="landing-page">
                <AccordionTrigger className='text-base font-semibold'>Landing Page Content</AccordionTrigger>
                <AccordionContent>
                    <Card className="border-0 shadow-none">
                         <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="landingPageBio">About Me / Bio</Label>
                                <Textarea id="landingPageBio" name="landingPageBio" value={cardDetails.landingPageBio || ''} onChange={handleInputChange} placeholder="Tell us a bit about yourself..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={cardDetails.email || ''} onChange={handleInputChange} placeholder="your@email.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" value={cardDetails.phone || ''} onChange={handleInputChange} placeholder="+1 234 567 890" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" name="website" type="url" value={cardDetails.website || ''} onChange={handleInputChange} placeholder="https://your-website.com" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                                <Input id="linkedin" name="linkedin" value={cardDetails.linkedin || ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="twitter">X/Twitter Profile URL</Label>
                                <Input id="twitter" name="twitter" value={cardDetails.twitter || ''} onChange={handleInputChange} placeholder="https://x.com/..." />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram Profile URL</Label>
                                <Input id="instagram" name="instagram" value={cardDetails.instagram || ''} onChange={handleInputChange} placeholder="https://instagram.com/..." />
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default LayoutEditor;
