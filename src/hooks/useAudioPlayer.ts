import { useEffect, useRef } from 'react';
import { useDJflyStore } from '@/store';

export const useAudioPlayer = () => {
  const { currentTrack, isPlaying, volume, queue } = useDJflyStore((state) => state.audio);
  const { updateProgress, setCurrentTrack, togglePlayback } = useDJflyStore((state) => ({
    updateProgress: state.updateProgress,
    setCurrentTrack: state.setCurrentTrack,
    togglePlayback: state.togglePlayback,
  const { currentTrack, isPlaying, volume } = useDJflyStore((state) => state.audio);
  const { updateProgress, setCurrentTrack, setQueue, queue } = useDJflyStore((state) => ({
    updateProgress: state.updateProgress,
    setCurrentTrack: state.setCurrentTrack,
    setQueue: state.setQueue,
    queue: state.audio.queue,
  }));

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to initialize the audio element and its event listeners
  useEffect(() => {
    // Create a single, persistent audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!isNaN(audio.duration)) {
        updateProgress(audio.currentTime, audio.duration);
      }
    };

    const handleTrackEnd = () => {
      const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex !== -1 && currentIndex < queue.length - 1) {
        // Play the next track in the queue
        setCurrentTrack(queue[currentIndex + 1]);
      } else {
        // End of queue, stop playback
        if (isPlaying) {
          togglePlayback();
        }
  // Effect to initialize the audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      updateProgress(audio.currentTime, audio.duration);
    };

    const handleEnded = () => {
      // Auto-advance to next track
      const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex !== -1 && currentIndex < queue.length - 1) {
        setCurrentTrack(queue[currentIndex + 1]);
      } else {
        // End of queue
        setCurrentTrack(null);
        setQueue([]);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended',handleTrackEnd);
    };
  }, [queue, currentTrack, isPlaying, setCurrentTrack, updateProgress, togglePlayback]);

  // Effect to handle changes in the current track
  useEffect(() => {
    if (audioRef.current && currentTrack?.previewUrl) {
      if (audioRef.current.src !== currentTrack.previewUrl) {
        audioRef.current.src = currentTrack.previewUrl;
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [currentTrack]);

  // Effect to handle play/pause state from the store
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentTrack) {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [updateProgress, queue, currentTrack, setCurrentTrack, setQueue]);

  // Effect to handle track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.previewUrl) {
      audioRef.current.src = currentTrack.previewUrl;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
    }
  }, [currentTrack]);

  // Effect to handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentTrack) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Effect to handle volume changes from the store
  // Effect to handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
};
