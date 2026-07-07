import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  output: 'standalone',
}

export default nextConfig
