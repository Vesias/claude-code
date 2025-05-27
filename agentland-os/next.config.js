/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: [
      'localhost',
      'agentland.saarland',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimize CSS
    optimizeCss: true,
    // Enable new app directory
    typedRoutes: true,
  },
  
  // Custom webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Add custom webpack plugins or loaders here
    
    // SVG handling is built-in with Next.js 15
    
    return config
  },
  
  // Environment variables to expose to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.APP_NAME || 'AgentlandOS',
    NEXT_PUBLIC_APP_URL: process.env.APP_URL || 'http://localhost:3000',
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    compress: true,
    generateBuildId: async () => {
      // Generate a unique build ID based on git commit or timestamp
      return `build-${Date.now()}`
    },
  }),
}

module.exports = nextConfig