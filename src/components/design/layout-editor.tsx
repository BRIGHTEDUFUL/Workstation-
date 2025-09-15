

'use client';

import React, { useRef, useCallback } from 'react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import type { CardDetails } from './card-data';
import { Button } from '../ui/button';
import { Upload, Globe } from 'lucide-react';
import cardLayouts from '@/lib/card-layouts.json';


interface LayoutEditorProps {
    cardDetails: CardDetails;
    setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const LayoutEditor = ({ cardDetails, setCardDetails }: LayoutEditorProps) => {
    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
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
        // Reset file input
        if(event.target) {
            event.target.value = '';
        }
    };
    
    const toggleComponent = (component: 'profilePic' | 'logo') => {
        setCardDetails(prev => {
            const hasComponent = prev.elements.some(e => e.component === component);
            const newElements = hasComponent
                ? prev.elements.filter(e => e.component !== component)
                : [...prev.elements, { id: component, component }];
            return { ...prev, elements: newElements };
        });
    };

    return (
        <Accordion type="multiple" defaultValue={['card-content', 'card-style']} className="w-full">
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
                                <Label htmlFor="website">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input id="website" name="website" value={cardDetails.website || ''} onChange={handleInputChange} placeholder="your.website.com" className="pl-10" />
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
                                <Input id="slogan" name="slogan" value={cardDetails.slogan || ''} onChange={handleInputChange} placeholder="e.g. Creating the future." />
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
        </Accordion>
    );
};

export default LayoutEditor;
