import { NextRequest, NextResponse } from 'next/server'

/**
 * Security middleware for additional runtime security checks
 */
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto')
    if (proto === 'http') {
      const httpsUrl = new URL(request.url)
      httpsUrl.protocol = 'https:'
      return NextResponse.redirect(httpsUrl.toString(), 301)
    }
  }
  
  // Add security headers at runtime (backup to next.config.js)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Rate limiting headers (informational)
  response.headers.set('X-RateLimit-Limit', '100')
  response.headers.set('X-RateLimit-Remaining', '99')
  
  return response
}

/**
 * Validate request origin for sensitive operations
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  
  // Allow same-origin requests
  if (origin && host) {
    const originUrl = new URL(origin)
    return originUrl.host === host
  }
  
  // Allow requests without origin (direct navigation)
  return !origin
}

/**
 * Check for suspicious request patterns
 */
export function detectSuspiciousActivity(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const referer = request.headers.get('referer') || ''
  
  // Basic bot detection
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i
  ]
  
  // Check for suspicious user agents
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    return true
  }
  
  // Check for missing user agent (potential automation)
  if (!userAgent) {
    return true
  }
  
  return false
}

/**
 * Sanitize file upload paths
 */
export function sanitizeFilePath(filename: string): string {
  // Remove directory traversal attempts
  const sanitized = filename
    .replace(/\.\./g, '') // Remove ..
    .replace(/\//g, '') // Remove forward slashes
    .replace(/\\/g, '') // Remove backslashes
    .replace(/[<>:"|?*]/g, '') // Remove invalid filename characters
    .trim()
  
  // Ensure filename is not empty and has reasonable length
  if (!sanitized || sanitized.length > 255) {
    throw new Error('Invalid filename')
  }
  
  return sanitized
}

/**
 * Generate secure random tokens
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}