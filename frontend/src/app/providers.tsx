'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CompareProvider } from '@/context/CompareContext';
import { Toaster } from '@/components/ui/Toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CompareProvider>
        {children}
        <Toaster />
      </CompareProvider>
    </AuthProvider>
  );
}
