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

  webpack(config,{isServer}) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    if(!isServer){ 
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
          crypto: false,
          path: false,
          os: false,
          events: false,
        };
      }
    return config;
  }
};

export default nextConfig;