import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import MainLayout from '@/components/layout/main-layout';
import { Inter, Source_Code_Pro } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-source-code-pro', display: 'swap' })

export const metadata: Metadata = {
  title: 'CardHub',
  description: 'Design and share your cards with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-body antialiased dark",
        inter.variable,
        sourceCodePro.variable
        )}>
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster />
      </body>
    </html>
  );
}
