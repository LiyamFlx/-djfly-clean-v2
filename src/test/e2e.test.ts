import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the entire config module. This happens before any other imports.
// Vitest hoists this to the top of the file.
vi.mock('@/config/apiConfig', async (importOriginal) => {
  const originalConfig = await importOriginal();
  return {
    ...originalConfig, // Keep original serviceStatus etc. if needed
    API_CONFIG: {
      spotify: {
        clientId: 'demo_client_id',
        clientSecret: 'demo_client_secret',
      },
      openai: {
        apiKey: 'demo_openai_key',
        orgId: 'demo_org_id',
      },
      supabase: {
        url: 'demo_url',
        anonKey: 'demo_anon_key',
      },
      // Add other necessary mock configs
      youtube: { apiKey: 'demo_youtube_key' },
      lastfm: { apiKey: 'demo_lastfm_key' },
      googleStudio: { apiKey: 'demo_google_studio_key' },
    },
  };
});

// Now, import the services. They will be initialized using the mocked config.
import { spotifyService } from '../services/spotify';
import { openAIService } from '../services/openai';
import { supabaseService } from '../services/supabaseClient';


describe('E2E Demo & Fallback Tests', () => {

  beforeEach(() => {
    // Suppress console logs for cleaner test output
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Spotify service should return demo search results in demo mode', async () => {
    const tracks = await spotifyService.searchTracks('any query');
    expect(tracks).toBeInstanceOf(Array);
    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks[0].artist).toBe('DJ Demo');
  });

  it('OpenAI service should return a demo playlist in demo mode', async () => {
    const onProgress = vi.fn();
    const playlist = await openAIService.generatePlaylist('any prompt', onProgress);
    expect(playlist).toBeInstanceOf(Array);
    expect(playlist.length).toBeGreaterThan(0);
    expect(playlist[0].artist).toBe('Demo Artist');
    expect(onProgress).toHaveBeenCalled();
  });

  it('Supabase service should use localStorage as a fallback when in demo mode', async () => {
    const userId = 'test-user-e2e-123';
    const storageKey = `djfly_preferences_${userId}`;
    const mockPreferences = { theme: 'dark', volume: 80, lastPlayed: null };

    // Because we mocked the config, the global supabaseService instance
    // should already be in its offline/localStorage mode.

    localStorage.removeItem(storageKey);
    expect(localStorage.getItem(storageKey)).toBeNull();

    await supabaseService.saveUserPreferences(userId, mockPreferences);

    const storedItem = localStorage.getItem(storageKey);
    expect(storedItem).not.toBeNull();
    expect(JSON.parse(storedItem!)).toEqual(mockPreferences);

    const retrievedPrefs = await supabaseService.getUserPreferences(userId);
    expect(retrievedPrefs).toEqual(mockPreferences);

    localStorage.removeItem(storageKey);
  });

});
