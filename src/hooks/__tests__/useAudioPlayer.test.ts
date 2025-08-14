import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAudioPlayer } from '../useAudioPlayer';

// Mock MagicPlayer
const mockMagicPlayer = {
  initialize: vi.fn().mockResolvedValue(undefined),
  destroy: vi.fn(),
  loadTrack: vi.fn().mockResolvedValue(undefined),
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  seek: vi.fn(),
  setDeckVolume: vi.fn(),
  getDeckState: vi.fn().mockReturnValue({ isPlaying: false, currentTime: 0 }),
  getCurrentAnalysis: vi.fn().mockReturnValue({
    spectrum: new Uint8Array(128),
    waveform: new Uint8Array(128),
  }),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Store event listeners for testing
let playCallback: (() => void) | null = null;
let pauseCallback: (() => void) | null = null;

// Override addEventListener to capture callbacks
mockMagicPlayer.addEventListener = vi.fn((event, callback) => {
  if (event === 'play') {
    playCallback = callback;
  } else if (event === 'pause') {
    pauseCallback = callback;
  }
});

// Mock the MagicPlayer class
vi.mock('@/services/MagicPlayer', () => ({
  default: vi.fn().mockImplementation(() => mockMagicPlayer),
  MagicPlayer: vi.fn().mockImplementation(() => mockMagicPlayer),
}));

describe('useAudioPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useAudioPlayer('test-src'));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.duration).toBe(0);
    expect(result.current.currentTime).toBe(0);
  });

  it('plays audio when play is called', async () => {
    const { result } = renderHook(() => useAudioPlayer('test-src'));

    await act(async () => {
      result.current.play();
    });

    expect(mockMagicPlayer.play).toHaveBeenCalledWith('A');

    // Simulate the play event callback
    if (playCallback) {
      act(() => {
        playCallback();
      });
    }

    expect(result.current.isPlaying).toBe(true);
  });

  it('pauses audio when pause is called', () => {
    const { result } = renderHook(() => useAudioPlayer('test-src'));

    act(() => {
      result.current.pause();
    });

    expect(mockMagicPlayer.pause).toHaveBeenCalledWith('A');

    // Simulate the pause event callback
    if (pauseCallback) {
      act(() => {
        pauseCallback();
      });
    }

    expect(result.current.isPlaying).toBe(false);
  });

  it('seeks to specific time', () => {
    const { result } = renderHook(() => useAudioPlayer('test-src'));

    act(() => {
      result.current.seek(60);
    });

    expect(mockMagicPlayer.seek).toHaveBeenCalledWith('A', 60);
  });
});
