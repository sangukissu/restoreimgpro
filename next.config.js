/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
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
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://www.clarity.ms https://*.clarity.ms https://client.crisp.chat https://settings.crisp.chat",
          "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://www.clarity.ms https://*.clarity.ms https://client.crisp.chat https://settings.crisp.chat",
          "style-src 'self' 'unsafe-inline' https://client.crisp.chat",
          "img-src 'self' data: https: blob: https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://*.crisp.chat",
          "font-src 'self' data: https://client.crisp.chat",
          "connect-src 'self' https://api.supabase.co https://*.supabase.co wss://*.supabase.co https://fal.ai https://*.fal.ai https://*.fal.media wss://*.fal.ai https://dodopayments.com https://*.dodopayments.com https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://www.clarity.ms https://*.clarity.ms https://client.crisp.chat https://storage.crisp.chat wss://client.relay.crisp.chat wss://stream.relay.crisp.chat",
          "media-src 'self' blob: https://*.public.blob.vercel-storage.com https://*.fal.media https://blog.bringback.pro https://*.wordpress.com",
          "frame-src 'self' https://www.youtube.com https://youtube.com https://challenges.cloudflare.com https://*.cloudflare.com https://*.crisp.chat",
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
      {
        source: '/restore/animate-old-photos',
        destination: '/ai-photo-animation',
        permanent: true
      },
      {
        source: '/restore/fix-scratched-childhood-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/how-can-i-digitize-old-photos',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-low-resolution-military-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/best-way-to-scan-photos',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-yellowed-family-portrait',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/remove-scratches-from-pictures',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-creased-ancestor-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-blurry-graduation-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-water-damaged-ancestor-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/convert-pictures-to-digital',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-yellowed-graduation-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-blurry-ancestor-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/enhance-photo-quality',
        destination: '/denoise-photos',
        permanent: true
      },
      {
        source: '/restore/colorize-black-and-white',
        destination: '/colorize-photos',
        permanent: true
      },
      {
        source: '/restore/fix-low-resolution-family-portrait',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-water-damaged-graduation-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-low-resolution-holiday-snap',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-water-damaged-family-portrait',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-blurry-military-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-scratched-ancestor-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-faded-graduation-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-low-resolution-childhood-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-torn-wedding-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-yellowed-childhood-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-faded-ancestor-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-faded-baby-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-scratched-family-portrait',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/old-photo-color-restoration-online',
        destination: '/colorize-photos',
        permanent: true
      },
      {
        source: '/restore/fix-yellowed-military-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-scratched-graduation-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-scratched-wedding-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-water-damaged-wedding-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
      {
        source: '/restore/fix-dusty-baby-photo',
        destination: '/old-photo-restoration',
        permanent: true
      },
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
