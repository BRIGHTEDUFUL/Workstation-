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
import type { CardDetails } from './design-page';

interface LayoutEditorProps {
    cardDetails: CardDetails;
    setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const LayoutEditor = ({ cardDetails, setCardDetails }: LayoutEditorProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <Card>
            <CardHeader>
                <CardTitle>Content & Style</CardTitle>
                <CardDescription>Edit your card's details and appearance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={cardDetails.name} onChange={handleInputChange} placeholder="e.g. Jane Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title">Title / Position</Label>
                    <Input id="title" name="title" value={cardDetails.title} onChange={handleInputChange} placeholder="e.g. Software Engineer" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="qrUrl">QR Code URL</Label>
                    <Input id="qrUrl" name="qrUrl" value={cardDetails.qrUrl} onChange={handleInputChange} placeholder="https://..." />
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
    );
};

export default LayoutEditor;
