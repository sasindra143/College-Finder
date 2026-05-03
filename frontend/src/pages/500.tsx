// Pages Router 500 page — handles /500 via the Pages Router pipeline.
// Keeps <html>/<body> OUT of this file; the _document.tsx provides them.
export default function Custom500() {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#030712', color: '#f9fafb',
      fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem', textAlign: 'center'
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>⚠️</div>
      <h1 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.5rem' }}>
        500 — Server Error
      </h1>
      <p style={{ color: '#9ca3af', maxWidth: '28rem', marginBottom: '2rem' }}>
        An unexpected error occurred on our servers. We are working to fix it.
      </p>
      <a href="/" style={{
        backgroundColor: '#f97316', color: 'white', padding: '0.75rem 2rem',
        borderRadius: '0.75rem', fontWeight: '700', textDecoration: 'none',
        display: 'inline-block'
      }}>
        Go to Homepage
      </a>
    </div>
  );
}
