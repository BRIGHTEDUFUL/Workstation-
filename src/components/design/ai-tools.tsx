'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  generateCardDesignAction,
  importCardDesignAction,
} from '@/ai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Sparkles, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from '@/ai/schema';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';

interface AiToolsProps {
  cardDetails: CardDetails;
  setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const AiTools = ({ cardDetails, setCardDetails }: AiToolsProps) => {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('generate');
    const [filename, setFilename] = useState('');
    const [isApiKeySet, setIsApiKeySet] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const storedApiKey = localStorage.getItem('googleApiKey');
        setIsApiKeySet(!!storedApiKey);
      }
    }, []);

    const handleGenerate = async () => {
        if (!isApiKeySet) {
            toast({
                variant: 'destructive',
                title: 'API Key Missing',
                description: 'Please set your Google AI API key in the settings.',
            });
            return;
        }
        setIsLoading(true);
        setActiveTab('generate');
        try {
            const result = await generateCardDesignAction({
                prompt,
                websiteUrl: websiteUrl || undefined,
                name: cardDetails.name,
                title: cardDetails.title,
                company: cardDetails.company
            });

            setCardDetails(prev => ({
                ...prev,
                designDescription: `AI-Generated Design: ${result.designPlan.styleDescription}`,
                bgColor: result.designPlan.bgColor,
                textColor: result.designPlan.textColor,
                accentColor: result.designPlan.accentColor,
                font: result.designPlan.font,
                backgroundImage: result.backgroundImageDataUri,
                pattern: result.designPlan.pattern,
                category: result.designPlan.category,
            }));

            toast({
              title: "Design Plan Generated!",
              description: "The AI has created a new design plan for your card.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: 'Could not generate design. Check your server-side API key and prompt.',
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
        if (!isApiKeySet) {
            toast({
                variant: 'destructive',
                title: 'API Key Missing',
                description: 'Please set your Google AI API key in the settings.',
            });
            return;
        }
        setIsLoading(true);
        setActiveTab('import');
        try {
            const result = await importCardDesignAction({ fileDataUri });
            setCardDetails(prev => ({
                ...prev,
                designDescription: `Imported Design: ${result.designPlan.styleDescription}`,
                bgColor: result.designPlan.bgColor,
                textColor: result.designPlan.textColor,
                accentColor: result.designPlan.accentColor,
                font: result.designPlan.font,
                pattern: result.designPlan.pattern,
                backgroundImage: '', // Clear background image when importing design
            }));
            toast({
              title: "Import Successful!",
              description: "The card design has been analyzed and applied.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Import Failed',
                description: 'Could not import design from file. Check your server-side API key.',
            });
        } finally {
            setIsLoading(false);
            setFilename('');
        }
    };

    const isLoadingGenerate = isLoading && activeTab === 'generate';
    const isLoadingImport = isLoading && activeTab === 'import';

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>AI Tools</CardTitle>
                    <CardDescription>Use AI to generate or import designs.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!isApiKeySet && (
                        <Alert className="mb-4">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>API Key Not Set</AlertTitle>
                            <AlertDescription>
                                To enable AI features, please set your Google AI API key in <Link href="/settings" className="font-semibold underline">Settings</Link>.
                            </AlertDescription>
                        </Alert>
                    )}
                    <Tabs defaultValue="generate">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="generate" disabled={!isApiKeySet}>Generate</TabsTrigger>
                            <TabsTrigger value="import" disabled={!isApiKeySet}>Import</TabsTrigger>
                        </TabsList>
                        <TabsContent value="generate" className="mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prompt">Design Prompt</Label>
                                    <Textarea
                                        id="prompt"
                                        placeholder="e.g., A minimalist card for a tech company"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        disabled={!isApiKeySet}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="websiteUrl">Company Website (Optional)</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            id="websiteUrl"
                                            placeholder="https://example.com"
                                            value={websiteUrl}
                                            onChange={(e) => setWebsiteUrl(e.target.value)}
                                            disabled={!isApiKeySet}
                                            className='pl-10'
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">The AI can use this to inform the design plan.</p>
                                </div>
                                
                                <Button onClick={handleGenerate} disabled={isLoadingGenerate || !prompt || !isApiKeySet} className="w-full">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {isLoadingGenerate ? 'Generating...' : 'Generate Design Plan'}
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="import" className="mt-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="import-file">Upload Image or PDF</Label>
                                    <Input id="import-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" disabled={!isApiKeySet || isLoadingImport} />
                                    <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isLoadingImport || !isApiKeySet}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isLoadingImport ? 'Importing...' : (filename || 'Choose a file')}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>AI-Generated Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mt-2">
                        {cardDetails.designDescription}
                    </p>
                </CardContent>
             </Card>
        </div>
    );
};

export default AiTools;
