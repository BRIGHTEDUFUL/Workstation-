
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  generateCardDesignAction,
} from '@/ai/flows/generate-card-design-from-prompt';
import {
  importCardDesignAction,
} from '@/ai/flows/import-card-design-from-image';
import {
    generateDesignSuggestionsAction
} from '@/ai/flows/generate-design-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CardDetails } from './card-data';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

interface AiToolsProps {
  cardDetails: CardDetails;
  setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>;
}

const AiTools = ({ cardDetails, setCardDetails }: AiToolsProps) => {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('generate');
    const [filename, setFilename] = useState('');
    const [isApiKeySet, setIsApiKeySet] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const storedApiKey = localStorage.getItem('googleApiKey');
        setIsApiKeySet(!!storedApiKey);
      }
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!isApiKeySet || !cardDetails.category) return;
            setSuggestionsLoading(true);
            try {
                const result = await generateDesignSuggestionsAction({ category: cardDetails.category });
                setSuggestions(result.suggestions);
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
                setSuggestions([]);
            } finally {
                setSuggestionsLoading(false);
            }
        };

        fetchSuggestions();
    }, [cardDetails.category, isApiKeySet]);

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
                name: cardDetails.name,
                title: cardDetails.title,
                company: cardDetails.company
            });

            setCardDetails(prev => ({
                ...prev,
                designDescription: `AI-generated design: ${result.designPlan.styleDescription}`,
                bgColor: result.designPlan.bgColor,
                textColor: result.designPlan.textColor,
                accentColor: result.designPlan.accentColor,
                font: result.designPlan.font,
                backgroundImage: result.backgroundImageDataUri,
                category: result.designPlan.category,
            }));

            toast({
              title: "Design Generated!",
              description: "The AI has created a new design for your card.",
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
                designDescription: result.analysis,
                bgColor: result.designPlan.bgColor,
                textColor: result.designPlan.textColor,
                accentColor: result.designPlan.accentColor,
                font: result.designPlan.font,
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
                            For AI features to work, your Google AI API key must be set as an environment variable named <code>GOOGLE_API_KEY</code> on the server. You can still set a temporary key for the browser in <Link href="/settings" className="font-semibold underline">Settings</Link> to enable these tools.
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
                                    placeholder="e.g., A minimalist card with a galaxy background"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    disabled={!isApiKeySet}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Suggestions for '{cardDetails.category}'</Label>
                                <div className="flex flex-wrap gap-2">
                                    {suggestionsLoading ? (
                                        <>
                                            <Skeleton className="h-6 w-48" />
                                            <Skeleton className="h-6 w-40" />
                                            <Skeleton className="h-6 w-52" />
                                        </>
                                    ) : (
                                        suggestions.map((p) => (
                                            <Badge
                                                key={p}
                                                variant="outline"
                                                className="cursor-pointer"
                                                onClick={() => setPrompt(p)}
                                            >
                                                {p}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </div>
                            <Button onClick={handleGenerate} disabled={isLoadingGenerate || !prompt || !isApiKeySet} className="w-full">
                                <Sparkles className="w-4 h-4 mr-2" />
                                {isLoadingGenerate ? 'Generating...' : 'Generate with AI'}
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="import" className="mt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="import-file">Upload Image or PDF</Label>
                                <Input id="import-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" disabled={!isApiKeySet} />
                                <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isLoadingImport || !isApiKeySet}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    {isLoadingImport ? 'Importing...' : (filename || 'Choose a file')}
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
