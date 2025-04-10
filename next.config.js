/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    // Disable ESLint during production build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
