/**
 * Last.fm API Integration
 * Provides music discovery and recommendation features
 */

import { API_CONFIG } from '@/config/apiConfig';
import type { Track } from '@/types/shared';

interface LastfmImage {
  size: string;
  '#text': string;
}

interface LastfmArtist {
  name: string;
  url?: string;
}

interface LastfmTrack {
  name: string;
  artist: string | LastfmArtist;
  url: string;
  listeners: string;
  image: LastfmImage[];
  duration?: string;
  playcount?: string;
}

interface LastfmSearchResponse {
  results: {
    trackmatches: {
      track: LastfmTrack[];
    };
  };
}

interface LastfmSimilarResponse {
  similartracks: {
    track: LastfmTrack[];
  };
}

interface LastfmTopTracksResponse {
  toptracks: {
    track: LastfmTrack[];
  };
}

interface LastfmTrackInfoResponse {
  track: {
    name: string;
    artist: LastfmArtist;
    album?: {
      title: string;
      image: LastfmImage[];
    };
    duration: string;
    listeners: string;
    playcount: string;
    toptags?: {
      tag: Array<{
        name: string;
        count: number;
        url: string;
      }>;
    };
    wiki?: {
      summary: string;
      content: string;
    };
    image: LastfmImage[];
  };
}

interface TrackInfo {
  name: string;
  artist: string;
  album?: string;
  duration: number;
  listeners: number;
  playcount: number;
  tags: string[];
  summary?: string;
  image: string;
}

export class LastfmService {
  private apiKey: string;
  private secret: string;
  private baseUrl: string;
  private requestCache = new Map<
    string,
    { data: unknown; timestamp: number }
  >();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiKey = API_CONFIG.lastfm.apiKey || '';
    this.secret = API_CONFIG.lastfm.secret || '';
    this.baseUrl = API_CONFIG.lastfm.baseUrl;

    if (!this.apiKey) {
      console.warn(
        '⚠️ Last.fm API key not configured. Music discovery features will be limited.'
      );
    } else {
      console.log('✅ Last.fm API configured');
    }
  }

  /**
   * Search for tracks with enhanced error handling and caching
   */
  async searchTracks(query: string, limit = 20): Promise<Track[]> {
    const cacheKey = `search_${query}_${limit}`;
    const cached = this.getFromCache<Track[]>(cacheKey);
    if (cached) return cached;

    try {
      if (!this.apiKey) {
        throw new Error('Last.fm API key not configured');
      }

      const params = new URLSearchParams({
        method: 'track.search',
        track: query,
        api_key: this.apiKey,
        format: 'json',
        limit: limit.toString(),
      });

      const response = await this.makeRequest(
        `${this.baseUrl}/?${params.toString()}`
      );
      const data = response as LastfmSearchResponse;

      if (!data.results?.trackmatches?.track) {
        console.warn('No tracks found in Last.fm search response');
        return [];
      }

      const tracks = data.results.trackmatches.track.map((track) =>
        this.mapLastfmTrackToTrack(track, 'search')
      );

      this.setCache(cacheKey, tracks);
      return tracks;
    } catch (error) {
      console.error('❌ Last.fm search error:', error);
      return [];
    }
  }

  /**
   * Get similar tracks with improved type safety
   */
  async getSimilarTracks(
    trackName: string,
    artistName: string,
    limit = 10
  ): Promise<Track[]> {
    const cacheKey = `similar_${trackName}_${artistName}_${limit}`;
    const cached = this.getFromCache<Track[]>(cacheKey);
    if (cached) return cached;

    try {
      if (!this.apiKey) {
        throw new Error('Last.fm API key not configured');
      }

      const params = new URLSearchParams({
        method: 'track.getSimilar',
        track: trackName,
        artist: artistName,
        api_key: this.apiKey,
        format: 'json',
        limit: limit.toString(),
      });

      const response = await this.makeRequest(
        `${this.baseUrl}/?${params.toString()}`
      );
      const data = response as LastfmSimilarResponse;

      if (!data.similartracks?.track) {
        console.warn('No similar tracks found in Last.fm response');
        return [];
      }

      const tracks = data.similartracks.track.map((track) =>
        this.mapLastfmTrackToTrack(track, 'similar')
      );

      this.setCache(cacheKey, tracks);
      return tracks;
    } catch (error) {
      console.error('❌ Last.fm similar tracks error:', error);
      return [];
    }
  }

  /**
   * Get top tracks by genre with proper typing
   */
  async getTopTracksByGenre(genre: string, limit = 20): Promise<Track[]> {
    const cacheKey = `genre_${genre}_${limit}`;
    const cached = this.getFromCache<Track[]>(cacheKey);
    if (cached) return cached;

    try {
      if (!this.apiKey) {
        throw new Error('Last.fm API key not configured');
      }

      const params = new URLSearchParams({
        method: 'tag.getTopTracks',
        tag: genre,
        api_key: this.apiKey,
        format: 'json',
        limit: limit.toString(),
      });

      const response = await this.makeRequest(
        `${this.baseUrl}/?${params.toString()}`
      );
      const data = response as LastfmTopTracksResponse;

      if (!data.toptracks?.track) {
        console.warn(`No top tracks found for genre: ${genre}`);
        return [];
      }

      const tracks = data.toptracks.track.map((track) =>
        this.mapLastfmTrackToTrack(track, 'genre')
      );

      this.setCache(cacheKey, tracks);
      return tracks;
    } catch (error) {
      console.error('❌ Last.fm top tracks error:', error);
      return [];
    }
  }

  /**
   * Get detailed track information with proper typing
   */
  async getTrackInfo(
    trackName: string,
    artistName: string
  ): Promise<TrackInfo | null> {
    const cacheKey = `info_${trackName}_${artistName}`;
    const cached = this.getFromCache<TrackInfo>(cacheKey);
    if (cached) return cached;

    try {
      if (!this.apiKey) {
        throw new Error('Last.fm API key not configured');
      }

      const params = new URLSearchParams({
        method: 'track.getInfo',
        track: trackName,
        artist: artistName,
        api_key: this.apiKey,
        format: 'json',
      });

      const response = await this.makeRequest(
        `${this.baseUrl}/?${params.toString()}`
      );
      const data = response as LastfmTrackInfoResponse;

      if (!data.track) {
        console.warn(`No track info found for: ${trackName} by ${artistName}`);
        return null;
      }

      const trackInfo: TrackInfo = {
        name: data.track.name,
        artist:
          typeof data.track.artist === 'string'
            ? data.track.artist
            : data.track.artist.name,
        album: data.track.album?.title,
        duration: parseInt(data.track.duration) || 0,
        listeners: parseInt(data.track.listeners) || 0,
        playcount: parseInt(data.track.playcount) || 0,
        tags: data.track.toptags?.tag.map((tag) => tag.name) || [],
        summary: data.track.wiki?.summary,
        image: this.extractImageUrl(data.track.image),
      };

      this.setCache(cacheKey, trackInfo);
      return trackInfo;
    } catch (error) {
      console.error('❌ Last.fm track info error:', error);
      return null;
    }
  }

  /**
   * Get artist's top tracks
   */
  async getArtistTopTracks(artistName: string, limit = 10): Promise<Track[]> {
    const cacheKey = `artist_top_${artistName}_${limit}`;
    const cached = this.getFromCache<Track[]>(cacheKey);
    if (cached) return cached;

    try {
      if (!this.apiKey) {
        throw new Error('Last.fm API key not configured');
      }

      const params = new URLSearchParams({
        method: 'artist.getTopTracks',
        artist: artistName,
        api_key: this.apiKey,
        format: 'json',
        limit: limit.toString(),
      });

      const response = await this.makeRequest(`${this.baseUrl}/?${params.toString()}`);
      const data = response as { toptracks: { track: LastfmTrack[] } };

      if (!data.toptracks?.track) {
        console.warn(`No top tracks found for artist: ${artistName}`);
        return [];
      }

      const tracks = data.toptracks.track.map((track) =>
        this.mapLastfmTrackToTrack(track, 'artist_top')
      );

      this.setCache(cacheKey, tracks);
      return tracks;
    } catch (error) {
      console.error('❌ Last.fm artist top tracks error:', error);
      return [];
    }
  }

  /**
   * Get popular genres/tags
   */
  async getPopularGenres(): Promise<string[]> {
    const cacheKey = 'popular_genres';
    const cached = this.getFromCache<string[]>(cacheKey);
    if (cached) return cached;

    try {
      if (!this.apiKey) {
        throw new Error('Last.fm API key not configured');
      }

      const params = new URLSearchParams({
        method: 'tag.getTopTags',
        api_key: this.apiKey,
        format: 'json',
      });

      const response = await this.makeRequest(
        `${this.baseUrl}/?${params.toString()}`
      );
      const data = response as {
        toptags: {
          tag: Array<{ name: string; count: number }>;
        };
      };

      const genres =
        data.toptags?.tag
          .slice(0, 20) // Get top 20 genres
          .map((tag) => tag.name) || [];

      this.setCache(cacheKey, genres);
      return genres;
    } catch (error) {
      console.error('❌ Last.fm popular genres error:', error);
      return [];
    }
  }

  /**
   * Private helper methods
   */
  private async makeRequest(url: string): Promise<unknown> {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          'Last.fm API key is invalid or request format is incorrect'
        );
      }
      if (response.status === 429) {
        throw new Error(
          'Last.fm API rate limit exceeded. Please try again later.'
        );
      }
      throw new Error(
        `Last.fm API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    // Check for Last.fm specific errors
    if (data.error) {
      throw new Error(`Last.fm API error: ${data.message || 'Unknown error'}`);
    }

    return data;
  }

  private mapLastfmTrackToTrack(track: LastfmTrack, source: string): Track {
    const artistName =
      typeof track.artist === 'string' ? track.artist : track.artist.name;
    
    return {
      id: `lastfm_${source}_${track.name}_${artistName}`.replace(/\s+/g, '_'),
      title: track.name,
      artist: artistName,
      duration: parseInt(track.duration || '0') || 0,
      preview_url: null, // Last.fm doesn't provide preview URLs
      source: 'lastfm' as const,
      popularity: parseInt(track.listeners || '0') || 0,
      image: this.extractImageUrl(track.image),
      genre: undefined, // Will be populated by getTrackInfo if needed
      bpm: undefined, // Last.fm doesn't provide BPM
      key: undefined, // Last.fm doesn't provide musical key
      energy: this.estimateEnergyFromPopularity(
        parseInt(track.listeners || '0')
      ),
    };
  }

  private extractImageUrl(images: LastfmImage[]): string {
    if (!images || !Array.isArray(images)) return '';

    // Prefer medium, then large, then any available
    const preferredSizes = ['medium', 'large', 'extralarge'];

    for (const size of preferredSizes) {
      const image = images.find((img) => img.size === size);
      if (image && image['#text']) {
        return image['#text'];
      }
    }

    // Return first available image if no preferred size found
    return images.find((img) => img['#text'])?.['#text'] || '';
  }

  private estimateEnergyFromPopularity(listeners: number): number {
    // Simple heuristic: more popular tracks tend to be more energetic
    // This is not accurate but provides a baseline
    if (listeners > 1000000) return 0.8;
    if (listeners > 500000) return 0.7;
    if (listeners > 100000) return 0.6;
    if (listeners > 50000) return 0.5;
    return 0.4;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.requestCache.get(key);
    if (item && Date.now() - item.timestamp < this.cacheExpiry) {
      return item.data as T;
    }
    this.requestCache.delete(key);
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.requestCache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.requestCache.clear();
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get service status for debugging
   */
  getStatus(): {
    configured: boolean;
    cacheSize: number;
    baseUrl: string;
  } {
    return {
      configured: this.isConfigured(),
      cacheSize: this.requestCache.size,
      baseUrl: this.baseUrl,
    };
  }
}

// Export singleton instance
export const lastfmService = new LastfmService();
export type { TrackInfo, LastfmTrack, LastfmImage };