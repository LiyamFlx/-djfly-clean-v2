/**
 * Audio Fallback Service
 * Provides fallback audio URLs when primary sources fail
 */

// Royalty-free music previews that should work reliably
export const FALLBACK_AUDIO_URLS = [
  'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
  'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
  'https://file-examples.com/storage/fe68c625b00ad8ad9df4a8d/2017/11/file_example_MP3_700KB.mp3'
];

// Default silence/beep for absolute fallback
export const SILENCE_AUDIO = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAa';

export class AudioFallbackService {
  private static failedUrls = new Set<string>();
  
  /**
   * Get a working audio URL with fallback support
   */
  static async getWorkingAudioUrl(primaryUrl: string): Promise<string> {
    // If we know this URL failed before, skip it
    if (this.failedUrls.has(primaryUrl)) {
      return this.getFallbackUrl();
    }
    
    try {
      // Test if the primary URL works
      const response = await fetch(primaryUrl, { method: 'HEAD' });
      if (response.ok) {
        return primaryUrl;
      }
    } catch (error) {
      console.warn(`Primary audio URL failed: ${primaryUrl}`, error);
    }
    
    this.failedUrls.add(primaryUrl);
    return this.getFallbackUrl();
  }
  
  /**
   * Get a fallback URL that should work
   */
  private static getFallbackUrl(): string {
    // Try fallback URLs in order
    for (const url of FALLBACK_AUDIO_URLS) {
      if (!this.failedUrls.has(url)) {
        return url;
      }
    }
    
    // If all else fails, return silence
    return SILENCE_AUDIO;
  }
  
  /**
   * Test an audio URL
   */
  static async testAudioUrl(url: string): Promise<boolean> {
    try {
      const audio = new Audio();
      return new Promise((resolve) => {
        audio.oncanplay = () => resolve(true);
        audio.onerror = () => resolve(false);
        audio.src = url;
      });
    } catch {
      return false;
    }
  }
  
  /**
   * Preload and validate audio URLs
   */
  static async preloadTrackAudio(tracks: any[]): Promise<any[]> {
    const validatedTracks = await Promise.all(
      tracks.map(async (track) => {
        const workingUrl = await this.getWorkingAudioUrl(track.previewUrl);
        return { ...track, previewUrl: workingUrl };
      })
    );
    
    return validatedTracks;
  }
}