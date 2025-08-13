import { Track } from '@/types';
import { spotifyService } from './spotify';
import { API_CONFIG } from '@/config/apiConfig';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = API_CONFIG.openai.apiKey || '';

    if (!this.apiKey || this.apiKey === 'demo_openai_key') {
      console.warn(
        '🤖 OpenAI API not configured. Using demo mode for AI features.'
      );
    } else {
      console.log('🤖 OpenAI service initialized');
    }
  }

  /**
   * Generate a playlist based on text prompt
   */
  async generatePlaylist(
    prompt: string,
    onProgress: (progress: number) => void
  ): Promise<Track[]> {
    if (!this.apiKey || this.apiKey === 'demo_openai_key') {
      console.warn('🤖 OpenAI API not available, returning demo playlist');
      return this.getDemoPlaylist(prompt, onProgress);
    }

    onProgress(10);

    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are a world-class DJ and music curator with deep knowledge of electronic music, hip-hop, pop, rock, and all genres. 
          
          Based on the user's prompt, generate a cohesive playlist of 10-15 tracks that would work well together in a DJ set. Consider:
          - Musical flow and energy progression
          - BPM compatibility for mixing
          - Genre coherence while allowing for tasteful transitions
          - Current popular tracks and classics that work well together
          
          Return ONLY a JSON object with a single key 'playlist' containing an array of strings in the format 'Artist - Song Title'.
          Do not include any explanations, just the JSON.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

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
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      onProgress(40);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data: OpenAIResponse = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      const trackQueries: string[] = content.playlist || [];

      onProgress(60);

      // Search for tracks on Spotify
      const trackPromises = trackQueries.map(async (query, index) => {
        try {
          const tracks = await spotifyService.searchTracks(query, 1);
          const track = tracks.length > 0 ? tracks[0] : null;

          onProgress(60 + Math.round(((index + 1) / trackQueries.length) * 35));
          return track;
        } catch (error) {
          console.error(`Failed to find track: ${query}`, error);
          return null;
        }
      });

      const tracks = await Promise.all(trackPromises);
      const validTracks = tracks.filter(
        (track): track is Track => track !== null
      );

      // Enhance tracks with audio features
      onProgress(95);
      const enhancedTracks =
        await spotifyService.getTracksWithFeatures(validTracks);

      onProgress(100);
      return enhancedTracks;
    } catch (error) {
      console.error('OpenAI playlist generation failed:', error);
      throw error;
    }
  }

  /**
   * Analyze crowd mood and suggest tracks
   */
  async analyzeCrowdAndSuggest(
    crowdData: {
      energy: number;
      mood: string;
      engagement: string;
      currentTracks?: Track[];
    },
    onProgress: (progress: number) => void
  ): Promise<Track[]> {
    if (!this.apiKey || this.apiKey === 'demo_openai_key') {
      console.warn('🤖 OpenAI not available, returning demo crowd suggestions');
      return this.getDemoCrowdSuggestions(crowdData, onProgress);
    }

    onProgress(10);

    const currentTracksContext = crowdData.currentTracks
      ? `Currently playing tracks: ${crowdData.currentTracks.map((t) => `${t.artist} - ${t.title}`).join(', ')}`
      : '';

    const messages: OpenAIMessage[] = [
      {
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
        ],
      };
    }

    // Basic analysis based on BPM progression
    const bpms = tracks.map((t) => t.bpm || 128);
    const avgBpm = bpms.reduce((a, b) => a + b, 0) / bpms.length;
    const bpmVariance =
      bpms.reduce((sum, bpm) => sum + Math.pow(bpm - avgBpm, 2), 0) /
      bpms.length;

    const score = Math.max(0.5, Math.min(0.95, 1 - bpmVariance / 1000));

    console.info(
      '🎵 Demo playlist analysis for',
      tracks.length,
      'tracks, score:',
      score
    );

    return {
      score,
      suggestions: [
        score < 0.7
          ? 'Consider smoother BPM transitions between tracks'
          : 'Good BPM flow!',
        'Try grouping tracks by key for harmonic mixing',
        'Consider the energy curve throughout the set',
      ],
    };
  }

  /**
   * Check if OpenAI is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'demo_openai_key';
  }
}

export const openAIService = new OpenAIService();
export default openAIService;
