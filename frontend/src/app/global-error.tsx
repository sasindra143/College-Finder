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
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.875rem', fontWeight: '900', color: '#111827' }}>Critical Application Error</h2>
          <p style={{ marginBottom: '2rem', fontWeight: '500', color: '#4b5563', maxWidth: '28rem', margin: '0 auto 2rem' }}>
            {error.message || 'An unexpected error occurred at the application level. Please try restarting.'}
          </p>
          <button
            onClick={() => reset()}
            style={{ borderRadius: '0.75rem', backgroundColor: '#2563eb', padding: '0.75rem 2rem', fontWeight: '700', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
