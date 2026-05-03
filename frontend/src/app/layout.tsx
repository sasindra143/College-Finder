import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './ClientLayout';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CollegeFinder India – Discover Your Dream College',
  description: 'Compare colleges across India.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
