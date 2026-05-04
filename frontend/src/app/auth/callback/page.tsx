'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from '../../../components/ui/Toaster';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams?.get('token');
    const userStr = searchParams?.get('user');

    if (token && userStr) {
      try {
        localStorage.setItem('token', token);
        // We could also store the user info if we had a dedicated state, 
        // but AuthContext will fetch it via /me anyway.
        toast.success('Logged in with Google!');
        
        // Use window.location to force a full reload and update AuthContext
        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Callback error:', err);
        toast.error('Failed to process Google login');
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-900">Finalizing Google Login...</h2>
        <p className="text-gray-500 mt-2">Please wait while we secure your session.</p>
      </div>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
