// This is the Pages Router _app.tsx. 
// It is completely separate from the App Router layout.
// We keep it minimal to prevent any conflicts.
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
