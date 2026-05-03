'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-black text-gray-900 mb-4">Something went wrong!</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg"
      >
        Try again
      </button>
    </div>
  );
}
