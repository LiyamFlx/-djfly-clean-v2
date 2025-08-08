/**
 * Comprehensive API Configuration Service
 * Handles all external service integrations with validation and fallback
 */

// Environment variables with validation and development fallbacks
const getEnvVar = (
  key: string,
  required: boolean = true
): string | undefined => {
  const value = import.meta.env[key];
  const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true';

  if (!value) {
    if (required && !isDev) {
      console.warn(`⚠️ Missing required environment variable: ${key}`);
    } else if (isDev) {
      console.info(`🔧 Development mode: ${key} not set, using fallbacks`);
    }
  }
  return value;
};

export const API_CONFIG = {
  // Spotify Configuration
  spotify: {
    clientId: getEnvVar('VITE_SPOTIFY_CLIENT_ID'),
    clientSecret: getEnvVar('VITE_SPOTIFY_CLIENT_SECRET'),
    redirectUri: getEnvVar('VITE_SPOTIFY_REDIRECT_URI'),
    scopes: [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-library-read',
      'user-top-read',
      'user-read-recently-played',
    ].join(' '),
    baseUrl: 'https://api.spotify.com/v1',
    authUrl: 'https://accounts.spotify.com',
    tokenUrl: 'https://accounts.spotify.com/api/token',
  },

  // Supabase Configuration
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
  },

  // OpenAI Configuration
  openai: {
    apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
    baseUrl: 'https://api.openai.com/v1',
    modelsUrl: 'https://api.openai.com/v1/models',
  },

  // YouTube Configuration
  youtube: {
    apiKey: getEnvVar('VITE_YOUTUBE_API_KEY'),
    baseUrl: 'https://www.googleapis.com/youtube/v3',
  },

  // Last.fm Configuration
  lastfm: {
    apiKey: getEnvVar('VITE_LASTFM_API_KEY'),
    secret: getEnvVar('VITE_LASTFM_SECRET'),
    baseUrl: 'https://ws.audioscrobbler.com/2.0',
  },

  // Google Studio Configuration
  googleStudio: {
    apiKey: getEnvVar('VITE_GOOGLE_STUDIO_API_KEY'),
  },

  // App Configuration
  app: {
    environment: getEnvVar('VITE_APP_ENVIRONMENT'),
    magicMatch: getEnvVar('VITE_MAGIC_MATCH_ENABLED') === 'true',
    magicSet: getEnvVar('VITE_MAGIC_SET_ENABLED') === 'true',
  },
};

// Service Status Tracking
export class ServiceStatus {
  private static instance: ServiceStatus;
  private services: Map<string, boolean> = new Map();

  static getInstance(): ServiceStatus {
    if (!ServiceStatus.instance) {
      ServiceStatus.instance = new ServiceStatus();
    }
    return ServiceStatus.instance;
  }

  setServiceStatus(service: string, isAvailable: boolean): void {
    this.services.set(service, isAvailable);
    console.log(
      `🔧 ${service}: ${isAvailable ? '✅ Available' : '❌ Unavailable'}`
    );
  }

  getServiceStatus(service: string): boolean {
    return this.services.get(service) || false;
  }

  getAvailableServices(): string[] {
    return Array.from(this.services.entries())
      .filter(([, isAvailable]) => isAvailable)
      .map(([service]) => service);
  }

  getAllServices(): Record<string, boolean> {
    return Object.fromEntries(this.services);
  }
}

export const serviceStatus = ServiceStatus.getInstance();

// API Key Validation
export const validateApiConfig = () => {
  // Check for placeholder/demo credentials
  const isPlaceholderSpotifyId = API_CONFIG.spotify.clientId?.match(
    /^(abc123|e5050e55f5a94ca2|demo_client_id)/
  );
  const isPlaceholderSpotifySecret = API_CONFIG.spotify.clientSecret?.match(
    /^(xyz456|7e76b6a7c1434b1a|demo_client_secret)/
  );

  const isPlaceholderOpenAI =
    API_CONFIG.openai.apiKey?.match(/^(demo_openai_key)/);

  const validations = {
    spotify: {
      clientId:
        !!API_CONFIG.spotify.clientId &&
        API_CONFIG.spotify.clientId.length > 10 &&
        !isPlaceholderSpotifyId,
      clientSecret:
        !!API_CONFIG.spotify.clientSecret &&
        API_CONFIG.spotify.clientSecret.length > 10 &&
        !isPlaceholderSpotifySecret,
      redirectUri: !!API_CONFIG.spotify.redirectUri,
      isPlaceholder: !!(isPlaceholderSpotifyId || isPlaceholderSpotifySecret),
    },
    supabase: {
      url:
        !!API_CONFIG.supabase.url &&
        API_CONFIG.supabase.url.startsWith('https://'),
      anonKey:
        !!API_CONFIG.supabase.anonKey &&
        API_CONFIG.supabase.anonKey.startsWith('eyJ'),
    },
    openai: {
      apiKey:
        !API_CONFIG.openai.apiKey ||
        (API_CONFIG.openai.apiKey.startsWith('sk-') &&
          API_CONFIG.openai.apiKey.length > 40) ||
        isPlaceholderOpenAI,
      isPlaceholder: !!isPlaceholderOpenAI,
    },
    youtube: {
      apiKey:
        !!API_CONFIG.youtube.apiKey && API_CONFIG.youtube.apiKey.length > 20,
    },
    lastfm: {
      apiKey:
        !!API_CONFIG.lastfm.apiKey && API_CONFIG.lastfm.apiKey.length > 20,
      secret:
        !!API_CONFIG.lastfm.secret && API_CONFIG.lastfm.secret.length > 20,
    },
    googleStudio: {
      apiKey:
        !!API_CONFIG.googleStudio.apiKey &&
        API_CONFIG.googleStudio.apiKey.length > 20,
    },
  };

  // Log validation results
  console.log('🔑 API Configuration Validation:');
  Object.entries(validations).forEach(([service, checks]) => {
    const allValid = Object.values(checks).every(Boolean);
    console.log(
      `${service.charAt(0).toUpperCase() + service.slice(1)}: ${allValid ? '✅' : '❌'}`
    );
    if (!allValid) {
      Object.entries(checks).forEach(([key, valid]) => {
        if (!valid) {
          if (key === 'isPlaceholder' && (checks as unknown).isPlaceholder) {
            console.warn(
              `  🔄 ${service}: Using placeholder/demo credentials - see API_CREDENTIALS_GUIDE.md`
            );
          } else {
            console.warn(`  ⚠️ ${key}: Invalid or missing`);
          }
        }
      });
    }
  });

  // Additional helpful messages
  if ((validations.spotify as unknown).isPlaceholder) {
    console.log(`📖 To use real Spotify data, see: API_CREDENTIALS_GUIDE.md`);
  }

  return validations;
};

// Connection Testing
export const testConnections = {
  async spotify(): Promise<boolean> {
    if (!API_CONFIG.spotify.clientId || !API_CONFIG.spotify.clientSecret) {
      return false;
    }

    try {
      // Test Spotify API with client credentials flow
      const response = await fetch(`${API_CONFIG.spotify.authUrl}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${API_CONFIG.spotify.clientId}:${API_CONFIG.spotify.clientSecret}`)}`,
        },
        body: 'grant_type=client_credentials',
      });

      const success = response.ok;
      serviceStatus.setServiceStatus('spotify', success);
      return success;
    } catch (error) {
      console.error('Spotify connection test failed:', error);
      serviceStatus.setServiceStatus('spotify', false);
      return false;
    }
  },

  async supabase(): Promise<boolean> {
    if (!API_CONFIG.supabase.url || !API_CONFIG.supabase.anonKey) {
      return false;
    }

    try {
      // Test Supabase connection
      const response = await fetch(`${API_CONFIG.supabase.url}/rest/v1/`, {
        headers: {
          apikey: API_CONFIG.supabase.anonKey,
          Authorization: `Bearer ${API_CONFIG.supabase.anonKey}`,
        },
      });

      const success = response.status !== 401; // 401 would indicate invalid key
      serviceStatus.setServiceStatus('supabase', success);
      return success;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      serviceStatus.setServiceStatus('supabase', false);
      return false;
    }
  },

  async openai(): Promise<boolean> {
    if (!API_CONFIG.openai.apiKey) {
      serviceStatus.setServiceStatus('openai', false);
      return false;
    }

    try {
      // Test OpenAI API (just check if key format is valid)
      const response = await fetch(`${API_CONFIG.openai.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${API_CONFIG.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const success = response.ok;
      serviceStatus.setServiceStatus('openai', success);
      return success;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      serviceStatus.setServiceStatus('openai', false);
      return false;
    }
  },

  async all(): Promise<Record<string, boolean>> {
    console.log('🔍 Testing all API connections...');

    const results = await Promise.allSettled([
      this.spotify(),
      this.supabase(),
      this.openai(),
    ]);

    const connectionResults = {
      spotify: results[0].status === 'fulfilled' ? results[0].value : false,
      supabase: results[1].status === 'fulfilled' ? results[1].value : false,
      openai: results[2].status === 'fulfilled' ? results[2].value : false,
    };

    console.log('📊 Connection Test Results:', connectionResults);
    return connectionResults;
  },
};

// Initialize configuration on import
validateApiConfig();

export default API_CONFIG;
