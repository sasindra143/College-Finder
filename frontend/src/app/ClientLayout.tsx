'use client';

import React from 'react';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Navbar />
      <main className="flex-1 w-full bg-gray-50 pt-[90px] md:pt-[200px]">{children}</main>
      <Footer />
    </Providers>
  );
}
