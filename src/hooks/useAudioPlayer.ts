import { useEffect, useRef, useState, useCallback } from 'react';
import { MagicPlayer } from '@/services/MagicPlayer';
import type { Track } from '@/types/audio';

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

    // Add event listeners
    player.addEventListener('play', handlePlay);
    player.addEventListener('pause', handlePause);
    player.addEventListener('loaded', handleLoaded);
    player.addEventListener('error', handleError);
    player.addEventListener('ended', handleEnded);

    return () => {
      // Remove event listeners
      player.removeEventListener('play', handlePlay);
      player.removeEventListener('pause', handlePause);
      player.removeEventListener('loaded', handleLoaded);
      player.removeEventListener('error', handleError);
      player.removeEventListener('ended', handleEnded);
    };
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

        // Load track into deck A
        magicPlayerRef.current.loadTrack('A', track).catch((_err) => {
          setError('Failed to load track');
          setIsLoading(false);
        });
      }
    }
  }, [src, createTrackFromUrl, options]);

  // Progress tracking
  useEffect(() => {
    if (isPlaying && magicPlayerRef.current) {
      progressIntervalRef.current = window.setInterval(() => {
        const deckA = magicPlayerRef.current!.getDeckState('A');
        if (deckA) {
          setCurrentTime(deckA.currentTime);
          setDuration(deckA.duration);
        }
      }, 100);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [isPlaying]);

  // Play function
  const play = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (magicPlayerRef.current) {
        magicPlayerRef.current.play('A');
      }
    } catch (_err) {
      setError('Failed to start playback');
      setIsLoading(false);
    }
  }, []);

  // Pause function
  const pause = useCallback(() => {
    if (magicPlayerRef.current) {
      magicPlayerRef.current.pause('A');
    }
  }, []);

  // Stop function
  const stop = useCallback(() => {
    if (magicPlayerRef.current) {
      magicPlayerRef.current.stop('A');
    }
    setCurrentTime(0);
  }, []);

  // Seek function
  const seek = useCallback((time: number) => {
    if (magicPlayerRef.current) {
      magicPlayerRef.current.seek('A', time);
    }
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
    if (magicPlayerRef.current) {
      const analysis = magicPlayerRef.current.getCurrentAnalysis();
      return new Uint8Array(128); // Placeholder - implement actual frequency data
    }
    return new Uint8Array(128);
  }, []);

  // Get time domain data for visualization
  const getTimeDomainData = useCallback(() => {
    if (magicPlayerRef.current) {
      const analysis = magicPlayerRef.current.getCurrentAnalysis();
      return new Uint8Array(128); // Placeholder - implement actual time domain data
    }
    return new Uint8Array(128);
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
