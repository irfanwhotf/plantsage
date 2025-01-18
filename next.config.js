/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://plantsage.pages.dev/api/:path*',
      },
    ];
  },
  experimental: {
    runtime: 'edge',
  }
}

module.exports = nextConfig
