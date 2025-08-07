/**
 * Advanced Audio Effects Service for DJfly
 * Provides professional DJ effects using Web Audio API
 */

import { config } from '@/config/env';

export interface AudioEffectParams {
  wet: number; // 0-1, dry/wet mix
  bypass: boolean;
}

export interface FilterParams extends AudioEffectParams {
  frequency: number; // Hz
  resonance: number; // Q factor
  type: 'lowpass' | 'highpass' | 'bandpass' | 'notch';
}

export interface DelayParams extends AudioEffectParams {
  time: number; // seconds
  feedback: number; // 0-1
  highCut: number; // Hz
}

export interface ReverbParams extends AudioEffectParams {
  roomSize: number; // 0-1
  decay: number; // seconds
  damping: number; // 0-1
}

export interface DistortionParams extends AudioEffectParams {
  amount: number; // 0-100
  oversample: '2x' | '4x' | 'none';
}

export interface PhaserParams extends AudioEffectParams {
  rate: number; // Hz
  depth: number; // 0-1
  feedback: number; // 0-1
}

export interface CompressorParams extends AudioEffectParams {
  threshold: number; // dB
  ratio: number; // 1-20
  attack: number; // seconds
  release: number; // seconds
}

export interface EQBand {
  frequency: number; // Hz
  gain: number; // dB
  q: number; // Quality factor
  type: 'peaking' | 'lowshelf' | 'highshelf';
}

class AudioEffectsService {
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  // Effect nodes
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGainNode: GainNode | null = null;
  private delayFeedbackNode: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private distortionNode: WaveShaperNode | null = null;
  private compressorNode: DynamicsCompressorNode | null = null;
  private eqNodes: BiquadFilterNode[] = [];

  // LFO for modulation effects
  private lfoNode: OscillatorNode | null = null;
  private lfoGainNode: GainNode | null = null;

  // Performance monitoring
  private performanceMetrics = {
    latency: 0,
    bufferSize: 0,
    sampleRate: 0,
    cpuUsage: 0,
  };

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext)();

        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        this.setupAudioGraph();
        this.updatePerformanceMetrics();
      } catch (error) {
        console.error('Failed to initialize audio effects context:', error);
      }
    }
  }

  private setupAudioGraph() {
    if (!this.audioContext) return;

    // Create master gain node
    this.masterGainNode = this.audioContext.createGain();

    // Create analyser for real-time analysis
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = config.audio.bufferSize;
    this.analyserNode.smoothingTimeConstant = 0.8;

    // Initialize effect nodes
    this.initializeFilter();
    this.initializeDelay();
    this.initializeReverb();
    this.initializeDistortion();
    this.initializeCompressor();
    this.initializeEQ();
    this.initializeLFO();

    // Connect to destination
    this.masterGainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.audioContext.destination);
  }

  private initializeFilter() {
    if (!this.audioContext) return;

    this.filterNode = this.audioContext.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 20000; // Full range initially
    this.filterNode.Q.value = 1;
  }

  private initializeDelay() {
    if (!this.audioContext) return;

    this.delayNode = this.audioContext.createDelay(1.0); // Max 1 second delay
    this.delayGainNode = this.audioContext.createGain();
    this.delayFeedbackNode = this.audioContext.createGain();

    // Create delay feedback loop
    this.delayNode.connect(this.delayFeedbackNode);
    this.delayFeedbackNode.connect(this.delayNode);
    this.delayNode.connect(this.delayGainNode);

    // Default values
    this.delayNode.delayTime.value = 0.25; // 250ms
    this.delayFeedbackNode.gain.value = 0.3;
    this.delayGainNode.gain.value = 0;
  }

  private async initializeReverb() {
    if (!this.audioContext) return;

    this.reverbNode = this.audioContext.createConvolver();

    // Generate impulse response for reverb
    const impulseResponse = await this.generateReverbIR(
      2,
      3,
      false,
      this.audioContext
    );
    this.reverbNode.buffer = impulseResponse;
  }

  private async generateReverbIR(
    duration: number,
    decay: number,
    reverse: boolean,
    audioContext: AudioContext
  ): Promise<AudioBuffer> {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = reverse ? length - i : i;
        channelData[i] =
          (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      }
    }

    return impulse as AudioBuffer;
  }

  private initializeDistortion() {
    if (!this.audioContext) return;

    this.distortionNode = this.audioContext.createWaveShaper();
    (this.distortionNode as { curve: Float32Array }).curve = this.makeDistortionCurve(0);
    this.distortionNode.oversample = '2x';
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] =
        ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    return curve as Float32Array;
  }

  private initializeCompressor() {
    if (!this.audioContext) return;

    this.compressorNode = this.audioContext.createDynamicsCompressor();
    this.compressorNode.threshold.value = -24;
    this.compressorNode.knee.value = 30;
    this.compressorNode.ratio.value = 12;
    this.compressorNode.attack.value = 0.003;
    this.compressorNode.release.value = 0.25;
  }

  private initializeEQ() {
    if (!this.audioContext) return;

    // Create 4-band EQ
    const frequencies = [100, 500, 2000, 8000];
    // eslint-disable-next-line no-undef
    const types: BiquadFilterType[] = [
      'lowshelf',
      'peaking',
      'peaking',
      'highshelf',
    ];

    this.eqNodes = frequencies.map((freq, index) => {
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = types[index];
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0; // No boost/cut initially
      return filter;
    });

    // Chain EQ nodes
    for (let i = 0; i < this.eqNodes.length - 1; i++) {
      this.eqNodes[i].connect(this.eqNodes[i + 1]);
    }
  }

  private initializeLFO() {
    if (!this.audioContext) return;

    this.lfoNode = this.audioContext.createOscillator();
    this.lfoGainNode = this.audioContext.createGain();

    this.lfoNode.type = 'sine';
    this.lfoNode.frequency.value = 1; // 1 Hz
    this.lfoGainNode.gain.value = 0; // No modulation initially

    this.lfoNode.connect(this.lfoGainNode);
    this.lfoNode.start();
  }

  /**
   * Connect an audio source to the effects chain
   */
  connectSource(source: AudioNode): AudioNode {
    if (!this.audioContext || !this.masterGainNode) {
      throw new Error('Audio effects not initialized');
    }

    // Create effects chain
    let currentNode: AudioNode = source;

    // EQ chain
    if (this.eqNodes.length > 0) {
      currentNode.connect(this.eqNodes[0]);
      currentNode = this.eqNodes[this.eqNodes.length - 1];
    }

    // Filter
    if (this.filterNode) {
      currentNode.connect(this.filterNode);
      currentNode = this.filterNode;
    }

    // Distortion
    if (this.distortionNode) {
      currentNode.connect(this.distortionNode);
      currentNode = this.distortionNode;
    }

    // Compressor
    if (this.compressorNode) {
      currentNode.connect(this.compressorNode);
      currentNode = this.compressorNode;
    }

    // Delay (parallel)
    if (this.delayNode && this.delayGainNode) {
      currentNode.connect(this.delayNode);
    }

    // Reverb (parallel)
    if (this.reverbNode) {
      const reverbGain = this.audioContext.createGain();
      reverbGain.gain.value = 0; // No reverb initially
      currentNode.connect(this.reverbNode);
      this.reverbNode.connect(reverbGain);
      reverbGain.connect(this.masterGainNode);
    }

    // Connect dry signal and delay to master
    currentNode.connect(this.masterGainNode);
    if (this.delayGainNode) {
      this.delayGainNode.connect(this.masterGainNode);
    }

    return this.masterGainNode;
  }

  /**
   * Apply filter effect
   */
  setFilter(params: FilterParams) {
    if (!this.filterNode) return;

    this.filterNode.type = params.type;
    this.filterNode.frequency.value = params.frequency;
    this.filterNode.Q.value = params.resonance;

    // Smooth parameter changes to avoid clicks
    const now = this.audioContext?.currentTime || 0;
    this.filterNode.frequency.setTargetAtTime(params.frequency, now, 0.01);
    this.filterNode.Q.setTargetAtTime(params.resonance, now, 0.01);
  }

  /**
   * Apply delay effect
   */
  setDelay(params: DelayParams) {
    if (!this.delayNode || !this.delayFeedbackNode || !this.delayGainNode)
      return;

    const now = this.audioContext?.currentTime || 0;

    this.delayNode.delayTime.setTargetAtTime(params.time, now, 0.01);
    this.delayFeedbackNode.gain.setTargetAtTime(params.feedback, now, 0.01);
    this.delayGainNode.gain.setTargetAtTime(params.wet, now, 0.01);
  }

  /**
   * Apply distortion effect
   */
  setDistortion(params: DistortionParams) {
    if (!this.distortionNode) return;

    (this.distortionNode as { curve: Float32Array }).curve = this.makeDistortionCurve(
      params.amount
    );
    this.distortionNode.oversample = params.oversample;
  }

  /**
   * Apply EQ settings
   */
  setEQ(bands: EQBand[]) {
    bands.forEach((band, index) => {
      if (this.eqNodes[index]) {
        const filter = this.eqNodes[index];
        const now = this.audioContext?.currentTime || 0;

        filter.frequency.setTargetAtTime(band.frequency, now, 0.01);
        filter.gain.setTargetAtTime(band.gain, now, 0.01);
        filter.Q.setTargetAtTime(band.q, now, 0.01);
      }
    });
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number) {
    if (!this.masterGainNode) return;

    const now = this.audioContext?.currentTime || 0;
    this.masterGainNode.gain.setTargetAtTime(volume, now, 0.01);
  }

  /**
   * Get real-time audio analysis data
   */
  getAnalysisData(): {
    frequencies: Uint8Array;
    waveform: Uint8Array;
    volume: number;
    peakFrequency: number;
  } {
    if (!this.analyserNode) {
      return {
        frequencies: new Uint8Array(128),
        waveform: new Uint8Array(128),
        volume: 0,
        peakFrequency: 0,
      };
    }

    const bufferLength = this.analyserNode.frequencyBinCount;
    const frequencies = new Uint8Array(bufferLength);
    const waveform = new Uint8Array(bufferLength);

    this.analyserNode.getByteFrequencyData(frequencies);
    this.analyserNode.getByteTimeDomainData(waveform);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < waveform.length; i++) {
      const sample = (waveform[i] - 128) / 128;
      sum += sample * sample;
    }
    const volume = Math.sqrt(sum / waveform.length);

    // Find peak frequency
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < frequencies.length; i++) {
      if (frequencies[i] > maxValue) {
        maxValue = frequencies[i];
        maxIndex = i;
      }
    }
    const peakFrequency =
      (maxIndex * (this.audioContext?.sampleRate || 44100)) /
      (2 * bufferLength);

    return { frequencies, waveform, volume, peakFrequency };
  }

  /**
   * Performance monitoring
   */
  private updatePerformanceMetrics() {
    if (!this.audioContext) return;

    this.performanceMetrics = {
      latency: this.audioContext.baseLatency || 0,
      bufferSize: config.audio.bufferSize,
      sampleRate: this.audioContext.sampleRate,
      cpuUsage: 0, // Would need additional monitoring for actual CPU usage
    };
  }

  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Preset management
   */
  savePreset(name: string): void {
    const preset = {
      filter: this.filterNode
        ? {
            type: this.filterNode.type,
            frequency: this.filterNode.frequency.value,
            Q: this.filterNode.Q.value,
          }
        : null,
      eq: this.eqNodes.map((node) => ({
        frequency: node.frequency.value,
        gain: node.gain.value,
        Q: node.Q.value,
      })),
      delay: this.delayNode
        ? {
            time: this.delayNode.delayTime.value,
            feedback: this.delayFeedbackNode?.gain.value || 0,
            wet: this.delayGainNode?.gain.value || 0,
          }
        : null,
    };

    localStorage.setItem(`djfly_preset_${name}`, JSON.stringify(preset));
  }

  loadPreset(name: string): boolean {
    try {
      const presetData = localStorage.getItem(`djfly_preset_${name}`);
      if (!presetData) return false;

      const preset = JSON.parse(presetData);

      // Apply filter settings
      if (preset.filter && this.filterNode) {
        this.filterNode.type = preset.filter.type;
        this.filterNode.frequency.value = preset.filter.frequency;
        this.filterNode.Q.value = preset.filter.Q;
      }

      // Apply EQ settings
      if (preset.eq) {
        preset.eq.forEach((band: { frequency: number; gain: number; Q: number }, index: number) => {
          if (this.eqNodes[index]) {
            this.eqNodes[index].frequency.value = band.frequency;
            this.eqNodes[index].gain.value = band.gain;
            this.eqNodes[index].Q.value = band.Q;
          }
        });
      }

      // Apply delay settings
      if (preset.delay && this.delayNode) {
        this.delayNode.delayTime.value = preset.delay.time;
        if (this.delayFeedbackNode)
          this.delayFeedbackNode.gain.value = preset.delay.feedback;
        if (this.delayGainNode)
          this.delayGainNode.gain.value = preset.delay.wet;
      }

      return true;
    } catch (error) {
      console.error('Failed to load preset:', error);
      return false;
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.lfoNode) {
      this.lfoNode.stop();
      this.lfoNode.disconnect();
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    // Clear references
    this.audioContext = null;
    this.masterGainNode = null;
    this.analyserNode = null;
    this.filterNode = null;
    this.delayNode = null;
    this.reverbNode = null;
    this.distortionNode = null;
    this.compressorNode = null;
    this.eqNodes = [];
  }

  /**
   * Check if audio effects are supported
   */
  isSupported(): boolean {
    return !!(this.audioContext && this.masterGainNode);
  }
}

export const audioEffectsService = new AudioEffectsService();
export default audioEffectsService;
