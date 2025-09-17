'use client';
import { LayoutDashboard, Brush, Library, CreditCard, Settings, ClipboardList } from 'lucide-react';

export const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/my-cards', label: 'My Cards', icon: CreditCard },
    { href: '/submitted-designs', label: 'Submitted Designs', icon: ClipboardList },
    { href: '/design', label: 'Design Studio', icon: Brush },
    { href: '/templates', label: 'Templates', icon: Library },
];

export const bottomNavItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
]
