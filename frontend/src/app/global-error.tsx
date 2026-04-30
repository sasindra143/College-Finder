'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="mb-4 text-3xl font-black text-gray-900">Critical Application Error</h2>
          <p className="mb-8 font-medium text-gray-600 max-w-md mx-auto">
            {error.message || 'An unexpected error occurred at the application level. Please try restarting.'}
          </p>
          <button
            onClick={() => reset()}
            className="rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-700 shadow-lg hover:shadow-xl"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
