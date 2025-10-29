# Security Implementation Guide

This document outlines the security measures implemented in the Birngback application.

## 🛡️ Security Features Implemented

### 1. Security Headers

The application implements comprehensive security headers via `next.config.js`:

- **X-Frame-Options**: `DENY` - Prevents clickjacking attacks
- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **Referrer-Policy**: `origin-when-cross-origin` - Controls referrer information
- **Permissions-Policy**: Restricts browser features (camera, microphone, geolocation, payment)
- **Cross-Origin-Opener-Policy**: `same-origin` - Prevents cross-origin attacks
- **Cross-Origin-Resource-Policy**: `cross-origin` - Controls resource sharing
- **X-DNS-Prefetch-Control**: `off` - Disables DNS prefetching
- **X-Download-Options**: `noopen` - Prevents file execution in IE

### 2. Content Security Policy (CSP)

Strict CSP implementation to prevent XSS attacks:

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
font-src 'self' data:;
connect-src 'self' https://api.supabase.co https://*.supabase.co https://fal.ai https://*.fal.ai https://dodopayments.com https://*.dodopayments.com;
media-src 'self' blob:;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
```

### 3. HTTPS Enforcement

#### Production Environment
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains; preload`
- **upgrade-insecure-requests**: Automatically upgrades HTTP to HTTPS
- Automatic HTTP to HTTPS redirects via middleware

#### Configuration
```javascript
// In next.config.js - Update the redirect destination
async redirects() {
  return [
    process.env.NODE_ENV === 'production' ? {
      source: '/(.*)',
      has: [{
        type: 'header',
        key: 'x-forwarded-proto',
        value: 'http'
      }],
      destination: 'https://bringback.pro/:path*', // ⚠️ UPDATE THIS
      permanent: true
    } : null
  ].filter(Boolean)
}
```

### 4. Security Middleware

Implemented in `middleware/security.ts` and integrated with `middleware.ts`:

- **Origin Validation**: Validates request origins for state-changing operations
- **Suspicious Activity Detection**: Basic bot and automation detection
- **Runtime Security Headers**: Backup security headers at runtime
- **File Path Sanitization**: Prevents directory traversal attacks

### 5. Environment-Based Configuration

Security settings adapt based on environment (`config/security.ts`):

- **Development**: Relaxed settings for local development
- **Production**: Strict security policies
- **Test**: Minimal restrictions for testing

## 🚀 Deployment Checklist

### Before Production Deployment

1. **Update Domain Configuration**
   ```javascript
   // In next.config.js
   destination: 'https://bringback.pro/:path*' // Replace with actual domain
   ```

2. **Update Allowed Origins**
   ```typescript
   // In config/security.ts
   allowedOrigins: [
     'https://bringback.pro',
     'https://www.yourdomain.com'
   ]
   ```

3. **Environment Variables**
   Ensure these are set in production:
   ```bash
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://bringback.pro
   ```

4. **SSL Certificate**
   - Ensure valid SSL certificate is installed
   - Test HTTPS functionality
   - Verify certificate chain

5. **Security Testing**
   - Run security headers test: https://securityheaders.com/
   - Test CSP compliance
   - Verify HTTPS redirects
   - Check for mixed content warnings

### Production Verification

1. **Headers Check**
   ```bash
   curl -I https://bringback.pro
   ```

2. **CSP Validation**
   - Check browser console for CSP violations
   - Use CSP Evaluator: https://csp-evaluator.withgoogle.com/

3. **HTTPS Test**
   - SSL Labs Test: https://www.ssllabs.com/ssltest/
   - Verify HSTS preload eligibility

## 🔧 Configuration Files

### Key Files
- `next.config.js` - Security headers and HTTPS redirects
- `middleware.ts` - Request-level security checks
- `middleware/security.ts` - Security utility functions
- `config/security.ts` - Environment-based security configuration

### Security Constants
- File upload limits: 10MB
- Allowed file types: JPEG, PNG, WebP, GIF
- Rate limiting: 100 requests per 15 minutes (configurable)
- Session timeout: Based on Supabase configuration

## 🚨 Security Monitoring

### Recommended Monitoring
1. **Error Tracking**: Monitor CSP violations and security errors
2. **Rate Limiting**: Track API usage patterns
3. **File Uploads**: Monitor for malicious file uploads
4. **Authentication**: Track failed login attempts

### Log Analysis
Monitor these patterns in logs:
- Suspicious user agents
- High-frequency requests from single IPs
- CSP violation reports
- Failed authentication attempts

## 📋 Maintenance

### Regular Tasks
1. **Dependency Updates**: Keep security-related packages updated
2. **CSP Review**: Regularly review and tighten CSP policies
3. **Certificate Renewal**: Monitor SSL certificate expiration
4. **Security Audits**: Regular security assessments

### Emergency Response
1. **Security Incident**: Have a plan for security breaches
2. **Certificate Issues**: Backup certificate management
3. **DDoS Protection**: Consider additional protection layers

## 🔗 Additional Resources

- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

**Note**: This security implementation provides a strong foundation, but security is an ongoing process. Regular reviews and updates are essential for maintaining security posture.