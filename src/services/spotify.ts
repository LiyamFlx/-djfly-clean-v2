import { Track } from '@/types';
import { cache } from '@/utils/cache';

interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    images: Array<{ url: string; height: number; width: number }>;
    name: string;
  };
  duration_ms: number;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
  popularity: number;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
  };
}

interface SpotifyAudioFeatures {
  id: string;
  tempo: number;
  key: number;
  energy: number;
  valence: number;
  danceability: number;
}

class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';
    
    if (!this.clientId) {
      console.warn('Spotify Client ID not configured. Add VITE_SPOTIFY_CLIENT_ID to your .env file');
    }
  }

  /**
   * Get access token using Client Credentials flow
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Check cache first
    const cachedToken = cache.get<{ token: string; expiry: number }>('spotify_token');
    if (cachedToken && Date.now() < cachedToken.expiry) {
      this.accessToken = cachedToken.token;
      this.tokenExpiry = cachedToken.expiry;
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify access token: ${response.statusText}`);
    }

    const data: SpotifyAuthResponse = await response.json();
    
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

    // Cache the token
    cache.set('spotify_token', {
      token: this.accessToken,
      expiry: this.tokenExpiry
    }, data.expires_in * 1000);

    return this.accessToken;
  }

  /**
   * Search for tracks on Spotify
   */
  async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify search failed: ${response.statusText}`);
      }

      const data: SpotifySearchResponse = await response.json();
      
      return data.tracks.items.map(this.convertSpotifyTrackToTrack);
    } catch (error) {
      console.error('Spotify search error:', error);
      throw error;
    }
  }

  /**
   * Get audio features for tracks
   */
  async getAudioFeatures(trackIds: string[]): Promise<Record<string, SpotifyAudioFeatures>> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get audio features: ${response.statusText}`);
      }

      const data = await response.json();
      
      const features: Record<string, SpotifyAudioFeatures> = {};
      data.audio_features.forEach((feature: SpotifyAudioFeatures | null) => {
        if (feature) {
          features[feature.id] = feature;
        }
      });

      return features;
    } catch (error) {
      console.error('Audio features error:', error);
      return {};
    }
  }

  /**
   * Get recommendations based on seed tracks, artists, or genres
   */
  async getRecommendations(params: {
    seed_tracks?: string[];
    seed_artists?: string[];
    seed_genres?: string[];
    target_tempo?: number;
    target_energy?: number;
    target_danceability?: number;
    limit?: number;
  }): Promise<Track[]> {
    try {
      const token = await this.getAccessToken();
      
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get recommendations: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.tracks.map(this.convertSpotifyTrackToTrack);
    } catch (error) {
      console.error('Recommendations error:', error);
      throw error;
    }
  }

  /**
   * Get available genres for recommendations
   */
  async getAvailableGenres(): Promise<string[]> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        'https://api.spotify.com/v1/recommendations/available-genre-seeds',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get genres: ${response.statusText}`);
      }

      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error('Genres error:', error);
      return [];
    }
  }

  /**
   * Convert Spotify track format to our Track interface
   */
  private convertSpotifyTrackToTrack = (spotifyTrack: SpotifyTrack): Track => {
    return {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists.map(artist => artist.name).join(', '),
      duration: Math.round(spotifyTrack.duration_ms / 1000),
      image: spotifyTrack.album.images[0]?.url || '/default-album-art.png',
      preview_url: spotifyTrack.preview_url,
      spotify_url: spotifyTrack.external_urls.spotify,
      source: 'spotify' as const,
      popularity: spotifyTrack.popularity
    };
  };

  /**
   * Check if Spotify is properly configured
   */
  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  /**
   * Get playlists for a user (requires user authentication)
   */
  async getUserPlaylists(userId: string, token: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get playlists: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error('Get playlists error:', error);
      return [];
    }
  }

  /**
   * Create a new playlist (requires user authentication)
   */
  async createPlaylist(userId: string, token: string, name: string, description?: string): Promise<any> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description: description || `Created by DJfly - ${new Date().toLocaleDateString()}`,
            public: false
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create playlist: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create playlist error:', error);
      throw error;
    }
  }

  /**
   * Add tracks to a playlist (requires user authentication)
   */
  async addTracksToPlaylist(playlistId: string, token: string, trackUris: string[]): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: trackUris
          })
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Add tracks to playlist error:', error);
      return false;
    }
  }

  /**
   * Get enhanced tracks with audio features
   */
  async getTracksWithFeatures(tracks: Track[]): Promise<Track[]> {
    const spotifyTracks = tracks.filter(track => track.source === 'spotify');
    if (spotifyTracks.length === 0) return tracks;

    try {
      const features = await this.getAudioFeatures(spotifyTracks.map(t => t.id));
      
      return tracks.map(track => {
        if (track.source === 'spotify' && features[track.id]) {
          const feature = features[track.id];
          return {
            ...track,
            bpm: Math.round(feature.tempo),
            energy: feature.energy,
            valence: feature.valence,
            danceability: feature.danceability,
            key: this.getKeyString(feature.key)
          };
        }
        return track;
      });
    } catch (error) {
      console.error('Failed to enhance tracks with features:', error);
      return tracks;
    }
  }

  /**
   * Convert Spotify key number to key string
   */
  private getKeyString(key: number): string {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return keys[key] || 'Unknown';
  }
}

export const spotifyService = new SpotifyService();
export default spotifyService;