import { Track } from '@/types';

export interface AudioFeatures {
  bpm: number;
  key: string;
  energy: number;
  valence: number;
  danceability: number;
  loudness: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
}

export interface CrossfadeSettings {
  duration: number; // in milliseconds
  curve: 'linear' | 'exponential' | 'logarithmic';
  eqMatching: boolean;
  keyMatching: boolean;
}

class AdvancedAudioService {
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private nextSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private nextGainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private crossfadeSettings: CrossfadeSettings = {
    duration: 3000,
    curve: 'exponential',
    eqMatching: true,
    keyMatching: false
  };

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        this.setupAudioGraph();
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
      }
    }
  }

  private setupAudioGraph() {
    if (!this.audioContext) return;

    // Create main gain node
    this.gainNode = this.audioContext.createGain();
    this.nextGainNode = this.audioContext.createGain();
    
    // Create analyser for real-time analysis
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    // Connect nodes
    this.gainNode.connect(this.analyser);
    this.nextGainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    // Set initial volumes
    this.gainNode.gain.value = 1.0;
    this.nextGainNode.gain.value = 0.0;
  }

  /**
   * Load and decode audio file
   */
  async loadTrack(track: Track): Promise<AudioBuffer | null> {
    if (!this.audioContext || !track.preview_url) {
      return null;
    }

    try {
      // Check if already loaded
      if (this.buffers.has(track.id)) {
        return this.buffers.get(track.id)!;
      }

      const response = await fetch(track.preview_url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Cache the buffer
      this.buffers.set(track.id, audioBuffer);
      
      return audioBuffer;
    } catch (error) {
      console.error('Failed to load track:', error);
      return null;
    }
  }

  /**
   * Analyze audio buffer for BPM detection
   */
  async analyzeBPM(audioBuffer: AudioBuffer): Promise<number> {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Apply high-pass filter to isolate percussive content
    const filteredData = this.highPassFilter(channelData, sampleRate, 200);
    
    // Calculate onset detection function
    const onsets = this.detectOnsets(filteredData, sampleRate);
    
    // Find tempo using autocorrelation
    const bpm = this.calculateTempo(onsets, sampleRate);
    
    return Math.round(bpm);
  }

  private highPassFilter(data: Float32Array, sampleRate: number, cutoff: number): Float32Array {
    const filtered = new Float32Array(data.length);
    const RC = 1.0 / (cutoff * 2 * Math.PI);
    const dt = 1.0 / sampleRate;
    const alpha = RC / (RC + dt);
    
    filtered[0] = data[0];
    for (let i = 1; i < data.length; i++) {
      filtered[i] = alpha * (filtered[i - 1] + data[i] - data[i - 1]);
    }
    
    return filtered;
  }

  private detectOnsets(data: Float32Array, _sampleRate: number): number[] {
    const onsets: number[] = [];
    const windowSize = Math.floor(sampleRate * 0.1); // 100ms windows
    const hopSize = Math.floor(windowSize / 2);
    
    let previousEnergy = 0;
    
    for (let i = 0; i < data.length - windowSize; i += hopSize) {
      // Calculate energy in current window
      let energy = 0;
      for (let j = i; j < i + windowSize; j++) {
        energy += data[j] * data[j];
      }
      energy = Math.sqrt(energy / windowSize);
      
      // Detect onset if energy increase is significant
      if (energy > previousEnergy * 1.3 && energy > 0.01) {
        onsets.push(i / sampleRate);
      }
      
      previousEnergy = energy;
    }
    
    return onsets;
  }

  private calculateTempo(onsets: number[], sampleRate: number): number {
    if (onsets.length < 2) return 120; // Default BPM
    
    // Calculate inter-onset intervals
    const intervals: number[] = [];
    for (let i = 1; i < onsets.length; i++) {
      intervals.push(onsets[i] - onsets[i - 1]);
    }
    
    // Find most common interval (mode)
    const histogram: { [key: number]: number } = {};
    intervals.forEach(interval => {
      const rounded = Math.round(interval * 100) / 100; // Round to nearest 10ms
      histogram[rounded] = (histogram[rounded] || 0) + 1;
    });
    
    // Find the most frequent interval
    let maxCount = 0;
    let mostCommonInterval = 0.5; // Default to 120 BPM
    
    for (const [interval, count] of Object.entries(histogram)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonInterval = parseFloat(interval);
      }
    }
    
    // Convert interval to BPM
    const bpm = 60 / mostCommonInterval;
    
    // Ensure BPM is in reasonable range
    return Math.max(60, Math.min(200, bpm));
  }

  /**
   * Detect musical key
   */
  async analyzeKey(audioBuffer: AudioBuffer): Promise<string> {
    const channelData = audioBuffer.getChannelData(0);
    
    // This is a simplified key detection algorithm
    // In practice, you'd use more sophisticated methods like chromagram analysis
    const chromaVector = this.calculateChromaVector(channelData, audioBuffer.sampleRate);
    const keyIndex = this.findStrongestChroma(chromaVector);
    
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return keys[keyIndex];
  }

  private calculateChromaVector(data: Float32Array, sampleRate: number): Float32Array {
    // Simplified chroma calculation
    const chroma = new Float32Array(12);
    const fftSize = 2048;
    const hopSize = 512;
    
    for (let i = 0; i < data.length - fftSize; i += hopSize) {
      const window = data.slice(i, i + fftSize);
      const spectrum = this.fft(window);
      
      // Map spectrum to chroma bins
      for (let bin = 0; bin < spectrum.length / 2; bin++) {
        const freq = (bin * sampleRate) / fftSize;
        const magnitude = Math.sqrt(spectrum[bin * 2] ** 2 + spectrum[bin * 2 + 1] ** 2);
        
        if (freq > 80 && freq < 5000) { // Focus on musical range
          const pitch = this.frequencyToPitch(freq);
          chroma[pitch % 12] += magnitude;
        }
      }
    }
    
    return chroma;
  }

  private fft(data: Float32Array): Float32Array {
    // Simplified FFT implementation (in practice, use a proper FFT library)
    const N = data.length;
    const result = new Float32Array(N * 2);
    
    for (let k = 0; k < N; k++) {
      let realSum = 0;
      let imagSum = 0;
      
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        realSum += data[n] * Math.cos(angle);
        imagSum += data[n] * Math.sin(angle);
      }
      
      result[k * 2] = realSum;
      result[k * 2 + 1] = imagSum;
    }
    
    return result;
  }

  private frequencyToPitch(frequency: number): number {
    // Convert frequency to MIDI note number
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);
    
    if (frequency <= 0) return 0;
    
    const noteNumber = Math.round(12 * Math.log2(frequency / C0));
    return Math.max(0, noteNumber);
  }

  private findStrongestChroma(chroma: Float32Array): number {
    let maxIndex = 0;
    let maxValue = chroma[0];
    
    for (let i = 1; i < chroma.length; i++) {
      if (chroma[i] > maxValue) {
        maxValue = chroma[i];
        maxIndex = i;
      }
    }
    
    return maxIndex;
  }

  /**
   * Perform crossfade between two tracks
   */
  async crossfade(
    currentBuffer: AudioBuffer,
    nextBuffer: AudioBuffer,
    startTime: number,
    settings: Partial<CrossfadeSettings> = {}
  ): Promise<void> {
    if (!this.audioContext || !this.gainNode || !this.nextGainNode) {
      throw new Error('Audio context not initialized');
    }

    const crossfadeSettings = { ...this.crossfadeSettings, ...settings };
    const duration = crossfadeSettings.duration / 1000; // Convert to seconds
    
    // Stop current sources if playing
    if (this.currentSource) {
      this.currentSource.stop();
    }
    if (this.nextSource) {
      this.nextSource.stop();
    }

    // Create new sources
    this.currentSource = this.audioContext.createBufferSource();
    this.nextSource = this.audioContext.createBufferSource();
    
    this.currentSource.buffer = currentBuffer;
    this.nextSource.buffer = nextBuffer;
    
    // Connect sources to gain nodes
    this.currentSource.connect(this.gainNode);
    this.nextSource.connect(this.nextGainNode);

    // Set up crossfade automation
    const now = this.audioContext.currentTime;
    const fadeStartTime = now + startTime;
    
    // Current track fade out
    this.gainNode.gain.setValueAtTime(1.0, fadeStartTime);
    
    if (crossfadeSettings.curve === 'linear') {
      this.gainNode.gain.linearRampToValueAtTime(0.0, fadeStartTime + duration);
    } else {
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, fadeStartTime + duration);
    }
    
    // Next track fade in
    this.nextGainNode.gain.setValueAtTime(0.0, fadeStartTime);
    
    if (crossfadeSettings.curve === 'linear') {
      this.nextGainNode.gain.linearRampToValueAtTime(1.0, fadeStartTime + duration);
    } else {
      this.nextGainNode.gain.exponentialRampToValueAtTime(1.0, fadeStartTime + duration);
    }

    // Start playback
    this.currentSource.start(now);
    this.nextSource.start(now + startTime);

    // Clean up after crossfade
    setTimeout(() => {
      if (this.currentSource) {
        this.currentSource.disconnect();
        this.currentSource = null;
      }
      
      // Swap sources
      this.currentSource = this.nextSource;
      this.nextSource = null;
      
      // Swap gain nodes
      const tempGain = this.gainNode;
      this.gainNode = this.nextGainNode;
      this.nextGainNode = tempGain;
      
      // Reset gain values
      if (this.gainNode) this.gainNode.gain.value = 1.0;
      if (this.nextGainNode) this.nextGainNode.gain.value = 0.0;
      
    }, (startTime + duration) * 1000);
  }

  /**
   * Apply EQ matching for smooth transitions
   */
  async applyEQMatching(track1: AudioBuffer, track2: AudioBuffer): Promise<{
    eq1: number[];
    eq2: number[];
  }> {
    // Analyze frequency content of both tracks
    const spectrum1 = this.analyzeSpectrum(track1);
    const spectrum2 = this.analyzeSpectrum(track2);
    
    // Calculate EQ adjustments to match spectral content
    const eqBands = 10; // Number of EQ bands
    const eq1 = new Array(eqBands).fill(0);
    const eq2 = new Array(eqBands).fill(0);
    
    for (let band = 0; band < eqBands; band++) {
      const freq1 = spectrum1[band];
      const freq2 = spectrum2[band];
      
      if (freq1 > freq2) {
        eq1[band] = -Math.min(6, Math.log10(freq1 / freq2) * 20); // Reduce band 1
        eq2[band] = Math.min(6, Math.log10(freq1 / freq2) * 20);  // Boost band 2
      } else {
        eq1[band] = Math.min(6, Math.log10(freq2 / freq1) * 20);  // Boost band 1
        eq2[band] = -Math.min(6, Math.log10(freq2 / freq1) * 20); // Reduce band 2
      }
    }
    
    return { eq1, eq2 };
  }

  private analyzeSpectrum(audioBuffer: AudioBuffer): number[] {
    const channelData = audioBuffer.getChannelData(0);
    const fftSize = 2048;
    const bands = 10;
    const spectrum = new Array(bands).fill(0);
    
    // Analyze multiple windows
    const windows = Math.floor(channelData.length / fftSize);
    
    for (let w = 0; w < windows; w++) {
      const start = w * fftSize;
      const window = channelData.slice(start, start + fftSize);
      const fftResult = this.fft(window);
      
      // Sum energy in frequency bands
      const binsPerBand = Math.floor(fftSize / 2 / bands);
      
      for (let band = 0; band < bands; band++) {
        let bandEnergy = 0;
        const startBin = band * binsPerBand;
        const endBin = Math.min(startBin + binsPerBand, fftSize / 2);
        
        for (let bin = startBin; bin < endBin; bin++) {
          const real = fftResult[bin * 2];
          const imag = fftResult[bin * 2 + 1];
          bandEnergy += Math.sqrt(real * real + imag * imag);
        }
        
        spectrum[band] += bandEnergy / binsPerBand;
      }
    }
    
    // Average across windows
    return spectrum.map(energy => energy / windows);
  }

  /**
   * Get real-time audio analysis
   */
  getRealtimeAnalysis(): {
    volume: number;
    frequencies: Uint8Array;
    waveform: Uint8Array;
  } {
    if (!this.analyser) {
      return {
        volume: 0,
        frequencies: new Uint8Array(128),
        waveform: new Uint8Array(128)
      };
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const frequencies = new Uint8Array(bufferLength);
    const waveform = new Uint8Array(bufferLength);
    
    this.analyser.getByteFrequencyData(frequencies);
    this.analyser.getByteTimeDomainData(waveform);
    
    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < waveform.length; i++) {
      const sample = (waveform[i] - 128) / 128;
      sum += sample * sample;
    }
    const volume = Math.sqrt(sum / waveform.length);
    
    return { volume, frequencies, waveform };
  }

  /**
   * Set crossfade settings
   */
  setCrossfadeSettings(settings: Partial<CrossfadeSettings>) {
    this.crossfadeSettings = { ...this.crossfadeSettings, ...settings };
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource.disconnect();
    }
    
    if (this.nextSource) {
      this.nextSource.stop();
      this.nextSource.disconnect();
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    this.buffers.clear();
  }
}

export const advancedAudioService = new AdvancedAudioService();
export default advancedAudioService;