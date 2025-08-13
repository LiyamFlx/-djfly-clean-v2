import { spotifyService } from '@/services/spotify';
import { openAIService } from '@/services/openai';
import { supabaseService } from '@/services/supabaseClient';
import { API_CONFIG } from '@/config/apiConfig';

export type ServiceName =
  | 'spotify'
  | 'openai'
  | 'supabase'
  | 'youtube'
  | 'lastfm';

export type ServiceStatus = 'connected' | 'disconnected' | 'degraded' | 'demo';

export interface HealthCheckResult {
  service: ServiceName;
  status: ServiceStatus;
  message: string;
}

/**
 * Checks the connection status of the Spotify API.
 */
export const testSpotifyConnection = async (): Promise<HealthCheckResult> => {
  if (
    !API_CONFIG.spotify.clientId ||
    API_CONFIG.spotify.clientId === 'demo_client_id'
  ) {
    return {
      service: 'spotify',
      status: 'demo',
      message: 'Running in Demo Mode',
    };
  }
  try {
    // A lightweight check to see if we can get genres
    const genres = await spotifyService.getAvailableGenres();
    if (genres.length > 0) {
      return {
        service: 'spotify',
        status: 'connected',
        message: 'Successfully connected',
      };
    }
    return {
      service: 'spotify',
      status: 'degraded',
      message: 'API returned empty data',
    };
  } catch (error) {
    return {
      service: 'spotify',
      status: 'disconnected',
      message: (error as Error).message,
    };
  }
};

/**
 * Checks the connection status of the OpenAI API.
 */
export const testOpenAIConnection = async (): Promise<HealthCheckResult> => {
  if (
    !API_CONFIG.openai.apiKey ||
    API_CONFIG.openai.apiKey === 'demo_openai_key'
  ) {
    return {
      service: 'openai',
      status: 'demo',
      message: 'Running in Demo Mode',
    };
  }
  // We can't easily "ping" OpenAI, so we check if it's configured.
  // A real request would be needed to confirm connectivity, which could be costly.
  if (openAIService.isConfigured()) {
    return {
      service: 'openai',
      status: 'connected',
      message: 'API is configured',
    };
  }
  return {
    service: 'openai',
    status: 'disconnected',
    message: 'API key is not configured',
  };
};

/**
 * Checks the connection status of the Supabase API.
 */
export const testSupabaseConnection = async (): Promise<HealthCheckResult> => {
  if (!API_CONFIG.supabase.url || API_CONFIG.supabase.url.includes('demo')) {
    return {
      service: 'supabase',
      status: 'demo',
      message: 'Running in Demo Mode',
    };
  }
  if (supabaseService.isOnline()) {
    return {
      service: 'supabase',
      status: 'connected',
      message: 'Successfully connected',
    };
  }
  return {
    service: 'supabase',
    status: 'disconnected',
    message: 'Connection to database failed',
  };
};

/**
 * Runs all API health checks.
 */
export const runAllHealthChecks = async (): Promise<HealthCheckResult[]> => {
  const results = await Promise.all([
    testSpotifyConnection(),
    testOpenAIConnection(),
    testSupabaseConnection(),
  ]);
  return results;
};
