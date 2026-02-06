/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
    appDir: true,
    serverActions: { bodySizeLimit: '25mb' },
    staticPageGenerationTimeout: 0,
  },
  reactStrictMode: true,

  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'd2v1qjwl1c2i7l.cloudfront.net',
        },
      ],
  },

  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

export default nextConfig;