/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    emotion: true,
  },
  target: 'serverless',
};

module.exports = nextConfig;
