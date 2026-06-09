import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bizflow/ui", "@bizflow/types"]
};

export default nextConfig;
