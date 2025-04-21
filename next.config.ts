import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    // We want ESLint to run during builds to catch errors early
    ignoreDuringBuilds: false,
  },
  typescript: {
    // We want TypeScript errors to be treated as build failures
    ignoreBuildErrors: false,
  }
}

export default nextConfig
