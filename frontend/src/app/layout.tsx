import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ClientLayout } from './ClientLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CollegeFinder India – Discover Your Dream College',
  description: 'Compare colleges across India. Search by fees, location, ratings, and placements. Find the best engineering, management, and arts colleges.',
  keywords: 'college search India, top colleges, engineering colleges, MBA colleges, college comparison, fees, placements',
  openGraph: {
    title: 'CollegeFinderIndia – Find & Compare Top Colleges',
    description: 'Discover, compare and save top colleges in India. Real data, real reviews.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
