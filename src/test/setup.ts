import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Audio API
global.AudioContext = vi.fn().mockImplementation(() => ({
  createOscillator: vi.fn(),
  createGain: vi.fn(),
  createAnalyser: vi.fn(),
  createBufferSource: vi.fn(),
  decodeAudioData: vi.fn(),
  destination: {},
  currentTime: 0,
  sampleRate: 44100,
  state: 'running',
  resume: vi.fn().mockResolvedValue(undefined),
  suspend: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
}));

// Mock MediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: vi.fn().mockReturnValue([{
        stop: vi.fn(),
      }]),
    }),
  },
});

// Mock MediaRecorder
global.MediaRecorder = class MockMediaRecorder {
  static isTypeSupported = vi.fn().mockReturnValue(true);
  
  start = vi.fn();
  stop = vi.fn();
  ondataavailable: ((event: any) => void) | null = null;
  onstop: (() => void) | null = null;
  state = 'inactive';
  
  constructor(_stream: MediaStream, _options?: MediaRecorderOptions) {}
} as any;

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));