import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Track } from '@/types/shared';

interface MusicContextValue {
  // Current playback state
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentIndex: number;
  
  // Actions
  setQueue: (tracks: Track[]) => void;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  
  // Playlist management
  savePlaylist: (name: string, tracks: Track[]) => void;
  loadPlaylist: (tracks: Track[]) => void;
}

const MusicContext = createContext<MusicContextValue | undefined>(undefined);

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadPlaylist = useCallback((tracks: Track[]) => {
    console.log('🎵 Loading playlist with', tracks.length, 'tracks');
    setQueue(tracks);
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setCurrentIndex(0);
    }
    // Store in localStorage for persistence
    localStorage.setItem('djfly-current-playlist', JSON.stringify(tracks));
  }, []);

  const playTrack = useCallback((track: Track) => {
    console.log('▶️ Playing track:', track.title);
    setCurrentTrack(track);
    setIsPlaying(true);
    
    const trackIndex = queue.findIndex(t => t.id === track.id);
    if (trackIndex !== -1) {
      setCurrentIndex(trackIndex);
    }
  }, [queue]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    console.log('⏭️ Next track:', queue[nextIndex]?.title);
  }, [queue, currentIndex]);

  const previousTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    console.log('⏮️ Previous track:', queue[prevIndex]?.title);
  }, [queue, currentIndex]);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
    console.log('➕ Added to queue:', track.title);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentIndex(0);
    localStorage.removeItem('djfly-current-playlist');
    console.log('🗑️ Queue cleared');
  }, []);

  const savePlaylist = useCallback((name: string, tracks: Track[]) => {
    const playlists = JSON.parse(localStorage.getItem('djfly-saved-playlists') || '{}');
    playlists[name] = {
      tracks,
      createdAt: new Date().toISOString(),
      name
    };
    localStorage.setItem('djfly-saved-playlists', JSON.stringify(playlists));
    console.log('💾 Saved playlist:', name, 'with', tracks.length, 'tracks');
  }, []);

  // Initialize with saved playlist on mount
  React.useEffect(() => {
    const savedPlaylist = localStorage.getItem('djfly-current-playlist');
    if (savedPlaylist) {
      try {
        const tracks = JSON.parse(savedPlaylist);
        if (Array.isArray(tracks) && tracks.length > 0) {
          console.log('🔄 Restoring saved playlist with', tracks.length, 'tracks');
          setQueue(tracks);
          setCurrentTrack(tracks[0]);
        }
      } catch (error) {
        console.warn('Failed to restore saved playlist:', error);
      }
    }
  }, []);

  const value: MusicContextValue = {
    // State
    currentTrack,
    queue,
    isPlaying,
    currentIndex,
    
    // Actions
    setQueue,
    setCurrentTrack,
    setIsPlaying,
    playTrack,
    nextTrack,
    previousTrack,
    addToQueue,
    clearQueue,
    
    // Playlist management
    savePlaylist,
    loadPlaylist,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;