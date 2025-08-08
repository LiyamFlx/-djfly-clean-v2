// Audio Engine Types
export interface AudioBuffer {
  duration: number;
  length: number;
  numberOfChannels: number;
  sampleRate: number;
  getChannelData(channel: number): Float32Array;
}

export interface AudioContext {
  sampleRate: number;
  createBufferSource(): AudioBufferSourceNode;
  createGain(): GainNode;
  createAnalyser(): AnalyserNode;
  createBiquadFilter(): BiquadFilterNode;
  decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer>;
}

export interface AudioNode {
  connect(destination: AudioNode): void;
  disconnect(): void;
}

export interface AudioBufferSourceNode extends AudioNode {
  buffer: AudioBuffer | null;
  playbackRate: AudioParam;
  start(when?: number, offset?: number, duration?: number): void;
  stop(when?: number): void;
}

export interface GainNode extends AudioNode {
  gain: AudioParam;
}

export interface AnalyserNode extends AudioNode {
  frequencyBinCount: number;
  getByteFrequencyData(array: Uint8Array): void;
  getByteTimeDomainData(array: Uint8Array): void;
  getFloatFrequencyData(array: Float32Array): void;
  getFloatTimeDomainData(array: Float32Array): void;
}

export interface BiquadFilterNode extends AudioNode {
  type: BiquadFilterType;
  frequency: AudioParam;
  Q: AudioParam;
  gain: AudioParam;
}

export type BiquadFilterType =
  | 'lowpass'
  | 'highpass'
  | 'bandpass'
  | 'lowshelf'
  | 'highshelf'
  | 'peaking'
  | 'notch'
  | 'allpass';

export interface AudioParam {
  value: number;
  setValueAtTime(value: number, startTime: number): AudioParam;
  linearRampToValueAtTime(value: number, endTime: number): AudioParam;
  exponentialRampToValueAtTime(value: number, endTime: number): AudioParam;
}

// Enhanced Audio Analysis Types
export interface HarmonicAnalysis {
  key: string;
  mode: 'major' | 'minor' | 'dorian' | 'mixolydian' | 'unknown';
  harmonicComplexity: number;
  chordProgression: string[];
  keyConfidence: number;
}

export interface SpectralFeatures {
  brightness: number; // High frequency content
  warmth: number;     // Low frequency content
  presence: number;   // Mid frequency content
  clarity: number;    // Overall spectral clarity
}

export interface BeatStructure {
  bpm: number;
  bpmConfidence: number;
  downbeats: number[]; // Timestamps of downbeats
  phraseLength: number; // In beats
  sectionBoundaries: number[]; // Timestamps of section changes
  beatGrid: number[]; // Regular beat timestamps
}

export interface StemAnalysis {
  vocals: number;     // Vocal presence (0-1)
  drums: number;      // Drum presence (0-1)
  bass: number;       // Bass presence (0-1)
  other: number;      // Other instruments (0-1)
  separationQuality: number; // Quality of stem separation (0-1)
}

export interface AdvancedTrackAnalysis {
  // Basic features (existing)
  bpm: number;
  key: string;
  energy: number;
  valence: number;
  danceability: number;
  
  // Enhanced analysis
  harmonicAnalysis: HarmonicAnalysis;
  spectralFeatures: SpectralFeatures;
  beatStructure: BeatStructure;
  stemAnalysis?: StemAnalysis;
  
  // Energy analysis
  energyCurve: Array<{ time: number; value: number }>;
  peakEnergy: number;
  averageEnergy: number;
  
  // Transition analysis
  introLength: number;
  outroLength: number;
  buildUpPoints: number[];
  dropPoints: number[];
  
  // Compatibility scores
  harmonicCompatibility: { [key: string]: number };
  energyCompatibility: { [bpm: number]: number };
  transitionQuality: { [trackId: string]: number };
}

// Legacy AudioFeatures interface for compatibility
export interface AudioFeatures {
  bpm: number;
  key: string;
  energy: number;
  valence: number;
  danceability: number;
  loudness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  tempo: number;
  timeSignature: number;
}

// Enhanced Track interface with advanced analysis
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  image: string;
  preview_url?: string;
  spotify_url?: string;
  source: 'spotify' | 'youtube' | 'demo' | 'upload';

  // Basic audio features
  bpm?: number;
  key?: string;
  energy?: number;
  valence?: number;
  danceability?: number;
  popularity?: number;
  genre?: string;
  
  // Advanced analysis
  analysis?: AdvancedTrackAnalysis;
  
  // DJ-specific features
  hotCues?: Array<{
    id: string;
    time: number;
    label: string;
    color: string;
  }>;
  
  loops?: Array<{
    id: string;
    start: number;
    end: number;
    active: boolean;
  }>;
  
  // Metadata
  tags?: string[];
  notes?: string;
  rating?: number;
  playCount?: number;
  lastPlayed?: string;
}

// Audio Engine State
export interface AudioEngineState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  currentTime: number;
  duration: number;
  volume: number;
  crossfadeTime: number;
  
  // Enhanced features
  pitch: number; // Pitch shift (-12 to +12 semitones)
  tempo: number; // Tempo multiplier (0.5 to 2.0)
  
  // Effects
  effects: {
    filter: { frequency: number; resonance: number; enabled: boolean };
    echo: { delay: number; feedback: number; enabled: boolean };
    reverb: { roomSize: number; dampening: number; enabled: boolean };
  };
  
  // Performance metrics
  latency: number;
  bufferHealth: number;
  cpuUsage: number;
}

// Real-time Audio Analysis
export interface RealTimeAnalysis {
  currentEnergy: number;
  spectralCentroid: number;
  spectralRolloff: number;
  zeroCrossingRate: number;
  rms: number;
  peak: number;
  
  // Beat detection
  beatConfidence: number;
  nextBeatTime: number;
  phaseAlignment: number;
  
  // Harmonic analysis
  currentKey: string;
  harmonicStability: number;
  
  // Performance metrics
  analysisLatency: number;
  processingTime: number;
}

// Audio Processing Pipeline
export interface AudioPipeline {
  input: AudioNode;
  analyzer: AnalyserNode;
  effects: {
    filter: BiquadFilterNode;
    echo: DelayNode;
    reverb: ConvolverNode;
  };
  output: AudioNode;
  
  // Analysis nodes
  fft: AnalyserNode;
  beatDetector: AudioWorkletNode;
  keyAnalyzer: AudioWorkletNode;
}

// Audio Quality Metrics
export interface AudioQualityMetrics {
  sampleRate: number;
  bitDepth: number;
  dynamicRange: number;
  signalToNoiseRatio: number;
  frequencyResponse: Array<{ frequency: number; amplitude: number }>;
  distortion: number;
  latency: number;
}

// Audio Export Options
export interface AudioExportOptions {
  format: 'wav' | 'mp3' | 'flac' | 'ogg';
  quality: number; // 0-1
  sampleRate: number;
  bitDepth: number;
  channels: number;
  normalize: boolean;
  fadeIn: number;
  fadeOut: number;
}

// Audio Control Types
export interface EQSettings {
  low: number; // -12 to +12 dB
  mid: number; // -12 to +12 dB
  high: number; // -12 to +12 dB
  lowFreq: number; // 60-250 Hz
  midFreq: number; // 250-2000 Hz
  highFreq: number; // 2000-8000 Hz
}

export interface FilterSettings {
  type: BiquadFilterType;
  frequency: number;
  Q: number;
  gain: number;
}

export interface CrossfaderSettings {
  position: number; // 0-100
  curve: 'linear' | 'exponential' | 'logarithmic';
  smoothness: number; // 0-1
}

export interface LoopSettings {
  start: number;
  end: number;
  enabled: boolean;
  beats: number;
}

// Audio Visualization Types
export interface WaveformData {
  data: Float32Array;
  sampleRate: number;
  duration: number;
}

export interface SpectrumData {
  frequencies: Float32Array;
  magnitudes: Float32Array;
  sampleRate: number;
}

export interface BeatGrid {
  beats: number[];
  bpm: number;
  offset: number;
}

// Audio Events
export interface AudioEvent {
  type:
    | 'play'
    | 'pause'
    | 'stop'
    | 'seek'
    | 'volume'
    | 'eq'
    | 'filter'
    | 'loop';
  timestamp: number;
  data?: unknown;
}

export interface AudioError {
  type: 'decode' | 'playback' | 'network' | 'permission';
  message: string;
  code?: string;
  details?: unknown;
}

// Audio Callbacks
export type AudioProgressCallback = (
  currentTime: number,
  duration: number
) => void;
export type AudioErrorCallback = (error: AudioError) => void;
export type AudioEventCallback = (event: AudioEvent) => void;
export type AudioAnalysisCallback = (features: AudioFeatures) => void;
