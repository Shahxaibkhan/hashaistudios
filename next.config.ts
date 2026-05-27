import type { NextConfig } from "next";

// Corporate SSL inspection proxy injects a self-signed cert that Node rejects.
// This is dev-only; production runs on Vercel where the cert chain is trusted.
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  scope: "/hungerai/dashboard",
  sw: "sw-hungerai.js",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  }
};

export default withPWA(nextConfig);
