import { useEffect, useRef, useState, useCallback } from 'react';
import { MagicPlayer } from '@/services/MagicPlayer';
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
  const [bufferProgress, setBufferProgress] = useState(0);

  const currentTrackRef = useRef<Track | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

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
      preview_url: url,
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
    MagicPlayer.addEventListener('play', handlePlay);
    MagicPlayer.addEventListener('pause', handlePause);
    MagicPlayer.addEventListener('loaded', handleLoaded);
    MagicPlayer.addEventListener('error', handleError);
    MagicPlayer.addEventListener('ended', handleEnded);

    return () => {
      // Remove event listeners
      MagicPlayer.removeEventListener('play', handlePlay);
      MagicPlayer.removeEventListener('pause', handlePause);
      MagicPlayer.removeEventListener('loaded', handleLoaded);
      MagicPlayer.removeEventListener('error', handleError);
      MagicPlayer.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Load new source when src changes
  useEffect(() => {
    if (src) {
      const track = createTrackFromUrl(src);

      // Only load if it's a different source
      if (!currentTrackRef.current || currentTrackRef.current.id !== src) {
        setIsLoading(true);
        setError(null);
        currentTrackRef.current = track;

        // Load track into deck A
        MagicPlayer.loadTrack('A', track).catch((err) => {
          setError(err.message || 'Failed to load track');
          setIsLoading(false);
        });
      }
    }
  }, [src, createTrackFromUrl, options]);

  // Progress tracking
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = window.setInterval(() => {
        const deckA = MagicPlayer.getDeckState('A');
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
      MagicPlayer.play('A');
    } catch (err) {
      setError('Failed to start playback');
      setIsLoading(false);
    }
  }, []);

  // Pause function
  const pause = useCallback(() => {
    MagicPlayer.pause('A');
  }, []);

  // Stop function
  const stop = useCallback(() => {
    MagicPlayer.stop('A');
    setCurrentTime(0);
  }, []);

  // Seek function
  const seek = useCallback((time: number) => {
    MagicPlayer.seek('A', time);
  }, []);

  // Volume control
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    MagicPlayer.setDeckVolume('A', clampedVolume);
  }, []);

  // Get frequency data for visualization
  const getFrequencyData = useCallback(() => {
    const analysis = MagicPlayer.getCurrentAnalysis();
    return analysis?.spectrum || new Uint8Array(128);
  }, []);

  // Get time domain data for visualization
  const getTimeDomainData = useCallback(() => {
    const analysis = MagicPlayer.getCurrentAnalysis();
    return analysis?.waveform || new Uint8Array(128);
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
