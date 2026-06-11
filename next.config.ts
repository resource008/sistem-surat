import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
}

export default nextConfig