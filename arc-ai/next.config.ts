import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DEMO_SERVICE_URL: process.env.DEMO_SERVICE_URL || "https://demo-service-277663208788.africa-south1.run.app",
  },
  async rewrites() {
    return [
      // Serve the existing Arc AI marketing page at / without changing the URL
      { source: "/", destination: "/index.html" },
      // Keep the existing arc-ai API function accessible
      { source: "/api/demo-request", destination: "/api/demo-request" },
    ];
  },
};

export default nextConfig;
