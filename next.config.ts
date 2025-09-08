import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export default nextConfig;
