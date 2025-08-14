/**
 * MagicMatch - Intelligent Track Matching and Recommendation Engine
 * Analyzes tracks and finds perfect matches based on harmonic, rhythmic, and energy compatibility
 */

import type { Track } from '@/types/shared';
import { spotifyService } from './spotify';
import { lastfmService } from '../-djfly-clean-v2/src/services/lastfm';
import { serviceStatus } from '@/config/apiConfig';

export interface MatchCriteria {
  harmonicWeight: number;
  energyWeight: number;
  bpmWeight: number;
  genreWeight: number;
  popularityWeight: number;
  keyCompatibility: boolean;
  maxBpmDifference: number;
  maxEnergyDifference: number;
}

export interface TrackMatch {
  track: Track;
  score: number;
  reasons: string[];
  compatibility: {
    harmonic: number;
    energy: number;
    bpm: number;
    genre: number;
    popularity: number;
  };
  confidence: number;
  transitionSuggestion?: {
    crossfadePoint: number; // seconds from end of current track
    effectsRecommended: string[];
    bpmAdjustmentNeeded: boolean;
    pitchAdjustment?: number;
  };
}

export interface MatchRequest {
  currentTrack: Track;
  targetEnergy?: number;
  targetBpm?: number;
  preferredGenres?: string[];
  excludeArtists?: string[];
  maxResults?: number;
  criteria?: Partial<MatchCriteria>;
}

export class MagicMatch {
  private availableTracks: Track[] = [];
  private keyCompatibilityMap: Map<string, string[]> = new Map();
  private defaultCriteria: MatchCriteria = {
    harmonicWeight: 0.25,
    energyWeight: 0.25,
    bpmWeight: 0.25,
    genreWeight: 0.15,
    popularityWeight: 0.1,
    keyCompatibility: true,
    maxBpmDifference: 15,
    maxEnergyDifference: 0.3,
  };

  constructor() {
    this.initializeKeyCompatibility();
  }

  /**
   * Initialize musical key compatibility mappings
   */
  private initializeKeyCompatibility(): void {
    const compatibleKeys = {
      C: ['C', 'F', 'G', 'Am', 'Dm', 'Em'],
      'C#': ['C#', 'F#', 'G#', 'A#m', 'D#m', 'Fm'],
      D: ['D', 'G', 'A', 'Bm', 'Em', 'F#m'],
      'D#': ['D#', 'G#', 'A#', 'Cm', 'Fm', 'Gm'],
      E: ['E', 'A', 'B', 'C#m', 'F#m', 'G#m'],
      F: ['F', 'Bb', 'C', 'Dm', 'Gm', 'Am'],
      'F#': ['F#', 'B', 'C#', 'D#m', 'G#m', 'A#m'],
      G: ['G', 'C', 'D', 'Em', 'Am', 'Bm'],
      'G#': ['G#', 'C#', 'D#', 'Fm', 'A#m', 'Cm'],
      A: ['A', 'D', 'E', 'F#m', 'Bm', 'C#m'],
      'A#': ['A#', 'D#', 'F', 'Gm', 'Cm', 'Dm'],
      B: ['B', 'E', 'F#', 'G#m', 'C#m', 'D#m'],
      // Minor keys
      Am: ['Am', 'C', 'F', 'G', 'Dm', 'Em'],
      'A#m': ['A#m', 'C#', 'F#', 'G#', 'D#m', 'Fm'],
      Bm: ['Bm', 'D', 'G', 'A', 'Em', 'F#m'],
      Cm: ['Cm', 'D#', 'G#', 'A#', 'Fm', 'Gm'],
      'C#m': ['C#m', 'E', 'A', 'B', 'F#m', 'G#m'],
      Dm: ['Dm', 'F', 'Bb', 'C', 'Gm', 'Am'],
      'D#m': ['D#m', 'F#', 'B', 'C#', 'G#m', 'A#m'],
      Em: ['Em', 'G', 'C', 'D', 'Am', 'Bm'],
      Fm: ['Fm', 'G#', 'C#', 'D#', 'A#m', 'Cm'],
      'F#m': ['F#m', 'A', 'D', 'E', 'Bm', 'C#m'],
      Gm: ['Gm', 'A#', 'D#', 'F', 'Cm', 'Dm'],
      'G#m': ['G#m', 'B', 'E', 'F#', 'C#m', 'D#m'],
    };

    Object.entries(compatibleKeys).forEach(([key, compatible]) => {
      this.keyCompatibilityMap.set(key, compatible);
    });
  }

  /**
   * Load available tracks for matching
   */
  async loadTracks(query?: string, limit: number = 100): Promise<void> {
    const tracks: Track[] = [];

    // Try Spotify first
    if (serviceStatus.getServiceStatus('spotify')) {
      try {
        const spotifyTracks = await spotifyService.searchTracks(
          query || 'electronic house techno',
          Math.ceil(limit * 0.7)
        );
        tracks.push(...spotifyTracks);
      } catch (error) {
        console.warn('Failed to load tracks from Spotify:', error);
      }
    }

    // Try Last.fm as additional source
    if (serviceStatus.getServiceStatus('lastfm') && tracks.length < limit) {
      try {
        const lastfmTracks = await lastfmService.searchTracks(
          query || 'electronic music',
          limit - tracks.length
        );

        // Merge with existing tracks, avoiding duplicates
        const existingIds = new Set(tracks.map((t) => t.id));
        const uniqueLastfmTracks = lastfmTracks.filter(
          (t) => !existingIds.has(t.id)
        );
        tracks.push(...uniqueLastfmTracks);
      } catch (error) {
        console.warn('Failed to load tracks from Last.fm:', error);
      }
    }

    this.availableTracks = tracks;
    console.log(`🎵 Loaded ${this.availableTracks.length} tracks for matching`);
  }

  /**
   * Find matching tracks for a given track
   */
  async findMatches(request: MatchRequest): Promise<TrackMatch[]> {
    if (this.availableTracks.length === 0) {
      await this.loadTracks();
    }

    const criteria = { ...this.defaultCriteria, ...(request.criteria || {}) };
    const matches: TrackMatch[] = [];

    // Filter out the current track and excluded artists
    const candidateTracks = this.availableTracks.filter((track) => {
      if (track.id === request.currentTrack.id) return false;
      if (request.excludeArtists?.includes(track.artist)) return false;
      return true;
    });

    // Calculate matches for each candidate
    for (const candidate of candidateTracks) {
      const match = this.calculateMatch(
        request.currentTrack,
        candidate,
        criteria
      );
      if (match.score > 0.3) {
        // Only include decent matches
        matches.push(match);
      }
    }

    // Sort by score and limit results
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, request.maxResults || 10);
  }

  /**
   * Calculate match score between two tracks
   */
  private calculateMatch(
    currentTrack: Track,
    candidate: Track,
    criteria: MatchCriteria
  ): TrackMatch {
    const compatibility = {
      harmonic: this.calculateHarmonicCompatibility(currentTrack, candidate),
      energy: this.calculateEnergyCompatibility(
        currentTrack,
        candidate,
        criteria
      ),
      bpm: this.calculateBpmCompatibility(currentTrack, candidate, criteria),
      genre: this.calculateGenreCompatibility(currentTrack, candidate),
      popularity: this.calculatePopularityScore(candidate),
    };

    // Calculate weighted score
    const score =
      compatibility.harmonic * criteria.harmonicWeight +
      compatibility.energy * criteria.energyWeight +
      compatibility.bpm * criteria.bpmWeight +
      compatibility.genre * criteria.genreWeight +
      compatibility.popularity * criteria.popularityWeight;

    const reasons = this.generateMatchReasons(
      compatibility,
      currentTrack,
      candidate
    );
    const confidence = this.calculateConfidence(
      currentTrack,
      candidate,
      compatibility
    );
    const transitionSuggestion = this.generateTransitionSuggestion(
      currentTrack,
      candidate
    );

    return {
      track: candidate,
      score,
      reasons,
      compatibility,
      confidence,
      transitionSuggestion,
    };
  }

  /**
   * Calculate harmonic compatibility between tracks
   */
  private calculateHarmonicCompatibility(track1: Track, track2: Track): number {
    if (!track1.key || !track2.key) return 0.5; // Neutral if keys unknown

    const compatibleKeys = this.keyCompatibilityMap.get(track1.key) || [];

    if (compatibleKeys.includes(track2.key)) {
      // Perfect key match or relative major/minor
      if (track1.key === track2.key) return 1.0;
      // Compatible keys
      return 0.8;
    }

    // Check if they're in related keys (circle of fifths)
    const keyDistance = this.calculateKeyDistance(track1.key, track2.key);
    return Math.max(0, 1 - keyDistance / 6); // Scale based on key distance
  }

  /**
   * Calculate energy compatibility
   */
  private calculateEnergyCompatibility(
    track1: Track,
    track2: Track,
    criteria: MatchCriteria
  ): number {
    const energy1 = track1.energy || 0.5;
    const energy2 = track2.energy || 0.5;
    const energyDiff = Math.abs(energy2 - energy1);

    if (energyDiff > criteria.maxEnergyDifference) {
      return 0.2; // Poor compatibility for large energy jumps
    }

    // Prefer gradual energy changes
    return Math.max(0, 1 - energyDiff / criteria.maxEnergyDifference);
  }

  /**
   * Calculate BPM compatibility
   */
  private calculateBpmCompatibility(
    track1: Track,
    track2: Track,
    criteria: MatchCriteria
  ): number {
    const bpm1 = track1.bpm || 120;
    const bpm2 = track2.bpm || 120;
    const bpmDiff = Math.abs(bpm2 - bpm1);

    if (bpmDiff > criteria.maxBpmDifference) {
      return 0.1; // Poor compatibility for large BPM differences
    }

    // Perfect score for very close BPMs
    if (bpmDiff <= 2) return 1.0;

    // Scale score based on BPM difference
    return Math.max(0, 1 - bpmDiff / criteria.maxBpmDifference);
  }

  /**
   * Calculate genre compatibility
   */
  private calculateGenreCompatibility(track1: Track, track2: Track): number {
    if (!track1.genre || !track2.genre) return 0.6; // Neutral if genres unknown

    const genre1 = track1.genre.toLowerCase();
    const genre2 = track2.genre.toLowerCase();

    if (genre1 === genre2) return 1.0; // Perfect match

    // Check for related genres
    const relatedGenres = this.getRelatedGenres(genre1);
    if (relatedGenres.some((g) => genre2.includes(g))) {
      return 0.7;
    }

    // Check if they share common elements
    const genre1Words = genre1.split(/[\s-]/);
    const genre2Words = genre2.split(/[\s-]/);
    const commonWords = genre1Words.filter((word) =>
      genre2Words.includes(word)
    );

    return Math.max(
      0.3,
      commonWords.length / Math.max(genre1Words.length, genre2Words.length)
    );
  }

  /**
   * Calculate popularity score
   */
  private calculatePopularityScore(track: Track): number {
    if (!track.popularity) return 0.5;
    return track.popularity / 100; // Normalize to 0-1 scale
  }

  /**
   * Calculate key distance in circle of fifths
   */
  private calculateKeyDistance(key1: string, key2: string): number {
    const circleOfFifths = [
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F#',
      'C#',
      'G#',
      'D#',
      'A#',
      'F',
    ];

    // Normalize keys (remove 'm' for minor)
    const normalizedKey1 = key1.replace('m', '');
    const normalizedKey2 = key2.replace('m', '');

    const index1 = circleOfFifths.indexOf(normalizedKey1);
    const index2 = circleOfFifths.indexOf(normalizedKey2);

    if (index1 === -1 || index2 === -1) return 6; // Max distance if key not found

    const distance = Math.abs(index1 - index2);
    return Math.min(distance, 12 - distance); // Shortest distance around circle
  }

  /**
   * Get related genres for a given genre
   */
  private getRelatedGenres(genre: string): string[] {
    const genreRelations: { [key: string]: string[] } = {
      house: ['deep house', 'tech house', 'progressive house', 'tribal house'],
      techno: ['minimal techno', 'detroit techno', 'progressive techno'],
      electronic: ['electro', 'electronica', 'edm', 'dance'],
      trance: ['progressive trance', 'uplifting trance', 'psy trance'],
      ambient: ['chillout', 'downtempo', 'new age'],
      'drum and bass': ['dnb', 'liquid dnb', 'neurofunk'],
    };

    return genreRelations[genre] || [];
  }

  /**
   * Generate match reasons
   */
  private generateMatchReasons(
    compatibility: TrackMatch['compatibility'],
    currentTrack: Track,
    candidate: Track
  ): string[] {
    const reasons: string[] = [];

    if (compatibility.harmonic > 0.8) {
      reasons.push(
        `Perfect harmonic match (${currentTrack.key} → ${candidate.key})`
      );
    } else if (compatibility.harmonic > 0.6) {
      reasons.push(`Compatible keys (${currentTrack.key} → ${candidate.key})`);
    }

    if (compatibility.bpm > 0.9) {
      reasons.push(
        `BPM perfectly matched (${currentTrack.bpm} → ${candidate.bpm})`
      );
    } else if (compatibility.bpm > 0.7) {
      reasons.push(`Smooth BPM transition possible`);
    }

    if (compatibility.energy > 0.8) {
      reasons.push('Maintains energy flow');
    } else if (compatibility.energy < 0.4) {
      reasons.push('Creates energy contrast');
    }

    if (compatibility.genre > 0.8) {
      reasons.push('Same genre continuity');
    } else if (compatibility.genre > 0.6) {
      reasons.push('Compatible genre mix');
    }

    if (compatibility.popularity > 0.8) {
      reasons.push('High crowd appeal');
    }

    return reasons.length > 0 ? reasons : ['Basic compatibility'];
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    currentTrack: Track,
    candidate: Track,
    compatibility: TrackMatch['compatibility']
  ): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence if we have audio analysis data
    if (currentTrack.bpm && currentTrack.key && currentTrack.energy) {
      confidence += 0.2;
    }

    if (candidate.bpm && candidate.key && candidate.energy) {
      confidence += 0.2;
    }

    // Factor in overall compatibility
    const avgCompatibility =
      Object.values(compatibility).reduce((a, b) => a + b) / 5;
    confidence = confidence * 0.6 + avgCompatibility * 0.4;

    return Math.min(1, confidence);
  }

  /**
   * Generate transition suggestions
   */
  private generateTransitionSuggestion(
    currentTrack: Track,
    candidate: Track
  ): TrackMatch['transitionSuggestion'] {
    const currentBpm = currentTrack.bpm || 120;
    const candidateBpm = candidate.bpm || 120;
    const bpmDiff = Math.abs(candidateBpm - currentBpm);

    const suggestion: TrackMatch['transitionSuggestion'] = {
      crossfadePoint: 30, // Default crossfade point
      effectsRecommended: [],
      bpmAdjustmentNeeded: bpmDiff > 5,
    };

    // Adjust crossfade point based on track properties
    if (currentTrack.duration) {
      if (currentTrack.genre?.toLowerCase().includes('ambient')) {
        suggestion.crossfadePoint = Math.max(45, currentTrack.duration * 0.2);
      } else {
        suggestion.crossfadePoint = Math.max(
          16,
          Math.min(32, currentTrack.duration * 0.15)
        );
      }
    }

    // Recommend effects based on transition type
    if (bpmDiff > 10) {
      suggestion.effectsRecommended.push('pitch adjustment', 'filter sweep');
      suggestion.pitchAdjustment = (candidateBpm - currentBpm) / currentBpm;
    }

    if (currentTrack.key !== candidate.key) {
      suggestion.effectsRecommended.push('harmonic filter', 'reverb');
    }

    if (
      Math.abs((currentTrack.energy || 0.5) - (candidate.energy || 0.5)) > 0.3
    ) {
      suggestion.effectsRecommended.push('volume fade', 'EQ adjustment');
    }

    return suggestion;
  }

  /**
   * Get available tracks count
   */
  getAvailableTracksCount(): number {
    return this.availableTracks.length;
  }

  /**
   * Clear loaded tracks
   */
  clearTracks(): void {
    this.availableTracks = [];
  }

  /**
   * Update matching criteria
   */
  updateCriteria(criteria: Partial<MatchCriteria>): void {
    this.defaultCriteria = { ...this.defaultCriteria, ...criteria };
  }

  /**
   * Get current matching criteria
   */
  getCriteria(): MatchCriteria {
    return { ...this.defaultCriteria };
  }
}

export const magicMatch = new MagicMatch();
export default magicMatch;
