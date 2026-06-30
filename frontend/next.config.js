/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost',   port: '8000' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  reactStrictMode: true,
  async rewrites() {
    // In production, proxy /api/* and /static/* through Next.js to avoid CORS.
    // In local dev, NEXT_PUBLIC_API_URL is set so api.js hits the backend directly.
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/api/:path*',
          destination: 'https://brandsgalaxywebsite.onrender.com/api/:path*',
        },
        {
          source: '/static/:path*',
          destination: 'https://brandsgalaxywebsite.onrender.com/static/:path*',
        },
      ];
    }
    return [];
  },
}

module.exports = nextConfig
