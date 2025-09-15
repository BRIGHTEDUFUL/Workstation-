'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Brush, Library, LogOut, Settings, CreditCard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CardHubLogo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const MainSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/my-cards', label: 'My Cards', icon: CreditCard },
    { href: '/design', label: 'Design Studio', icon: Brush },
    { href: '/templates', label: 'Templates', icon: Library },
  ];

  const bottomMenuItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <CardHubLogo className="w-8 h-8" />
            <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">CardHub</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="w-full justify-start"
                tooltip={{children: item.label, side: "right"}}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className='my-2' />
      <SidebarContent className="p-2">
        <SidebarMenu>
           {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="w-full justify-start"
                tooltip={{children: item.label, side: "right"}}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className='my-2' />
      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" data-ai-hint="user avatar"/>
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-col hidden group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-sm">User Name</span>
                <span className="text-xs text-muted-foreground">user@cardhub.com</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:w-full">
                <LogOut className="h-4 w-4"/>
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
};

export default MainSidebar;
