/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production'
    
    const securityHeaders = [
      // Prevent clickjacking attacks
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      // Prevent MIME type sniffing
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      // Control referrer information
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
      },
      // Restrict browser features
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=()'
      },
      // Content Security Policy to prevent XSS attacks
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com",
          "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https: blob: https://www.google-analytics.com",
          "font-src 'self' data:",
          "connect-src 'self' https://api.supabase.co https://*.supabase.co https://fal.ai https://*.fal.ai https://dodopayments.com https://*.dodopayments.com https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com",
          "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
          "frame-src 'self' https://www.youtube.com https://youtube.com https://challenges.cloudflare.com https://*.cloudflare.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          process.env.NODE_ENV === 'production' ? "upgrade-insecure-requests" : ""
        ].filter(Boolean).join('; ')
      },
      // Cross-Origin policies
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin'
      },
      {
        key: 'Cross-Origin-Resource-Policy',
        value: 'cross-origin'
      },
      // Additional security headers
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'off'
      },
      {
        key: 'X-Download-Options',
        value: 'noopen'
      }
    ]
    
    // Add HTTPS enforcement headers only in production
    if (isProduction) {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload'
      })
    }
    
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  },
  
  // Force HTTPS in production
  async redirects() {
    return [
      // Redirect HTTP to HTTPS in production
      process.env.NODE_ENV === 'production' ? {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http'
          }
        ],
        destination: 'https://bringback.pro/:path*',
        permanent: true
      } : null
    ].filter(Boolean)
  },

  // Additional security configurations
  poweredByHeader: false, // Remove X-Powered-By header
  
  // Image optimization security
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.bringback.pro',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'peerpush.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wordpress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wordpress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ddbpucrrposyyfpwpigq.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
}

module.exports = nextConfig