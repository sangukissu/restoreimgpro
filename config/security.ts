/**
 * Security configuration for different environments
 */

export interface SecurityConfig {
  enforceHttps: boolean
  allowedOrigins: string[]
  cspDirectives: Record<string, string[]>
  rateLimiting: {
    enabled: boolean
    windowMs: number
    maxRequests: number
  }
  fileUpload: {
    maxSize: number
    allowedTypes: string[]
    scanForMalware: boolean
  }
}

const baseConfig: SecurityConfig = {
  enforceHttps: false,
  allowedOrigins: ['http://localhost:3000'],
  cspDirectives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      'https://api.supabase.co',
      'https://*.supabase.co',
      'https://fal.ai',
      'https://*.fal.ai',
      'https://dodopayments.com',
      'https://*.dodopayments.com',
      'https://1262a1778d74.ngrok-free.app',
      'https://*.ngrok-free.app'
    ],
    'media-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"]
  },
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  fileUpload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    scanForMalware: false
  }
}

const developmentConfig: SecurityConfig = {
  ...baseConfig,
  enforceHttps: false,
  allowedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001'
  ]
}

const productionConfig: SecurityConfig = {
  ...baseConfig,
  enforceHttps: true,
  allowedOrigins: [
    'https://bringback.pro',
    'https://www.yourdomain.com'
  ],
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50 // Stricter in production
  },
  fileUpload: {
    ...baseConfig.fileUpload,
    scanForMalware: true // Enable in production
  }
}

const testConfig: SecurityConfig = {
  ...baseConfig,
  enforceHttps: false,
  rateLimiting: {
    enabled: false,
    windowMs: 0,
    maxRequests: 1000
  }
}

export function getSecurityConfig(): SecurityConfig {
  const env = process.env.NODE_ENV || 'development'
  
  switch (env) {
    case 'production':
      return productionConfig
    case 'test':
      return testConfig
    case 'development':
    default:
      return developmentConfig
  }
}

/**
 * Generate CSP header value from configuration
 */
export function generateCSPHeader(config: SecurityConfig): string {
  return Object.entries(config.cspDirectives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null, config: SecurityConfig): boolean {
  if (!origin) return true // Allow requests without origin (direct navigation)
  return config.allowedOrigins.includes(origin)
}

/**
 * Security headers for different environments
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Control referrer information
  'Referrer-Policy': 'origin-when-cross-origin',
  
  // Restrict browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  
  // Cross-Origin policies
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  
  // Additional security
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen'
} as const

/**
 * HTTPS enforcement headers
 */
export const HTTPS_HEADERS = {
  // Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
} as const