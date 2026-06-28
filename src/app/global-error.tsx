'use client';

// Last-resort boundary for errors thrown in the root layout itself. Unlike
// error.tsx it replaces the whole document, so it must render <html>/<body>
// and can't rely on any app chrome or providers.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: '1rem',
          background: '#0a0a0a',
          color: '#fafafa',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '32rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
            The application failed to load. Please try again.
          </p>
          {error.digest && (
            <p style={{ opacity: 0.5, fontSize: '0.75rem', marginBottom: '1.5rem' }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              cursor: 'pointer',
              borderRadius: '0.5rem',
              border: 'none',
              padding: '0.625rem 1.25rem',
              fontWeight: 600,
              background: '#fafafa',
              color: '#0a0a0a',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
