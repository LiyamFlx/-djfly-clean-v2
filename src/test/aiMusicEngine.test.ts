import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AIMusicEngine, AIPlaylistRequest } from '@/services/aiMusicEngine';

// Mock the config to provide a dummy API key for all tests
// This forces the engine to attempt a fetch, which we can then intercept.
vi.mock('@/config/apiConfig', () => ({
  API_CONFIG: {
    openai: {
      apiKey: 'fake_api_key',
      baseUrl: 'https://api.openai.com/v1',
    },
  },
}));

// Mock the music library to have predictable data
vi.mock('@/services/musicLibrary', () => ({
  MUSIC_LIBRARY: [
    {
      id: 'track1',
      title: 'Mock Track 1',
      artist: 'Mock Artist 1',
      genre: 'Electronic',
      bpm: 128,
      key: 'A minor',
      energy: 0.8,
    },
    {
      id: 'track2',
      title: 'Mock Track 2',
      artist: 'Mock Artist 2',
      genre: 'House',
      bpm: 125,
      key: 'C major',
      energy: 0.7,
    },
  ],
}));

describe('AIMusicEngine', () => {
  let fetchSpy: any;

  beforeEach(() => {
    // Suppress console logs
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate a fallback playlist when the OpenAI API call fails', async () => {
    fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.reject(new Error('API is down'));
    });

    const engine = new AIMusicEngine();
    const request: AIPlaylistRequest = { prompt: 'Test prompt' };
    const recommendation = await engine.generateIntelligentPlaylist(request);

    expect(fetchSpy).toHaveBeenCalled();
    expect(recommendation).toBeDefined();
    expect(recommendation.tracks.length).toBeGreaterThan(0);
    expect(recommendation.reasoning).toContain('fallback selection');
  });

  it('should successfully call OpenAI API and return a mapped playlist', async () => {
    const mockApiResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                function_call: {
                  arguments: JSON.stringify({
                    tracks: [
                      {
                        title: 'Mock Track 1',
                        artist: 'Mock Artist 1',
                        genre: 'Electronic',
                      },
                    ],
                    reasoning: 'This is a test reason.',
                    energyCurve: [50, 75],
                    mixingTips: ['Test tip'],
                  }),
                },
              },
            },
          ],
        }),
    };

    fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(mockApiResponse as Response);

    const engine = new AIMusicEngine();
    const request: AIPlaylistRequest = { prompt: 'Test prompt' };
    const recommendation = await engine.generateIntelligentPlaylist(request);

    expect(fetchSpy).toHaveBeenCalled();
    expect(recommendation).toBeDefined();
    expect(recommendation.tracks.length).toBeGreaterThan(0);
    expect(recommendation.tracks[0].id).toBe('track1'); // Check that it mapped to our mock library
    expect(recommendation.reasoning).toBe('This is a test reason.');
  });
});
