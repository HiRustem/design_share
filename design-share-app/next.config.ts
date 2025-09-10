import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  images: {
    domains: ['localhost'],
  },
  // Увеличиваем лимит размера тела запроса для загрузки PDF файлов
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
  // Настройки для работы с PDF файлами
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
  // Настройки для экспорта статических файлов (если нужно)
  output: 'standalone',
  // Настройки для работы с внешними ресурсами
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;