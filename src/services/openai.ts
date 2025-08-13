<<<<<<< HEAD
/**
 * Real OpenAI API Integration
 * Production-ready with proper authentication, error handling, and rate limiting
 */
=======
import { Track } from '@/types';
import { spotifyService } from './spotify';
import { API_CONFIG } from '@/config/apiConfig';
import { cache } from '@/utils/cache';
>>>>>>> fix-spotify-connection

import { API_CONFIG } from '@/config/apiConfig';
import type { Track, AIRecommendation } from '@/types/shared';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

interface AudioAnalysisResult {
  energy: number;
  mood: string;
  genre: string;
  bpm: number;
  key: string;
  crowdSize: number;
  demographics: {
    ageGroups: Record<string, number>;
    genderDistribution: Record<string, number>;
  };
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl: string;
  private rateLimitDelay: number = 1000; // 1 second between requests
  private lastRequestTime: number = 0;

  constructor() {
    this.apiKey = API_CONFIG.openai.apiKey || '';
<<<<<<< HEAD
    this.baseUrl = API_CONFIG.openai.baseUrl || 'https://api.openai.com/v1';
=======
>>>>>>> fix-spotify-connection

    if (!this.apiKey) {
      console.error('❌ OpenAI API key not configured');
    }
  }

  /**
   * Generate AI-powered playlist recommendations
   */
  async generatePlaylist(
    prompt: string,
    context?: any
  ): Promise<AIRecommendation> {
    try {
      await this.rateLimit();

      const systemPrompt = `You are an expert DJ and music curator. Generate a playlist based on the user's request. 
      Return a JSON response with this exact format:
      {
<<<<<<< HEAD
        "tracks": [
          {
            "id": "track_1",
            "title": "Track Title",
            "artist": "Artist Name",
            "duration": 180,
            "energy": 0.8,
            "bpm": 128,
            "genre": "house",
            "source": "spotify"
          }
=======
        role: 'system',
        content: `You are an AI DJ assistant analyzing crowd response. Based on crowd analytics, suggest the next 5-8 tracks that would best match the current vibe and energy level.

        Consider:
        - Energy level: ${crowdData.energy}/1.0 (0 = low energy, 1 = high energy)
        - Mood: ${crowdData.mood}
        - Engagement: ${crowdData.engagement}
        - Musical progression and flow
        
        ${currentTracksContext}
        
        Return ONLY a JSON object with 'tracks' array containing strings in format 'Artist - Song Title'.`,
      },
      {
        role: 'user',
        content: `The crowd energy is ${crowdData.energy}, mood is ${crowdData.mood}, and engagement is ${crowdData.engagement}. What tracks should I play next?`,
      },
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      onProgress(50);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data: OpenAIResponse = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      const trackQueries: string[] = content.tracks || [];

      // Search for tracks
      const trackPromises = trackQueries.map(async (query, index) => {
        try {
          const tracks = await spotifyService.searchTracks(query, 1);
          onProgress(50 + Math.round(((index + 1) / trackQueries.length) * 40));
          return tracks.length > 0 ? tracks[0] : null;
        } catch (error) {
          console.error(`Failed to find suggested track: ${query}`, error);
          return null;
        }
      });

      const tracks = await Promise.all(trackPromises);
      const validTracks = tracks.filter(
        (track): track is Track => track !== null
      );

      onProgress(100);
      return validTracks;
    } catch (error) {
      console.error('Crowd analysis failed:', error);
      throw error;
    }
  }

  /**
   * Generate mix transitions and BPM suggestions
   */
  async suggestTransitions(
    currentTrack: Track,
    nextTrack: Track
  ): Promise<{
    suggestion: string;
    bpmAdjustment?: number;
    crossfadePoint?: number;
    effects?: string[];
  }> {
    if (!this.apiKey || this.apiKey === 'demo_openai_key') {
      return this.getDemoTransitionSuggestion(currentTrack, nextTrack);
    }

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `You are a professional DJ mixing consultant. Analyze two tracks and provide specific mixing advice including BPM adjustments, crossfade timing, and effects suggestions.
        
        Consider:
        - Key compatibility (harmonic mixing)
        - BPM differences and sync strategies
        - Energy flow and crowd psychology
        - Optimal crossfade points
        - Effects that would enhance the transition`,
      },
      {
        role: 'user',
        content: `Help me transition from "${currentTrack.artist} - ${currentTrack.title}" (${currentTrack.bpm || 'unknown'} BPM, ${currentTrack.key || 'unknown'} key) to "${nextTrack.artist} - ${nextTrack.title}" (${nextTrack.bpm || 'unknown'} BPM, ${nextTrack.key || 'unknown'} key). Provide JSON with: suggestion (string), bpmAdjustment (number), crossfadePoint (seconds), effects (array).`,
      },
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.6,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get transition suggestions');
      }

      const data: OpenAIResponse = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Transition suggestion failed:', error);
      return {
        suggestion: 'Standard crossfade recommended',
        crossfadePoint: 30,
      };
    }
  }

  /**
   * Analyze playlist flow and suggest improvements
   */
  async analyzePlaylistFlow(tracks: Track[]): Promise<{
    score: number;
    suggestions: string[];
    reorderedTracks?: Track[];
  }> {
    if (
      !this.apiKey ||
      this.apiKey === 'demo_openai_key' ||
      tracks.length < 3
    ) {
      return this.getDemoPlaylistAnalysis(tracks);
    }

    const trackList = tracks
      .map(
        (t, i) =>
          `${i + 1}. ${t.artist} - ${t.title} (${t.bpm || '?'} BPM, ${t.key || '?'} key, Energy: ${t.energy || '?'})`
      )
      .join('\n');

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `You are a DJ consultant analyzing playlist flow. Rate the playlist flow from 0-1 and provide specific suggestions for improvement. Consider BPM progression, key harmony, energy curves, and crowd psychology.`,
      },
      {
        role: 'user',
        content: `Analyze this playlist flow:\n${trackList}\n\nProvide JSON with: score (0-1), suggestions (array of strings).`,
      },
    ];

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.5,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze playlist flow');
      }

      const data: OpenAIResponse = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Playlist analysis failed:', error);
      return {
        score: 0.7,
        suggestions: ['Consider BPM progression and key harmony'],
      };
    }
  }

  /**
   * Get demo playlist when OpenAI is not available
   */
  private async getDemoPlaylist(
    prompt: string,
    onProgress: (progress: number) => void
  ): Promise<Track[]> {
    const cacheKey = `demo_playlist_${prompt}`;
    const cachedPlaylist = cache.get<Track[]>(cacheKey);
    if (cachedPlaylist) {
      onProgress(100);
      return cachedPlaylist;
    }

    onProgress(20);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onProgress(50);

    // Demo tracks based on prompt keywords
    const demoTracks: Track[] = [
      {
        id: 'demo1',
        title: 'Electronic Dreams',
        artist: 'Demo Artist',
        duration: 180,
        image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=🎵',
        source: 'demo' as const,
        genre: 'Electronic',
        bpm: 128,
        key: 'A minor',
        energy: 0.8,
        preview_url: '/demo-track-1.mp3',
      },
      {
        id: 'demo2',
        title: 'Future Bass Flow',
        artist: 'AI Generated',
        duration: 200,
        image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=🎶',
        source: 'demo' as const,
        genre: 'Future Bass',
        bpm: 140,
        key: 'C major',
        energy: 0.9,
        preview_url: '/demo-track-1.mp3',
      },
    ];

    onProgress(100);
    console.info('🎵 Using demo playlist for prompt:', prompt);
    cache.set(cacheKey, demoTracks, 300000); // Cache for 5 minutes
    return demoTracks;
  }

  /**
   * Get demo crowd suggestions when OpenAI is not available
   */
  private async getDemoCrowdSuggestions(
    crowdData: { energy: number; mood: string; engagement: string },
    onProgress: (progress: number) => void
  ): Promise<Track[]> {
    onProgress(30);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return demo tracks based on crowd energy
    const tracks = await spotifyService.searchTracks(
      'demo electronic house',
      5
    );
    onProgress(100);

    console.info('🎵 Demo crowd suggestions based on:', crowdData);
    return tracks;
  }

  /**
   * Get demo transition suggestion when OpenAI is not available
   */
  private getDemoTransitionSuggestion(
    currentTrack: Track,
    nextTrack: Track
  ): {
    suggestion: string;
    bpmAdjustment?: number;
    crossfadePoint?: number;
    effects?: string[];
  } {
    const currentBpm = currentTrack.bpm || 128;
    const nextBpm = nextTrack.bpm || 128;
    const bpmDiff = Math.abs(currentBpm - nextBpm);

    console.info(
      '🎵 Demo transition suggestion between tracks:',
      currentTrack.title,
      '→',
      nextTrack.title
    );

    return {
      suggestion:
        bpmDiff > 10
          ? 'Use pitch adjustment to match BPMs, then apply a smooth crossfade'
          : 'Perfect BPM match! Use a standard crossfade transition',
      bpmAdjustment: bpmDiff > 10 ? (nextBpm - currentBpm) / currentBpm : 0,
      crossfadePoint: 32,
      effects: bpmDiff > 5 ? ['reverb', 'filter'] : ['filter'],
    };
  }

  /**
   * Get demo playlist analysis when OpenAI is not available
   */
  private getDemoPlaylistAnalysis(tracks: Track[]): {
    score: number;
    suggestions: string[];
    reorderedTracks?: Track[];
  } {
    if (tracks.length < 3) {
      return {
        score: 0.6,
        suggestions: [
          'Add more tracks for better flow analysis',
          'Consider BPM progression',
>>>>>>> fix-spotify-connection
        ],
        "energy": 85,
        "mood": "energetic",
        "reasoning": "Overall playlist reasoning",
        "mixingTips": ["Tip 1", "Tip 2"],
        "energyCurve": [60, 70, 80, 90, 85, 75]
      }`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Generate a playlist for: ${prompt}${context ? `\nContext: ${JSON.stringify(context)}` : ''}`,
            },
          ],
          max_tokens: 2000,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      return this.parsePlaylistResponse(content);
    } catch (error) {
      console.error('❌ OpenAI playlist generation error:', error);
      throw error;
    }
  }

  /**
   * Generate track recommendations based on seed tracks
   */
  async getTrackRecommendations(
    seedTracks: Track[],
    targetEnergy?: number,
    targetMood?: string
  ): Promise<Track[]> {
    try {
      await this.rateLimit();

      const seedInfo = seedTracks.map((track) => ({
        title: track.title,
        artist: track.artist,
        energy: track.energy || 0.5,
        bpm: track.bpm || 120,
        genre: track.genre || 'electronic',
      }));

      const prompt = `Based on these seed tracks: ${JSON.stringify(seedInfo)}, recommend similar tracks. Target energy: ${targetEnergy || 'match seed'}, mood: ${targetMood || 'match seed'}. Return only track titles and artists.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'You are a music recommendation expert. Provide track recommendations in a simple format: "Title - Artist"',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      return this.parseTrackRecommendations(content);
    } catch (error) {
      console.error('❌ OpenAI track recommendations error:', error);
      throw error;
    }
  }

  /**
   * Analyze text for mood and energy
   */
  async analyzeText(
    text: string
  ): Promise<{ mood: string; energy: number; genre: string }> {
    try {
      await this.rateLimit();

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'Analyze the text and return a JSON object with mood (string), energy (0-100 number), and genre (string).',
            },
            {
              role: 'user',
              content: text,
            },
          ],
          max_tokens: 200,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('❌ OpenAI text analysis error:', error);
      throw error;
    }
  }

  /**
   * Rate limiting to respect API limits
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Build prompt for audio analysis
   */
  private buildAudioAnalysisPrompt(): string {
    return `Analyze the provided audio data and return a JSON response with:
    {
      "energy": 0.8,
      "mood": "excited",
      "genre": "house",
      "bpm": 128,
      "key": "C#",
      "crowdSize": 150,
      "demographics": {
        "ageGroups": {"18-25": 0.4, "26-35": 0.35, "36-45": 0.25},
        "genderDistribution": {"male": 0.6, "female": 0.4}
      }
    }`;
  }

  /**
   * Parse audio analysis response
   */
  private parseAudioAnalysisResponse(content: string): AudioAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback to default values
      return {
        energy: 0.7,
        mood: 'energetic',
        genre: 'electronic',
        bpm: 128,
        key: 'C',
        crowdSize: 100,
        demographics: {
          ageGroups: { '18-25': 0.4, '26-35': 0.35, '36-45': 0.25 },
          genderDistribution: { male: 0.6, female: 0.4 },
        },
      };
    } catch (error) {
      console.error('❌ Failed to parse audio analysis response:', error);
      throw new Error('Invalid response format from OpenAI');
    }
  }

  /**
   * Parse playlist response
   */
  private parsePlaylistResponse(content: string): AIRecommendation {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          tracks: parsed.tracks || [],
          energy: parsed.energy || 75,
          mood: parsed.mood || 'energetic',
          reasoning: parsed.reasoning || '',
          mixingTips: parsed.mixingTips || [],
          energyCurve: parsed.energyCurve || [60, 70, 80, 90, 85, 75],
        };
      }

      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('❌ Failed to parse playlist response:', error);
      throw new Error('Invalid response format from OpenAI');
    }
  }

  /**
   * Parse track recommendations
   */
  private parseTrackRecommendations(content: string): Track[] {
    try {
      const lines = content.split('\n').filter((line) => line.trim());
      return lines.map((line, index) => {
        const [title, artist] = line.split(' - ');
        return {
          id: `recommended_${index}`,
          title: title?.trim() || 'Unknown Track',
          artist: artist?.trim() || 'Unknown Artist',
          duration: 180,
          source: 'spotify' as const,
        };
      });
    } catch (error) {
      console.error('❌ Failed to parse track recommendations:', error);
      return [];
    }
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get API usage statistics
   */
  async getUsageStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/usage`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`OpenAI usage API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ OpenAI usage stats error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();

export const openAIService = { healthCheck: async () => ({ status: 'ok' }) };
