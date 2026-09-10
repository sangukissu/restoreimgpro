const urlPolicy = require('./config/url-policy.json')

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
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://c.ecompin.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://www.clarity.ms https://*.clarity.ms https://client.crisp.chat https://settings.crisp.chat",
          "script-src-elem 'self' 'unsafe-inline' https://c.ecompin.com https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://www.clarity.ms https://*.clarity.ms https://client.crisp.chat https://settings.crisp.chat",
          "style-src 'self' 'unsafe-inline' https://client.crisp.chat",
          "img-src 'self' data: https: blob: https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://*.crisp.chat",
          "font-src 'self' data: https://client.crisp.chat",
          "connect-src 'self' https://c.ecompin.com https://api.supabase.co https://*.supabase.co wss://*.supabase.co https://fal.ai https://*.fal.ai https://*.fal.media wss://*.fal.ai https://dodopayments.com https://*.dodopayments.com https://*.r2.cloudflarestorage.com https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://www.clarity.ms https://*.clarity.ms https://client.crisp.chat https://storage.crisp.chat wss://client.relay.crisp.chat wss://stream.relay.crisp.chat",
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
      },
      // Defense in depth for the admin surface: even if a crawler ignores
      // robots.txt, the response itself declares itself non-indexable and is
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate' },
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
      {
        source: '/api/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
        ],
      },
    ]
  },

  // 301 redirects: true duplicates + genuinely deleted blog posts only.
  //
  // DO NOT hand-edit this list. Every retired URL lives in
  // config/url-policy.json, which app/sitemap.ts and app/features/page.tsx read
  // from the same file. Editing here alone recreates the July 2026 bug where
  // URLs were redirected but left in the sitemap and internal links.
  //
  // Rule before retiring anything: the URL must target the SAME primary query
  // as its destination. Low CTR is NOT a reason -- sitewide CTR is suppressed
  // by AI Overviews, so a low CTR at a good position means the SERP changed,
  // not that the page is bad. See SEO_URL_REGISTRY.md for the decision log.
  async redirects() {
    return [
      ...Object.entries({
        ...urlPolicy.retiredKeywordPaths,
        ...urlPolicy.retiredBlogPaths,
      }).map(([source, destination]) => ({
        source,
        destination,
        permanent: true,
      })),
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
