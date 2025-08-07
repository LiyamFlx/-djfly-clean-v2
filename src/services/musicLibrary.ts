/**
 * Music Library with curated DJ tracks
 * Integrates with Spotify API for real music data
 */

import { spotifyService } from './spotify';
import { serviceStatus } from '@/config/apiConfig';

export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  duration: number; // in seconds
  previewUrl: string;
  energy: 'low' | 'medium' | 'high';
  image?: string;
}

// Curated music library with reliable audio sources
export const MUSIC_LIBRARY: Track[] = [
  {
    id: 'electronic-1',
    title: 'Neon Dreams',
    artist: 'Synthwave Express',
    genre: 'Electronic',
    bpm: 128,
    key: 'Am',
    duration: 240,
    energy: 'high',
    previewUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop'
  },
  {
    id: 'house-1', 
    title: 'Deep Groove',
    artist: 'House Collective',
    genre: 'House',
    bpm: 122,
    key: 'Fm',
    duration: 280,
    energy: 'medium',
    previewUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: 'techno-1',
    title: 'Industrial Drive',
    artist: 'Techno Underground',
    genre: 'Techno',
    bpm: 132,
    key: 'Gm',
    duration: 320,
    energy: 'high',
    previewUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
    image: 'https://images.unsplash.com/photo-1571974599782-87ad85adba70?w=400&h=400&fit=crop'
  },
  {
    id: 'progressive-1',
    title: 'Sunset Horizon',
    artist: 'Progressive Waves',
    genre: 'Progressive',
    bpm: 126,
    key: 'C',
    duration: 360,
    energy: 'medium',
    previewUrl: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
    image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=400&fit=crop'
  },
  {
    id: 'ambient-1',
    title: 'Ethereal Spaces',
    artist: 'Ambient Collective',
    genre: 'Ambient',
    bpm: 110,
    key: 'D',
    duration: 300,
    energy: 'low',
    previewUrl: 'https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop'
  },
  {
    id: 'electronic-2',
    title: 'Electric Pulse',
    artist: 'Digital Soundscape',
    genre: 'Electronic',
    bpm: 130,
    key: 'Em',
    duration: 260,
    energy: 'high',
    previewUrl: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop'
  },
  {
    id: 'house-2',
    title: 'Midnight Groove',
    artist: 'House Masters',
    genre: 'Deep House',
    bpm: 124,
    key: 'Bbm',
    duration: 290,
    energy: 'medium',
    previewUrl: 'https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: 'techno-2',
    title: 'Machine Dreams',
    artist: 'Cyber Rhythms',
    genre: 'Techno',
    bpm: 134,
    key: 'Fm',
    duration: 310,
    energy: 'high',
    previewUrl: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
    image: 'https://images.unsplash.com/photo-1571974599782-87ad85adba70?w=400&h=400&fit=crop'
  },
  {
    id: 'trance-1',
    title: 'Uplifting Journey',
    artist: 'Trance State',
    genre: 'Trance',
    bpm: 136,
    key: 'F',
    duration: 420,
    energy: 'high',
    previewUrl: 'https://file-examples.com/storage/fe68c625b00ad8ad9df4a8d/2017/11/file_example_MP3_700KB.mp3',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: 'chill-1',
    title: 'Lazy Sunday',
    artist: 'Chill Vibes',
    genre: 'Chillout',
    bpm: 95,
    key: 'G',
    duration: 240,
    energy: 'low',
    previewUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&h=400&fit=crop'
  },
  {
    id: 'electronic-3',
    title: 'Future Bass',
    artist: 'Bass Architects',
    genre: 'Electronic',
    bpm: 140,
    key: 'A',
    duration: 200,
    energy: 'high',
    previewUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop'
  },
  {
    id: 'minimal-1',
    title: 'Subtle Movements',
    artist: 'Minimal Tech',
    genre: 'Minimal',
    bpm: 118,
    key: 'Dm',
    duration: 380,
    energy: 'medium',
    previewUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
    image: 'https://images.unsplash.com/photo-1571974599782-87ad85adba70?w=400&h=400&fit=crop'
  }
];

// Playlist generation functions
export class PlaylistGenerator {
  /**
   * Get tracks from Spotify if available, fallback to local library
   */
  private static async getTracksFromSpotify(query: string, limit: number = 10): Promise<Track[]> {
    if (serviceStatus.getServiceStatus('spotify')) {
      try {
        const results = await spotifyService.searchTracks(query, limit);
        return results.map((spotifyTrack: any) => ({
          id: spotifyTrack.id,
          title: spotifyTrack.name,
          artist: spotifyTrack.artists[0]?.name || 'Unknown Artist',
          genre: this.inferGenreFromTrack(spotifyTrack),
          bpm: 120, // Will be enhanced with audio features later
          key: 'C',
          duration: Math.floor(spotifyTrack.duration_ms / 1000),
          energy: this.inferEnergyFromTrack(spotifyTrack),
          previewUrl: spotifyTrack.preview_url || MUSIC_LIBRARY[0].previewUrl,
          image: spotifyTrack.album?.images[0]?.url
        }));
      } catch (error) {
        console.warn('Failed to get Spotify tracks, using fallback:', error);
      }
    }
    return [];
  }

  /**
   * Infer genre from Spotify track data
   */
  private static inferGenreFromTrack(spotifyTrack: any): string {
    const name = spotifyTrack.name.toLowerCase();
    const artist = spotifyTrack.artists[0]?.name?.toLowerCase() || '';
    
    if (name.includes('house') || artist.includes('house')) return 'House';
    if (name.includes('techno') || artist.includes('techno')) return 'Techno';
    if (name.includes('trance') || artist.includes('trance')) return 'Trance';
    if (name.includes('ambient') || artist.includes('ambient')) return 'Ambient';
    if (name.includes('electronic') || artist.includes('electronic')) return 'Electronic';
    
    return 'Electronic'; // Default
  }

  /**
   * Infer energy level from track data
   */
  private static inferEnergyFromTrack(track: any): 'low' | 'medium' | 'high' {
    const popularity = track.popularity || 50;
    if (popularity > 70) return 'high';
    if (popularity > 40) return 'medium';
    return 'low';
  }
  /**
   * Generate a playlist based on vibe analysis
   */
  static async generateByVibe(vibe: 'energetic' | 'chill' | 'progressive' | 'mixed' = 'mixed'): Promise<Track[]> {
    // Try to get tracks from Spotify first
    let spotifyTracks: Track[] = [];
    
    switch (vibe) {
      case 'energetic':
        spotifyTracks = await this.getTracksFromSpotify('electronic dance music high energy', 6);
        break;
      case 'chill':
        spotifyTracks = await this.getTracksFromSpotify('ambient chill electronic', 5);
        break;
      case 'progressive':
        spotifyTracks = await this.getTracksFromSpotify('progressive house trance', 6);
        break;
      case 'mixed':
        spotifyTracks = await this.getTracksFromSpotify('electronic house techno', 8);
        break;
    }
    
    // If we got Spotify tracks, use them
    if (spotifyTracks.length > 0) {
      console.log(`🎵 Generated ${spotifyTracks.length} tracks from Spotify for ${vibe} vibe`);
      return spotifyTracks;
    }
    
    // Fallback to local library
    const playlist: Track[] = [];
    
    switch (vibe) {
      case 'energetic':
        // High-energy tracks, progressively building
        playlist.push(
          ...MUSIC_LIBRARY.filter(track => 
            track.energy === 'high' && track.bpm >= 128
          ).slice(0, 6)
        );
        break;
        
      case 'chill':
        // Low to medium energy, relaxed progression
        playlist.push(
          ...MUSIC_LIBRARY.filter(track => 
            ['low', 'medium'].includes(track.energy) && track.bpm <= 120
          ).slice(0, 5)
        );
        break;
        
      case 'progressive':
        // Gradual energy build from low to high
        const lowEnergy = MUSIC_LIBRARY.filter(t => t.energy === 'low').slice(0, 2);
        const mediumEnergy = MUSIC_LIBRARY.filter(t => t.energy === 'medium').slice(0, 2);
        const highEnergy = MUSIC_LIBRARY.filter(t => t.energy === 'high').slice(0, 2);
        playlist.push(...lowEnergy, ...mediumEnergy, ...highEnergy);
        break;
        
      case 'mixed':
      default:
        // Balanced mix across genres and energy levels
        playlist.push(...this.createBalancedMix());
        break;
    }
    
    return playlist.length > 0 ? playlist : MUSIC_LIBRARY.slice(0, 8);
  }

  /**
   * Generate playlist by genre
   */
  static async generateByGenre(genre: string, count: number = 6): Promise<Track[]> {
    // Try Spotify first
    const spotifyTracks = await this.getTracksFromSpotify(`${genre} electronic music`, count);
    if (spotifyTracks.length > 0) {
      return spotifyTracks;
    }
    
    // Fallback to local library
    const genreTracks = MUSIC_LIBRARY.filter(track => 
      track.genre.toLowerCase().includes(genre.toLowerCase())
    );
    
    if (genreTracks.length === 0) {
      // Fallback to electronic if genre not found
      return MUSIC_LIBRARY.filter(track => 
        track.genre === 'Electronic'
      ).slice(0, count);
    }
    
    return genreTracks.slice(0, count);
  }

  /**
   * Generate playlist by BPM range
   */
  static generateByBPM(minBpm: number, maxBpm: number, count: number = 6): Track[] {
    return MUSIC_LIBRARY.filter(track => 
      track.bpm >= minBpm && track.bpm <= maxBpm
    ).slice(0, count);
  }

  /**
   * Create a balanced mix
   */
  private static createBalancedMix(): Track[] {
    const genres = ['Electronic', 'House', 'Techno', 'Progressive'];
    const playlist: Track[] = [];
    
    genres.forEach(genre => {
      const genreTracks = MUSIC_LIBRARY.filter(track => 
        track.genre.includes(genre)
      );
      if (genreTracks.length > 0) {
        playlist.push(genreTracks[Math.floor(Math.random() * genreTracks.length)]);
      }
    });
    
    // Fill remaining slots with random tracks
    const remaining = MUSIC_LIBRARY.filter(track => 
      !playlist.some(p => p.id === track.id)
    );
    
    while (playlist.length < 8 && remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      playlist.push(remaining.splice(randomIndex, 1)[0]);
    }
    
    return playlist;
  }

  /**
   * Generate AI-style playlist based on text prompt
   */
  static async generateByPrompt(prompt: string): Promise<Track[]> {
    // Try Spotify with the exact prompt first
    const spotifyTracks = await this.getTracksFromSpotify(prompt, 8);
    if (spotifyTracks.length > 0) {
      console.log(`🎵 Generated ${spotifyTracks.length} tracks from Spotify for prompt: "${prompt}"`);
      return spotifyTracks;
    }
    
    // Fallback to local analysis
    const promptLower = prompt.toLowerCase();
    let vibe: 'energetic' | 'chill' | 'progressive' | 'mixed' = 'mixed';
    
    // Analyze prompt for vibe
    if (promptLower.includes('energetic') || promptLower.includes('party') || 
        promptLower.includes('dance') || promptLower.includes('club')) {
      vibe = 'energetic';
    } else if (promptLower.includes('chill') || promptLower.includes('relax') || 
               promptLower.includes('ambient') || promptLower.includes('lounge')) {
      vibe = 'chill';
    } else if (promptLower.includes('progressive') || promptLower.includes('build') || 
               promptLower.includes('journey')) {
      vibe = 'progressive';
    }
    
    // Check for specific genres
    if (promptLower.includes('house')) return this.generateByGenre('House');
    if (promptLower.includes('techno')) return this.generateByGenre('Techno');
    if (promptLower.includes('electronic')) return this.generateByGenre('Electronic');
    if (promptLower.includes('trance')) return this.generateByGenre('Trance');
    
    return await this.generateByVibe(vibe);
  }
}

export default MUSIC_LIBRARY;