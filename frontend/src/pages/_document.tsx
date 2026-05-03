import Document, { Html, Head, Main, NextScript } from 'next/document';

// This file configures the Pages Router document for Next.js.
// It MUST exist to handle /404 and /500 error pages correctly
// when using the App Router alongside the Pages Router fallback.
// Without it, Next.js tries to use App Router's layout.tsx (which has
// <html>/<body> tags) for Pages Router pages, causing a build error.
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
