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
    return Object.fromEntries(this.services.entries());
  }
}

export const serviceStatus = ServiceStatus.getInstance();

// Configuration validation
export const validateApiConfig = () => {
  const validations: Record<string, Record<string, boolean>> = {
    spotify: {
      clientId: !!API_CONFIG.spotify.clientId,
      clientSecret: !!API_CONFIG.spotify.clientSecret,
      redirectUri: !!API_CONFIG.spotify.redirectUri,
    },
    supabase: {
      url: !!API_CONFIG.supabase.url,
      anonKey: !!API_CONFIG.supabase.anonKey,
    },
    openai: {
      apiKey: !!API_CONFIG.openai.apiKey,
    },
    youtube: {
      apiKey: !!API_CONFIG.youtube.apiKey,
    },
    lastfm: {
      apiKey: !!API_CONFIG.lastfm.apiKey,
      secret: !!API_CONFIG.lastfm.secret,
    },
    googleStudio: {
      apiKey: !!API_CONFIG.googleStudio.apiKey,
    },
  };

  // Log validation results
  Object.entries(validations).forEach(([service, checks]) => {
    const allValid = Object.values(checks).every(Boolean);
    console.log(
      `${allValid ? '✅' : '⚠️'} ${service.toUpperCase()}: ${
        allValid ? 'All credentials configured' : 'Some credentials missing'
      }`
    );

    if (!allValid) {
      Object.entries(checks).forEach(([key, valid]) => {
        if (!valid) {
          if (key === 'isPlaceholder' && (checks as any).isPlaceholder) {
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
  if ((validations.spotify as any).isPlaceholder) {
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

  async youtube(): Promise<boolean> {
    // Skip API testing in production - assume unavailable unless properly configured
    if (!API_CONFIG.youtube.apiKey || API_CONFIG.youtube.apiKey.includes('AIzaSyBBD44Gy31o8al3_MoJFksfhVJGI9a7SA')) {
      console.info('🎥 YouTube API not configured or using invalid demo key - using fallback mode');
      serviceStatus.setServiceStatus('youtube', false);
      return false;
    }

    try {
      // Only test if we have what looks like a real API key
      const response = await fetch(
        `${API_CONFIG.youtube.baseUrl}/search?part=snippet&q=test&key=${API_CONFIG.youtube.apiKey}&maxResults=1`
      );

      const success = response.ok;
      serviceStatus.setServiceStatus('youtube', success);
      return success;
    } catch (error) {
      console.info('YouTube connection test failed - using fallback mode:', error);
      serviceStatus.setServiceStatus('youtube', false);
      return false;
    }
  },

  async lastfm(): Promise<boolean> {
    // Skip API testing with known invalid keys
    if (!API_CONFIG.lastfm.apiKey || API_CONFIG.lastfm.apiKey.includes('8d3f0ac6611b0146296c5375c9634ef6')) {
      console.info('🎵 Last.fm API not configured or using invalid demo key - using fallback mode');
      serviceStatus.setServiceStatus('lastfm', false);
      return false;
    }

    try {
      // Only test if we have what looks like a real API key
      const response = await fetch(
        `${API_CONFIG.lastfm.baseUrl}/?method=track.search&track=test&api_key=${API_CONFIG.lastfm.apiKey}&format=json`
      );

      const success = response.ok;
      serviceStatus.setServiceStatus('lastfm', success);
      return success;
    } catch (error) {
      console.info('Last.fm connection test failed - using fallback mode:', error);
      serviceStatus.setServiceStatus('lastfm', false);
      return false;
    }
  },

  async all(): Promise<Record<string, boolean>> {
    const results = await Promise.allSettled([
      this.spotify(),
      this.supabase(),
      this.openai(),
      this.youtube(),
      this.lastfm(),
    ]);

    return {
      spotify: results[0].status === 'fulfilled' && results[0].value,
      supabase: results[1].status === 'fulfilled' && results[1].value,
      openai: results[2].status === 'fulfilled' && results[2].value,
      youtube: results[3].status === 'fulfilled' && results[3].value,
      lastfm: results[4].status === 'fulfilled' && results[4].value,
    };
  },
};

// Initialize configuration validation
validateApiConfig();
