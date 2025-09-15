'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileCode, Palette } from 'lucide-react';
import { useTheme } from '@/components/theme/theme-provider';

const themes = [
    { name: 'Default Dark', value: 'theme-default-dark' },
    { name: 'Midnight Slate', value: 'theme-midnight-slate' },
    { name: 'Crimson Glow', value: 'theme-crimson-glow' },
    { name: 'Forest Mist', value: 'theme-forest-mist' },
    { name: 'Sunset Flare', value: 'theme-sunset-flare' },
    { name: 'Light', value: 'light' },
];

export default function Settings() {
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
        const storedKey = localStorage.getItem('googleApiKey');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('googleApiKey', apiKey);
        toast({
            title: 'Settings Saved',
            description: 'Your API key has been stored in your browser.',
        });
        // Force a reload to make sure all components check for the key again
        window.location.reload();
    };

    if (!isMounted) {
        return null; // or a loading spinner
    }

  return (
    <div className="flex flex-col h-screen">
      <header className="p-6 border-b shrink-0 border-border">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and configurations.
        </p>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-8">
            <Card>
                 <CardHeader>
                    <CardTitle className='flex items-center gap-2'><Palette className='w-5 h-5' /> Theme</CardTitle>
                    <CardDescription>
                        Select a color theme for the application. Your preference will be saved in your browser.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                        <SelectContent>
                            {themes.map((t) => (
                                <SelectItem key={t.value} value={t.value}>{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>AI Model Configuration</CardTitle>
                    <CardDescription>
                        Enter your Google AI API key here to enable the AI tools in the design studio.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert variant='default'>
                        <FileCode className='w-4 h-4' />
                        <AlertTitle>Server-Side API Key</AlertTitle>
                        <AlertDescription>
                            For AI features to work, your Google AI API key must be set as an environment variable named <code>GOOGLE_API_KEY</code> on the server. Storing the key here only enables the AI feature UI in the browser.
                        </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                        <Label htmlFor="ai-provider">AI Provider</Label>
                        <Select defaultValue='google'>
                            <SelectTrigger id="ai-provider">
                                <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="google">Google AI</SelectItem>
                                <SelectItem value="openai" disabled>OpenAI (Coming Soon)</SelectItem>
                                <SelectItem value="anthropic" disabled>Anthropic (Coming Soon)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="api-key">Google AI API Key (for Browser)</Label>
                        <Input
                            id="api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Google AI API key"
                        />
                    </div>
                    <Button onClick={handleSave} disabled={!apiKey}>Save Key to Browser</Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};
