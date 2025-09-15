export type CardDetails = {
    id: string;
    name: string;
    title:string;
    company: string;
    qrUrl: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    font: string;
    designDescription: string;
    logoUrl?: string;
    slogan?: string;
    category?: string;
    backgroundImage?: string;
    
    // Landing page fields
    landingPageUrl?: string;
    profilePicUrl?: string;
    landingPageBio?: string;
    email?: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;

    // Category specific fields
    policyNumber?: string;
    planType?: string;
    eventName?: string;
    eventDate?: string;
    accessLevel?: string;
    memberId?: string;
    studentId?: string;
};

export const DEFAULT_CARD_DETAILS: CardDetails = {
    id: '1',
    name: 'Your Name',
    title: 'Your Title',
    company: 'Your Company',
    qrUrl: 'https://firebase.google.com',
    bgColor: '#ffffff',
    textColor: '#111827',
    accentColor: '#3b82f6',
    font: 'Inter',
    category: 'Business',
    designDescription: 'A clean and modern business card design with a white background, dark text, and blue accents. It features a prominent name and title on the front, and a QR code on the back.',
    profilePicUrl: "https://picsum.photos/seed/user-avatar/100/100",
    landingPageUrl: typeof window !== 'undefined' ? `${window.location.origin}/card/1` : '/card/1',
};
