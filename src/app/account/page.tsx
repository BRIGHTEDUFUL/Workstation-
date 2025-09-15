'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';

export default function Account() {
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState('User Name');
  const [email, setEmail] = useState('user@cardhub.com');
  const [profilePic, setProfilePic] = useState('https://picsum.photos/seed/user-avatar/100/100');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setName(userDetails.name || 'User Name');
      setEmail(userDetails.email || 'user@cardhub.com');
      setProfilePic(userDetails.profilePic || 'https://picsum.photos/seed/user-avatar/100/100');
    }
  }, []);

  const handleSave = () => {
    const userDetails = { name, email, profilePic };
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    toast({
      title: 'Account Details Saved',
      description: 'Your profile information has been updated.',
    });
    // Optional: force a reload to ensure sidebar updates, though it should be reactive.
    window.dispatchEvent(new Event('storage')); // Notify other components of storage change
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setProfilePic(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };
  
  if (!isMounted) {
    return (
        <div className="flex flex-col h-screen">
            <header className="p-6 border-b shrink-0 border-border">
                <h1 className="text-2xl font-bold tracking-tight">Account</h1>
                <p className="text-muted-foreground">Manage your account details.</p>
            </header>
            <main className="flex-1 p-6 overflow-auto">
                <p>Loading account details...</p>
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="p-6 border-b shrink-0 border-border">
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your account details.
        </p>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information and profile picture.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={profilePic} alt={name} />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                             <Label>Profile Picture</Label>
                             <Input id="profilePic" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                             <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload New Picture
                            </Button>
                            <p className="text-xs text-muted-foreground">Recommended size: 200x200px</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" />
                    </div>
                    <Button onClick={handleSave}>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
