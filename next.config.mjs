import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dimatikan: source map production expose source code readable ke browser publik.
  productionBrowserSourceMaps: false,
  distDir: process.env.DIST_DIR || '.next',
  turbopack: {}, // Konfigurasi Turbopack kosong untuk membungkam error
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
  },
  webpack(config, { dev }) {
    if (dev) {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: '@dhiwise/component-tagger/nextLoader',
          },
        ],
      });
      const ignoredPaths = (process.env.WATCH_IGNORED_PATHS || '')
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      config.watchOptions = {
        ignored: ignoredPaths.length
          ? ignoredPaths.map((p) => `**/${p.replace(/^\/+|\/+$/g, '')}/**`)
          : undefined,
      };
    }
    return config;
  },
};

export default nextConfig;