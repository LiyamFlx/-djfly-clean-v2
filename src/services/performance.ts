/**
 * Performance Optimization Service for DJfly
 * Handles memory management, lazy loading, and performance monitoring
 */

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number; // MB
  audioLatency: number; // ms
  renderTime: number; // ms
  networkLatency: number; // ms
  cacheHitRate: number; // percentage
}

export interface OptimizationSettings {
  enableLazyLoading: boolean;
  prefetchTracks: boolean;
  maxCachedTracks: number;
  audioQuality: 'low' | 'medium' | 'high';
  visualEffectsLevel: 'minimal' | 'normal' | 'enhanced';
  backgroundProcessing: boolean;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    audioLatency: 0,
    renderTime: 0,
    networkLatency: 0,
    cacheHitRate: 0,
  };

  private settings: OptimizationSettings = {
    enableLazyLoading: true,
    prefetchTracks: true,
    maxCachedTracks: 50,
    audioQuality: 'high',
    visualEffectsLevel: 'normal',
    backgroundProcessing: true,
  };

  private frameCount = 0;
  private lastFrameTime = performance.now();
  private fpsHistory: number[] = [];
  private memoryHistory: number[] = [];
  private isMonitoring = false;

  // Track preloading and caching
  private audioBufferCache = new Map<string, AudioBuffer>();
  private imageCache = new Map<string, HTMLImageElement>();

  // Worker for background processing
  private backgroundWorker: Worker | null = null;

  constructor() {
    this.initializeSettings();
    this.setupPerformanceObserver();
    this.initializeWorker();
  }

  private initializeSettings() {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('djfly_performance_settings');
    if (savedSettings) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.warn('Failed to load performance settings:', error);
      }
    }

    // Auto-detect optimal settings based on device capabilities
    this.autoOptimizeSettings();
  }

  private autoOptimizeSettings() {
    // Detect device capabilities
    const memory = (navigator as unknown).deviceMemory || 4; // GB
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const connection = (navigator as unknown).connection;

    // Adjust settings based on device capabilities
    if (memory < 4) {
      this.settings.maxCachedTracks = 20;
      this.settings.audioQuality = 'medium';
      this.settings.visualEffectsLevel = 'minimal';
    } else if (memory >= 8) {
      this.settings.maxCachedTracks = 100;
      this.settings.audioQuality = 'high';
      this.settings.visualEffectsLevel = 'enhanced';
    }

    // Adjust for slow connections
    if (connection && connection.effectiveType === 'slow-2g') {
      this.settings.prefetchTracks = false;
      this.settings.audioQuality = 'low';
    }

    // Disable background processing on low-end devices
    if (hardwareConcurrency < 2) {
      this.settings.backgroundProcessing = false;
    }
  }

  private setupPerformanceObserver() {
    if (typeof window === 'undefined') return;

    // Monitor paint performance
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (
              entry.entryType === 'paint' &&
              entry.name === 'first-contentful-paint'
            ) {
              this.metrics.renderTime = entry.startTime;
            }
          });
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }
  }

  private initializeWorker() {
    if (!this.settings.backgroundProcessing || typeof Worker === 'undefined')
      return;

    try {
      // Create worker for background audio processing
      const workerCode = `
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          switch (type) {
            case 'analyzeAudio':
              // Perform audio analysis in background
              const result = performAudioAnalysis(data);
              self.postMessage({ type: 'audioAnalysisResult', result });
              break;
              
            case 'generateWaveform':
              // Generate waveform data
              const waveform = generateWaveformData(data);
              self.postMessage({ type: 'waveformResult', waveform });
              break;
          }
        };
        
        function performAudioAnalysis(audioData) {
          // Simplified audio analysis
          const analysis = {
            peak: Math.max(...audioData),
            rms: Math.sqrt(audioData.reduce((sum, val) => sum + val * val, 0) / audioData.length),
            zeroCrossings: countZeroCrossings(audioData)
          };
          return analysis;
        }
        
        function generateWaveformData(audioData) {
          const samples = 200; // Number of waveform samples
          const blockSize = Math.floor(audioData.length / samples);
          const waveform = new Float32Array(samples);
          
          for (let i = 0; i < samples; i++) {
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
              sum += Math.abs(audioData[i * blockSize + j] || 0);
            }
            waveform[i] = sum / blockSize;
          }
          
          return Array.from(waveform);
        }
        
        function countZeroCrossings(data) {
          let crossings = 0;
          for (let i = 1; i < data.length; i++) {
            if ((data[i - 1] >= 0) !== (data[i] >= 0)) {
              crossings++;
            }
          }
          return crossings;
        }
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.backgroundWorker = new Worker(URL.createObjectURL(blob));

      this.backgroundWorker.onmessage = (e) => {
        const { type, result, waveform } = e.data;

        switch (type) {
          case 'audioAnalysisResult':
            // Handle background audio analysis result
            this.handleBackgroundAnalysis(result);
            break;

          case 'waveformResult':
            // Handle waveform generation result
            this.handleWaveformResult(waveform);
            break;
        }
      };
    } catch (error) {
      console.warn('Failed to initialize background worker:', error);
      this.settings.backgroundProcessing = false;
    }
  }

  private handleBackgroundAnalysis(result: unknown) {
    // Emit event or store result for components to use
    window.dispatchEvent(
      new CustomEvent('audioAnalysisComplete', { detail: result })
    );
  }

  private handleWaveformResult(waveform: Float32Array) {
    // Emit waveform data for visualization components
    window.dispatchEvent(
      new CustomEvent('waveformGenerated', { detail: waveform })
    );
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitorPerformance();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
  }

  private monitorPerformance() {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;

    // Calculate FPS
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      this.fpsHistory.push(fps);

      // Keep only last 60 frames for averaging
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }

      this.metrics.fps =
        this.fpsHistory.reduce((sum, f) => sum + f, 0) / this.fpsHistory.length;
    }

    // Monitor memory usage
    if ('memory' in performance) {
      const memory = (performance as unknown).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB

      this.memoryHistory.push(this.metrics.memoryUsage);
      if (this.memoryHistory.length > 100) {
        this.memoryHistory.shift();
      }
    }

    this.lastFrameTime = now;
    this.frameCount++;

    // Continue monitoring
    requestAnimationFrame(() => this.monitorPerformance());
  }

  /**
   * Preload audio tracks for smooth playback
   */
  async preloadTrack(trackUrl: string): Promise<AudioBuffer | null> {
    // Check if already cached
    if (this.audioBufferCache.has(trackUrl)) {
      return this.audioBufferCache.get(trackUrl)!;
    }

    // Check cache size limit
    if (this.audioBufferCache.size >= this.settings.maxCachedTracks) {
      // Remove oldest cached track
      const firstKey = this.audioBufferCache.keys().next().value;
      if (firstKey) {
        this.audioBufferCache.delete(firstKey);
      }
    }

    try {
      const startTime = performance.now();

      const response = await fetch(trackUrl);
      const arrayBuffer = await response.arrayBuffer();

      // Use Web Audio API to decode
      const audioContext = new (window.AudioContext ||
        (window as unknown).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(
        arrayBuffer.slice(0)
      );

      // Cache the decoded buffer
      this.audioBufferCache.set(trackUrl, audioBuffer);

      // Update network latency metric
      this.metrics.networkLatency = performance.now() - startTime;

      return audioBuffer;
    } catch (error) {
      console.error('Failed to preload track:', error);
      return null;
    }
  }

  /**
   * Preload image with lazy loading support
   */
  async preloadImage(imageUrl: string): Promise<HTMLImageElement | null> {
    if (this.imageCache.has(imageUrl)) {
      return this.imageCache.get(imageUrl)!;
    }

    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        this.imageCache.set(imageUrl, img);
        resolve(img);
      };

      img.onerror = () => {
        console.error('Failed to preload image:', imageUrl);
        resolve(null);
      };

      img.src = imageUrl;
    });
  }

  /**
   * Background audio analysis
   */
  analyzeAudioInBackground(audioData: Float32Array) {
    if (!this.backgroundWorker) return;

    this.backgroundWorker.postMessage({
      type: 'analyzeAudio',
      data: Array.from(audioData),
    });
  }

  /**
   * Generate waveform in background
   */
  generateWaveformInBackground(audioData: Float32Array) {
    if (!this.backgroundWorker) return;

    this.backgroundWorker.postMessage({
      type: 'generateWaveform',
      data: Array.from(audioData),
    });
  }

  /**
   * Optimize component rendering
   */
  shouldRenderComponent(componentName: string): boolean {
    // Skip rendering heavy components when FPS is low
    if (this.metrics.fps < 30) {
      const heavyComponents = ['Waveform', 'Visualizer', 'SpectrumAnalyzer'];
      return !heavyComponents.includes(componentName);
    }

    return true;
  }

  /**
   * Memory cleanup
   */
  cleanupMemory() {
    // Clear image cache
    this.imageCache.clear();

    // Clear audio buffer cache if memory usage is high
    if (this.metrics.memoryUsage > 100) {
      // 100MB threshold
      const keysToDelete = Array.from(this.audioBufferCache.keys()).slice(
        0,
        10
      );
      keysToDelete.forEach((key) => this.audioBufferCache.delete(key));
    }

    // Force garbage collection if available
    if ('gc' in window) {
      (window as unknown).gc();
    }
  }

  /**
   * Update optimization settings
   */
  updateSettings(newSettings: Partial<OptimizationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem(
      'djfly_performance_settings',
      JSON.stringify(this.settings)
    );

    // Apply settings immediately
    this.applySettings();
  }

  private applySettings() {
    // Clean up cache if max size reduced
    while (this.audioBufferCache.size > this.settings.maxCachedTracks) {
      const firstKey = this.audioBufferCache.keys().next().value;
      if (firstKey) this.audioBufferCache.delete(firstKey);
    }

    // Restart worker if background processing setting changed
    if (!this.settings.backgroundProcessing && this.backgroundWorker) {
      this.backgroundWorker.terminate();
      this.backgroundWorker = null;
    } else if (this.settings.backgroundProcessing && !this.backgroundWorker) {
      this.initializeWorker();
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get optimization settings
   */
  getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  /**
   * Get memory usage trend
   */
  getMemoryTrend(): number[] {
    return [...this.memoryHistory];
  }

  /**
   * Check if device is low-end
   */
  isLowEndDevice(): boolean {
    const memory = (navigator as unknown).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;

    return memory < 4 || cores < 4 || this.metrics.fps < 30;
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.stopMonitoring();

    if (this.backgroundWorker) {
      this.backgroundWorker.terminate();
      this.backgroundWorker = null;
    }

    this.audioBufferCache.clear();
    this.imageCache.clear();
    this.fpsHistory = [];
    this.memoryHistory = [];
  }
}

export const performanceService = new PerformanceService();
export default performanceService;
