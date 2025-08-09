import { useEffect, useRef, useState, useCallback } from 'react';
<<<<<<< HEAD
import { MagicPlayer } from '@/services/MagicPlayer';
import type { Track } from '@/types/audio';
=======
import MagicPlayer, { type AudioSource } from '@/services/MagicPlayer';
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)

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
<<<<<<< HEAD
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
=======
    MagicPlayer.on('play', handlePlay);
    MagicPlayer.on('pause', handlePause);
    MagicPlayer.on('loaded', handleLoaded);
    MagicPlayer.on('error', handleError);
    MagicPlayer.on('ended', handleEnded);

    return () => {
      // Remove event listeners
      MagicPlayer.off('play', handlePlay);
      MagicPlayer.off('pause', handlePause);
      MagicPlayer.off('loaded', handleLoaded);
      MagicPlayer.off('error', handleError);
      MagicPlayer.off('ended', handleEnded);
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
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

<<<<<<< HEAD
        // Load track into deck A
        magicPlayerRef.current.loadTrack('A', track).catch(() => {
          setError('Failed to load track');
          setIsLoading(false);
        });
=======
        MagicPlayer
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
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
      }
    }
  }, [src, createTrackFromUrl, options]);

  // Progress tracking
  useEffect(() => {
    if (isPlaying && magicPlayerRef.current) {
      progressIntervalRef.current = window.setInterval(() => {
<<<<<<< HEAD
        const deckA = magicPlayerRef.current!.getDeckState('A');
        if (deckA) {
          setCurrentTime(deckA.currentTime);
          setDuration(deckA.duration);
        }
      }, 100);
=======
        const analytics = MagicPlayer.getAnalytics();
        setCurrentTime(analytics.currentTime);
        setBufferProgress(analytics.bufferProgress);
      }, 100); // Update every 100ms for smooth progress
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)

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
<<<<<<< HEAD
      if (magicPlayerRef.current) {
        magicPlayerRef.current.play('A');
=======
      await MagicPlayer.play();

      // Auto-play may require user interaction
      if (!MagicPlayer.isPlaying()) {
        console.log(
          '⏳ Waiting for user interaction to enable audio playback...'
        );
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
      }
    } catch {
      setError('Failed to start playback');
      setIsLoading(false);
    }
  }, []);

  // Pause function
  const pause = useCallback(() => {
<<<<<<< HEAD
    if (magicPlayerRef.current) {
      magicPlayerRef.current.pause('A');
    }
=======
    MagicPlayer.pause();
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  }, []);

  // Stop function
  const stop = useCallback(() => {
<<<<<<< HEAD
    if (magicPlayerRef.current) {
      magicPlayerRef.current.stop('A');
    }
=======
    MagicPlayer.stop();
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
    setCurrentTime(0);
  }, []);

  // Seek function
  const seek = useCallback((time: number) => {
<<<<<<< HEAD
    if (magicPlayerRef.current) {
      magicPlayerRef.current.seek('A', time);
    }
=======
    MagicPlayer.seek(time);
    setCurrentTime(time);
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  }, []);

  // Volume control
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
<<<<<<< HEAD
=======
    MagicPlayer.setVolume(clampedVolume);
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
    setVolumeState(clampedVolume);
    if (magicPlayerRef.current) {
      magicPlayerRef.current.setDeckVolume('A', clampedVolume);
    }
  }, []);

  // Get frequency data for visualization
  const getFrequencyData = useCallback(() => {
<<<<<<< HEAD
    if (magicPlayerRef.current) {
      return new Uint8Array(128); // Placeholder - implement actual frequency data
    }
    return new Uint8Array(128);
=======
    return MagicPlayer.getFrequencyData();
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
  }, []);

  // Get time domain data for visualization
  const getTimeDomainData = useCallback(() => {
<<<<<<< HEAD
    if (magicPlayerRef.current) {
      return new Uint8Array(128); // Placeholder - implement actual time domain data
    }
    return new Uint8Array(128);
=======
    return MagicPlayer.getTimeDomainData();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
>>>>>>> 86165b8 (🎯 Major Architecture Overhaul: AI-Powered DJ Engine)
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
