import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@la/contracts', '@la/config'],
  poweredByHeader: false,
  // Permite varios `next dev` en paralelo (uno por agente) sin pisarse el .next
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
};

export default nextConfig;
