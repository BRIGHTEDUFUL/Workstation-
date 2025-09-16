'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import MainSidebar from '@/components/layout/main-sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/design') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar>
              <MainSidebar />
          </Sidebar>
          <SidebarInset className="min-h-0">
              {children}
          </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
