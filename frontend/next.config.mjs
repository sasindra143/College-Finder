/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.unsplash.com" },
    ],
  },
  // Prevent static prerendering failures caused by client-only hooks (useContext)
  // being executed during the build phase. This tells Next.js not to bail out
  // with a hard error when CSR-only components are encountered during SSG.
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;

