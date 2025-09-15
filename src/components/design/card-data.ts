

export type CardElement = {
    id: string;
    component: 'name' | 'title' | 'company' | 'logo' | 'profilePic' | 'slogan';
    x: number; // percentage
    y: number; // percentage
    text?: string;
    fontSize?: number; // vw
    fontWeight?: number;
    color?: string;
    width?: number; // percentage
    height?: number; // percentage
    imageUrl?: string;
};


export type CardDetails = {
    id:string;
    name: string;
    title:string;
    company: string;
    qrUrl: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
    font: string;
    elements: CardElement[];
    designDescription: string;
    logoUrl?: string;
    slogan?: string;
    category: string;
    backgroundImage?: string;
    
    // Landing page fields
    profilePicUrl?: string;
    website?: string;

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
    qrUrl: '',
    bgColor: '#ffffff',
    textColor: '#111827',
    accentColor: '#3b82f6',
    font: 'var(--font-inter)',
    category: 'Business',
    designDescription: 'A clean and modern business card design with a white background, dark text, and blue accents. It features a prominent name and title on the front, and a QR code on the back.',
    profilePicUrl: "https://picsum.photos/seed/user-avatar/100/100",
    elements: [
        { id: 'name', component: 'name', x: 50, y: 40, fontSize: 2.5, fontWeight: 700 },
        { id: 'title', component: 'title', x: 50, y: 55, fontSize: 1.5, fontWeight: 400 },
        { id: 'company', component: 'company', x: 50, y: 70, fontSize: 1.2, fontWeight: 400 },
    ]
};
