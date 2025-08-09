/**
 * Real Music Library Service
 * Production-ready with real track management and search
 */

import type { Track } from '@/types/shared';
import { spotifyService } from './spotify';
import { lastfmService } from './lastfm';

// Demo track library for fallback
const demoTracks: Track[] = [
  {
    id: 'demo_001',
    title: 'Solar Flare',
    artist: 'Cosmic DJ',
    duration: 240,
    bpm: 126,
    key: 'Am',
    energy: 0.75,
    genre: 'Progressive House',
    image: '/api/placeholder/300/300',
    source: 'demo',
  },
  {
    id: 'demo_002', 
    title: 'Neon Dreams',
    artist: 'SynthWave Masters',
    duration: 268,
    bpm: 132,
    key: 'Dm',
    energy: 0.82,
    genre: 'Synthwave',
    image: '/api/placeholder/300/300',
    source: 'demo',
  },
  {
    id: 'demo_003',
    title: 'Deep Ocean',
    artist: 'Liquid Sounds',
    duration: 312,
    bpm: 118,
    key: 'Fm',
    energy: 0.65,
    genre: 'Deep House',
    image: '/api/placeholder/300/300',
    source: 'demo',
  },
  {
    id: 'demo_004',
    title: 'Electric Storm',
    artist: 'Thunder Bass',
    duration: 195,
    bpm: 140,
    key: 'Em',
    energy: 0.91,
    genre: 'Drum & Bass',
    image: '/api/placeholder/300/300',
    source: 'demo',
  },
  {
    id: 'demo_005',
    title: 'Midnight Drive',
    artist: 'City Lights',
    duration: 278,
    bpm: 124,
    key: 'Cm',
    energy: 0.68,
    genre: 'Tech House',
    image: '/api/placeholder/300/300',
    source: 'demo',
  },
];

class MusicLibraryService {
  /**
   * Search for tracks across multiple services
   */
  async searchTracks(query: string, limit: number = 10): Promise<Track[]> {
    console.log(`🔍 Searching for "${query}" (limit: ${limit})`);
    
    try {
      // Try Spotify first
      if (spotifyService.isConfigured()) {
        try {
          const spotifyTracks = await spotifyService.searchTracks(query, limit);
          if (spotifyTracks.length > 0) {
            console.log(`✅ Found ${spotifyTracks.length} Spotify tracks`);
            return spotifyTracks;
          }
        } catch (error) {
          console.warn('⚠️ Spotify search failed, trying fallback:', error);
        }
      }

      // Try Last.fm as fallback
      if (lastfmService.isConfigured()) {
        try {
          const lastfmTracks = await lastfmService.searchTracks(query, limit);
          if (lastfmTracks.length > 0) {
            console.log(`✅ Found ${lastfmTracks.length} Last.fm tracks`);
            return lastfmTracks;
          }
        } catch (error) {
          console.warn('⚠️ Last.fm search failed, falling back to demo tracks:', error);
        }
      }

      // Return demo tracks as final fallback
      console.log('🎵 Using demo tracks as fallback');
      return this.getDemoTracks(query, limit);
    } catch (error) {
      console.error('❌ Search failed completely:', error);
      return this.getDemoTracks(query, limit);
    }
  }

  /**
   * Generate a playlist based on a text prompt
   */
  async generatePlaylist(prompt: string): Promise<Track[]> {
    console.log(`🎯 Generating playlist from prompt: "${prompt}"`);
    
    // Extract keywords from prompt for search
    const keywords = this.extractKeywordsFromPrompt(prompt);
    const searchQuery = keywords.join(' ');
    
    try {
      const tracks = await this.searchTracks(searchQuery, 12);
      return this.shuffleArray(tracks).slice(0, 8);
    } catch (error) {
      console.error('❌ Playlist generation failed:', error);
      return this.getDemoTracks('', 8);
    }
  }

  /**
   * Get demo tracks with optional filtering
   */
  private getDemoTracks(query: string = '', limit: number = 10): Track[] {
    let tracks = [...demoTracks];
    
    // Filter by query if provided
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      tracks = tracks.filter(track => 
        searchTerms.some(term => 
          track.title.toLowerCase().includes(term) ||
          track.artist.toLowerCase().includes(term) ||
          track.genre?.toLowerCase().includes(term)
        )
      );
    }
    
    return tracks.slice(0, limit);
  }

  /**
   * Extract keywords from a playlist generation prompt
   */
  private extractKeywordsFromPrompt(prompt: string): string[] {
    const genreMap: Record<string, string[]> = {
      'electronic': ['electronic', 'edm', 'techno', 'house'],
      'house': ['house', 'deep house', 'tech house'],
      'techno': ['techno', 'minimal', 'industrial'],
      'trance': ['trance', 'progressive', 'uplifting'],
      'dubstep': ['dubstep', 'bass', 'wobble'],
      'drum': ['drum and bass', 'dnb', 'jungle'],
      'ambient': ['ambient', 'chill', 'atmospheric'],
      'synthwave': ['synthwave', 'retrowave', 'neon'],
    };

    const moodMap: Record<string, string[]> = {
      'energetic': ['energetic', 'high energy', 'upbeat', 'party'],
      'chill': ['chill', 'relaxed', 'calm', 'mellow'],
      'dark': ['dark', 'aggressive', 'hard', 'intense'],
      'uplifting': ['uplifting', 'positive', 'happy', 'euphoric'],
    };

    const keywords: string[] = [];
    const lowerPrompt = prompt.toLowerCase();

    // Extract genre keywords
    Object.entries(genreMap).forEach(([genre, terms]) => {
      if (terms.some(term => lowerPrompt.includes(term))) {
        keywords.push(genre);
      }
    });

    // Extract mood keywords
    Object.entries(moodMap).forEach(([mood, terms]) => {
      if (terms.some(term => lowerPrompt.includes(term))) {
        keywords.push(mood);
      }
    });

    // Fallback to electronic if no genres found
    if (keywords.length === 0) {
      keywords.push('electronic');
    }

    return keywords;
  }

  /**
   * Utility function to shuffle array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Export singleton instance
export const musicLibrary = new MusicLibraryService();