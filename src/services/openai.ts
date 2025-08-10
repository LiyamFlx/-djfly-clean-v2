/**
 * Real OpenAI API Integration
 * Production-ready with proper authentication, error handling, and rate limiting
 */

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
    this.baseUrl = API_CONFIG.openai.baseUrl || 'https://api.openai.com/v1';

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
