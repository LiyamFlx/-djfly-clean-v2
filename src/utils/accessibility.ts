import React, { useEffect, useRef, useState } from 'react';

// Focus management utilities
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
};

// Screen reader announcements
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onEnter?.();
      break;
    case 'Escape':
      event.preventDefault();
      onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      onArrowDown?.();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      onArrowLeft?.();
      break;
    case 'ArrowRight':
      event.preventDefault();
      onArrowRight?.();
      break;
  }
};

// High contrast mode detection
export const useHighContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) => {
      if (c <= 0.03928) {
        return c / 12.92;
      }
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
};

export const isAccessibleContrast = (
  color1: string,
  color2: string
): boolean => {
  const ratio = getContrastRatio(color1, color2);
  return ratio >= 4.5; // WCAG AA standard for normal text
};

// Skip link component - JSX version available in separate component file
export const createSkipLink = (targetId: string, text: string) => {
  return {
    href: `#${targetId}`,
    className:
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-electric-blue focus:text-rich-black focus:rounded-lg focus:font-semibold',
    text,
  };
};

// ARIA label helpers
export const getAriaLabel = (action: string, context?: string): string => {
  if (context) {
    return `${action} ${context}`;
  }
  return action;
};

// Live region announcements for dynamic content - JSX version available in separate component file
export const createLiveRegion = (
  priority: 'polite' | 'assertive' = 'polite'
) => {
  return {
    'aria-live': priority,
    'aria-atomic': 'true',
    className: 'sr-only',
  };
};

// Focus restoration
export const useFocusRestoration = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  return { saveFocus, restoreFocus };
};

// Audio description helpers for music visualization
export const describeAudioVisualization = (
  energy: number,
  bpm: number,
  key: string,
  isPlaying: boolean
): string => {
  const energyLevel = energy > 80 ? 'high' : energy > 60 ? 'medium' : 'low';
  const tempo = bpm > 140 ? 'fast' : bpm > 120 ? 'moderate' : 'slow';
  const status = isPlaying ? 'playing' : 'paused';

  return `Track is ${status} with ${energyLevel} energy, ${tempo} tempo at ${bpm} BPM in ${key} key`;
};

// Haptic feedback for mobile devices
export const useHapticFeedback = () => {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const hapticPatterns = {
    light: [10],
    medium: [50],
    heavy: [100],
    success: [100, 50, 100],
    error: [200, 100, 200],
    warning: [150, 50, 150],
  };

  return { vibrate, patterns: hapticPatterns };
};

// Voice control support
export const useVoiceControl = () => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      return recognition;
    }
    return null;
  };

  return { isListening, startListening };
};

export default {
  useFocusTrap,
  announceToScreenReader,
  handleKeyboardNavigation,
  useHighContrastMode,
  useReducedMotion,
  getContrastRatio,
  isAccessibleContrast,
  createSkipLink,
  getAriaLabel,
  createLiveRegion,
  useFocusRestoration,
  describeAudioVisualization,
  useHapticFeedback,
  useVoiceControl,
};
