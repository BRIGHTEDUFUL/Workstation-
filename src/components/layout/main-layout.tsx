import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import MainSidebar from '@/components/layout/main-sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
