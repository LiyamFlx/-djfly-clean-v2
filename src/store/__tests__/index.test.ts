import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../index';

describe('Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.getState().resetAI();
  });

  it('initializes with correct default state', () => {
    const state = useStore.getState();
    
    expect(state.audio.isPlaying).toBe(false);
    expect(state.audio.currentTrack).toBeNull();
    expect(state.audio.queue).toEqual([]);
    expect(state.audio.volume).toBe(80);
    
    expect(state.ai.isGenerating).toBe(false);
    expect(state.ai.prompt).toBe('');
    expect(state.ai.generatedTracks).toEqual([]);
    expect(state.ai.error).toBeNull();
  });

  it('toggles playback correctly', () => {
    const { togglePlayback } = useStore.getState();
    
    expect(useStore.getState().audio.isPlaying).toBe(false);
    
    togglePlayback();
    expect(useStore.getState().audio.isPlaying).toBe(true);
    
    togglePlayback();
    expect(useStore.getState().audio.isPlaying).toBe(false);
  });

  it('sets volume correctly', () => {
    const { setVolume } = useStore.getState();
    
    setVolume(50);
    expect(useStore.getState().audio.volume).toBe(50);
    
    setVolume(100);
    expect(useStore.getState().audio.volume).toBe(100);
  });

  it('adds track to queue', () => {
    const { addToQueue } = useStore.getState();
    
    const testTrack = {
      id: 'test-1',
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      image: 'test.jpg',
      source: 'demo' as const
    };
    
    addToQueue(testTrack);
    expect(useStore.getState().audio.queue).toContain(testTrack);
  });

  it('starts session correctly', () => {
    const { startSession } = useStore.getState();
    
    startSession();
    const state = useStore.getState();
    
    expect(state.session.sessionId).toBeTruthy();
    expect(state.session.startTime).toBeInstanceOf(Date);
    expect(state.session.totalTracks).toBe(0);
  });
});