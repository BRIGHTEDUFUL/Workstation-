'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const SettingsPage = () => {
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState('');
    const [isMounted, setIsMounted] = useState(false);

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
            description: 'Your API key has been updated.',
        });
        // Force a reload to make sure all components get the new key
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
          Manage your AI model configurations.
        </p>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>AI Model Configuration</CardTitle>
                    <CardDescription>
                        Select your preferred AI provider and enter your API key to enable AI features.
                        Your key is stored securely in your browser's local storage and is never sent to our servers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        <Label htmlFor="api-key">Google AI API Key</Label>
                        <Input
                            id="api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Google AI API key"
                        />
                    </div>
                    <Button onClick={handleSave} disabled={!apiKey}>Save Settings</Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
