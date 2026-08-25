/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost',   port: '8000' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'brandsgalaxy.store' }],
        destination: 'https://www.brandsgalaxy.store/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
