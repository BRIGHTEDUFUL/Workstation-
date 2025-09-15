'use client';

import React, { useRef } from 'react';
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
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';

interface LayoutEditorProps {
    cardDetails: CardDetails;
    setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const CategorySpecificFields = ({ cardDetails, handleInputChange }: { cardDetails: CardDetails, handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    switch (cardDetails.category) {
        case 'Medical':
            return (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="policyNumber">Policy Number</Label>
                        <Input id="policyNumber" name="policyNumber" value={cardDetails.policyNumber || ''} onChange={handleInputChange} placeholder="e.g. ABC123456789" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="planType">Plan Type</Label>
                        <Input id="planType" name="planType" value={cardDetails.planType || ''} onChange={handleInputChange} placeholder="e.g. PPO Gold" />
                    </div>
                </>
            );
        case 'Event':
            return (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="eventName">Event Name</Label>
                        <Input id="eventName" name="eventName" value={cardDetails.eventName || ''} onChange={handleInputChange} placeholder="e.g. Tech Conference 2024" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="eventDate">Event Date</Label>
                        <Input id="eventDate" name="eventDate" value={cardDetails.eventDate || ''} onChange={handleInputChange} placeholder="e.g. October 26-28, 2024" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="accessLevel">Access Level</Label>
                        <Input id="accessLevel" name="accessLevel" value={cardDetails.accessLevel || ''} onChange={handleInputChange} placeholder="e.g. VIP Access" />
                    </div>
                </>
            );
        case 'Membership':
             return (
                <div className="space-y-2">
                    <Label htmlFor="memberId">Member ID</Label>
                    <Input id="memberId" name="memberId" value={cardDetails.memberId || ''} onChange={handleInputChange} placeholder="e.g. M-987654" />
                </div>
            );
        case 'Student':
            return (
                <div className="space-y-2">
                    <Label htmlFor="studentId">Student/ID Number</Label>
                    <Input id="studentId" name="studentId" value={cardDetails.studentId || ''} onChange={handleInputChange} placeholder="e.g. 2024-00123" />
                </div>
            );
        default:
            return null;
    }
}


const LayoutEditor = ({ cardDetails, setCardDetails }: LayoutEditorProps) => {
    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <Accordion type="multiple" defaultValue={['card-content']} className="w-full">
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
                            <CategorySpecificFields cardDetails={cardDetails} handleInputChange={handleInputChange} />
                            
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
                                    <Input id="accentColor" type="color" value={cardDetails.accentColor} onChange={(e) => handleColorchange('accentColor', e.target.value)} className="p-1 h-10" />
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
        </Accordion>
    );
};

export default LayoutEditor;
