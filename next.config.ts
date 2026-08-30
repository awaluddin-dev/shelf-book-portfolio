import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/:path*`, // Proxy to Backend
      },
    ];
  },
  async redirects() {
    // Memastikan redirect HANYA berjalan jika kedua ENV diatur di Vercel.
    // Jika repo di-clone orang lain atau berjalan di lokal tanpa ENV ini, redirect diabaikan.
    if (
      !process.env.NEXT_PUBLIC_LEGACY_DOMAIN ||
      !process.env.NEXT_PUBLIC_WEB_URL
    ) {
      return [];
    }

    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: process.env.NEXT_PUBLIC_LEGACY_DOMAIN,
          },
        ],
        destination: `${process.env.NEXT_PUBLIC_WEB_URL}/:path*`,
        permanent: true,
      },
    ];
  },
  output: "standalone",
  transpilePackages: ["motion"],
  webpack: (config, { dev }) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === "true") {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
