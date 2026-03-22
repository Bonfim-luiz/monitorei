import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/db', '@workspace/redis', '@workspace/api-client-react'],
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
}

export default nextConfig
