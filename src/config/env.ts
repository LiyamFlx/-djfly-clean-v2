// Environment variable configuration and validation
// This ensures all required environment variables are properly loaded

interface AppConfig {
  // App Info
  appName: string;
  appVersion: string;
  environment: 'development' | 'production' | 'preview';

  // AI Services
  openai: {
    apiKey?: string;
    orgId?: string;
  };

  anthropic: {
    apiKey?: string;
  };

  // Music Services
  spotify: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  };

  youtube: {
    apiKey?: string;
  };

  // Backend Services
  supabase: {
    url?: string;
    anonKey?: string;
  };

  // Analytics
  analytics: {
    googleAnalyticsId?: string;
    sentryDsn?: string;
    mixpanelToken?: string;
  };

  // Feature Flags
  features: {
    magicMatchEnabled: boolean;
    magicSetEnabled: boolean;
    analyticsEnabled: boolean;
    devMode: boolean;
    mockAiResponses: boolean;
  };

  // Audio Configuration
  audio: {
    sampleRate: number;
    bufferSize: number;
    crossfadeDuration: number;
    maxVolume: number;
  };
}

// Load and validate environment variables
const getEnvVar = (key: string, defaultValue?: string): string | undefined => {
  const value = import.meta.env[key] || defaultValue;
  return value || undefined;
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

// Create configuration object
const environment =
  (getEnvVar(
    'VITE_APP_ENVIRONMENT',
    'development'
  ) as AppConfig['environment']) || 'development';
const isProduction = environment === 'production';

export const config: AppConfig = {
  // App Info
  appName: getEnvVar('VITE_APP_NAME', 'DJfly Clean') || 'DJfly Clean',
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0') || '1.0.0',
  environment,

  // AI Services
  openai: {
    apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
    orgId: getEnvVar('VITE_OPENAI_ORG_ID'),
  },

  anthropic: {
    apiKey: getEnvVar('VITE_ANTHROPIC_API_KEY'),
  },

  // Music Services
  spotify: {
    clientId: getEnvVar('VITE_SPOTIFY_CLIENT_ID'),
    clientSecret: getEnvVar('VITE_SPOTIFY_CLIENT_SECRET'),
    redirectUri: getEnvVar('VITE_SPOTIFY_REDIRECT_URI'),
  },

  youtube: {
    apiKey: getEnvVar('VITE_YOUTUBE_API_KEY'),
  },

  // Backend Services
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },

  // Analytics
  analytics: {
    googleAnalyticsId: getEnvVar('VITE_GA_MEASUREMENT_ID'),
    sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
    mixpanelToken: getEnvVar('VITE_MIXPANEL_TOKEN'),
  },

  // Feature Flags
  features: {
    magicMatchEnabled:
      isProduction || getBooleanEnv('VITE_MAGIC_MATCH_ENABLED', true),
    magicSetEnabled:
      isProduction || getBooleanEnv('VITE_MAGIC_SET_ENABLED', true),
    analyticsEnabled:
      isProduction || getBooleanEnv('VITE_ANALYTICS_ENABLED', true),
    devMode: !isProduction && getBooleanEnv('VITE_DEV_MODE', false),
    mockAiResponses:
      !isProduction && getBooleanEnv('VITE_MOCK_AI_RESPONSES', false),
  },

  // Audio Configuration
  audio: {
    sampleRate: getNumberEnv('VITE_AUDIO_SAMPLE_RATE', 44100),
    bufferSize: getNumberEnv('VITE_AUDIO_BUFFER_SIZE', 2048),
    crossfadeDuration: getNumberEnv('VITE_PLAYER_CROSSFADE_DURATION', 3000),
    maxVolume: getNumberEnv('VITE_PLAYER_MAX_VOLUME', 90) / 100,
  },
};

// Validation functions
export const validateRequiredEnvVars = (): {
  isValid: boolean;
  missing: string[];
} => {
  const requiredVars = [
    'VITE_OPENAI_API_KEY',
    'VITE_SPOTIFY_CLIENT_ID',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const missing = requiredVars.filter((key) => !import.meta.env[key]);

  return {
    isValid: missing.length === 0,
    missing,
  };
};

// Development helper
export const logConfigStatus = (): void => {
  if (config.features.devMode) {
    console.group('🔧 DJfly Configuration Status');

    const validation = validateRequiredEnvVars();

    if (validation.isValid) {
      console.log('✅ All required environment variables are set');
    } else {
      console.warn(
        '⚠️ Missing required environment variables:',
        validation.missing
      );
    }

    console.log('🎵 App Environment:', config.environment);
    console.log('🤖 AI Services:', {
      openai: !!config.openai.apiKey,
      anthropic: !!config.anthropic.apiKey,
    });
    console.log('🎵 Music Services:', {
      spotify: !!config.spotify.clientId,
      youtube: !!config.youtube.apiKey,
    });
    console.log('🌐 Backend Services:', {
      supabase: !!config.supabase.url,
    });
    console.log('📊 Analytics:', {
      googleAnalytics: !!config.analytics.googleAnalyticsId,
      sentry: !!config.analytics.sentryDsn,
    });
    console.log('🎛️ Features:', config.features);

    console.groupEnd();
  }
};

// Initialize configuration logging in development
if (config.features.devMode) {
  logConfigStatus();
}

export default config;
