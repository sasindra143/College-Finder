import type { AppProps } from 'next/app';

// This is the Pages Router _app.tsx.
// It is completely separate from the App Router layout.
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
