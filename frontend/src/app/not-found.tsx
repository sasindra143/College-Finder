import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', minHeight: '70vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1rem' }}>
      <h2 style={{ fontSize: '4rem', fontWeight: '900', color: '#111827', marginBottom: '1rem' }}>404</h2>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#374151', marginBottom: '1.5rem' }}>Page Not Found</h3>
      <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '28rem' }}>
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link 
        href="/"
        style={{ padding: '0.75rem 2rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.75rem', fontWeight: '700', textDecoration: 'none' }}
      >
        Return Home
      </Link>
    </div>
  );
}
