import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAudioPlayer } from '../useAudioPlayer';

// Mock HTMLAudioElement
const mockAudio = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  duration: 180,
  currentTime: 0,
  src: '',
};

global.Audio = vi.fn().mockImplementation(() => mockAudio);

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

    expect(mockAudio.play).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(true);
  });

  it('pauses audio when pause is called', () => {
    const { result } = renderHook(() => useAudioPlayer('test-src'));

    act(() => {
      result.current.pause();
    });

    expect(mockAudio.pause).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('seeks to specific time', () => {
    const { result } = renderHook(() => useAudioPlayer('test-src'));

    act(() => {
      result.current.seek(60);
    });

    expect(mockAudio.currentTime).toBe(60);
  });
});
