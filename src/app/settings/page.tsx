
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Palette, Terminal } from 'lucide-react';
import { useTheme } from '@/components/theme/theme-provider';

const themes = [
    { name: 'Default Dark', value: 'theme-default-dark' },
    { name: 'Midnight Slate', value: 'theme-midnight-slate' },
    { name: 'Moonlit Amethyst', value: 'theme-moonlit-amethyst' },
    { name: 'Crimson Glow', value: 'theme-crimson-glow' },
    { name: 'Forest Mist', value: 'theme-forest-mist' },
    { name: 'Sunset Flare', value: 'theme-sunset-flare' },
    { name: 'Rose Gold', value: 'theme-rose-gold' },
    { name: 'Light', value: 'light' },
];

type ApiKeys = {
    google: string;
    openai: string;
    deepseek: string;
};

export default function Settings() {
    const { toast } = useToast();
    const [apiKeys, setApiKeys] = useState<ApiKeys>({ google: '', openai: '', deepseek: '' });
    const [isMounted, setIsMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
        const storedKeys = localStorage.getItem('apiKeys');
        if (storedKeys) {
            setApiKeys(JSON.parse(storedKeys));
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
        toast({
            title: 'Settings Saved',
            description: 'Your API keys have been stored in your browser.',
        });
        // Force a reload to make sure all components check for the key again
        window.location.reload();
    };

    const handleKeyChange = (provider: keyof ApiKeys, value: string) => {
        setApiKeys(prev => ({ ...prev, [provider]: value }));
    };
    
    const isAnyKeyEntered = apiKeys.google || apiKeys.openai || apiKeys.deepseek;

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
                        Enter your API keys here. This enables the AI tools in the design studio.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <Alert variant='default'>
                        <Terminal className='w-4 h-4' />
                        <AlertTitle>Server-Side API Keys Required</AlertTitle>
                        <AlertDescription>
                            For AI features to function, you must set the corresponding environment variables on the server (e.g., <code>GOOGLE_API_KEY</code>). The settings below only enable the AI feature UI in your browser.
                        </AlertDescription>
                    </Alert>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="google-key">Google AI API Key</Label>
                            <Input
                                id="google-key"
                                type="password"
                                value={apiKeys.google}
                                onChange={(e) => handleKeyChange('google', e.target.value)}
                                placeholder="Enter your Google AI API key"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="openai-key">OpenAI API Key</Label>
                            <Input
                                id="openai-key"
                                type="password"
                                value={apiKeys.openai}
                                onChange={(e) => handleKeyChange('openai', e.target.value)}
                                placeholder="Enter your OpenAI (ChatGPT) API key"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="deepseek-key">DeepSeek API Key</Label>
                            <Input
                                id="deepseek-key"
                                type="password"
                                value={apiKeys.deepseek}
                                onChange={(e) => handleKeyChange('deepseek', e.target.value)}
                                placeholder="Enter your DeepSeek API key"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={!isAnyKeyEntered}>Save Keys to Browser</Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};
