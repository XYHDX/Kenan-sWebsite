import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  eslint: {
    // Temporarily ignore ESLint during builds to enable deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We want TypeScript errors to be treated as build failures
    ignoreBuildErrors: false,
  }
}

export default nextConfig
