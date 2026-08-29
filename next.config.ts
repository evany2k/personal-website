import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["*.trycloudflare.com", "*.loca.lt"],
};

export default nextConfig;
