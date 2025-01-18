/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  }
}

module.exports = nextConfig
