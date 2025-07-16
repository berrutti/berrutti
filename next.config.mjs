/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/berrutti',
  assetPrefix: '/berrutti',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
