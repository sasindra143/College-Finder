import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './ClientLayout';

import { Toaster } from '@/components/ui/Toaster';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CollegeFinder India – Discover Your Dream College',
  description: 'Compare colleges across India.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen flex flex-col antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
