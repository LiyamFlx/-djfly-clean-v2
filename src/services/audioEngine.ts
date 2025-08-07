/**
 * Advanced Audio Engine with real-time effects processing
 * Handles EQ, filters, reverb, delay, and other DJ effects
 */

export interface AudioEffects {
  bass: number;
  mid: number;
  treble: number;
  lowPassFilter: number;
  highPassFilter: number;
  reverb: number;
  delay: number;
  gain: number;
}

export class AudioEngine {
  private audioContext: AudioContext;
  private source: MediaElementAudioSourceNode | null = null;
  private gainNode!: GainNode;
  private bassNode!: BiquadFilterNode;
  private midNode!: BiquadFilterNode;
  private trebleNode!: BiquadFilterNode;
  private lowPassNode!: BiquadFilterNode;
  private highPassNode!: BiquadFilterNode;
  private convolver!: ConvolverNode;
  private delayNode!: DelayNode;
  private feedbackGain!: GainNode;
  private wetGain!: GainNode;
  private dryGain!: GainNode;
  private analyser!: AnalyserNode;
  private isInitialized = false;

  constructor() {
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.setupAudioNodes();
  }

  private setupAudioNodes() {
    // Master gain
    this.gainNode = this.audioContext.createGain();

    // EQ Filters
    this.bassNode = this.audioContext.createBiquadFilter();
    this.bassNode.type = 'lowshelf';
    this.bassNode.frequency.setValueAtTime(320, this.audioContext.currentTime);

    this.midNode = this.audioContext.createBiquadFilter();
    this.midNode.type = 'peaking';
    this.midNode.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    this.midNode.Q.setValueAtTime(0.5, this.audioContext.currentTime);

    this.trebleNode = this.audioContext.createBiquadFilter();
    this.trebleNode.type = 'highshelf';
    this.trebleNode.frequency.setValueAtTime(
      3200,
      this.audioContext.currentTime
    );

    // Filter effects
    this.lowPassNode = this.audioContext.createBiquadFilter();
    this.lowPassNode.type = 'lowpass';
    this.lowPassNode.frequency.setValueAtTime(
      22000,
      this.audioContext.currentTime
    );

    this.highPassNode = this.audioContext.createBiquadFilter();
    this.highPassNode.type = 'highpass';
    this.highPassNode.frequency.setValueAtTime(
      20,
      this.audioContext.currentTime
    );

    // Reverb
    this.convolver = this.audioContext.createConvolver();
    this.loadImpulseResponse();

    // Delay
    this.delayNode = this.audioContext.createDelay(1.0);
    this.feedbackGain = this.audioContext.createGain();
    this.wetGain = this.audioContext.createGain();
    this.dryGain = this.audioContext.createGain();

    // Analyser for visualization
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    // Set up delay feedback loop
    this.delayNode.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delayNode);
    this.delayNode.connect(this.wetGain);

    // Set initial values
    this.setDefaultValues();
  }

  private setDefaultValues() {
    this.gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime);
    this.bassNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.midNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.trebleNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.feedbackGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    this.wetGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.dryGain.gain.setValueAtTime(1, this.audioContext.currentTime);
  }

  private async loadImpulseResponse() {
    try {
      // Create a simple artificial reverb impulse response
      const length = this.audioContext.sampleRate * 2; // 2 second reverb
      const impulse = this.audioContext.createBuffer(
        2,
        length,
        this.audioContext.sampleRate
      );

      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
          const decay = Math.pow(1 - i / length, 2);
          channelData[i] = (Math.random() * 2 - 1) * decay * 0.1;
        }
      }

      this.convolver.buffer = impulse;
    } catch (error) {
      console.error('Failed to load impulse response:', error);
    }
  }

  public connectAudioElement(audioElement: HTMLAudioElement) {
    if (this.source) {
      this.source.disconnect();
    }

    this.source = this.audioContext.createMediaElementSource(audioElement);

    // Connect the audio processing chain
    this.source
      .connect(this.gainNode)
      .connect(this.bassNode)
      .connect(this.midNode)
      .connect(this.trebleNode)
      .connect(this.lowPassNode)
      .connect(this.highPassNode)
      .connect(this.analyser);

    // Dry signal (no reverb/delay)
    this.analyser.connect(this.dryGain);
    this.dryGain.connect(this.audioContext.destination);

    // Wet signal (with reverb)
    this.analyser.connect(this.convolver);
    this.convolver.connect(this.audioContext.destination);

    // Wet signal (with delay)
    this.analyser.connect(this.delayNode);
    this.wetGain.connect(this.audioContext.destination);

    this.isInitialized = true;
  }

  public async resumeContext() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  public setGain(value: number) {
    const gain = Math.max(0, Math.min(1, value));
    this.gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime);
  }

  public setBass(value: number) {
    // Convert 0-100 to -12dB to +12dB
    const gain = ((value - 50) / 50) * 12;
    this.bassNode.gain.setValueAtTime(gain, this.audioContext.currentTime);
  }

  public setMid(value: number) {
    const gain = ((value - 50) / 50) * 12;
    this.midNode.gain.setValueAtTime(gain, this.audioContext.currentTime);
  }

  public setTreble(value: number) {
    const gain = ((value - 50) / 50) * 12;
    this.trebleNode.gain.setValueAtTime(gain, this.audioContext.currentTime);
  }

  public setLowPassFilter(frequency: number) {
    // Frequency range: 200Hz to 22000Hz
    const freq = Math.max(200, Math.min(22000, frequency));
    this.lowPassNode.frequency.setValueAtTime(
      freq,
      this.audioContext.currentTime
    );
  }

  public setHighPassFilter(frequency: number) {
    const freq = Math.max(20, Math.min(1000, frequency));
    this.highPassNode.frequency.setValueAtTime(
      freq,
      this.audioContext.currentTime
    );
  }

  public setReverb(wetness: number) {
    // Wetness from 0-100
    const wet = wetness / 100;
    const dry = 1 - wet;

    // Fade between dry and wet signals
    this.dryGain.gain.setValueAtTime(dry, this.audioContext.currentTime);

    // Connect/disconnect reverb based on wetness
    if (wetness > 0) {
      try {
        this.convolver.connect(this.audioContext.destination);
      } catch {
        // Already connected
      }
    } else {
      this.convolver.disconnect();
    }
  }

  public setDelay(amount: number) {
    // Delay amount from 0-100 (0-500ms)
    const delayTime = (amount / 100) * 0.5;
    const wetness = amount / 100;

    this.delayNode.delayTime.setValueAtTime(
      delayTime,
      this.audioContext.currentTime
    );
    this.wetGain.gain.setValueAtTime(
      wetness * 0.3,
      this.audioContext.currentTime
    );
    this.dryGain.gain.setValueAtTime(
      1 - wetness * 0.3,
      this.audioContext.currentTime
    );
  }

  public applyEffects(effects: Partial<AudioEffects>) {
    if (!this.isInitialized) return;

    if (effects.gain !== undefined) this.setGain(effects.gain / 100);
    if (effects.bass !== undefined) this.setBass(effects.bass);
    if (effects.mid !== undefined) this.setMid(effects.mid);
    if (effects.treble !== undefined) this.setTreble(effects.treble);
    if (effects.lowPassFilter !== undefined)
      this.setLowPassFilter(effects.lowPassFilter);
    if (effects.reverb !== undefined) this.setReverb(effects.reverb);
    if (effects.delay !== undefined) this.setDelay(effects.delay);
  }

  public getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  public getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public getTimeDomainData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  public getBPM(): number {
    // Simple BPM detection using frequency analysis
    const freqData = this.getFrequencyData();
    const bassEnergy = freqData.slice(0, 10).reduce((sum, val) => sum + val, 0);

    // This is a simplified BPM estimation - in reality, you'd need more complex analysis
    const estimatedBPM = Math.round((bassEnergy / 10) * 0.3 + 120);
    return Math.max(80, Math.min(200, estimatedBPM));
  }

  public getVUMeter(): { left: number; right: number } {
    const dataArray = this.getTimeDomainData();
    const rms = Math.sqrt(
      dataArray.reduce((sum, val) => sum + (val - 128) ** 2, 0) /
        dataArray.length
    );
    const level = (rms / 128) * 100;

    return {
      left: level,
      right: level * 0.95, // Slight variation for stereo effect
    };
  }

  public applyPreset(presetName: 'party' | 'chill' | 'clear' | 'vocal') {
    const presets = {
      party: {
        bass: 75,
        mid: 60,
        treble: 70,
        lowPassFilter: 15000,
        reverb: 20,
        delay: 10,
        gain: 85,
      },
      chill: {
        bass: 40,
        mid: 55,
        treble: 45,
        lowPassFilter: 8000,
        reverb: 40,
        delay: 25,
        gain: 70,
      },
      clear: {
        bass: 50,
        mid: 50,
        treble: 50,
        lowPassFilter: 22000,
        reverb: 0,
        delay: 0,
        gain: 80,
      },
      vocal: {
        bass: 30,
        mid: 70,
        treble: 60,
        lowPassFilter: 12000,
        reverb: 15,
        delay: 5,
        gain: 75,
      },
    };

    this.applyEffects(presets[presetName]);
  }

  public disconnect() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    this.isInitialized = false;
  }

  public destroy() {
    this.disconnect();
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

export const audioEngine = new AudioEngine();
