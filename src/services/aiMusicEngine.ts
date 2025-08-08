/**
 * AI-Powered Music Discovery Engine
 * Uses OpenAI to provide intelligent track recommendations and playlist generation
 */

import { API_CONFIG } from '@/config/apiConfig';
import type { Track } from '@/types';
import { musicLibrary } from '@/services/musicLibrary';

interface AIPlaylistRequest {
  prompt: string;
  mood?: 'energetic' | 'chill' | 'progressive' | 'mixed';
  genre?: string;
  bpmRange?: { min: number; max: number };
  duration?: number; // minutes
  currentTrack?: Track;
  previousTracks?: Track[];
  crowdEnergy?: number; // 0-100
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'late-night';
  venue?: 'club' | 'lounge' | 'festival' | 'radio' | 'workout';
}

import type { AIRecommendation } from '@/types/shared';

interface MoodAnalysis {
  energy: number; // 0-100
  valence: number; // 0-100 (negative to positive)
  danceability: number; // 0-100
  dominantGenre: string;
  suggestedBPM: number;
  description: string;
}

interface CacheItem {
  data: AIRecommendation | MoodAnalysis;
  timestamp: number;
}

class AIMusicEngine {
  private apiKey: string;
  private baseUrl: string;
  private cache = new Map<string, CacheItem>();
  private cacheExpiry = 10 * 60 * 1000; // 10 minutes

  constructor() {
    this.apiKey = API_CONFIG.openai.apiKey || '';
    this.baseUrl = API_CONFIG.openai.baseUrl;

    if (!this.apiKey) {
      console.warn(
        '⚠️ OpenAI API key not configured. AI features will use fallback logic.'
      );
    } else {
      console.log('✅ OpenAI API key configured');
    }
  }

  /**
   * Generate intelligent playlist based on complex criteria
   */
  async generateIntelligentPlaylist(
    request: AIPlaylistRequest
  ): Promise<AIRecommendation> {
    const cacheKey = this.generateCacheKey('playlist', request);
    const cached = this.getFromCache(cacheKey);
    if (cached && 'tracks' in cached) return cached as AIRecommendation;

    try {
      if (!this.apiKey) {
        console.warn(
          '⚠️ OpenAI API key not configured, using fallback playlist'
        );
        return this.generateFallbackPlaylist(request);
      }

      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(request);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 1500,
          functions: [
            {
              name: 'create_dj_playlist',
              description:
                'Create a DJ playlist with track recommendations and mixing advice',
              parameters: {
                type: 'object',
                properties: {
                  tracks: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        artist: { type: 'string' },
                        genre: { type: 'string' },
                        bpm: { type: 'number' },
                        key: { type: 'string' },
                        energy: {
                          type: 'string',
                          enum: ['low', 'medium', 'high'],
                        },
                      },
                    },
                  },
                  reasoning: { type: 'string' },
                  energyCurve: { type: 'array', items: { type: 'number' } },
                  mixingTips: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          ],
          function_call: { name: 'create_dj_playlist' },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const functionCall = data.choices[0].message.function_call;
      const aiResult = JSON.parse(functionCall.arguments);

      // Map AI suggestions to actual tracks from our library
      const recommendation = this.mapAIResultToTracks(aiResult);

      this.setCache(cacheKey, recommendation);
      return recommendation;
    } catch (error) {
      console.warn('AI playlist generation failed, using fallback:', error);
      return this.generateFallbackPlaylist(request);
    }
  }

  /**
   * Analyze mood from text prompt or current context
   */
  async analyzeMood(input: string): Promise<MoodAnalysis> {
    const cacheKey = this.generateCacheKey('mood', { input });
    const cached = this.getFromCache(cacheKey);
    if (cached && 'energy' in cached && 'valence' in cached) return cached as MoodAnalysis;

    try {
      if (!this.apiKey) {
        return this.analyzeMoodFallback(input);
      }

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
              content: `You are a professional DJ and music psychologist. Analyze the mood and energy of the given text or context and provide specific musical recommendations.`,
            },
            {
              role: 'user',
              content: `Analyze the mood and musical requirements for: "${input}"`,
            },
          ],
          functions: [
            {
              name: 'analyze_mood',
              description: 'Analyze musical mood and energy requirements',
              parameters: {
                type: 'object',
                properties: {
                  energy: { type: 'number', minimum: 0, maximum: 100 },
                  valence: { type: 'number', minimum: 0, maximum: 100 },
                  danceability: { type: 'number', minimum: 0, maximum: 100 },
                  dominantGenre: { type: 'string' },
                  suggestedBPM: { type: 'number' },
                  description: { type: 'string' },
                },
              },
            },
          ],
          function_call: { name: 'analyze_mood' },
        }),
      });

      const data = await response.json();
      const analysis = JSON.parse(
        data.choices[0].message.function_call.arguments
      );

      this.setCache(cacheKey, analysis);
      return analysis;
    } catch (error) {
      console.warn('AI mood analysis failed, using fallback:', error);
      return this.analyzeMoodFallback(input);
    }
  }

  /**
   * Get next track recommendations based on current playing context
   */
  async getNextTrackRecommendations(
    currentTrack: Track,
    previousTracks: Track[],
    crowdEnergy: number = 50
  ): Promise<Track[]> {
    const context = {
      current: currentTrack,
      previous: previousTracks.slice(-3), // Last 3 tracks
      crowdEnergy,
      prompt: `Continue the set flow from ${currentTrack.title} by ${currentTrack.artist} (${currentTrack.genre}, ${currentTrack.bpm} BPM)`,
    };

    const recommendation = await this.generateIntelligentPlaylist(context);
    return (
      recommendation.nextTrackSuggestions || recommendation.tracks.slice(0, 5)
    );
  }

  /**
   * Simulate crowd response using AI
   */
  async simulateCrowdResponse(
    currentTrack: Track,
    previousTracks: Track[],
    venue: string = 'club'
  ): Promise<{
    energy: number;
    response: string;
    suggestions: string[];
  }> {
    try {
      if (!this.apiKey) {
        return this.simulateCrowdResponseFallback(currentTrack, venue);
      }

      const trackHistory = previousTracks
        .slice(-5)
        .map((t) => `${t.title} by ${t.artist} (${t.genre})`)
        .join(', ');

      const prompt = `As a professional DJ reading crowd energy at a ${venue}, analyze the crowd response to playing "${currentTrack.title}" by ${currentTrack.artist} (${currentTrack.genre || 'unknown genre'}, ${currentTrack.bpm || 120} BPM, ${currentTrack.key || 'unknown'} key) after recently playing: ${trackHistory}`;

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
                'You are an expert DJ who can read crowd energy. Provide realistic crowd response analysis.',
            },
            { role: 'user', content: prompt },
          ],
          functions: [
            {
              name: 'analyze_crowd_response',
              parameters: {
                type: 'object',
                properties: {
                  energy: { type: 'number', minimum: 0, maximum: 100 },
                  response: { type: 'string' },
                  suggestions: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          ],
          function_call: { name: 'analyze_crowd_response' },
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.function_call.arguments);
    } catch {
      return this.simulateCrowdResponseFallback(currentTrack, venue);
    }
  }

  /**
   * Private helper methods
   */
  private buildSystemPrompt(): string {
    return `You are an AI DJ assistant with deep knowledge of electronic music, crowd psychology, and professional DJ techniques. 

Your expertise includes:
- Music theory: BPM matching, key compatibility, energy progression
- Genre knowledge: House, Techno, Trance, Progressive, Ambient, and subgenres
- Crowd psychology: Reading energy, building atmosphere, creating journeys
- DJ techniques: Harmonic mixing, energy curves, transition strategies

Available music library genres: ${this.getAvailableGenres().join(', ')}
BPM range in library: 95-140 BPM
Available keys: All major and minor keys

Create playlists that:
1. Maintain natural energy flow
2. Use compatible BPM transitions (+/- 10 BPM or double/half time)
3. Consider harmonic compatibility (Circle of Fifths)
4. Build emotional journeys appropriate to the context
5. Provide practical mixing advice`;
  }

  private buildUserPrompt(request: AIPlaylistRequest): string {
    let prompt = `Create a DJ playlist for: "${request.prompt}"`;

    if (request.mood) prompt += `\nMood: ${request.mood}`;
    if (request.genre) prompt += `\nGenre preference: ${request.genre}`;
    if (request.bpmRange)
      prompt += `\nBPM range: ${request.bpmRange.min}-${request.bpmRange.max}`;
    if (request.duration)
      prompt += `\nTarget duration: ${request.duration} minutes`;
    if (request.venue) prompt += `\nVenue type: ${request.venue}`;
    if (request.timeOfDay) prompt += `\nTime of day: ${request.timeOfDay}`;
    if (request.crowdEnergy)
      prompt += `\nCrowd energy level: ${request.crowdEnergy}/100`;

    if (request.currentTrack) {
      prompt += `\nCurrent track: ${request.currentTrack.title} by ${request.currentTrack.artist} (${request.currentTrack.bpm || 'unknown'} BPM, ${request.currentTrack.key || 'unknown'} key)`;
    }

    if (request.previousTracks?.length) {
      const recent = request.previousTracks.slice(-3);
      prompt += `\nRecent tracks: ${recent.map((t) => `${t.title} by ${t.artist}`).join(', ')}`;
    }

    prompt += `\n\nProvide 8-10 track suggestions that create a cohesive journey, with reasoning for the selection and mixing tips for smooth transitions.`;

    return prompt;
  }

  private mapAIResultToTracks(aiResult: any): AIRecommendation {
    const tracks: Track[] = [];
    const trackPool = [...musicLibrary.getAllTracks()];

    // Map AI suggestions to closest matches in our library
    for (const suggestion of (aiResult as any).tracks || []) {
      const match = this.findBestTrackMatch(suggestion, trackPool);
      if (match) {
        tracks.push(match);
        // Remove from pool to avoid duplicates
        const index = trackPool.findIndex((t) => t.id === match.id);
        if (index > -1) trackPool.splice(index, 1);
      }
    }

    // Fill remaining slots if needed
    while (tracks.length < 8 && trackPool.length > 0) {
      const randomTrack = trackPool.splice(
        Math.floor(Math.random() * trackPool.length),
        1
      )[0];
      tracks.push(randomTrack);
    }

    return {
      tracks,
      energy: 75,
      mood: 'energetic',
      reasoning:
        (aiResult as any).reasoning || 'Curated playlist based on your preferences',
      energyCurve: (aiResult as any).energyCurve || tracks.map((_, i) => 40 + i * 8), // Default ascending curve
      mixingTips: (aiResult as any).mixingTips || this.generateDefaultMixingTips(tracks),
      nextTrackSuggestions: trackPool.slice(0, 5),
    };
  }

  private findBestTrackMatch(
    suggestion: any,
    trackPool: Track[]
  ): Track | null {
    // Score tracks based on similarity to AI suggestion
    const scores = trackPool.map((track) => {
      let score = 0;

      // Genre match
      if (
        track.genre &&
        track.genre
          .toLowerCase()
          .includes((suggestion as any).genre?.toLowerCase() || '')
      )
        score += 30;

      // BPM proximity
      const bpmDiff = Math.abs((track.bpm || 120) - ((suggestion as any).bpm || 120));
      score += Math.max(0, 20 - bpmDiff);

      // Energy match
      const energyMap = { low: 1, medium: 2, high: 3 };
      const trackEnergyValue = track.energy || 0.5;
      const trackEnergy =
        trackEnergyValue > 0.7 ? 3 : trackEnergyValue < 0.4 ? 1 : 2;
      const suggestionEnergy =
        energyMap[(suggestion as any).energy as keyof typeof energyMap] || 2;
      if (trackEnergy === suggestionEnergy) score += 25;

      // Key compatibility (simplified)
      if (track.key === (suggestion as any).key) score += 15;

      return { track, score };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores[0]?.track || null;
  }

  private generateDefaultMixingTips(tracks: Track[]): string[] {
    const tips: string[] = [];

    for (let i = 0; i < tracks.length - 1; i++) {
      const current = tracks[i];
      const next = tracks[i + 1];

      const bpmDiff = (next.bpm || 120) - (current.bpm || 120);
      if (Math.abs(bpmDiff) <= 3) {
        tips.push(
          `Smooth BPM transition from ${current.title} to ${next.title} (${bpmDiff > 0 ? '+' : ''}${bpmDiff} BPM)`
        );
      } else {
        tips.push(
          `Use tempo adjustment for ${current.title} → ${next.title} transition (${bpmDiff > 0 ? 'speed up' : 'slow down'})`
        );
      }
    }

    return tips;
  }

  private generateFallbackPlaylist(
    request: AIPlaylistRequest
  ): AIRecommendation {
    let tracks = [...musicLibrary.getAllTracks()];

    // Filter by genre if specified
    if (request.genre) {
      tracks = tracks.filter((t) =>
        t.genre?.toLowerCase().includes(request.genre!.toLowerCase())
      );
    }

    // Filter by BPM range if specified
    if (request.bpmRange) {
      tracks = tracks.filter(
        (t) =>
          (t.bpm || 120) >= request.bpmRange!.min &&
          (t.bpm || 120) <= request.bpmRange!.max
      );
    }

    // Sort by mood preference
    if (request.mood === 'energetic') {
      tracks.sort(
        (a, b) =>
          (b.bpm || 120) +
          ((b.energy || 0) > 0.7 ? 20 : 0) -
          ((a.bpm || 120) + ((a.energy || 0) > 0.7 ? 20 : 0))
      );
    } else if (request.mood === 'chill') {
      tracks = tracks.filter(
        (t) =>
          (t.energy || 0) < 0.4 ||
          ((t.energy || 0) >= 0.4 && (t.energy || 0) <= 0.7)
      );
      tracks.sort((a, b) => (a.bpm || 120) - (b.bpm || 120));
    }

    // Select 8 tracks
    tracks = tracks.slice(0, 8);

    return {
      tracks,
      energy: 75,
      mood: 'energetic',
      reasoning:
        'Curated playlist based on your preferences using intelligent fallback selection',
      energyCurve: tracks.map((_, i) => 40 + i * 7),
      mixingTips: this.generateDefaultMixingTips(tracks),
      nextTrackSuggestions: musicLibrary.getAllTracks().slice(0, 5),
    };
  }

  private analyzeMoodFallback(input: string): MoodAnalysis {
    const inputLower = input.toLowerCase();
    let energy = 50,
      valence = 50,
      danceability = 50;
    let genre = 'Electronic',
      bpm = 125;

    // Simple keyword analysis
    if (
      inputLower.includes('energetic') ||
      inputLower.includes('party') ||
      inputLower.includes('dance')
    ) {
      energy = 80;
      danceability = 85;
    }
    if (
      inputLower.includes('chill') ||
      inputLower.includes('relax') ||
      inputLower.includes('ambient')
    ) {
      energy = 30;
      bpm = 110;
    }
    if (inputLower.includes('house')) genre = 'House';
    if (inputLower.includes('techno')) genre = 'Techno';
    if (inputLower.includes('trance')) genre = 'Trance';

    return {
      energy,
      valence,
      danceability,
      dominantGenre: genre,
      suggestedBPM: bpm,
      description: `Analyzed mood: ${energy > 70 ? 'High energy' : energy > 40 ? 'Medium energy' : 'Low energy'} ${genre.toLowerCase()} music`,
    };
  }

  private simulateCrowdResponseFallback(
    track: Track,
    venue: string
  ): {
    energy: number;
    response: string;
    suggestions: string[];
  } {
    const baseEnergy =
      (track.energy || 0) > 0.7
        ? 75
        : (track.energy || 0) >= 0.4 && (track.energy || 0) <= 0.7
          ? 50
          : 30;
    const venueModifier = venue === 'club' ? 15 : venue === 'festival' ? 20 : 0;
    const energy = Math.min(
      100,
      baseEnergy + venueModifier + Math.random() * 20
    );

    return {
      energy,
      response:
        energy > 70
          ? 'Crowd is loving it! High energy on the dance floor.'
          : energy > 40
            ? 'Good response, people are feeling the vibe.'
            : 'Mellow response, perfect for building atmosphere.',
      suggestions:
        energy > 70
          ? ['Keep the energy up', 'Great time for a breakdown']
          : ['Build the energy', 'Try a more uplifting track next'],
    };
  }

  private getAvailableGenres(): string[] {
    return [
      ...new Set(
        musicLibrary.getAllTracks().map((t: Track) => t.genre).filter(
          (genre): genre is string => genre !== undefined
        )
      ),
    ];
  }

  private generateCacheKey(type: string, data: unknown): string {
    return `${type}_${JSON.stringify(data)}`;
  }

  private getFromCache(key: string): AIRecommendation | MoodAnalysis | null {
    const item = this.cache.get(key);
    if (item && Date.now() - (item as any).timestamp < this.cacheExpiry) {
      return (item as any).data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: AIRecommendation | MoodAnalysis): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

export const aiMusicEngine = new AIMusicEngine();
export default aiMusicEngine;
export type { AIPlaylistRequest, AIRecommendation, MoodAnalysis };
