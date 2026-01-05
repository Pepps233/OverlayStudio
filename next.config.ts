import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'OverlayStudio';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}` : '',
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
