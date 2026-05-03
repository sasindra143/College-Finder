import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './ClientLayout';
import { metadata } from './metadata';

export { metadata };

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
