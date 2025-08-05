interface AudioAnalysisResult {
  energy: number;
  mood: 'excited' | 'chill' | 'energetic' | 'mellow';
  engagement: 'low' | 'medium' | 'high';
  tempo?: number;
  volume?: number;
  spectralCentroid?: number;
}

class AudioAnalysisService {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.initializeAudioContext();
    }
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
  }

  /**
   * Analyze audio buffer and extract features
   */
  async analyzeBuffer(audioBuffer: ArrayBuffer): Promise<AudioAnalysisResult> {
    if (!this.audioContext || !this.analyser) {
      return this.getMockAnalysis();
    }

    try {
      // Decode audio data
      const audioData = await this.audioContext.decodeAudioData(audioBuffer.slice(0));
      
      // Analyze the audio data
      const analysis = this.extractAudioFeatures(audioData);
      
      return analysis;
    } catch (error) {
      console.error('Audio analysis failed:', error);
      return this.getMockAnalysis();
    }
  }

  /**
   * Analyze real-time audio stream
   */
  async analyzeRealTimeAudio(stream: MediaStream): Promise<AudioAnalysisResult> {
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

      // Analyze the frequency data
      const analysis = this.analyzeFrequencyData(dataArray, bufferLength);
      
      // Clean up
      source.disconnect();
      
      return analysis;
    } catch (error) {
      console.error('Real-time audio analysis failed:', error);
      return this.getMockAnalysis();
    }
  }

  /**
   * Extract audio features from AudioBuffer
   */
  private extractAudioFeatures(audioBuffer: AudioBuffer): AudioAnalysisResult {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Calculate RMS (Root Mean Square) for energy
    let sum = 0;
    for (let i = 0; i < channelData.length; i++) {
      sum += channelData[i] * channelData[i];
    }
    const rms = Math.sqrt(sum / channelData.length);
    const energy = Math.min(rms * 10, 1.0); // Normalize to 0-1

    // Estimate tempo using autocorrelation (simplified)
    const tempo = this.estimateTempo(channelData, sampleRate);
    
    // Calculate spectral centroid (brightness)
    const spectralCentroid = this.calculateSpectralCentroid(channelData);
    
    // Derive mood and engagement from features
    const mood = this.determineMood(energy, spectralCentroid, tempo);
    const engagement = this.determineEngagement(energy, tempo);

    return {
      energy,
      mood,
      engagement,
      tempo,
      volume: rms,
      spectralCentroid
    };
  }

  /**
   * Analyze frequency domain data
   */
  private analyzeFrequencyData(dataArray: Uint8Array, bufferLength: number): AudioAnalysisResult {
    // Calculate average amplitude across frequency bins
    let sum = 0;
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;

    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i];
      sum += value;
      
      // Frequency ranges (approximate)
      if (i < bufferLength * 0.1) {
        bassSum += value; // Bass: 0-10% of spectrum
      } else if (i < bufferLength * 0.4) {
        midSum += value; // Mids: 10-40% of spectrum
      } else {
        trebleSum += value; // Treble: 40-100% of spectrum
      }
    }

    const avgAmplitude = sum / bufferLength;
    const energy = Math.min(avgAmplitude / 255, 1.0);
    
    const bassRatio = bassSum / (bufferLength * 0.1 * 255);
    const midRatio = midSum / (bufferLength * 0.3 * 255);
    const trebleRatio = trebleSum / (bufferLength * 0.6 * 255);

    // Determine mood based on frequency distribution
    let mood: 'excited' | 'chill' | 'energetic' | 'mellow';
    if (bassRatio > 0.6 && energy > 0.5) {
      mood = 'energetic';
    } else if (trebleRatio > 0.4 && energy > 0.4) {
      mood = 'excited';
    } else if (energy < 0.3) {
      mood = 'chill';
    } else {
      mood = 'mellow';
    }

    // Determine engagement
    let engagement: 'low' | 'medium' | 'high';
    if (energy > 0.6) {
      engagement = 'high';
    } else if (energy > 0.3) {
      engagement = 'medium';
    } else {
      engagement = 'low';
    }

    return {
      energy,
      mood,
      engagement,
      volume: avgAmplitude / 255,
      spectralCentroid: (midRatio + trebleRatio) / 2
    };
  }

  /**
   * Estimate tempo using simplified beat detection
   */
  private estimateTempo(channelData: Float32Array, sampleRate: number): number {
    // Very simplified tempo estimation
    // In a real implementation, you'd use more sophisticated algorithms
    const windowSize = Math.floor(sampleRate * 0.1); // 100ms windows
    const hops = Math.floor(channelData.length / windowSize);
    
    let peakCount = 0;
    let lastPeak = 0;
    const threshold = 0.1;
    
    for (let i = 0; i < hops - 1; i++) {
      const startIdx = i * windowSize;
      const endIdx = Math.min(startIdx + windowSize, channelData.length);
      
      // Calculate energy in this window
      let energy = 0;
      for (let j = startIdx; j < endIdx; j++) {
        energy += Math.abs(channelData[j]);
      }
      energy /= (endIdx - startIdx);
      
      // Simple peak detection
      if (energy > threshold && (i - lastPeak) > 2) {
        peakCount++;
        lastPeak = i;
      }
    }
    
    // Convert to BPM (very rough estimate)
    const timeSpan = channelData.length / sampleRate;
    const beatsPerSecond = peakCount / timeSpan;
    const bpm = Math.max(60, Math.min(200, beatsPerSecond * 60));
    
    return Math.round(bpm);
  }

  /**
   * Calculate spectral centroid (brightness measure)
   */
  private calculateSpectralCentroid(channelData: Float32Array): number {
    // Simplified spectral centroid calculation
    // In practice, you'd use FFT for proper frequency domain analysis
    let weightedSum = 0;
    let magnitudeSum = 0;
    
    for (let i = 0; i < channelData.length; i++) {
      const magnitude = Math.abs(channelData[i]);
      weightedSum += i * magnitude;
      magnitudeSum += magnitude;
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;
  }

  /**
   * Determine mood from audio features
   */
  private determineMood(
    energy: number, 
    _spectralCentroid: number, 
    tempo: number
  ): 'excited' | 'chill' | 'energetic' | 'mellow' {
    if (energy > 0.7 && tempo > 140) {
      return 'excited';
    } else if (energy > 0.5 && tempo > 110) {
      return 'energetic';
    } else if (energy < 0.3) {
      return 'chill';
    } else {
      return 'mellow';
    }
  }

  /**
   * Determine engagement level from audio features
   */
  private determineEngagement(energy: number, tempo: number): 'low' | 'medium' | 'high' {
    const score = (energy * 0.7) + ((tempo - 60) / 140 * 0.3);
    
    if (score > 0.7) {
      return 'high';
    } else if (score > 0.4) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Get mock analysis data for fallback
   */
  private getMockAnalysis(): AudioAnalysisResult {
    const moods: Array<'excited' | 'chill' | 'energetic' | 'mellow'> = 
      ['excited', 'chill', 'energetic', 'mellow'];
    const engagements: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    
    return {
      energy: Math.random() * 0.4 + 0.3,
      mood: moods[Math.floor(Math.random() * moods.length)],
      engagement: engagements[Math.floor(Math.random() * engagements.length)],
      tempo: Math.floor(Math.random() * 60) + 100,
      volume: Math.random() * 0.5 + 0.2,
      spectralCentroid: Math.random()
    };
  }

  /**
   * Check if audio analysis is supported
   */
  isSupported(): boolean {
    return !!(this.audioContext && this.analyser);
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.analyser = null;
  }
}

export const audioAnalysisService = new AudioAnalysisService();
export default audioAnalysisService;