

export type CardElement = {
    id: string;
    component: 'name' | 'title' | 'company' | 'logo' | 'profilePic' | 'slogan';
    x?: number; // percentage
    y?: number; // percentage
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
    layoutId: string;
    designDescription: string;
    logoUrl?: string;
    slogan?: string;
    category: string;
    backgroundImage?: string;
    
    profilePicUrl?: string;
    website?: string;
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
    elements: [],
    layoutId: 'center-aligned'
};
