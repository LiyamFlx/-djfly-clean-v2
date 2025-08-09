/**
 * Real Music Library Service
 * Production-ready with real track management and search
 */

import type { Track } from '@/types/shared';
import { spotifyService } from './spotify';
<<<<<<< HEAD
import { openaiService } from './openai';
import { lastfmService } from './lastfm';

export class MusicLibrary {
  private tracks: Track[] = [];
  private playlists: Map<string, Track[]> = new Map();

  /**
   * Search for tracks using multiple APIs
   */
  async searchTracks(query: string, limit: number = 20): Promise<Track[]> {
    try {
      // Try Spotify first
      if (spotifyService.isAuthenticated()) {
        const spotifyTracks = await spotifyService.searchTracks(query, limit);
        if (spotifyTracks.length > 0) {
          return spotifyTracks;
        }
=======
import { lastfmService } from '../-djfly-clean-v2/src/services/lastfm';
import { serviceStatus } from '@/config/apiConfig';
import { MagicSet } from '../-djfly-clean-v2/src/services/MagicSet';
import { magicMatch } from './MagicMatch';
import type { Track } from '@/types/shared';
import type { SessionContext } from '@/types/session';


// Enhanced Playlist generation with AI-powered matching
export class PlaylistGenerator {
  private static magicSet = new MagicSet();

  /**
   * Generate intelligent playlist using MagicSet algorithm
   */
  static async generateIntelligentSet(
    context: SessionContext,
    seedTracks?: Track[]
  ): Promise<{
    tracks: Track[];
    energyCurve: Array<{ t: number; value: number }>;
    confidence: number;
    rationale: string;
  }> {
    try {
      const result = await this.magicSet.buildSet(context, seedTracks);
      
      // Convert track IDs back to track objects
      const allTracks = await this.loadAvailableTracks(context);
      const tracks = result.tracks_order
        .map(id => allTracks.find(t => t.id === id))
        .filter((track): track is Track => !!track);

      return {
        tracks,
        energyCurve: result.energy_curve,
        confidence: result.confidence,
        rationale: result.rationale,
      };
    } catch (error) {
      console.error('MagicSet generation failed:', error);
      throw error;
    }
  }

  /**
   * Find matching tracks for a given track using MagicMatch
   */
  static async findMatches(
    currentTrack: Track,
    options: {
      maxResults?: number;
      targetEnergy?: number;
      preferredGenres?: string[];
      excludeArtists?: string[];
    } = {}
  ): Promise<Array<{
    track: Track;
    score: number;
    reasons: string[];
    confidence: number;
  }>> {
    try {
      // Load tracks for matching if not already loaded
      if (magicMatch.getAvailableTracksCount() === 0) {
        await magicMatch.loadTracks();
      }

      const matches = await magicMatch.findMatches({
        currentTrack,
        ...options,
      });

      return matches.map(match => ({
        track: match.track,
        score: match.score,
        reasons: match.reasons,
        confidence: match.confidence,
      }));
    } catch (error) {
      console.error('MagicMatch failed:', error);
      return [];
    }
  }

  /**
   * Load available tracks for operations
   */
  private static async loadAvailableTracks(context?: SessionContext): Promise<Track[]> {
    const tracks: Track[] = [];
    const query = this.buildQueryFromContext(context);

    // Load from Spotify
    if (serviceStatus.getServiceStatus('spotify')) {
      try {
        const spotifyTracks = await spotifyService.searchTracks(query, 100);
        tracks.push(...spotifyTracks);
      } catch (error) {
        console.warn('Failed to load Spotify tracks:', error);
      }
    }

    // Load from Last.fm
    if (serviceStatus.getServiceStatus('lastfm')) {
      try {
        const lastfmTracks = await lastfmService.searchTracks(query, 50);
        // Avoid duplicates
        const existingIds = new Set(tracks.map(t => t.id));
        const uniqueTracks = lastfmTracks.filter(t => !existingIds.has(t.id));
        tracks.push(...uniqueTracks);
      } catch (error) {
        console.warn('Failed to load Last.fm tracks:', error);
      }
    }

    return tracks;
  }

  /**
   * Build search query from context
   */
  private static buildQueryFromContext(context?: SessionContext): string {
    if (!context) return 'electronic music';

    const parts: string[] = [];
    
    if (context.genres && context.genres.length > 0) {
      parts.push(...context.genres);
    }
    
    if (context.vibe) {
      parts.push(context.vibe);
    }
    
    return parts.length > 0 ? parts.join(' ') : 'electronic music';
  }
  /**
   * Get tracks from available services (Spotify, Last.fm) with intelligent fallbacks
   */
  private static async getTracksFromServices(
    query: string,
    limit: number = 10
  ): Promise<Track[]> {
    let tracks: Track[] = [];

    // Try Spotify first
    if (serviceStatus.getServiceStatus('spotify')) {
      try {
        console.log('🎵 Searching Spotify for:', query);
        const results = await spotifyService.searchTracks(query, limit);
        tracks = results.map((spotifyTrack: any) => ({
          id: spotifyTrack.id,
          title: spotifyTrack.name,
          artist: spotifyTrack.artists[0]?.name || 'Unknown Artist',
          duration: Math.floor(spotifyTrack.duration_ms / 1000),
          image: spotifyTrack.album?.images[0]?.url,
          preview_url: spotifyTrack.preview_url || '/demo-track-1.mp3',
          source: 'spotify' as const,
          bpm: 120, // Will be enhanced with audio features later
          key: 'C',
          energy: this.inferEnergyFromTrack(spotifyTrack),
          genre: this.inferGenreFromTrack(spotifyTrack),
          popularity: spotifyTrack.popularity || 50
        }));

        if (tracks.length > 0) {
          console.log(`✅ Found ${tracks.length} tracks from Spotify`);
          return tracks;
        }
      } catch (error) {
        console.warn('⚠️ Spotify search failed, trying Last.fm:', error);
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
      }

      // Try Last.fm as fallback
      if (lastfmService.isConfigured()) {
        try {
          const lastfmTracks = await lastfmService.searchTracks(query, limit);
          if (lastfmTracks.length > 0) {
            return lastfmTracks;
          }
        } catch (error) {
          console.warn(
            '⚠️ Last.fm search failed, falling back to demo tracks:',
            error
          );
        }
      }

      // Return demo tracks as final fallback
      console.warn('⚠️ No external APIs available, returning demo tracks');
      return this.getDemoTracks(query, limit);
    } catch (error) {
      console.error('❌ Track search failed:', error);
      return this.getDemoTracks(query, limit);
    }
<<<<<<< HEAD
=======

    // Fallback to Last.fm
    if (serviceStatus.getServiceStatus('lastfm')) {
      try {
        console.log('🎵 Searching Last.fm for:', query);
        tracks = await lastfmService.searchTracks(query, limit);
        if (tracks.length > 0) {
          console.log(`✅ Found ${tracks.length} tracks from Last.fm`);
          return tracks;
        }
      } catch (error) {
        console.warn('⚠️ Last.fm search failed, using demo tracks:', error);
      }
    }

    // Return empty array if no services available
    console.warn('⚠️ No music services available for:', query);
    return [];
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  }

  /**
   * Get track recommendations using AI
   */
  async getRecommendations(
    seedTracks: Track[],
    targetEnergy?: number,
    targetMood?: string
  ): Promise<Track[]> {
<<<<<<< HEAD
    try {
      if (!openaiService.isConfigured()) {
        throw new Error('AI service not configured');
      }

      return await openaiService.getTrackRecommendations(
        seedTracks,
        targetEnergy,
        targetMood
      );
    } catch (error) {
      console.error('❌ AI recommendations failed:', error);
      throw error;
    }
  }

  /**
   * Generate playlist using AI
   */
  async generatePlaylist(prompt: string, context?: any): Promise<Track[]> {
    try {
      if (!openaiService.isConfigured()) {
        throw new Error('AI service not configured');
      }

      const aiRecommendation = await openaiService.generatePlaylist(
        prompt,
        context
      );
      return aiRecommendation.tracks;
    } catch (error) {
      console.error('❌ Playlist generation failed:', error);
      throw error;
=======
    const context: SessionContext = {
      vibe,
      genres: this.getGenresForVibe(vibe),
      bpmTarget: this.getBpmRangeForVibe(vibe),
      crowdSize: 500,
    };

    try {
      const result = await this.generateIntelligentSet(context);
      return result.tracks;
    } catch (error) {
      console.error('Intelligent vibe generation failed, falling back to simple search:', error);
      return await this.getTracksFromServices(this.getQueryForVibe(vibe), 10);
    }
  }

  private static getGenresForVibe(vibe: string): string[] {
    switch (vibe) {
      case 'energetic': return ['house', 'techno', 'electro'];
      case 'chill': return ['ambient', 'chillout', 'downtempo'];
      case 'progressive': return ['progressive house', 'progressive trance'];
      default: return ['electronic', 'house', 'techno'];
    }
  }

  private static getBpmRangeForVibe(vibe: string): [number, number] {
    switch (vibe) {
      case 'energetic': return [125, 140];
      case 'chill': return [80, 110];
      case 'progressive': return [120, 132];
      default: return [115, 135];
    }
  }

  private static getQueryForVibe(vibe: string): string {
    switch (vibe) {
      case 'energetic': return 'electronic dance music high energy';
      case 'chill': return 'ambient chill electronic';
      case 'progressive': return 'progressive house trance';
      default: return 'electronic house techno';
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
    }
  }

  /**
<<<<<<< HEAD
   * Get user's playlists from Spotify
   */
  async getUserPlaylists(): Promise<any[]> {
    try {
      if (!spotifyService.isAuthenticated()) {
        throw new Error('Spotify not connected');
      }

      return await spotifyService.getUserPlaylists();
    } catch (error) {
      console.error('❌ Failed to get user playlists:', error);
      throw error;
    }
  }

  /**
   * Get track audio features
   */
  async getTrackFeatures(trackId: string): Promise<any> {
    try {
      if (!spotifyService.isAuthenticated()) {
        throw new Error('Spotify not connected');
      }

      return await spotifyService.getTrackFeatures(trackId);
    } catch (error) {
      console.error('❌ Failed to get track features:', error);
      throw error;
    }
  }

  /**
   * Add track to library
   */
  addTrack(track: Track): void {
    const existingIndex = this.tracks.findIndex((t) => t.id === track.id);
    if (existingIndex === -1) {
      this.tracks.push(track);
    }
  }

  /**
   * Remove track from library
   */
  removeTrack(trackId: string): void {
    this.tracks = this.tracks.filter((track) => track.id !== trackId);
  }

  /**
   * Get all tracks in library
   */
  getAllTracks(): Track[] {
    return [...this.tracks];
  }

  /**
   * Get demo tracks for development
   */
  private getDemoTracks(query: string, limit: number): Track[] {
    const demoTracks: Track[] = [
      {
        id: 'demo-1',
        title: 'Midnight City',
        artist: 'M83',
        duration: 240,
        preview_url: '/demo-track-1.mp3',
        source: 'demo',
        energy: 0.8,
        bpm: 128,
        key: 'C',
        genre: 'electronic',
        popularity: 85,
      },
      {
        id: 'demo-2',
        title: 'Strobe',
        artist: 'Deadmau5',
        duration: 639,
        preview_url: '/demo-track-2.mp3',
        source: 'demo',
        energy: 0.9,
        bpm: 128,
        key: 'A',
        genre: 'progressive house',
        popularity: 90,
      },
      {
        id: 'demo-3',
        title: 'Levels',
        artist: 'Avicii',
        duration: 334,
        preview_url: '/demo-track-3.mp3',
        source: 'demo',
        energy: 0.95,
        bpm: 126,
        key: 'F',
        genre: 'house',
        popularity: 95,
      },
      {
        id: 'demo-4',
        title: 'Sandstorm',
        artist: 'Darude',
        duration: 225,
        preview_url: '/demo-track-4.mp3',
        source: 'demo',
        energy: 0.85,
        bpm: 135,
        key: 'D',
        genre: 'trance',
        popularity: 88,
      },
      {
        id: 'demo-5',
        title: 'One More Time',
        artist: 'Daft Punk',
        duration: 320,
        preview_url: '/demo-track-5.mp3',
        source: 'demo',
        energy: 0.75,
        bpm: 123,
        key: 'C',
        genre: 'house',
        popularity: 92,
      },
    ];

    // Filter by query if provided
    const filtered = query
      ? demoTracks.filter(
          (track) =>
            track.title.toLowerCase().includes(query.toLowerCase()) ||
            track.artist.toLowerCase().includes(query.toLowerCase()) ||
            track.genre.toLowerCase().includes(query.toLowerCase())
        )
      : demoTracks;

    return filtered.slice(0, limit);
  }

  /**
   * Create playlist
   */
  createPlaylist(name: string, tracks: Track[]): string {
    const playlistId = `playlist_${Date.now()}`;
    this.playlists.set(playlistId, [...tracks]);
    return playlistId;
  }

  /**
   * Get playlist
   */
  getPlaylist(playlistId: string): Track[] {
    return this.playlists.get(playlistId) || [];
  }

  /**
   * Add track to playlist
   */
  addTrackToPlaylist(playlistId: string, track: Track): void {
    const playlist = this.playlists.get(playlistId);
    if (playlist) {
      playlist.push(track);
    }
  }

  /**
   * Remove track from playlist
   */
  removeTrackFromPlaylist(playlistId: string, trackId: string): void {
    const playlist = this.playlists.get(playlistId);
    if (playlist) {
      const updatedPlaylist = playlist.filter((track) => track.id !== trackId);
      this.playlists.set(playlistId, updatedPlaylist);
    }
  }

  /**
   * Get all playlists
   */
  getAllPlaylists(): Map<string, Track[]> {
    return new Map(this.playlists);
  }

  /**
   * Search tracks by genre
   */
  async searchByGenre(genre: string, limit: number = 20): Promise<Track[]> {
    return this.searchTracks(`genre:${genre}`, limit);
  }

  /**
   * Search tracks by artist
   */
  async searchByArtist(artist: string, limit: number = 20): Promise<Track[]> {
    return this.searchTracks(`artist:${artist}`, limit);
  }

  /**
   * Search tracks by BPM range
   */
  async searchByBPM(
    minBPM: number,
    maxBPM: number,
    limit: number = 20
  ): Promise<Track[]> {
    const allTracks = await this.searchTracks('', 100);
    return allTracks
      .filter(
        (track) => track.bpm && track.bpm >= minBPM && track.bpm <= maxBPM
      )
      .slice(0, limit);
  }

  /**
   * Get recently played tracks
   */
  getRecentlyPlayed(): Track[] {
    // In a real implementation, this would come from a database
    return this.tracks.slice(-10);
  }

  /**
   * Get favorite tracks
   */
  getFavorites(): Track[] {
    // In a real implementation, this would come from user preferences
    return this.tracks.filter(
      (track) => track.popularity && track.popularity > 80
    );
  }

  /**
   * Clear library
   */
  clearLibrary(): void {
    this.tracks = [];
    this.playlists.clear();
  }

  /**
   * Export library as JSON
   */
  exportLibrary(): string {
    return JSON.stringify({
      tracks: this.tracks,
      playlists: Object.fromEntries(this.playlists),
    });
=======
   * Generate playlist by genre
   */
  static async generateByGenre(
    genre: string,
    count: number = 6
  ): Promise<Track[]> {
    const context: SessionContext = {
      genres: [genre],
      crowdSize: 500,
      vibe: 'mixed',
    };

    try {
      const result = await this.generateIntelligentSet(context);
      return result.tracks.slice(0, count);
    } catch (error) {
      console.error('Intelligent genre generation failed, falling back to search:', error);
      return await this.getTracksFromServices(`${genre} electronic music`, count);
    }
  }

  /**
   * Generate playlist by BPM range
   */
  static async generateByBPM(
    minBpm: number,
    maxBpm: number,
    count: number = 6
  ): Promise<Track[]> {
    const context: SessionContext = {
      bpmTarget: [minBpm, maxBpm],
      genres: ['electronic', 'house', 'techno'],
      vibe: 'mixed',
      crowdSize: 500,
    };

    try {
      const result = await this.generateIntelligentSet(context);
      return result.tracks.slice(0, count);
    } catch (error) {
      console.error('Intelligent BPM generation failed, falling back to search:', error);
      const query = `electronic music ${minBpm} bpm`;
      const tracks = await this.getTracksFromServices(query, count * 2);
      
      return tracks.filter(track => {
        const bpm = track.bpm || 120;
        return bpm >= minBpm && bpm <= maxBpm;
      }).slice(0, count);
    }
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  }


  /**
   * Import library from JSON
   */
<<<<<<< HEAD
  importLibrary(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      this.tracks = data.tracks || [];
      this.playlists = new Map(Object.entries(data.playlists || {}));
    } catch (error) {
      console.error('❌ Failed to import library:', error);
      throw new Error('Invalid library data format');
    }
  }
}

// Export singleton instance
export const musicLibrary = new MusicLibrary();
=======
  static async generateByPrompt(prompt: string): Promise<Track[]> {
    const context = this.analyzePromptToContext(prompt);

    try {
      const result = await this.generateIntelligentSet(context);
      console.log(
        `🎵 Generated intelligent ${result.tracks.length}-track set for: "${prompt}"`
      );
      return result.tracks;
    } catch (error) {
      console.error('Intelligent prompt generation failed, falling back to search:', error);
      return await this.getTracksFromServices(prompt, 8);
    }
  }

  private static analyzePromptToContext(prompt: string): SessionContext {
    const lowerPrompt = prompt.toLowerCase();
    const context: SessionContext = {
      genres: [],
      crowdSize: 500,
    };

    // Analyze vibe
    if (lowerPrompt.includes('energetic') || lowerPrompt.includes('party') || lowerPrompt.includes('club')) {
      context.vibe = 'high energy';
      context.bpmTarget = [125, 140];
    } else if (lowerPrompt.includes('chill') || lowerPrompt.includes('relax') || lowerPrompt.includes('ambient')) {
      context.vibe = 'chill';
      context.bpmTarget = [80, 110];
    } else if (lowerPrompt.includes('progressive') || lowerPrompt.includes('build')) {
      context.vibe = 'progressive';
      context.bpmTarget = [120, 132];
    } else {
      context.vibe = 'mixed';
      context.bpmTarget = [115, 135];
    }

    // Extract genres
    const genreKeywords = [
      'house', 'techno', 'trance', 'electronic', 'ambient',
      'progressive', 'minimal', 'electro', 'drum and bass', 'dubstep'
    ];
    
    for (const genre of genreKeywords) {
      if (lowerPrompt.includes(genre)) {
        context.genres!.push(genre);
      }
    }

    if (context.genres!.length === 0) {
      context.genres = ['electronic', 'house'];
    }

    // Analyze crowd size indicators
    if (lowerPrompt.includes('festival') || lowerPrompt.includes('main stage')) {
      context.crowdSize = 5000;
    } else if (lowerPrompt.includes('club') || lowerPrompt.includes('dancefloor')) {
      context.crowdSize = 1000;
    } else if (lowerPrompt.includes('intimate') || lowerPrompt.includes('lounge')) {
      context.crowdSize = 100;
    }

    return context;
  }
}

export default PlaylistGenerator;
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
