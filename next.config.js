/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Prevent `next build` from clobbering the `.next` folder used by a running dev server.
    distDir: isDevServer ? '.next-dev' : '.next',
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
      unoptimized: process.env.NODE_ENV === 'development',
    },
    typescript: {
      tsconfigPath: './tsconfig.json',
    },
  };

  return nextConfig;
};
