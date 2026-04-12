/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost',   port: '8000' },
      { protocol: 'https', hostname: '**' },   // allow any HTTPS backend in production
    ],
  },
  // Suppress hydration warnings from browser extensions
  reactStrictMode: true,
}

module.exports = nextConfig
