/**
 * Secure Configuration Service
 * Removes hardcoded credentials and implements proper validation
 */

interface SecureAppConfig {
  // App Info
  appName: string;
  appVersion: string;
  environment: 'development' | 'production' | 'preview';

  // AI Services
  openai: {
    apiKey?: string;
    orgId?: string;
  };

  // Music Services
  spotify: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  };

  // YouTube Configuration
  youtube: {
    apiKey?: string;
  };

  // Last.fm Configuration
  lastfm: {
    apiKey?: string;
    secret?: string;
  };

  // Google Studio Configuration
  googleStudio: {
    apiKey?: string;
  };

  // Backend Services
  supabase: {
    url?: string;
    anonKey?: string;
  };

  // Feature Flags
  features: {
    magicMatchEnabled: boolean;
    magicSetEnabled: boolean;
    analyticsEnabled: boolean;
    devMode: boolean;
    mockAiResponses: boolean;
  };

  // Security Settings
  security: {
    enableHttps: boolean;
    enableCSP: boolean;
    enableHSTS: boolean;
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
  };
}

// Secure environment variable loading
const getSecureEnvVar = (key: string, required: boolean = false): string | undefined => {
  const value = import.meta.env[key];
  
  if (!value && required) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
};

const getBooleanEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getNumberEnv = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

// Validation functions
const validateApiKey = (key: string | undefined, _service: string): boolean => {
  if (!key) return false;
  
  // Check for placeholder/demo values
  const placeholderPatterns = [
    /^demo_/,
    /^test_/,
    /^placeholder_/,
    /^abc123/,
    /^xyz456/,
  ];
  
  return !placeholderPatterns.some(pattern => pattern.test(key));
};

const validateUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Create secure configuration
const environment = getSecureEnvVar('VITE_APP_ENVIRONMENT', true) as 'development' | 'production' | 'preview' || 'development';
const isProduction = environment === 'production';

export const secureConfig: SecureAppConfig = {
  // App Info
  appName: getSecureEnvVar('VITE_APP_NAME', true) || 'DJfly Clean',
  appVersion: getSecureEnvVar('VITE_APP_VERSION', true) || '1.0.0',
  environment,

  // AI Services
  openai: {
    apiKey: getSecureEnvVar('VITE_OPENAI_API_KEY'),
    orgId: getSecureEnvVar('VITE_OPENAI_ORG_ID'),
  },

  // Music Services
  spotify: {
    clientId: getSecureEnvVar('VITE_SPOTIFY_CLIENT_ID'),
    clientSecret: getSecureEnvVar('VITE_SPOTIFY_CLIENT_SECRET'),
    redirectUri: getSecureEnvVar('VITE_SPOTIFY_REDIRECT_URI'),
  },

  // YouTube Configuration
  youtube: {
    apiKey: getSecureEnvVar('VITE_YOUTUBE_API_KEY'),
  },

  // Last.fm Configuration
  lastfm: {
    apiKey: getSecureEnvVar('VITE_LASTFM_API_KEY'),
    secret: getSecureEnvVar('VITE_LASTFM_SECRET'),
  },

  // Google Studio Configuration
  googleStudio: {
    apiKey: getSecureEnvVar('VITE_GOOGLE_STUDIO_API_KEY'),
  },

  // Backend Services
  supabase: {
    url: getSecureEnvVar('VITE_SUPABASE_URL'),
    anonKey: getSecureEnvVar('VITE_SUPABASE_ANON_KEY'),
  },

  // Feature Flags
  features: {
    magicMatchEnabled: isProduction || getBooleanEnv('VITE_MAGIC_MATCH_ENABLED', true),
    magicSetEnabled: isProduction || getBooleanEnv('VITE_MAGIC_SET_ENABLED', true),
    analyticsEnabled: isProduction || getBooleanEnv('VITE_ANALYTICS_ENABLED', true),
    devMode: !isProduction && getBooleanEnv('VITE_DEV_MODE', false),
    mockAiResponses: !isProduction && getBooleanEnv('VITE_MOCK_AI_RESPONSES', false),
  },

  // Security Settings
  security: {
    enableHttps: isProduction,
    enableCSP: true,
    enableHSTS: isProduction,
    sessionTimeout: getNumberEnv('VITE_SESSION_TIMEOUT', 60), // 60 minutes
    maxLoginAttempts: getNumberEnv('VITE_MAX_LOGIN_ATTEMPTS', 5),
  },
};

// Configuration validation
export const validateSecureConfig = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required validations
  if (!validateApiKey(secureConfig.openai.apiKey, 'OpenAI')) {
    if (isProduction) {
      errors.push('OpenAI API key is required in production');
    } else {
      warnings.push('OpenAI API key not configured - AI features will be limited');
    }
  }

  if (!validateApiKey(secureConfig.spotify.clientId, 'Spotify')) {
    if (isProduction) {
      errors.push('Spotify Client ID is required in production');
    } else {
      warnings.push('Spotify Client ID not configured - music features will be limited');
    }
  }

  if (!validateUrl(secureConfig.supabase.url)) {
    if (isProduction) {
      errors.push('Supabase URL is required in production');
    } else {
      warnings.push('Supabase URL not configured - database features will be limited');
    }
  }

  // Security validations
  if (!isProduction && !secureConfig.security.enableHttps) {
    warnings.push('HTTPS not enforced in development mode');
  }

  if (!secureConfig.security.enableCSP) {
    warnings.push('Content Security Policy not enabled');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Service status tracking
export class SecureServiceStatus {
  private static instance: SecureServiceStatus;
  private services: Map<string, { available: boolean; lastCheck: number }> = new Map();

  static getInstance(): SecureServiceStatus {
    if (!SecureServiceStatus.instance) {
      SecureServiceStatus.instance = new SecureServiceStatus();
    }
    return SecureServiceStatus.instance;
  }

  setServiceStatus(service: string, isAvailable: boolean): void {
    this.services.set(service, {
      available: isAvailable,
      lastCheck: Date.now(),
    });
  }

  getServiceStatus(service: string): boolean {
    const status = this.services.get(service);
    return status?.available || false;
  }

  getAvailableServices(): string[] {
    return Array.from(this.services.entries())
      .filter(([, status]) => status.available)
      .map(([service]) => service);
  }

  getAllServices(): Record<string, boolean> {
    return Object.fromEntries(
      Array.from(this.services.entries()).map(([service, status]) => [
        service,
        status.available,
      ])
    );
  }
}

export const secureServiceStatus = SecureServiceStatus.getInstance();

// Initialize and validate configuration
const validation = validateSecureConfig();

if (validation.errors.length > 0) {
  console.error('❌ Configuration errors:', validation.errors);
}

if (validation.warnings.length > 0) {
  console.warn('⚠️ Configuration warnings:', validation.warnings);
}

if (validation.isValid) {
  console.log('✅ Secure configuration validated successfully');
}

export default secureConfig;
