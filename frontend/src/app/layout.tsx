import { Inter } from 'next/font/google';
import './globals.css';
import { ClientLayout } from './ClientLayout';
import { metadata } from './metadata';

// Force dynamic rendering — prevents the static generation phase where
// client hooks fail with 'Cannot read properties of null (reading useContext)' on Netlify.
export const dynamic = 'force-dynamic';

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
