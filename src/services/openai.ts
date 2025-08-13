/**
 * OpenAI API Service
 * Handles AI-powered music recommendations and analysis
 */

import type { Track } from '@/types';

export interface AIRecommendation {
  tracks: Track[];
  reasoning?: string;
  confidence?: number;
}

export interface MoodAnalysis {
  mood: string;
  energy: number;
  recommendations: string[];
  confidence: number;
}

export interface CrowdData {
  energy: number;
  mood: string;
  engagement: number;
}

class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'demo-key';
  }

  /**
   * Rate limiting for API calls
   */
  private async rateLimit(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
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

      // In demo mode, return mock recommendations
      if (!this.apiKey || this.apiKey === 'demo-key') {
        return this.getMockRecommendation(prompt);
      }

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
        ]
      }`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      try {
        const parsed = JSON.parse(content);
        return {
          tracks: parsed.tracks || [],
          reasoning: parsed.reasoning,
          confidence: 0.8,
        };
      } catch (parseError) {
        console.warn('Failed to parse OpenAI response, using fallback');
        return this.getMockRecommendation(prompt);
      }
    } catch (error) {
      console.warn('OpenAI API failed, using mock data:', error);
      return this.getMockRecommendation(prompt);
    }
  }

  /**
   * Analyze crowd mood and energy
   */
  async analyzeMood(crowdData: CrowdData): Promise<MoodAnalysis> {
    try {
      await this.rateLimit();

      // In demo mode, return mock analysis
      if (!this.apiKey || this.apiKey === 'demo-key') {
        return this.getMockMoodAnalysis(crowdData);
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are an AI DJ assistant analyzing crowd mood. Return JSON with mood analysis.',
            },
            {
              role: 'user',
              content: `Analyze this crowd: energy=${crowdData.energy}, mood=${crowdData.mood}, engagement=${crowdData.engagement}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.getMockMoodAnalysis(crowdData);
      }
    } catch (error) {
      console.warn('OpenAI mood analysis failed, using mock data:', error);
      return this.getMockMoodAnalysis(crowdData);
    }
  }

  /**
   * Generate mock recommendations for demo mode
   */
  private getMockRecommendation(prompt: string): AIRecommendation {
    const mockTracks: Track[] = [
      {
        id: 'mock-1',
        title: 'Summer Vibes',
        artist: 'DJ Nova',
        duration: 210,
        bpm: 128,
        genre: 'House',
        image: '/api/placeholder/300/300',
        source: 'demo',
      },
      {
        id: 'mock-2',
        title: 'Night Drive',
        artist: 'Echo Beats',
        duration: 195,
        bpm: 124,
        genre: 'Deep House',
        image: '/api/placeholder/300/300',
        source: 'demo',
      },
      {
        id: 'mock-3',
        title: 'Electric Dreams',
        artist: 'Synth Wave',
        duration: 188,
        bpm: 132,
        genre: 'Electronic',
        image: '/api/placeholder/300/300',
        source: 'demo',
      },
    ];

    const selectedTracks = mockTracks.slice(
      0,
      Math.floor(Math.random() * 2) + 2
    );

    return {
      tracks: selectedTracks,
      reasoning: `Generated ${selectedTracks.length} tracks based on: "${prompt}"`,
      confidence: 0.85,
    };
  }

  /**
   * Generate mock mood analysis for demo mode
   */
  private getMockMoodAnalysis(crowdData: CrowdData): MoodAnalysis {
    const moods = ['energetic', 'chill', 'progressive', 'peak-time', 'deep'];
    const mood = moods[Math.floor(Math.random() * moods.length)];

    return {
      mood,
      energy: crowdData.energy,
      recommendations: [
        'Increase tempo gradually',
        'Add more bass elements',
        'Layer in vocal hooks',
      ],
      confidence: 0.8,
    };
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
export const openAIService = openaiService; // Alias for compatibility
export default openaiService;
