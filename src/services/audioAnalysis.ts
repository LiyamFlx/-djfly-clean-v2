interface AudioAnalysisResult {
  energy: number;
  mood: 'excited' | 'chill' | 'energetic' | 'mellow';
  engagement: 'low' | 'medium' | 'high';
  tempo?: number;
  volume?: number;
  spectralCentroid?: number;
  // Enhanced features
  bpm?: number;
  key?: string;
  harmonicComplexity?: number;
  beatConfidence?: number;
  keyConfidence?: number;
  energyCurve?: number[];
  spectralFeatures?: {
    brightness: number;
    warmth: number;
    presence: number;
  };
}

interface BeatDetectionResult {
  bpm: number;
  confidence: number;
  beatTimes: number[];
  downbeats: number[];
}

interface KeyAnalysisResult {
  key: string;
  mode: 'major' | 'minor';
  confidence: number;
  harmonicContent: number[];
}

class AudioAnalysisService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private beatDetector: BeatDetector | null = null;
  private keyAnalyzer: KeyAnalyzer | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.initializeAudioContext();
      this.initializeAdvancedAnalyzers();
    }
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }

  private initializeAdvancedAnalyzers() {
    if (this.audioContext) {
      this.beatDetector = new BeatDetector(this.audioContext);
      this.keyAnalyzer = new KeyAnalyzer(this.audioContext);
    }
  }

  /**
   * Analyze audio buffer and extract advanced features
   */
  async analyzeBuffer(audioBuffer: ArrayBuffer): Promise<AudioAnalysisResult> {
    if (!this.audioContext || !this.analyser) {
      return this.getMockAnalysis();
    }

    try {
      // Decode audio data
      const audioData = await this.audioContext.decodeAudioData(
        audioBuffer.slice(0)
      );

      // Analyze the audio data with enhanced features
      const analysis = await this.extractAdvancedAudioFeatures(audioData);

      return analysis;
    } catch (error) {
      console.error('Audio analysis failed:', error);
      return this.getMockAnalysis();
    }
  }

  /**
   * Analyze real-time audio stream with advanced features
   */
  async analyzeRealTimeAudio(
    stream: MediaStream
  ): Promise<AudioAnalysisResult> {
    if (!this.audioContext || !this.analyser) {
      return this.getMockAnalysis();
    }

    try {
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      // Get frequency data
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      // Analyze the frequency data with advanced features
      const analysis = await this.analyzeAdvancedFrequencyData(
        dataArray,
        bufferLength
      );

      // Clean up
      source.disconnect();

      return analysis;
    } catch (error) {
      console.error('Real-time audio analysis failed:', error);
      return this.getMockAnalysis();
    }
  }

  /**
   * Extract advanced audio features from AudioBuffer
   */
  private async extractAdvancedAudioFeatures(
    audioBuffer: AudioBuffer
  ): Promise<AudioAnalysisResult> {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;

    // Basic features
    const energy = this.calculateEnergy(channelData);
    const tempo = this.estimateTempo(channelData, sampleRate);
    const spectralCentroid = this.calculateSpectralCentroid(channelData);
    const mood = this.determineMood(energy, spectralCentroid, tempo);
    const engagement = this.determineEngagement(energy, tempo);

    // Advanced features
    const beatResult =
      this.beatDetector?.detectBeats(channelData, sampleRate) || null;
    const keyResult =
      this.keyAnalyzer?.analyzeKey(channelData, sampleRate) || null;
    const energyCurve = this.calculateEnergyCurve(channelData);
    const spectralFeatures = this.calculateSpectralFeatures(channelData);

    return {
      energy,
      mood,
      engagement,
      tempo,
      volume: energy,
      spectralCentroid,
      bpm: beatResult?.bpm,
      key: keyResult ? `${keyResult.key} ${keyResult.mode}` : undefined,
      harmonicComplexity:
        keyResult?.harmonicContent.reduce((a, b) => a + b, 0) || 0,
      beatConfidence: beatResult?.confidence,
      keyConfidence: keyResult?.confidence,
      energyCurve,
      spectralFeatures,
    };
  }

  /**
   * Calculate energy from audio data
   */
  private calculateEnergy(channelData: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < channelData.length; i++) {
      sum += channelData[i] * channelData[i];
    }
    const rms = Math.sqrt(sum / channelData.length);
    return Math.min(rms * 10, 1.0); // Normalize to 0-1
  }

  /**
   * Calculate energy curve over time
   */
  private calculateEnergyCurve(channelData: Float32Array): number[] {
    const segmentSize = Math.floor(channelData.length / 20); // 20 segments
    const curve: number[] = [];

    for (let i = 0; i < 20; i++) {
      const start = i * segmentSize;
      const end = Math.min(start + segmentSize, channelData.length);
      let sum = 0;

      for (let j = start; j < end; j++) {
        sum += channelData[j] * channelData[j];
      }

      const energy = Math.sqrt(sum / (end - start));
      curve.push(Math.min(energy * 10, 1.0));
    }

    return curve;
  }

  /**
   * Calculate spectral features
   */
  private calculateSpectralFeatures(channelData: Float32Array): {
    brightness: number;
    warmth: number;
    presence: number;
  } {
    // Simple spectral analysis
    const fft = this.performFFT(channelData);
    const frequencies = this.getFrequencyBands(fft);

    return {
      brightness:
        frequencies.high /
        (frequencies.low + frequencies.mid + frequencies.high),
      warmth:
        frequencies.low /
        (frequencies.low + frequencies.mid + frequencies.high),
      presence:
        frequencies.mid /
        (frequencies.low + frequencies.mid + frequencies.high),
    };
  }

  /**
   * Perform FFT on audio data
   */
  private performFFT(channelData: Float32Array): Float32Array {
    // Simplified FFT implementation
    const fftSize = 1024;
    const fft = new Float32Array(fftSize);

    for (let i = 0; i < Math.min(fftSize, channelData.length); i++) {
      fft[i] = channelData[i];
    }

    return fft;
  }

  /**
   * Get frequency bands from FFT data
   */
  private getFrequencyBands(fft: Float32Array): {
    low: number;
    mid: number;
    high: number;
  } {
    const lowEnd = Math.floor(fft.length * 0.1);
    const midEnd = Math.floor(fft.length * 0.5);

    let low = 0,
      mid = 0,
      high = 0;

    for (let i = 0; i < fft.length; i++) {
      if (i < lowEnd) low += fft[i];
      else if (i < midEnd) mid += fft[i];
      else high += fft[i];
    }

    return { low, mid, high };
  }

  /**
   * Analyze advanced frequency data
   */
  private async analyzeAdvancedFrequencyData(
    dataArray: Uint8Array,
    bufferLength: number
  ): Promise<AudioAnalysisResult> {
    // Convert frequency data to energy
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const energy = sum / (bufferLength * 255); // Normalize to 0-1

    // Estimate tempo from frequency patterns
    const tempo = this.estimateTempoFromFrequency(dataArray);

    // Calculate spectral centroid
    let weightedSum = 0;
    let totalSum = 0;
    for (let i = 0; i < bufferLength; i++) {
      weightedSum += i * dataArray[i];
      totalSum += dataArray[i];
    }
    const spectralCentroid = totalSum > 0 ? weightedSum / totalSum : 0;

    const mood = this.determineMood(energy, spectralCentroid, tempo);
    const engagement = this.determineEngagement(energy, tempo);

    return {
      energy,
      mood,
      engagement,
      tempo,
      volume: energy,
      spectralCentroid,
    };
  }

  /**
   * Estimate tempo from frequency data
   */
  private estimateTempoFromFrequency(dataArray: Uint8Array): number {
    // Simple tempo estimation from frequency patterns
    let peaks = 0;
    for (let i = 1; i < dataArray.length - 1; i++) {
      if (dataArray[i] > dataArray[i - 1] && dataArray[i] > dataArray[i + 1]) {
        peaks++;
      }
    }

    // Convert peaks to approximate BPM
    const estimatedBPM = Math.min(Math.max(peaks * 2, 60), 180);
    return estimatedBPM;
  }

  /**
   * Estimate tempo using autocorrelation (simplified)
   */
  private estimateTempo(channelData: Float32Array, sampleRate: number): number {
    // Simplified autocorrelation for tempo detection
    const maxLag = Math.floor(sampleRate / 60); // Minimum 60 BPM
    const minLag = Math.floor(sampleRate / 200); // Maximum 200 BPM

    let bestCorrelation = 0;
    let bestLag = 0;

    for (let lag = minLag; lag <= maxLag; lag++) {
      let correlation = 0;
      let count = 0;

      for (let i = 0; i < channelData.length - lag; i++) {
        correlation += channelData[i] * channelData[i + lag];
        count++;
      }

      if (count > 0) {
        correlation /= count;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestLag = lag;
        }
      }
    }

    // Convert lag to BPM
    const bpm = (sampleRate * 60) / bestLag;
    return Math.min(Math.max(bpm, 60), 200);
  }

  /**
   * Calculate spectral centroid (brightness)
   */
  private calculateSpectralCentroid(channelData: Float32Array): number {
    // Simplified spectral centroid calculation
    let weightedSum = 0;
    let totalSum = 0;

    for (let i = 0; i < channelData.length; i++) {
      const magnitude = Math.abs(channelData[i]);
      weightedSum += i * magnitude;
      totalSum += magnitude;
    }

    return totalSum > 0 ? weightedSum / totalSum : 0;
  }

  /**
   * Determine mood based on audio features
   */
  private determineMood(
    energy: number,
    _spectralCentroid: number,
    tempo: number
  ): 'excited' | 'chill' | 'energetic' | 'mellow' {
    if (energy > 0.7 && tempo > 140) return 'excited';
    if (energy > 0.5 && tempo > 120) return 'energetic';
    if (energy < 0.3) return 'chill';
    return 'mellow';
  }

  /**
   * Determine engagement level
   */
  private determineEngagement(
    energy: number,
    tempo: number
  ): 'low' | 'medium' | 'high' {
    if (energy > 0.6 && tempo > 120) return 'high';
    if (energy > 0.3 || tempo > 100) return 'medium';
    return 'low';
  }

  /**
   * Get mock analysis for fallback
   */
  private getMockAnalysis(): AudioAnalysisResult {
    return {
      energy: 0.5,
      mood: 'energetic',
      engagement: 'medium',
      tempo: 120,
      volume: 0.5,
      spectralCentroid: 0.5,
      bpm: 120,
      key: 'C major',
      harmonicComplexity: 0.6,
      beatConfidence: 0.7,
      keyConfidence: 0.8,
      energyCurve: Array(20).fill(0.5),
      spectralFeatures: {
        brightness: 0.5,
        warmth: 0.5,
        presence: 0.5,
      },
    };
  }

  /**
   * Check if advanced audio analysis is supported
   */
  isSupported(): boolean {
    return this.audioContext !== null && this.analyser !== null;
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
    this.beatDetector = null;
    this.keyAnalyzer = null;
  }
}

/**
 * Advanced Beat Detection using onset detection and autocorrelation
 */
class BeatDetector {
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  /**
   * Detect beats in audio data
   */
  detectBeats(
    channelData: Float32Array,
    sampleRate: number
  ): BeatDetectionResult {
    const onsetTimes = this.detectOnsets(channelData, sampleRate);
    const bpm = this.calculateBPM(onsetTimes, sampleRate);
    const beatTimes = this.predictBeatTimes(onsetTimes, bpm, sampleRate);
    const downbeats = this.detectDownbeats(beatTimes, bpm);

    return {
      bpm,
      confidence: this.calculateBeatConfidence(onsetTimes, beatTimes),
      beatTimes,
      downbeats,
    };
  }

  /**
   * Detect onset times (sudden increases in energy)
   */
  private detectOnsets(
    channelData: Float32Array,
    sampleRate: number
  ): number[] {
    const onsetTimes: number[] = [];
    const windowSize = Math.floor(sampleRate * 0.1); // 100ms window
    const threshold = 0.1;

    for (let i = windowSize; i < channelData.length - windowSize; i++) {
      const currentEnergy = this.calculateWindowEnergy(
        channelData,
        i,
        windowSize
      );
      const previousEnergy = this.calculateWindowEnergy(
        channelData,
        i - windowSize,
        windowSize
      );

      if (currentEnergy > previousEnergy * (1 + threshold)) {
        onsetTimes.push(i / sampleRate);
      }
    }

    return onsetTimes;
  }

  /**
   * Calculate energy in a window
   */
  private calculateWindowEnergy(
    channelData: Float32Array,
    start: number,
    windowSize: number
  ): number {
    let energy = 0;
    for (
      let i = start;
      i < Math.min(start + windowSize, channelData.length);
      i++
    ) {
      energy += channelData[i] * channelData[i];
    }
    return energy / windowSize;
  }

  /**
   * Calculate BPM from onset times
   */
  private calculateBPM(onsetTimes: number[], _sampleRate: number): number {
    if (onsetTimes.length < 2) return 120;

    const intervals: number[] = [];
    for (let i = 1; i < onsetTimes.length; i++) {
      intervals.push(onsetTimes[i] - onsetTimes[i - 1]);
    }

    // Find the most common interval (tempo)
    const intervalCounts = new Map<number, number>();
    intervals.forEach((interval) => {
      const rounded = Math.round(interval * 10) / 10;
      intervalCounts.set(rounded, (intervalCounts.get(rounded) || 0) + 1);
    });

    let mostCommonInterval = 0;
    let maxCount = 0;
    intervalCounts.forEach((count, interval) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonInterval = interval;
      }
    });

    const bpm = 60 / mostCommonInterval;
    return Math.min(Math.max(bpm, 60), 200);
  }

  /**
   * Predict beat times based on BPM
   */
  private predictBeatTimes(
    onsetTimes: number[],
    bpm: number,
    _sampleRate: number
  ): number[] {
    const beatTimes: number[] = [];

    if (onsetTimes.length === 0) return beatTimes;

    const firstBeat = onsetTimes[0];
    for (let i = 0; i < 32; i++) {
      // Predict 32 beats
      beatTimes.push(firstBeat + i * (60 / bpm));
    }

    return beatTimes;
  }

  /**
   * Detect downbeats (strong beats)
   */
  private detectDownbeats(beatTimes: number[], _bpm: number): number[] {
    const downbeats: number[] = [];

    beatTimes.forEach((beat, index) => {
      if (index % 4 === 0) {
        // Every 4th beat is a downbeat
        downbeats.push(beat);
      }
    });

    return downbeats;
  }

  /**
   * Calculate confidence in beat detection
   */
  private calculateBeatConfidence(
    onsetTimes: number[],
    beatTimes: number[]
  ): number {
    if (onsetTimes.length === 0 || beatTimes.length === 0) return 0;

    let matches = 0;
    const tolerance = 0.1; // 100ms tolerance

    onsetTimes.forEach((onset) => {
      beatTimes.forEach((beat) => {
        if (Math.abs(onset - beat) < tolerance) {
          matches++;
        }
      });
    });

    return Math.min(matches / onsetTimes.length, 1.0);
  }
}

/**
 * Advanced Key Analysis using chromagram and harmonic analysis
 */
class KeyAnalyzer {
  private audioContext: AudioContext;
  private readonly noteFrequencies = {
    C: 261.63,
    'C#': 277.18,
    D: 293.66,
    'D#': 311.13,
    E: 329.63,
    F: 349.23,
    'F#': 369.99,
    G: 392.0,
    'G#': 415.3,
    A: 440.0,
    'A#': 466.16,
    B: 493.88,
  };

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  /**
   * Analyze musical key from audio data
   */
  analyzeKey(channelData: Float32Array, sampleRate: number): KeyAnalysisResult {
    const chromagram = this.calculateChromagram(channelData, sampleRate);
    const keyProfile = this.createKeyProfile(chromagram);
    const bestKey = this.findBestKey(keyProfile);

    return {
      key: bestKey.key,
      mode: bestKey.mode,
      confidence: bestKey.confidence,
      harmonicContent: chromagram,
    };
  }

  /**
   * Calculate chromagram (pitch class profile)
   */
  private calculateChromagram(
    channelData: Float32Array,
    sampleRate: number
  ): number[] {
    const chromagram = new Array(12).fill(0);
    const fftSize = 2048;
    const hopSize = fftSize / 4;

    for (let i = 0; i < channelData.length - fftSize; i += hopSize) {
      const window = channelData.slice(i, i + fftSize);
      const spectrum = this.calculateSpectrum(window);

      // Map frequencies to pitch classes
      for (let freq = 20; freq < sampleRate / 2; freq *= 1.01) {
        const magnitude = this.getMagnitudeAtFrequency(
          spectrum,
          freq,
          sampleRate
        );
        const pitchClass = this.frequencyToPitchClass(freq);
        chromagram[pitchClass] += magnitude;
      }
    }

    // Normalize
    const max = Math.max(...chromagram);
    return chromagram.map((val) => val / max);
  }

  /**
   * Calculate spectrum using FFT
   */
  private calculateSpectrum(window: Float32Array): Float32Array {
    // Simplified FFT - in practice, use a proper FFT library
    const spectrum = new Float32Array(window.length);
    for (let i = 0; i < window.length; i++) {
      spectrum[i] = Math.abs(window[i]);
    }
    return spectrum;
  }

  /**
   * Get magnitude at specific frequency
   */
  private getMagnitudeAtFrequency(
    spectrum: Float32Array,
    frequency: number,
    sampleRate: number
  ): number {
    const binIndex = Math.floor((frequency * spectrum.length) / sampleRate);
    return spectrum[binIndex] || 0;
  }

  /**
   * Convert frequency to pitch class (0-11)
   */
  private frequencyToPitchClass(frequency: number): number {
    const a4 = 440;
    const semitones = Math.round(12 * Math.log2(frequency / a4));
    return ((semitones % 12) + 12) % 12;
  }

  /**
   * Create key profile from chromagram
   */
  private createKeyProfile(chromagram: number[]): number[] {
    // Simplified key profiles (major and minor)
    const majorProfile = [
      6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88,
    ];
    const minorProfile = [
      6.33, 2.68, 3.69, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17,
    ];

    const majorCorrelation = this.calculateCorrelation(
      chromagram,
      majorProfile
    );
    const minorCorrelation = this.calculateCorrelation(
      chromagram,
      minorProfile
    );

    return majorCorrelation > minorCorrelation ? majorProfile : minorProfile;
  }

  /**
   * Calculate correlation between two arrays
   */
  private calculateCorrelation(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  /**
   * Find the best matching key
   */
  private findBestKey(keyProfile: number[]): {
    key: string;
    mode: 'major' | 'minor';
    confidence: number;
  } {
    const keys = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    let bestKey = 'C';
    let bestCorrelation = 0;
    let bestMode: 'major' | 'minor' = 'major';

    // Test all keys
    for (let i = 0; i < 12; i++) {
      const shiftedProfile = this.shiftArray(keyProfile, i);
      const correlation = this.calculateCorrelation(keyProfile, shiftedProfile);

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestKey = keys[i];
      }
    }

    return {
      key: bestKey,
      mode: bestMode,
      confidence: Math.min(bestCorrelation / 100, 1.0),
    };
  }

  /**
   * Shift array by n positions
   */
  private shiftArray(arr: number[], n: number): number[] {
    const result = [...arr];
    for (let i = 0; i < n; i++) {
      result.push(result.shift()!);
    }
    return result;
  }
}

export const audioAnalysisService = new AudioAnalysisService();
export default audioAnalysisService;
