'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CardHubLogo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { navItems, bottomNavItems } from '@/lib/nav-items';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from 'react';

const MainSidebar = () => {
  const pathname = usePathname();
  const [userDetails, setUserDetails] = useState({
    name: 'User Name',
    email: 'user@cardhub.com',
    profilePic: 'https://picsum.photos/seed/user-avatar/40/40'
  });

  useEffect(() => {
    const updateDetails = () => {
        const storedDetails = localStorage.getItem('userDetails');
        if (storedDetails) {
            const parsedDetails = JSON.parse(storedDetails);
            setUserDetails({
                name: parsedDetails.name || 'User Name',
                email: parsedDetails.email || 'user@cardhub.com',
                profilePic: parsedDetails.profilePic || 'https://picsum.photos/seed/user-avatar/40/40'
            });
        }
    };
    
    updateDetails();

    // Listen for changes from other tabs/windows
    window.addEventListener('storage', updateDetails);

    return () => {
        window.removeEventListener('storage', updateDetails);
    }
  }, []);

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
          {navItems.map((item) => (
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
           {bottomNavItems.map((item) => (
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <div className="flex items-center gap-3 cursor-pointer">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={userDetails.profilePic} data-ai-hint="user avatar"/>
                    <AvatarFallback>{userDetails.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-col hidden group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sm">{userDetails.name}</span>
                    <span className="text-xs text-muted-foreground">{userDetails.email}</span>
                </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2 ml-2" side="top" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">Account</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2"/>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
};

export default MainSidebar;
