import { useEffect, useRef, useState, useCallback } from 'react';
import MagicPlayer, { type AudioSource } from '@/services/MagicPlayer';
import type { Track } from '@/types/shared';

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
  const [bufferProgress] = useState(0);

  const currentTrackRef = useRef<Track | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const magicPlayerRef = useRef<MagicPlayer>(new MagicPlayer());

  // Initialize MagicPlayer instance
  useEffect(() => {
    if (!magicPlayerRef.current) {
      magicPlayerRef.current = new MagicPlayer();
      magicPlayerRef.current.initialize().catch(console.error);
    }

    return () => {
      if (magicPlayerRef.current) {
        magicPlayerRef.current.destroy();
        magicPlayerRef.current = null;
      }
    };
  }, []);

  // Create track from URL
  const createTrackFromUrl = useCallback((url: string): Track => {
    const urlObj = new URL(url, window.location.origin);
    const filename = urlObj.pathname.split('/').pop() || 'unknown';
    const title = filename.replace(/\.[^/.]+$/, ''); // Remove extension

    return {
      id: url,
      title,
      artist: 'Unknown Artist',
      duration: 0,
      image: '/default-album-art.jpg',
      source: 'upload',
      preview_url: url,
    };
  }, []);

  // Setup MagicPlayer event listeners
  useEffect(() => {
    if (!magicPlayerRef.current) return;

    const player = magicPlayerRef.current;

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

    const handleError = (data: { message?: string }) => {
      setError(data.message || 'Playback error occurred');
      setIsLoading(false);
      setIsPlaying(false);
      console.error('🚨 Audio playback error:', data.message);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Add event listeners - placeholder for now
  }, []);

  // Load new source when src changes
  useEffect(() => {
    if (src && magicPlayerRef.current) {
      const track = createTrackFromUrl(src);

      // Only load if it's a different source
      if (!currentTrackRef.current || currentTrackRef.current.id !== src) {
        setIsLoading(true);
        setError(null);
        currentTrackRef.current = track;

      }
    }
  }, [src, createTrackFromUrl, options]);

  // Progress tracking
  useEffect(() => {
    if (isPlaying && magicPlayerRef.current) {
      progressIntervalRef.current = window.setInterval(() => {
        // Update progress tracking - simplified for now
        setCurrentTime(prev => prev + 0.1);
      }, 100);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Play function
  const play = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (magicPlayerRef.current) {
        magicPlayerRef.current.play('A');
      }
      setIsPlaying(true);
      setIsLoading(false);
    } catch {
      setError('Failed to start playback');
      setIsLoading(false);
    }
  }, []);

  // Pause function
  const pause = useCallback(() => {
    if (magicPlayerRef.current) {
      magicPlayerRef.current.pause('A');
    }
    setIsPlaying(false);
  }, []);

  // Stop function
  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Seek function
  const seek = useCallback((time: number) => {
    if (magicPlayerRef.current) {
      magicPlayerRef.current.seek('A', time);
    }
    setCurrentTime(time);
  }, []);

  // Volume control
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (magicPlayerRef.current) {
      magicPlayerRef.current.setDeckVolume('A', clampedVolume);
    }
  }, []);

  // Get frequency data for visualization
  const getFrequencyData = useCallback(() => {
    return new Uint8Array(0); // Placeholder
  }, []);

  // Get time domain data for visualization
  const getTimeDomainData = useCallback(() => {
    return new Uint8Array(0); // Placeholder
  }, []);

  return {
    isPlaying,
    isLoading,
    duration,
    currentTime,
    volume,
    error,
    bufferProgress,
    play,
    pause,
    stop,
    seek,
    setVolume,
    getFrequencyData,
    getTimeDomainData,
  };
}
