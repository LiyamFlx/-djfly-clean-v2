/**
 * Security Utilities
 * Provides input sanitization, error handling, and security functions
 */

// Input sanitization
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
};

// XSS Prevention
export const escapeHtml = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

export const escapeAttribute = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

// CSRF Protection
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
};

export const validateCSRFToken = (
  token: string,
  storedToken: string
): boolean => {
  return token === storedToken;
};

// Secure error handling
export const sanitizeError = (
  error: unknown,
  context: string = 'Unknown'
): string => {
  // Don't expose internal error details to users
  console.error(`Error in ${context}:`, error);

  if (error instanceof Error) {
    // Only expose safe error messages
    const safeMessages = [
      'Invalid credentials',
      'Network error',
      'Service temporarily unavailable',
      'Invalid input',
      'Authentication required',
    ];

    if (safeMessages.includes(error.message)) {
      return error.message;
    }
  }

  return 'An error occurred. Please try again.';
};

// Security headers
export const getSecurityHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  // Add CSP header
  headers['Content-Security-Policy'] = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  // Add HSTS header in production
  if (import.meta.env.PROD) {
    headers['Strict-Transport-Security'] =
      'max-age=31536000; includeSubDomains';
  }

  return headers;
};

// Password strength validation
export const validatePasswordStrength = (
  password: string
): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain at least one special character');
  }

  // Common password check
  const commonPasswords = [
    'password',
    '123456',
    'qwerty',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    'dragon',
    'master',
    'football',
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    score -= 2;
    feedback.push('Password is too common');
  }

  return {
    isValid: score >= 4 && feedback.length === 0,
    score,
    feedback,
  };
};

// Rate limiting utilities
export class RateLimiter {
  private attempts = new Map<
    string,
    { count: number; lastAttempt: number; blocked: boolean }
  >();
  private readonly maxAttempts: number;
  private readonly lockoutDuration: number;
  private readonly blockDuration: number;

  constructor(
    maxAttempts: number = 5,
    lockoutDuration: number = 15 * 60 * 1000, // 15 minutes
    blockDuration: number = 60 * 60 * 1000 // 1 hour
  ) {
    this.maxAttempts = maxAttempts;
    this.lockoutDuration = lockoutDuration;
    this.blockDuration = blockDuration;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (!attempt) return true;

    // Check if blocked
    if (attempt.blocked) {
      if (now - attempt.lastAttempt > this.blockDuration) {
        this.attempts.delete(identifier);
        return true;
      }
      return false;
    }

    // Check if lockout period has passed
    if (now - attempt.lastAttempt > this.lockoutDuration) {
      this.attempts.delete(identifier);
      return true;
    }

    return attempt.count < this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);

    if (attempt) {
      attempt.count++;
      attempt.lastAttempt = now;

      // Block if max attempts exceeded
      if (attempt.count >= this.maxAttempts) {
        attempt.blocked = true;
      }
    } else {
      this.attempts.set(identifier, {
        count: 1,
        lastAttempt: now,
        blocked: false,
      });
    }
  }

  resetAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }

  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return this.maxAttempts;
    return Math.max(0, this.maxAttempts - attempt.count);
  }
}

// Secure storage utilities
export class SecureStorage {
  private static instance: SecureStorage;
  private encryptionKey: string | null = null;

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private async getEncryptionKey(): Promise<string> {
    if (!this.encryptionKey) {
      // Generate a key from user agent and screen size for basic obfuscation
      const keyMaterial = `${navigator.userAgent}${screen.width}${screen.height}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(keyMaterial);
      const hash = await crypto.subtle.digest('SHA-256', data);
      this.encryptionKey = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
    return this.encryptionKey;
  }

  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      const encryptionKey = await this.getEncryptionKey();
      const encodedValue = btoa(unescape(encodeURIComponent(value)));
      const encryptedValue = this.simpleXOR(encodedValue, encryptionKey);
      sessionStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Failed to set secure item:', error);
      // Fallback to plain storage
      sessionStorage.setItem(key, value);
    }
  }

  async getSecureItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = sessionStorage.getItem(key);
      if (!encryptedValue) return null;

      const encryptionKey = await this.getEncryptionKey();
      const decryptedValue = this.simpleXOR(encryptedValue, encryptionKey);
      return decodeURIComponent(escape(atob(decryptedValue)));
    } catch (error) {
      console.error('Failed to get secure item:', error);
      // Fallback to plain storage
      return sessionStorage.getItem(key);
    }
  }

  private simpleXOR(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result);
  }

  removeSecureItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  clearSecureStorage(): void {
    sessionStorage.clear();
  }
}

export const secureStorage = SecureStorage.getInstance();

// Export default security utilities
export default {
  sanitizeString,
  sanitizeEmail,
  sanitizeUrl,
  escapeHtml,
  escapeAttribute,
  generateCSRFToken,
  validateCSRFToken,
  sanitizeError,
  getSecurityHeaders,
  validatePasswordStrength,
  RateLimiter,
  secureStorage,
};
