import { Track, RealTimeAnalysis } from '../types/audio';

// Event handler type for better type safety
type EventHandler = (data: unknown) => void;

export interface DJWorkflow {
  hotCues: Array<{
    id: string;
    time: number;
    label: string;
    color: string;
  }>;
  loops: Array<{
    id: string;
    start: number;
    end: number;
    active: boolean;
  }>;
  effects: {
    filter: { frequency: number; resonance: number; enabled: boolean };
    echo: { delay: number; feedback: number; enabled: boolean };
    reverb: { roomSize: number; dampening: number; enabled: boolean };
  };
  transitions: {
    type: 'crossfade' | 'cut' | 'echo' | 'filter';
    duration: number;
    quality: number;
  };
}

export interface DeckState {
  id: 'A' | 'B';
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  pitch: number;
  tempo: number;
  eq: {
    low: number;
    mid: number;
    high: number;
  };
  effects: {
    filter: { frequency: number; resonance: number; enabled: boolean };
    echo: { delay: number; feedback: number; enabled: boolean };
    reverb: { roomSize: number; dampening: number; enabled: boolean };
  };
  hotCues: Array<{
    id: string;
    time: number;
    label: string;
    color: string;
  }>;
  loops: Array<{
    id: string;
    start: number;
    end: number;
    active: boolean;
  }>;
  waveform: Float32Array | null;
  spectrum: Float32Array | null;
  audioBuffer?: AudioBuffer;
}

export interface MixerState {
  crossfader: number; // -1 (A) to 1 (B)
  masterVolume: number;
  boothVolume: number;
  headphonesVolume: number;
  monitorSource: 'A' | 'B' | 'MASTER';
}

export interface CrowdResponse {
  energy: number;
  engagement: number;
  mood: string;
  demographics: {
    ageRange: [number, number];
    genderDistribution: { male: number; female: number; other: number };
    energyPreference: 'high' | 'medium' | 'low';
  };
  behavior: {
    dancing: number;
    singing: number;
    clapping: number;
    cheering: number;
  };
  predictions: {
    nextTrackAppeal: number;
    energyForecast: number;
    crowdRetention: number;
  };
}

export interface StemSeparation {
  vocals: AudioBuffer;
  drums: AudioBuffer;
  bass: AudioBuffer;
  other: AudioBuffer;
}

export class MagicPlayer {
  private audioContext: AudioContext | null = null;
  private deckA: DeckState;
  private deckB: DeckState;
  private mixer: MixerState;
  private currentAnalysis: RealTimeAnalysis | null = null;
  private crowdResponse: CrowdResponse | null = null;
  private eventListeners: Map<string, EventHandler[]> = new Map();
  private analysisInterval: ReturnType<typeof setInterval> | null = null;
  private crowdSimulationInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.deckA = this.createDeckState('A');
    this.deckB = this.createDeckState('B');
    this.mixer = this.createMixerState();
  }

  // Initialization
  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext)();
      await this.audioContext.resume();

      this.startRealTimeAnalysis();
      this.startCrowdSimulation();

      this.emitEvent('player_initialized', { success: true });
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      this.emitEvent('player_error', {
        error: 'Audio context initialization failed',
      });
    }
  }

  // Deck Management
  async loadTrack(deckId: 'A' | 'B', track: Track): Promise<void> {
    const deck = deckId === 'A' ? this.deckA : this.deckB;

    try {
      deck.track = track;
      deck.currentTime = 0;
      deck.duration = track.duration;

      // Load audio and generate waveform
      await this.loadAudio(deckId, track);
      await this.generateWaveform(deckId, track);

      this.emitEvent('track_loaded', { deckId, track });
    } catch (error) {
      console.error(`Failed to load track on deck ${deckId}:`, error);
      this.emitEvent('player_error', {
        error: `Failed to load track on deck ${deckId}`,
      });
    }
  }

  private async loadAudio(deckId: 'A' | 'B', track: Track): Promise<void> {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const response = await fetch(track.preview_url || '');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    // Store audio buffer for playback
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    deck.audioBuffer = audioBuffer;
  }

  private async generateWaveform(
    deckId: 'A' | 'B',
    track: Track
  ): Promise<void> {
    // Generate waveform data for visualization
    const deck = deckId === 'A' ? this.deckA : this.deckB;

    // Simulate waveform generation (in real implementation, use Web Audio API)
    const sampleCount = Math.floor(((track.duration / 1000) * 44100) / 1000); // 1 sample per ms
    deck.waveform = new Float32Array(sampleCount);

    for (let i = 0; i < sampleCount; i++) {
      deck.waveform[i] = Math.random() * 0.5 + 0.25; // Simulated waveform
    }

    this.emitEvent('waveform_generated', { deckId, waveform: deck.waveform });
  }

  // Playback Control
  play(deckId: 'A' | 'B'): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;

    if (!deck.track) return;

    deck.isPlaying = true;
    this.emitEvent('playback_started', { deckId, track: deck.track });
  }

  pause(deckId: 'A' | 'B'): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;

    deck.isPlaying = false;
    this.emitEvent('playback_paused', { deckId });
  }

  stop(deckId: 'A' | 'B'): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;

    deck.isPlaying = false;
    deck.currentTime = 0;
    this.emitEvent('playback_stopped', { deckId });
  }

  seek(deckId: 'A' | 'B', time: number): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;

    deck.currentTime = Math.max(0, Math.min(time, deck.duration));
    this.emitEvent('seeked', { deckId, time: deck.currentTime });
  }

  // Mixing Controls
  setCrossfader(position: number): void {
    this.mixer.crossfader = Math.max(-1, Math.min(1, position));
    this.emitEvent('crossfader_changed', { position: this.mixer.crossfader });
  }

  setDeckVolume(deckId: 'A' | 'B', volume: number): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    deck.volume = Math.max(0, Math.min(1, volume));
    this.emitEvent('volume_changed', { deckId, volume: deck.volume });
  }

  setDeckPitch(deckId: 'A' | 'B', pitch: number): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    deck.pitch = Math.max(-12, Math.min(12, pitch));
    this.emitEvent('pitch_changed', { deckId, pitch: deck.pitch });
  }

  setDeckTempo(deckId: 'A' | 'B', tempo: number): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    deck.tempo = Math.max(0.5, Math.min(2.0, tempo));
    this.emitEvent('tempo_changed', { deckId, tempo: deck.tempo });
  }

  setDeckEQ(
    deckId: 'A' | 'B',
    band: 'low' | 'mid' | 'high',
    value: number
  ): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    deck.eq[band] = Math.max(-12, Math.min(12, value));
    this.emitEvent('eq_changed', { deckId, band, value: deck.eq[band] });
  }

  // Effects
  toggleEffect(
    deckId: 'A' | 'B',
    effectType: 'filter' | 'echo' | 'reverb'
  ): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    deck.effects[effectType].enabled = !deck.effects[effectType].enabled;
    this.emitEvent('effect_toggled', {
      deckId,
      effectType,
      enabled: deck.effects[effectType].enabled,
    });
  }

  setEffectParameter(
    deckId: 'A' | 'B',
    effectType: 'filter' | 'echo' | 'reverb',
    parameter: string,
    value: number
  ): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    const effect = deck.effects[effectType] as Record<string, any>;
    effect[parameter] = value;
    this.emitEvent('effect_parameter_changed', {
      deckId,
      effectType,
      parameter,
      value,
    });
  }

  // Hot Cues
  setHotCue(
    deckId: 'A' | 'B',
    cueId: string,
    time: number,
    label: string,
    color: string
  ): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;

    const existingCue = deck.hotCues.find((cue) => cue.id === cueId);
    if (existingCue) {
      existingCue.time = time;
      existingCue.label = label;
      existingCue.color = color;
    } else {
      deck.hotCues.push({ id: cueId, time, label, color });
    }

    this.emitEvent('hot_cue_set', { deckId, cueId, time, label, color });
  }

  jumpToHotCue(deckId: 'A' | 'B', cueId: string): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    const cue = deck.hotCues.find((c) => c.id === cueId);

    if (cue) {
      this.seek(deckId, cue.time);
      this.emitEvent('hot_cue_jumped', { deckId, cueId, time: cue.time });
    }
  }

  // Loops
  setLoop(deckId: 'A' | 'B', loopId: string, start: number, end: number): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;

    const existingLoop = deck.loops.find((loop) => loop.id === loopId);
    if (existingLoop) {
      existingLoop.start = start;
      existingLoop.end = end;
    } else {
      deck.loops.push({ id: loopId, start, end, active: false });
    }

    this.emitEvent('loop_set', { deckId, loopId, start, end });
  }

  toggleLoop(deckId: 'A' | 'B', loopId: string): void {
    const deck = deckId === 'A' ? this.deckA : this.deckB;
    const loop = deck.loops.find((l) => l.id === loopId);

    if (loop) {
      loop.active = !loop.active;
      this.emitEvent('loop_toggled', { deckId, loopId, active: loop.active });
    }
  }

  // Real-time Analysis
  private startRealTimeAnalysis(): void {
    this.analysisInterval = setInterval(() => {
      this.performRealTimeAnalysis();
    }, 100); // 10 FPS
  }

  private performRealTimeAnalysis(): void {
    if (!this.audioContext) return;

    // Simulate real-time analysis
    this.currentAnalysis = {
      currentEnergy: Math.random() * 0.5 + 0.5,
      spectralCentroid: Math.random() * 2000 + 1000,
      spectralRolloff: Math.random() * 4000 + 2000,
      zeroCrossingRate: Math.random() * 0.1,
      rms: Math.random() * 0.5 + 0.1,
      peak: Math.random() * 0.8 + 0.2,
      beatConfidence: Math.random(),
      nextBeatTime: Date.now() + Math.random() * 1000,
      phaseAlignment: Math.random(),
      currentKey: 'C',
      harmonicStability: Math.random(),
      analysisLatency: Math.random() * 10,
      processingTime: Math.random() * 5,
    };

    this.emitEvent('analysis_updated', this.currentAnalysis);
  }

  // Crowd Response Simulation
  private startCrowdSimulation(): void {
    this.crowdSimulationInterval = setInterval(() => {
      this.simulateCrowdResponse();
    }, 5000); // Every 5 seconds
  }

  private simulateCrowdResponse(): void {
    const currentEnergy = this.currentAnalysis?.currentEnergy || 0.5;
    const activeDeck = this.deckA.isPlaying
      ? this.deckA
      : this.deckB.isPlaying
        ? this.deckB
        : null;

    if (!activeDeck) return;

    // Simulate crowd response based on track and energy
    const trackEnergy = activeDeck.track?.energy || 0.5;
    const popularity = activeDeck.track?.popularity || 0.5;

    this.crowdResponse = {
      energy: Math.min(1, currentEnergy * 1.2),
      engagement: Math.min(1, (trackEnergy + popularity) / 2),
      mood: this.determineCrowdMood(currentEnergy, trackEnergy),
      demographics: {
        ageRange: [18, 35] as [number, number],
        genderDistribution: { male: 0.6, female: 0.4, other: 0.0 },
        energyPreference:
          currentEnergy > 0.7 ? 'high' : currentEnergy > 0.4 ? 'medium' : 'low',
      },
      behavior: {
        dancing: Math.min(1, currentEnergy * 1.5),
        singing: Math.min(1, popularity * 0.8),
        clapping: Math.min(1, currentEnergy * 0.7),
        cheering: Math.min(1, (currentEnergy + popularity) / 2),
      },
      predictions: {
        nextTrackAppeal: Math.random() * 0.3 + 0.7,
        energyForecast: Math.min(
          1,
          currentEnergy + (Math.random() - 0.5) * 0.2
        ),
        crowdRetention: Math.min(
          1,
          (trackEnergy + popularity) / 2 + (Math.random() - 0.5) * 0.1
        ),
      },
    };

    this.emitEvent('crowd_response_updated', this.crowdResponse);
  }

  private determineCrowdMood(energy: number, trackEnergy: number): string {
    const combinedEnergy = (energy + trackEnergy) / 2;

    if (combinedEnergy > 0.8) return 'excited';
    if (combinedEnergy > 0.6) return 'energetic';
    if (combinedEnergy > 0.4) return 'engaged';
    if (combinedEnergy > 0.2) return 'chill';
    return 'mellow';
  }

  // Stem Separation
  async separateStems(track: Track): Promise<StemSeparation> {
    // Simulate stem separation (in real implementation, use AI models)
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const duration = track.duration / 1000;
    const length = Math.floor(sampleRate * duration);

    const createStemBuffer = (): AudioBuffer => {
      const buffer = this.audioContext!.createBuffer(2, length, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() - 0.5) * 0.1; // Simulated stem
      }
      return buffer;
    };

    return {
      vocals: createStemBuffer(),
      drums: createStemBuffer(),
      bass: createStemBuffer(),
      other: createStemBuffer(),
    };
  }

  // Event Management
  addEventListener(event: string, listener: EventHandler): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  removeEventListener(event: string, listener: EventHandler): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEvent(event: string, data: unknown): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }

  // Utility methods
  private createDeckState(id: 'A' | 'B'): DeckState {
    return {
      id,
      track: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      pitch: 0,
      tempo: 1,
      eq: { low: 0, mid: 0, high: 0 },
      effects: {
        filter: { frequency: 1000, resonance: 1, enabled: false },
        echo: { delay: 0.5, feedback: 0.3, enabled: false },
        reverb: { roomSize: 0.5, dampening: 0.5, enabled: false },
      },
      hotCues: [],
      loops: [],
      waveform: null,
      spectrum: null,
    };
  }

  private createMixerState(): MixerState {
    return {
      crossfader: 0,
      masterVolume: 1,
      boothVolume: 0.8,
      headphonesVolume: 0.7,
      monitorSource: 'MASTER',
    };
  }

  // Additional utility methods for enhanced functionality
  getBPMDifference(): number {
    if (!this.deckA.track || !this.deckB.track) return 0;
    return Math.abs(this.deckA.track.bpm - this.deckB.track.bpm);
  }

  getKeyCompatibility(): boolean {
    if (!this.deckA.track || !this.deckB.track) return false;
    // Simplified key compatibility check
    return this.deckA.track.key === this.deckB.track.key;
  }

  getTransitionQuality(): number {
    const bpmDiff = this.getBPMDifference();
    const keyCompat = this.getKeyCompatibility();
    const energyDiff = Math.abs(
      (this.deckA.track?.energy || 0) - (this.deckB.track?.energy || 0)
    );

    let score = 100;
    score -= Math.min(40, bpmDiff * 2); // Penalize BPM differences
    score -= keyCompat ? 0 : 20; // Penalize key incompatibility
    score -= energyDiff * 20; // Penalize energy jumps

    return Math.max(0, score);
  }

  // Auto-sync features
  autoSyncBPM(sourceDeck: 'A' | 'B', targetDeck: 'A' | 'B'): void {
    const source = sourceDeck === 'A' ? this.deckA : this.deckB;
    const target = targetDeck === 'A' ? this.deckA : this.deckB;

    if (!source.track || !target.track) return;

    const bpmRatio = source.track.bpm / target.track.bpm;
    this.setDeckTempo(targetDeck, bpmRatio);
    this.emitEvent('auto_sync_applied', { sourceDeck, targetDeck, bpmRatio });
  }

  // Getters
  getDeckState(deckId: 'A' | 'B'): DeckState {
    return deckId === 'A' ? this.deckA : this.deckB;
  }

  getMixerState(): MixerState {
    return this.mixer;
  }

  getCurrentAnalysis(): RealTimeAnalysis | null {
    return this.currentAnalysis;
  }

  getCrowdResponse(): CrowdResponse | null {
    return this.crowdResponse;
  }

  // Performance metrics
  getPerformanceMetrics(): {
    cpu: number;
    memory: number;
    latency: number;
    bufferHealth: number;
  } {
    return {
      cpu: Math.random() * 30 + 10, // Simulated CPU usage
      memory: Math.random() * 100 + 50, // Simulated memory usage (MB)
      latency: this.currentAnalysis?.analysisLatency || 0,
      bufferHealth: Math.random() * 20 + 80, // Simulated buffer health %
    };
  }

  // Cleanup
  destroy(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
    if (this.crowdSimulationInterval) {
      clearInterval(this.crowdSimulationInterval);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.eventListeners.clear();
  }
}
