'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="mb-4 text-3xl font-black text-gray-900">Something went wrong</h2>
      <p className="mb-8 font-medium text-gray-600 max-w-md mx-auto">
        {error.message || 'An unexpected error occurred while loading this page.'}
      </p>
      <button
        onClick={() => reset()}
        className="rounded-xl bg-brand-600 px-8 py-3 font-bold text-white transition-all hover:bg-brand-700 shadow-lg hover:shadow-xl"
      >
        Try again
      </button>
    </div>
  );
}
