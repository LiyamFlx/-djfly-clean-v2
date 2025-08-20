import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AIMusicEngine } from '@/services/aiMusicEngine';

// Mock the config to provide a dummy API key for all tests
vi.mock('@/config/apiConfig', () => ({
  API_CONFIG: {
    openai: {
      apiKey: 'fake_api_key',
      baseUrl: 'https://api.openai.com/v1',
    },
  },
}));

describe('AIMusicEngine', () => {
  let fetchSpy: any;
  let aiEngine: AIMusicEngine;

  beforeEach(() => {
    // Suppress console logs
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    aiEngine = new AIMusicEngine();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create an instance', () => {
    expect(aiEngine).toBeInstanceOf(AIMusicEngine);
  });

  it('should generate a fallback playlist when the OpenAI API call fails', async () => {
    // Mock fetch to simulate API failure
    fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockRejectedValue(new Error('API Error'));

    const request = {
      prompt: 'Generate an upbeat house playlist',
      mood: 'energetic' as const,
      crowdEnergy: 0.8,
      timeOfDay: 'evening' as const,
      venue: 'club' as const,
      duration: 60,
    };

    const result = await aiEngine.generateIntelligentPlaylist(request);

    expect(result).toBeDefined();
    expect(result.tracks).toBeInstanceOf(Array);
    expect(result.tracks.length).toBeGreaterThan(0);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should handle successful API response', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              tracks: [
                { id: 'test1', title: 'Test Track 1', artist: 'Test Artist 1' },
                { id: 'test2', title: 'Test Track 2', artist: 'Test Artist 2' },
              ],
              reasoning: 'Test reasoning',
            }),
          },
        },
      ],
    };

    fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const request = {
      prompt: 'Generate a chill playlist',
      mood: 'chill' as const,
      crowdEnergy: 0.5,
      timeOfDay: 'afternoon' as const,
      venue: 'lounge' as const,
      duration: 45,
    };

    const result = await aiEngine.generateIntelligentPlaylist(request);

    expect(result).toBeDefined();
    expect(result.tracks).toBeInstanceOf(Array);
    expect(result.reasoning).toBe('Test reasoning');
    expect(fetchSpy).toHaveBeenCalled();
  });
});
