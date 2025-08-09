import { Track, AdvancedTrackAnalysis } from '../types/audio';
import { SessionContext, EnergyPoint } from '../types/session';

export interface MagicSetResult {
  set_id: string;
  tracks_order: string[];
  energy_curve: EnergyPoint[];
  confidence: number;
  rationale: string;
}

export interface TrackMatch {
  trackId: string;
  score: number;
  rationale: {
    harmonicCompatibility: number;
    energyFlow: number;
    crowdAppeal: number;
    transitionQuality: number;
    explanation: string;
  };
  confidence: number;
}

export interface SetBuilderState {
  tracks: Track[];
  order: string[];
  energyCurve: EnergyPoint[];
  currentEnergy: number;
  targetEnergy: number;
  bpmRange: [number, number];
  keyCenter: string;
  genres: string[];
  isOptimizing: boolean;
}

export class MagicSet {
  private tracks: Track[] = [];
  private setState: SetBuilderState | null = null;
  private undoStack: SetBuilderState[] = [];
  private redoStack: SetBuilderState[] = [];
  private maxUndoSteps = 20;

  // Set Building
  async buildSet(
    context: SessionContext,
    availableTracks: Track[]
  ): Promise<MagicSetResult> {
    this.tracks = availableTracks;

    // Initialize set builder state
    this.setState = {
      tracks: availableTracks,
      order: [],
      energyCurve: [],
      currentEnergy: 0,
      targetEnergy: this.calculateTargetEnergy(context),
      bpmRange: context.bpmTarget || [120, 140],
      keyCenter: this.determineKeyCenter(availableTracks),
      genres: context.genres || [],
      isOptimizing: false,
    };

    // Build initial set
    const initialSet = await this.generateInitialSet(context);
    this.setState.order = initialSet.tracks_order;
    this.setState.energyCurve = initialSet.energy_curve;

    // Optimize set
    const optimizedSet = await this.optimizeSet();

    return {
      set_id: this.generateSetId(),
      tracks_order: optimizedSet.order,
      energy_curve: optimizedSet.energyCurve,
      confidence: optimizedSet.confidence,
      rationale: optimizedSet.rationale,
    };
  }

  private async generateInitialSet(
    context: SessionContext
  ): Promise<{ tracks_order: string[]; energy_curve: EnergyPoint[] }> {
    const { bpmTarget, genres } = context;

    // Filter tracks by criteria
    let filteredTracks = this.tracks.filter((track) => {
      if (bpmTarget && track.bpm) {
        const [minBpm, maxBpm] = bpmTarget;
        if (track.bpm < minBpm || track.bpm > maxBpm) return false;
      }

      if (genres && genres.length > 0 && track.genre) {
        if (
          !genres.some((genre) =>
            track.genre!.toLowerCase().includes(genre.toLowerCase())
          )
        ) {
          return false;
        }
      }

      return true;
    });

    // Sort by energy and popularity
    filteredTracks.sort((a, b) => {
      const aScore = (a.energy || 0) * (a.popularity || 0);
      const bScore = (b.energy || 0) * (b.popularity || 0);
      return bScore - aScore;
    });

    // Build energy curve
    const energyCurve: EnergyPoint[] = [];
    let currentEnergy = 0.5; // Start at medium energy

    const tracks_order = filteredTracks.slice(0, 20).map((track) => {
      // Calculate energy progression
      const energyStep = this.calculateEnergyStep(track, currentEnergy);
      currentEnergy = Math.max(0, Math.min(1, currentEnergy + energyStep));

      energyCurve.push({
        t: energyCurve.length * 30, // 30 seconds per track
        value: currentEnergy,
      });

      return track.id;
    });

    return { tracks_order, energy_curve: energyCurve };
  }

  private async optimizeSet(): Promise<{
    order: string[];
    energyCurve: EnergyPoint[];
    confidence: number;
    rationale: string;
  }> {
    if (!this.setState) throw new Error('No set state available');

    this.setState.isOptimizing = true;

    // Save current state for undo
    this.saveState();

    let bestOrder = [...this.setState.order];
    let bestEnergyCurve = [...this.setState.energyCurve];
    let bestScore = this.calculateSetScore(bestOrder, bestEnergyCurve);

    // Genetic algorithm for optimization
    const generations = 50;
    const populationSize = 20;

    for (let gen = 0; gen < generations; gen++) {
      const population = this.generatePopulation(bestOrder, populationSize);

      for (const candidate of population) {
        const candidateEnergy = this.recalculateEnergyCurve(candidate);
        const score = this.calculateSetScore(candidate, candidateEnergy);

        if (score > bestScore) {
          bestScore = score;
          bestOrder = [...candidate];
          bestEnergyCurve = [...candidateEnergy];
        }
      }
    }

    this.setState.order = bestOrder;
    this.setState.energyCurve = bestEnergyCurve;
    this.setState.isOptimizing = false;

    return {
      order: bestOrder,
      energyCurve: bestEnergyCurve,
      confidence: bestScore,
      rationale: this.generateOptimizationRationale(bestOrder, bestEnergyCurve),
    };
  }

  // Track Matching
  async findMatches(
    baseTrackId: string,
    limit: number = 10
  ): Promise<TrackMatch[]> {
    const baseTrack = this.tracks.find((t) => t.id === baseTrackId);
    if (!baseTrack) throw new Error('Base track not found');

    const matches: TrackMatch[] = [];

    for (const track of this.tracks) {
      if (track.id === baseTrackId) continue;

      const match = await this.calculateTrackMatch(baseTrack, track);
      matches.push(match);
    }

    // Sort by score and return top matches
    return matches.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  private async calculateTrackMatch(
    baseTrack: Track,
    candidateTrack: Track
  ): Promise<TrackMatch> {
    const harmonicCompatibility = this.calculateHarmonicCompatibility(
      baseTrack,
      candidateTrack
    );
    const energyFlow = this.calculateEnergyFlow(baseTrack, candidateTrack);
    const crowdAppeal = this.calculateCrowdAppeal(candidateTrack);
    const transitionQuality = this.calculateTransitionQuality(
      baseTrack,
      candidateTrack
    );

    const score =
      harmonicCompatibility * 0.3 +
      energyFlow * 0.3 +
      crowdAppeal * 0.2 +
      transitionQuality * 0.2;

    return {
      trackId: candidateTrack.id,
      score,
      rationale: {
        harmonicCompatibility,
        energyFlow,
        crowdAppeal,
        transitionQuality,
        explanation: this.generateMatchExplanation({
          harmonicCompatibility,
          energyFlow,
          crowdAppeal,
          transitionQuality,
        }),
      },
      confidence: this.calculateConfidence(baseTrack, candidateTrack),
    };
  }

  // Set Manipulation
  reorderTracks(newOrder: string[]): void {
    if (!this.setState) return;

    this.saveState();
    this.setState.order = newOrder;
    this.setState.energyCurve = this.recalculateEnergyCurve(newOrder);
  }

  insertTrack(trackId: string, position: number): void {
    if (!this.setState) return;

    this.saveState();
    this.setState.order.splice(position, 0, trackId);
    this.setState.energyCurve = this.recalculateEnergyCurve(
      this.setState.order
    );
  }

  removeTrack(trackId: string): void {
    if (!this.setState) return;

    this.saveState();
    this.setState.order = this.setState.order.filter((id) => id !== trackId);
    this.setState.energyCurve = this.recalculateEnergyCurve(
      this.setState.order
    );
  }

  // Undo/Redo
  undo(): boolean {
    if (this.undoStack.length === 0) return false;

    const previousState = this.undoStack.pop()!;
    this.redoStack.push({ ...this.setState! });
    this.setState = previousState;

    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;

    const nextState = this.redoStack.pop()!;
    this.undoStack.push({ ...this.setState! });
    this.setState = nextState;

    return true;
  }

  private saveState(): void {
    if (!this.setState) return;

    this.undoStack.push({ ...this.setState });
    if (this.undoStack.length > this.maxUndoSteps) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Clear redo stack when new action is performed
  }

  // Utility methods
  private calculateTargetEnergy(context: SessionContext): number {
    const { crowdSize, vibe } = context;

    let baseEnergy = 0.5;

    if (crowdSize) {
      if (crowdSize > 1000) baseEnergy += 0.2;
      else if (crowdSize > 500) baseEnergy += 0.1;
      else if (crowdSize < 100) baseEnergy -= 0.1;
    }

    if (vibe) {
      switch (vibe.toLowerCase()) {
        case 'high energy':
        case 'party':
          baseEnergy += 0.3;
          break;
        case 'chill':
        case 'ambient':
          baseEnergy -= 0.3;
          break;
        case 'build up':
          baseEnergy += 0.1;
          break;
      }
    }

    return Math.max(0, Math.min(1, baseEnergy));
  }

  private determineKeyCenter(tracks: Track[]): string {
    const keyCounts: { [key: string]: number } = {};

    tracks.forEach((track) => {
      if (track.key) {
        keyCounts[track.key] = (keyCounts[track.key] || 0) + 1;
      }
    });

    return (
      Object.entries(keyCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'C'
    );
  }

  private calculateEnergyStep(track: Track, currentEnergy: number): number {
    const trackEnergy = track.energy || 0.5;
    const energyDiff = trackEnergy - currentEnergy;

    // Gradual energy changes
    return Math.sign(energyDiff) * Math.min(0.2, Math.abs(energyDiff));
  }

  private calculateSetScore(
    order: string[],
    energyCurve: EnergyPoint[]
  ): number {
    let score = 0;

    // Energy flow score
    for (let i = 1; i < energyCurve.length; i++) {
      const energyDiff = Math.abs(
        energyCurve[i].value - energyCurve[i - 1].value
      );
      score += Math.max(0, 1 - energyDiff); // Prefer smooth transitions
    }

    // Track variety score
    const uniqueArtists = new Set(
      order.map((id) => this.tracks.find((t) => t.id === id)?.artist)
    ).size;
    score += (uniqueArtists / order.length) * 0.5;

    // BPM consistency score
    const bpms = order
      .map((id) => this.tracks.find((t) => t.id === id)?.bpm)
      .filter((bpm): bpm is number => bpm !== undefined);
    if (bpms.length > 0) {
      const avgBpm = bpms.reduce((sum, bpm) => sum + bpm, 0) / bpms.length;
      const bpmVariance =
        bpms.reduce((sum, bpm) => sum + Math.pow(bpm - avgBpm, 2), 0) /
        bpms.length;
      score += Math.max(0, 1 - bpmVariance / 100);
    }

    return score;
  }

  private generatePopulation(baseOrder: string[], size: number): string[][] {
    const population: string[][] = [];

    for (let i = 0; i < size; i++) {
      const candidate = [...baseOrder];

      // Random mutations
      for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
        const idx1 = Math.floor(Math.random() * candidate.length);
        const idx2 = Math.floor(Math.random() * candidate.length);
        [candidate[idx1], candidate[idx2]] = [candidate[idx2], candidate[idx1]];
      }

      population.push(candidate);
    }

    return population;
  }

  private recalculateEnergyCurve(order: string[]): EnergyPoint[] {
    const energyCurve: EnergyPoint[] = [];
    let currentEnergy = 0.5;

    order.forEach((trackId, index) => {
      const track = this.tracks.find((t) => t.id === trackId);
      if (track) {
        const energyStep = this.calculateEnergyStep(track, currentEnergy);
        currentEnergy = Math.max(0, Math.min(1, currentEnergy + energyStep));

        energyCurve.push({
          t: index * 30,
          value: currentEnergy,
        });
      }
    });

    return energyCurve;
  }

  private calculateHarmonicCompatibility(track1: Track, track2: Track): number {
    if (!track1.key || !track2.key) return 0.5;

    const compatibleKeys = this.getCompatibleKeys(track1.key);
    return compatibleKeys.includes(track2.key) ? 1.0 : 0.3;
  }

  private calculateEnergyFlow(track1: Track, track2: Track): number {
    const energy1 = track1.energy || 0.5;
    const energy2 = track2.energy || 0.5;
    const energyDiff = Math.abs(energy2 - energy1);

    // Prefer gradual energy changes
    return Math.max(0, 1 - energyDiff);
  }

  private calculateCrowdAppeal(track: Track): number {
    const popularity = track.popularity || 0.5;
    const danceability = track.danceability || 0.5;
    const energy = track.energy || 0.5;

    return popularity * 0.4 + danceability * 0.3 + energy * 0.3;
  }

  private calculateTransitionQuality(track1: Track, track2: Track): number {
    const bpm1 = track1.bpm || 120;
    const bpm2 = track2.bpm || 120;
    const bpmDiff = Math.abs(bpm2 - bpm1);

    // Prefer tracks with similar BPM
    return Math.max(0, 1 - bpmDiff / 20);
  }

  private calculateConfidence(track1: Track, track2: Track): number {
    const hasAnalysis = track1.analysis && track2.analysis;
    const hasAudioFeatures =
      track1.bpm && track1.key && track2.bpm && track2.key;

    let confidence = 0.5;
    if (hasAnalysis) confidence += 0.3;
    if (hasAudioFeatures) confidence += 0.2;

    return Math.min(1, confidence);
  }

  private getCompatibleKeys(key: string): string[] {
    // Simplified key compatibility (relative majors/minors)
    const keyMap: { [key: string]: string[] } = {
      C: ['C', 'Am', 'F', 'G'],
      G: ['G', 'Em', 'C', 'D'],
      D: ['D', 'Bm', 'G', 'A'],
      A: ['A', 'F#m', 'D', 'E'],
      E: ['E', 'C#m', 'A', 'B'],
      B: ['B', 'G#m', 'E', 'F#'],
      'F#': ['F#', 'D#m', 'B', 'C#'],
      'C#': ['C#', 'A#m', 'F#', 'G#'],
      'G#': ['G#', 'Fm', 'C#', 'D#'],
      'D#': ['D#', 'Cm', 'G#', 'A#'],
      'A#': ['A#', 'F#m', 'D#', 'F'],
      F: ['F', 'Dm', 'Bb', 'C'],
    };

    return keyMap[key] || [key];
  }

  private generateMatchExplanation(scores: any): string {
    const explanations: string[] = [];

    if (scores.harmonicCompatibility > 0.8) {
      explanations.push('Excellent harmonic compatibility');
    } else if (scores.harmonicCompatibility < 0.4) {
      explanations.push('Harmonic clash detected');
    }

    if (scores.energyFlow > 0.8) {
      explanations.push('Smooth energy flow');
    } else if (scores.energyFlow < 0.4) {
      explanations.push('Energy jump may be jarring');
    }

    if (scores.crowdAppeal > 0.8) {
      explanations.push('High crowd appeal');
    }

    if (scores.transitionQuality > 0.8) {
      explanations.push('Natural BPM transition');
    }

    return explanations.join('. ') || 'Moderate compatibility';
  }

  private generateOptimizationRationale(
    order: string[],
    energyCurve: EnergyPoint[]
  ): string {
    const trackCount = order.length;
    const avgEnergy =
      energyCurve.reduce((sum, point) => sum + point.value, 0) /
      energyCurve.length;
    const energyVariance =
      energyCurve.reduce(
        (sum, point) => sum + Math.pow(point.value - avgEnergy, 2),
        0
      ) / energyCurve.length;

    return `Optimized set with ${trackCount} tracks, average energy ${avgEnergy.toFixed(2)}, smooth transitions (variance: ${energyVariance.toFixed(3)})`;
  }

  private generateSetId(): string {
    return `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Getters
  getCurrentSet(): SetBuilderState | null {
    return this.setState;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
