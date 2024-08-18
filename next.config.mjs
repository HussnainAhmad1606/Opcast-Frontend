/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other Next.js config options
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/index.html',
      },
    ];
  },
};

export default nextConfig;
