// Re-export types from shared first
export * from './shared';
// Then re-export API-specific types (excluding duplicates)
export type {
  SpotifyApiConfig,
  OpenAIApiConfig,
  LastFMApiConfig,
  ApiConfig,
  ApiError,
} from './api';
// Session types
export * from './session';

// Legacy exports for backward compatibility
export type { Track, Playlist, User, AudioState } from './shared';
