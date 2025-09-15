'use client';

import React, { useState, useRef } from 'react';
import { generateCardDesignFromTextPrompt, ImportCardDesignFromImageInput, importCardDesignFromImage } from '@/ai/flows';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from './design-page';

interface AiToolsProps {
  cardDetails: CardDetails;
  setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const AiTools = ({ cardDetails, setCardDetails }: AiToolsProps) => {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filename, setFilename] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            // This is a mocked response as Genkit flow for image generation is not implemented
            // In a real scenario, the result would be a data URI of an image/animation
            await new Promise(resolve => setTimeout(resolve, 1500));
            const aiDescription = `An AI-generated 3D animated card based on the prompt: "${prompt}". It features dynamic elements and a futuristic aesthetic.`;
            setCardDetails(prev => ({
                ...prev,
                designDescription: aiDescription,
                bgColor: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
                textColor: '#111827',
                accentColor: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
            }));

            toast({
              title: "Design Generated!",
              description: "The AI has created a new design concept.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Could not generate design from prompt.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFilename(file.name);
            const reader = new FileReader();
            reader.onload = async (e) => {
                const dataUri = e.target?.result as string;
                if(dataUri) {
                    await handleImport(dataUri);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImport = async (fileDataUri: string) => {
        setIsLoading(true);
        try {
            const result = await importCardDesignFromImage({ fileDataUri });
            setCardDetails(prev => ({...prev, designDescription: result.designDescription }));
            toast({
              title: "Import Successful!",
              description: "The card design has been analyzed.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Import Failed',
                description: 'Could not import design from file.',
            });
        } finally {
            setIsLoading(false);
            setFilename('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Tools</CardTitle>
                <CardDescription>Use AI to generate or import designs.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="generate">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="generate">Generate</TabsTrigger>
                        <TabsTrigger value="import">Import</TabsTrigger>
                    </TabsList>
                    <TabsContent value="generate" className="mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="prompt">Text Prompt</Label>
                                <Textarea
                                    id="prompt"
                                    placeholder="e.g., A minimalist card with a galaxy background and glowing text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full">
                                <Sparkles className="w-4 h-4 mr-2" />
                                {isLoading ? 'Generating...' : 'Generate with AI'}
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="import" className="mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="import-file">Upload Image or PDF</Label>
                                <Input id="import-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" />
                                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isLoading ? 'Importing...' : (filename || 'Choose a file')}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                        <CardTitle className="text-base">AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {cardDetails.designDescription}
                        </p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default AiTools;
