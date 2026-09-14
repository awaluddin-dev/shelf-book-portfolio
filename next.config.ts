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
    const apiUrl = (process.env.API_URL || "http://localhost:3002")
      .replace(/\/+$/, "")
      .replace(/\/api$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
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
