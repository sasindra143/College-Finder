'use client';

export const dynamic = 'force-dynamic';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '70vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', marginBottom: '1rem' }}>Something went wrong!</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '28rem' }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        style={{ padding: '0.75rem 2rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.75rem', fontWeight: '700', border: 'none', cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  );
}
