'use client';
import { CardDetails } from "@/components/design/design-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Link as LinkIcon, Linkedin, Twitter, Instagram, Facebook, UserPlus, FileDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// This is a mock. In a real app, you'd fetch this from a database.
const MOCK_CARD_DATA: CardDetails = {
    id: '1',
    name: 'Your Name',
    title: 'Your Title',
    company: 'Your Company',
    qrUrl: '',
    bgColor: '#ffffff',
    textColor: '#111827',
    accentColor: '#3b82f6',
    font: 'Inter',
    designDescription: '',
    profilePicUrl: "https://picsum.photos/seed/user-avatar/150/150",
    landingPageBio: "Welcome to my digital hub! I'm a passionate creator and innovator, always looking for the next challenge. Let's connect and build something amazing together.",
    email: "user@example.com",
    phone: "+11234567890",
    website: "https://example.com",
    linkedin: "https://linkedin.com/in/example",
    twitter: "https://x.com/example",
    instagram: "https://instagram.com/example"
};


export default function CardLandingPage({ params }: { params: { id: string } }) {
    const [card, setCard] = useState<CardDetails | null>(null);

    useEffect(() => {
        // In a real app, you would fetch the card details based on params.id
        // For now, we use mock data.
        if (params.id === MOCK_CARD_DATA.id) {
            setCard(MOCK_CARD_DATA);
        }
    }, [params.id]);

    const createVCard = () => {
        if (!card) return;

        const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
ORG:${card.company}
TITLE:${card.title}
TEL;TYPE=WORK,VOICE:${card.phone}
EMAIL:${card.email}
URL:${card.website}
END:VCARD`;

        const blob = new Blob([vCard], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${card.name.replace(' ', '_')}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    if (!card) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p>Card not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: card.bgColor, color: card.textColor, fontFamily: card.font }}>
            <main className="max-w-2xl mx-auto">
                <Card className="overflow-hidden shadow-2xl" style={{ backgroundColor: card.bgColor, border: 'none' }}>
                    <div className="h-32" style={{ backgroundColor: card.accentColor }} />
                    <CardContent className="p-6 text-center -mt-20">
                        <Avatar className="w-32 h-32 mx-auto border-4 shadow-lg" style={{ borderColor: card.bgColor }}>
                            <AvatarImage src={card.profilePicUrl} alt={card.name} />
                            <AvatarFallback>{card.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <h1 className="mt-4 text-4xl font-bold">{card.name}</h1>
                        <p className="text-xl" style={{ color: card.accentColor }}>{card.title}</p>
                        <p className="text-md">{card.company}</p>

                        <p className="mt-6 text-base text-center max-w-prose mx-auto" style={{color: card.textColor}}>
                            {card.landingPageBio}
                        </p>

                        <div className="grid grid-cols-1 gap-4 mt-8 text-left sm:grid-cols-2">
                            {card.email && <ContactLink href={`mailto:${card.email}`} icon={Mail} text={card.email} />}
                            {card.phone && <ContactLink href={`tel:${card.phone}`} icon={Phone} text={card.phone} />}
                            {card.website && <ContactLink href={card.website} icon={LinkIcon} text="Website" />}
                        </div>
                        
                        <div className="flex justify-center gap-4 mt-8">
                            {card.linkedin && <SocialIcon href={card.linkedin} icon={Linkedin} label="LinkedIn" />}
                            {card.twitter && <SocialIcon href={card.twitter} icon={Twitter} label="X/Twitter" />}
                            {card.instagram && <SocialIcon href={card.instagram} icon={Instagram} label="Instagram" />}
                            {card.facebook && <SocialIcon href={card.facebook} icon={Facebook} label="Facebook" />}
                        </div>

                    </CardContent>
                </Card>
                 <div className="flex justify-center mt-8">
                    <Button
                        onClick={createVCard}
                        style={{
                            backgroundColor: card.accentColor,
                            color: card.bgColor,
                        }}
                        className="transition-transform duration-200 hover:scale-105"
                    >
                        <FileDown className="w-5 h-5 mr-2" />
                        Save to Contacts
                    </Button>
                </div>
            </main>
            <footer className="py-6 mt-8 text-center">
                <p className="text-xs" style={{color: card.textColor}}>Powered by CardHub</p>
            </footer>
        </div>
    );
}

const ContactLink = ({ href, icon: Icon, text }: { href: string, icon: React.ElementType, text: string }) => (
    <Button asChild variant="ghost" className="justify-start h-auto p-3 text-left">
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <Icon className="w-6 h-6 shrink-0" />
            <span className="flex-1 break-all">{text}</span>
        </a>
    </Button>
);

const SocialIcon = ({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) => (
    <Button asChild variant="ghost" size="icon" className="w-12 h-12 rounded-full transition-transform duration-200 hover:scale-110">
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
            <Icon className="w-6 h-6" />
        </a>
    </Button>
);

