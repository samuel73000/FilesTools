import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Alias pour les imports
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    // Configuration pour PDF.js
    config.module.rules.push({
      test: /\.pdf$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      ],
    });

    // Fallback pour environnement client
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;