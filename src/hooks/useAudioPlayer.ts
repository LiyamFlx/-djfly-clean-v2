import { useEffect, useRef, useState, useCallback } from 'react';
import { magicPlayer, AudioSource } from '@/services/MagicPlayer';
import type { AudioError } from '@/types/audio';

export interface UseAudioPlayerOptions {
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

export function useAudioPlayer(
  src: string,
  options: UseAudioPlayerOptions = {}
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(options.volume || 1);
  const [error, setError] = useState<string | null>(null);
  const [bufferProgress, setBufferProgress] = useState(0);

  const currentSourceRef = useRef<AudioSource | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Create audio source from URL
  const createAudioSource = useCallback((url: string): AudioSource => {
    const urlObj = new URL(url, window.location.origin);
    const filename = urlObj.pathname.split('/').pop() || 'unknown';
    const extension = filename.split('.').pop()?.toLowerCase() as
      | string
      | undefined;

    return {
      id: url,
      url,
      title: filename.replace(/\.[^/.]+$/, ''), // Remove extension
      artist: 'Unknown Artist',
      format: extension || 'mp3',
    };
  }, []);

  // Setup MagicPlayer event listeners
  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoaded = (data: { duration?: number }) => {
      setDuration(data.duration || 0);
      setIsLoading(false);
      setError(null);
    };

    const handleError = (data: AudioError) => {
      setError(data.message || 'Playback error occurred');
      setIsLoading(false);
      setIsPlaying(false);
      console.error('🚨 Audio playback error:', data.message);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Add event listeners
    magicPlayer.on('play', handlePlay);
    magicPlayer.on('pause', handlePause);
    magicPlayer.on('loaded', handleLoaded);
    magicPlayer.on('error', handleError);
    magicPlayer.on('ended', handleEnded);

    return () => {
      // Remove event listeners
      magicPlayer.off('play', handlePlay);
      magicPlayer.off('pause', handlePause);
      magicPlayer.off('loaded', handleLoaded);
      magicPlayer.off('error', handleError);
      magicPlayer.off('ended', handleEnded);
    };
  }, []);

  // Load new source when src changes
  useEffect(() => {
    if (src) {
      const audioSource = createAudioSource(src);

      // Only load if it's a different source
      if (!currentSourceRef.current || currentSourceRef.current.url !== src) {
        setIsLoading(true);
        setError(null);
        currentSourceRef.current = audioSource;

        magicPlayer
          .load(audioSource, {
            volume: options.volume,
            loop: options.loop,
            preload: true,
            fadeInDuration: options.fadeInDuration,
            fadeOutDuration: options.fadeOutDuration,
          })
          .catch((error) => {
            console.error('Failed to load audio source:', error);
            setError(error.message);
            setIsLoading(false);
          });
      }
    }
  }, [src, createAudioSource, options]);

  // Update progress periodically when playing
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        const analytics = magicPlayer.getAnalytics();
        setCurrentTime(analytics.currentTime);
        setBufferProgress(analytics.bufferProgress);
      }, 100); // Update every 100ms for smooth progress
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const play = useCallback(async () => {
    try {
      setError(null);
      await magicPlayer.play();

      // Auto-play may require user interaction
      if (!magicPlayer.isPlaying()) {
        console.log(
          '⏳ Waiting for user interaction to enable audio playback...'
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to play audio';
      console.error('Play failed:', error);
      setError(errorMessage);
    }
  }, []);

  const pause = useCallback(() => {
    magicPlayer.pause();
  }, []);

  const stop = useCallback(() => {
    magicPlayer.stop();
    setCurrentTime(0);
  }, []);

  const seek = useCallback((time: number) => {
    magicPlayer.seek(time);
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    magicPlayer.setVolume(clampedVolume);
    setVolumeState(clampedVolume);
  }, []);

  // Get frequency data for visualizations
  const getFrequencyData = useCallback(() => {
    return magicPlayer.getFrequencyData();
  }, []);

  // Get time domain data for waveform
  const getTimeDomainData = useCallback(() => {
    return magicPlayer.getTimeDomainData();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return {
    // State
    isPlaying,
    isLoading,
    duration,
    currentTime,
    volume,
    error,
    bufferProgress,

    // Actions
    play,
    pause,
    stop,
    seek,
    setVolume,

    // Analytics
    getFrequencyData,
    getTimeDomainData,

    // Utilities
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
    formatTime: (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
  };
}
