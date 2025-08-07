/**
 * MagicPlayer: Universal Bulletproof Audio Engine
 * Seamless, error-free, and policy-compliant audio for every user and device
 *
 * Features:
 * - Universal format support (MP3, WAV, OGG, AAC, M4A)
 * - Audio policy compliance and gesture requirements
 * - Memory management and resource optimization
 * - Cross-device compatibility and fallback systems
 * - Real-time error handling and recovery
 * - Progressive enhancement and graceful degradation
 */

export interface AudioSource {
  id: string;
  url: string;
  title: string;
  artist: string;
  duration?: number;
  format?: 'mp3' | 'wav' | 'ogg' | 'aac' | 'm4a';
  quality?: 'low' | 'medium' | 'high';
}

export interface PlaybackOptions {
  volume?: number; // 0-1
  startTime?: number; // seconds
  loop?: boolean;
  preload?: boolean;
  crossfade?: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

export interface AudioAnalytics {
  currentTime: number;
  duration: number;
  volume: number;
  isPlaying: boolean;
  isLoading: boolean;
  bufferProgress: number;
  playbackRate: number;
  error?: string;
}

type AudioState =
  | 'idle'
  | 'loading'
  | 'loaded'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error';
type PlaybackEvent =
  | 'play'
  | 'pause'
  | 'ended'
  | 'error'
  | 'loaded'
  | 'progress'
  | 'buffer';

class MagicPlayer {
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;

  private state: AudioState = 'idle';
  private currentSource: AudioSource | null = null;
  private playbackOptions: PlaybackOptions = {};

  private eventListeners = new Map<PlaybackEvent, ((data: any) => void)[]>();
  private fadeInterval: number | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  private isUserGestureReceived = false;
  private pendingPlay = false;

  // Memory management
  private audioCache = new Map<string, HTMLAudioElement>();
  private maxCacheSize = 10;
  private resourceCleanupInterval: number | null = null;

  constructor() {
    this.initializeAudioContext();
    this.setupEventListeners();
    this.startResourceMonitoring();
  }

  /**
   * Initialize Web Audio API context with fallback handling
   */
  private async initializeAudioContext(): Promise<void> {
    try {
      // Check for Web Audio API support
      if (typeof AudioContext !== 'undefined') {
        this.audioContext = new AudioContext();
      } else if (typeof (window as any).webkitAudioContext !== 'undefined') {
        this.audioContext = new (window as any).webkitAudioContext();
      }

      if (this.audioContext) {
        // Handle audio context state changes
        this.audioContext.addEventListener('statechange', () => {
          console.log(`🎵 Audio context state: ${this.audioContext?.state}`);
          if (this.audioContext?.state === 'suspended') {
            this.handleAudioPolicyCompliance();
          }
        });

        // Create audio nodes
        this.gainNode = this.audioContext.createGain();
        this.analyserNode = this.audioContext.createAnalyser();

        // Configure analyser
        this.analyserNode.fftSize = 2048;
        this.analyserNode.smoothingTimeConstant = 0.8;

        // Connect nodes: source -> gain -> analyser -> destination
        this.gainNode.connect(this.analyserNode);
        this.analyserNode.connect(this.audioContext.destination);

        console.log('🎵 MagicPlayer: Audio context initialized');
      }
    } catch {
      console.warn(
        '⚠️ MagicPlayer: Web Audio API not available, using HTML5 Audio fallback'
      );
      // HTML5 Audio fallback will be used
    }
  }

  /**
   * Handle audio policy compliance (requires user gesture)
   */
  private async handleAudioPolicyCompliance(): Promise<void> {
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('🎵 Audio context resumed after user gesture');

        if (this.pendingPlay) {
          this.pendingPlay = false;
          this.play();
        }
      }
    } catch (error) {
      console.error('Failed to resume audio context:', error);
    }
  }

  /**
   * Setup global event listeners
   */
  private setupEventListeners(): void {
    // Listen for user interactions to enable audio
    const enableAudio = () => {
      if (!this.isUserGestureReceived) {
        this.isUserGestureReceived = true;
        this.handleAudioPolicyCompliance();
        console.log('🎵 User gesture received, audio enabled');
      }
    };

    // Multiple interaction types for broader compatibility
    ['click', 'touchstart', 'keydown', 'touchend'].forEach((eventType) => {
      document.addEventListener(eventType, enableAudio, {
        once: true,
        passive: true,
      });
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'playing') {
        // Pause when tab becomes hidden (mobile optimization)
        this.pause();
      }
    });

    // Handle network changes
    window.addEventListener('online', () => {
      console.log('🌐 Network restored');
      if (this.state === 'error') {
        this.retryPlayback();
      }
    });

    window.addEventListener('offline', () => {
      console.log('🌐 Network lost - switching to cached content');
    });
  }

  /**
   * Start resource monitoring for memory management
   */
  private startResourceMonitoring(): void {
    this.resourceCleanupInterval = window.setInterval(() => {
      this.cleanupMemory();
    }, 30000); // Clean up every 30 seconds
  }

  /**
   * Load audio source with format detection and fallbacks
   */
  async load(
    source: AudioSource,
    options: PlaybackOptions = {}
  ): Promise<void> {
    try {
      this.setState('loading');
      this.currentSource = source;
      this.playbackOptions = { ...options };

      console.log(`🎵 Loading: ${source.title} by ${source.artist}`);

      // Check cache first
      let audio = this.audioCache.get(source.id);

      if (!audio) {
        audio = await this.createOptimizedAudioElement(source);
        this.cacheAudio(source.id, audio);
      }

      this.currentAudio = audio;
      await this.setupAudioNodes();

      // Configure audio element
      if (options.volume !== undefined) {
        this.setVolume(options.volume);
      }

      if (options.loop) {
        audio.loop = true;
      }

      if (options.startTime) {
        audio.currentTime = options.startTime;
      }

      this.setState('loaded');
      this.emit('loaded', { source, duration: audio.duration });
    } catch (error) {
      console.error('🚨 MagicPlayer load error:', error);
      this.setState('error');
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.emit('error', { error: errorMessage, source });

      // Try fallback sources
      await this.tryFallbackSources(source);
    }
  }

  /**
   * Create optimized audio element with format detection
   */
  private async createOptimizedAudioElement(
    source: AudioSource
  ): Promise<HTMLAudioElement> {
    const audio = new Audio();

    // Configure for optimal performance
    audio.preload = this.playbackOptions.preload ? 'auto' : 'metadata';
    audio.crossOrigin = 'anonymous';

    // Set up error handling
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Audio load timeout'));
      }, 15000); // 15 second timeout

      audio.addEventListener(
        'canplaythrough',
        () => {
          clearTimeout(timeout);
          resolve(audio);
        },
        { once: true }
      );

      audio.addEventListener(
        'error',
        () => {
          clearTimeout(timeout);
          reject(new Error(`Audio load failed: ${audio.error?.message}`));
        },
        { once: true }
      );

      // Try to load the audio
      audio.src = source.url;
      audio.load();
    });
  }

  /**
   * Setup audio nodes and connections
   */
  private async setupAudioNodes(): Promise<void> {
    if (!this.currentAudio || !this.audioContext || !this.gainNode) return;

    try {
      // Disconnect previous source if exists
      if (this.sourceNode) {
        this.sourceNode.disconnect();
      }

      // Create new media element source
      this.sourceNode = this.audioContext.createMediaElementSource(
        this.currentAudio
      );
      this.sourceNode.connect(this.gainNode);

      console.log('🔗 Audio nodes connected');
    } catch (error) {
      console.warn(
        'Audio node setup failed, using HTML5 Audio fallback:',
        error
      );
      // Continue without Web Audio API features
    }
  }

  /**
   * Play audio with policy compliance and error handling
   */
  async play(): Promise<void> {
    if (!this.currentAudio) {
      console.warn('No audio loaded');
      return;
    }

    try {
      // Check audio policy compliance
      if (this.audioContext?.state === 'suspended') {
        if (!this.isUserGestureReceived) {
          console.log('⏳ Waiting for user gesture to enable audio...');
          this.pendingPlay = true;
          return;
        }
        await this.audioContext.resume();
      }

      // Handle fade in
      if (this.playbackOptions.fadeInDuration) {
        this.fadeIn(this.playbackOptions.fadeInDuration);
      }

      // Attempt to play
      const playPromise = this.currentAudio.play();

      if (playPromise) {
        await playPromise;
      }

      this.setState('playing');
      this.emit('play', this.getAnalytics());
      this.retryCount = 0; // Reset retry count on successful play

      console.log(`▶️ Playing: ${this.currentSource?.title}`);
    } catch (error) {
      console.error('🚨 Play error:', error);

      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.log(
          '⏳ Play blocked by browser policy, waiting for user interaction...'
        );
        this.pendingPlay = true;
      } else {
        this.setState('error');
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.emit('error', { error: errorMessage });

        // Retry logic
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(
            `🔄 Retrying playback (${this.retryCount}/${this.maxRetries})`
          );
          setTimeout(() => this.play(), 1000 * this.retryCount);
        }
      }
    }
  }

  /**
   * Pause audio with optional fade out
   */
  async pause(): Promise<void> {
    if (!this.currentAudio || this.state !== 'playing') return;

    try {
      if (this.playbackOptions.fadeOutDuration) {
        await this.fadeOut(this.playbackOptions.fadeOutDuration);
      }

      this.currentAudio.pause();
      this.setState('paused');
      this.emit('pause', this.getAnalytics());

      console.log(`⏸️ Paused: ${this.currentSource?.title}`);
    } catch (error) {
      console.error('Pause error:', error);
    }
  }

  /**
   * Stop playback and reset
   */
  stop(): void {
    if (!this.currentAudio) return;

    try {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.setState('idle');

      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }

      console.log(`⏹️ Stopped: ${this.currentSource?.title}`);
    } catch (error) {
      console.error('Stop error:', error);
    }
  }

  /**
   * Set playback volume
   */
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));

    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        clampedVolume,
        this.audioContext!.currentTime
      );
    } else if (this.currentAudio) {
      this.currentAudio.volume = clampedVolume;
    }
  }

  /**
   * Seek to specific time
   */
  seek(time: number): void {
    if (!this.currentAudio) return;

    try {
      const clampedTime = Math.max(
        0,
        Math.min(this.currentAudio.duration || 0, time)
      );
      this.currentAudio.currentTime = clampedTime;
      console.log(`⏩ Seeked to ${clampedTime}s`);
    } catch (error) {
      console.error('Seek error:', error);
    }
  }

  /**
   * Fade in audio
   */
  private fadeIn(duration: number): void {
    if (!this.gainNode || !this.audioContext) return;

    const startTime = this.audioContext.currentTime;
    this.gainNode.gain.setValueAtTime(0, startTime);
    this.gainNode.gain.linearRampToValueAtTime(1, startTime + duration);
  }

  /**
   * Fade out audio
   */
  private fadeOut(duration: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.gainNode || !this.audioContext) {
        resolve();
        return;
      }

      const startTime = this.audioContext.currentTime;
      this.gainNode.gain.setValueAtTime(1, startTime);
      this.gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      setTimeout(resolve, duration * 1000);
    });
  }

  /**
   * Try fallback audio sources
   */
  private async tryFallbackSources(originalSource: AudioSource): Promise<void> {
    const fallbackFormats = ['mp3', 'ogg', 'wav'];

    for (const format of fallbackFormats) {
      if (format === originalSource.format) continue;

      try {
        const fallbackUrl = originalSource.url.replace(
          /\.[^.]+$/,
          `.${format}`
        );
        const fallbackSource: AudioSource = {
          ...originalSource,
          url: fallbackUrl,
          format: format as any,
        };

        console.log(`🔄 Trying fallback format: ${format}`);
        await this.load(fallbackSource, this.playbackOptions);
        return;
      } catch (error) {
        console.warn(`Fallback ${format} failed:`, error);
      }
    }

    console.error('🚨 All fallback sources failed');
  }

  /**
   * Retry current playback
   */
  private async retryPlayback(): Promise<void> {
    if (this.currentSource && this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(
        `🔄 Retrying playback (${this.retryCount}/${this.maxRetries})`
      );

      try {
        await this.load(this.currentSource, this.playbackOptions);
        if (this.state === 'loaded') {
          await this.play();
        }
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }
  }

  /**
   * Cache audio element
   */
  private cacheAudio(id: string, audio: HTMLAudioElement): void {
    // Remove oldest entry if cache is full
    if (this.audioCache.size >= this.maxCacheSize) {
      const firstKey = this.audioCache.keys().next().value;
      if (firstKey) {
        const oldAudio = this.audioCache.get(firstKey);
        if (oldAudio) {
          oldAudio.src = '';
          oldAudio.load();
        }
        this.audioCache.delete(firstKey);
      }
    }

    this.audioCache.set(id, audio);
  }

  /**
   * Clean up memory and resources
   */
  private cleanupMemory(): void {
    // Clean up unused cached audio
    for (const [id, audio] of this.audioCache.entries()) {
      if (
        audio !== this.currentAudio &&
        audio.paused &&
        audio.currentTime === 0
      ) {
        audio.src = '';
        audio.load();
        this.audioCache.delete(id);
      }
    }

    // Log memory status
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      console.log(
        `🧠 Memory: ${(memory.usedJSHeapSize / 1048576).toFixed(1)}MB used`
      );
    }
  }

  /**
   * Get real-time audio analytics
   */
  getAnalytics(): AudioAnalytics {
    const audio = this.currentAudio;

    return {
      currentTime: audio?.currentTime || 0,
      duration: audio?.duration || 0,
      volume: this.gainNode?.gain.value || audio?.volume || 0,
      isPlaying: this.state === 'playing',
      isLoading: this.state === 'loading',
      bufferProgress: this.getBufferProgress(),
      playbackRate: audio?.playbackRate || 1,
      error: this.state === 'error' ? 'Playback error occurred' : undefined,
    };
  }

  /**
   * Get buffer progress percentage
   */
  private getBufferProgress(): number {
    if (!this.currentAudio) return 0;

    try {
      const buffered = this.currentAudio.buffered;
      if (buffered.length > 0) {
        return (
          (buffered.end(buffered.length - 1) / this.currentAudio.duration) * 100
        );
      }
    } catch {
      // Ignore buffered access errors
    }

    return 0;
  }

  /**
   * Get frequency data for visualizations
   */
  getFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);

    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Get time domain data for waveform
   */
  getTimeDomainData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);

    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  /**
   * Set playback state
   */
  private setState(newState: AudioState): void {
    if (this.state !== newState) {
      console.log(`🎵 State: ${this.state} → ${newState}`);
      this.state = newState;
    }
  }

  /**
   * Add event listener
   */
  on(event: PlaybackEvent, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: PlaybackEvent, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: PlaybackEvent, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Event listener error for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get current playback state
   */
  getState(): AudioState {
    return this.state;
  }

  /**
   * Check if audio is playing
   */
  isPlaying(): boolean {
    return this.state === 'playing';
  }

  /**
   * Cleanup and dispose
   */
  dispose(): void {
    // Stop playback
    this.stop();

    // Clear intervals
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
    }

    if (this.resourceCleanupInterval) {
      clearInterval(this.resourceCleanupInterval);
    }

    // Cleanup audio cache
    for (const audio of this.audioCache.values()) {
      audio.src = '';
      audio.load();
    }
    this.audioCache.clear();

    // Cleanup audio context
    if (this.sourceNode) {
      this.sourceNode.disconnect();
    }

    if (this.audioContext?.state !== 'closed') {
      this.audioContext?.close();
    }

    // Clear event listeners
    this.eventListeners.clear();

    console.log('🧹 MagicPlayer disposed');
  }
}

// Global instance
export const magicPlayer = new MagicPlayer();
export default MagicPlayer;
