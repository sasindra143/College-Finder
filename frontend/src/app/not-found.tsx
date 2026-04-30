'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-6xl font-black text-gray-900 mb-4">404</h2>
      <h3 className="text-2xl font-bold text-gray-700 mb-6">Page Not Found</h3>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link 
        href="/"
        className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg"
      >
        Return Home
      </Link>
    </div>
  );
}
