import { useState, useEffect } from 'react';

export interface MobileFeatures {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: {
    width: number;
    height: number;
  };
  deviceType: 'mobile' | 'tablet' | 'desktop';
  hasNotch: boolean;
  isStandalone: boolean; // PWA mode
}

export function useMobile(): MobileFeatures {
  const [mobileFeatures, setMobileFeatures] = useState<MobileFeatures>({
    isMobile: false,
    isTablet: false,
    isTouch: false,
    orientation: 'portrait',
    screenSize: { width: 0, height: 0 },
    deviceType: 'desktop',
    hasNotch: false,
    isStandalone: false,
  });

  useEffect(() => {
    const updateMobileFeatures = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Detect device type based on screen size and user agent
      const isMobile =
        width <= 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isTablet =
        width > 768 &&
        width <= 1024 &&
        /iPad|Android/i.test(navigator.userAgent);
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Determine device type
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile && width <= 768) {
        deviceType = 'mobile';
      } else if (isTablet || (isMobile && width > 768)) {
        deviceType = 'tablet';
      }

      // Detect orientation
      const orientation = width > height ? 'landscape' : 'portrait';

      // Detect notch (simplified detection)
      const hasNotch =
        // iPhone X and newer
        (/iPhone/i.test(navigator.userAgent) &&
          window.screen.height >= 812 &&
          'CSS' in window &&
          CSS.supports('padding-top: env(safe-area-inset-top)')) ||
        // Android devices with notch
        (/Android/i.test(navigator.userAgent) &&
          height >= 800 &&
          'CSS' in window &&
          CSS.supports('padding-top: env(safe-area-inset-top)'));

      // Detect PWA/standalone mode
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as { standalone?: boolean }).standalone ||
        document.referrer.includes('android-app://');

      setMobileFeatures({
        isMobile,
        isTablet,
        isTouch,
        orientation,
        screenSize: { width, height },
        deviceType,
        hasNotch,
        isStandalone,
      });
    };

    // Initial detection
    updateMobileFeatures();

    // Listen for changes
    window.addEventListener('resize', updateMobileFeatures);
    window.addEventListener('orientationchange', () => {
      // Delay to ensure accurate readings after orientation change
      setTimeout(updateMobileFeatures, 100);
    });

    return () => {
      window.removeEventListener('resize', updateMobileFeatures);
      window.removeEventListener('orientationchange', updateMobileFeatures);
    };
  }, []);

  return mobileFeatures;
}

// Hook for responsive breakpoints
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<
    'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  >('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setBreakpoint('xs');
      } else if (width < 768) {
        setBreakpoint('sm');
      } else if (width < 1024) {
        setBreakpoint('md');
      } else if (width < 1280) {
        setBreakpoint('lg');
      } else if (width < 1536) {
        setBreakpoint('xl');
      } else {
        setBreakpoint('2xl');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// Hook for touch gestures
export function useTouchGestures() {
  const [gestureState, setGestureState] = useState({
    isGesturing: false,
    startPoint: { x: 0, y: 0 },
    currentPoint: { x: 0, y: 0 },
    direction: null as 'up' | 'down' | 'left' | 'right' | null,
  });

  const handleGesture = (
    element: HTMLElement,
    callbacks: {
      onSwipeUp?: () => void;
      onSwipeDown?: () => void;
      onSwipeLeft?: () => void;
      onSwipeRight?: () => void;
      onTap?: () => void;
      onLongPress?: () => void;
    }
  ) => {
    let startTime = 0;
    let longPressTimer: number;
    const minSwipeDistance = 50;
    const maxTapDistance = 10;
    const longPressDelay = 500;

    const handleStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startTime = Date.now();

      setGestureState({
        isGesturing: true,
        startPoint: { x: touch.clientX, y: touch.clientY },
        currentPoint: { x: touch.clientX, y: touch.clientY },
        direction: null,
      });

      // Start long press timer
      longPressTimer = setTimeout(() => {
        callbacks.onLongPress?.();
      }, longPressDelay) as unknown as number;
    };

    let lastMoveTime = 0;
    const moveThrottleMs = 16; // ~60fps

    const handleMove = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < moveThrottleMs) return;
      lastMoveTime = now;

      const touch = e.touches[0];
      const deltaX = touch.clientX - gestureState.startPoint.x;
      const deltaY = touch.clientY - gestureState.startPoint.y;

      // Clear long press timer on move
      clearTimeout(longPressTimer);

      // Determine direction
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      setGestureState((prev) => ({
        ...prev,
        currentPoint: { x: touch.clientX, y: touch.clientY },
        direction,
      }));
    };

    const handleEnd = () => {
      clearTimeout(longPressTimer);

      const deltaX = gestureState.currentPoint.x - gestureState.startPoint.x;
      const deltaY = gestureState.currentPoint.y - gestureState.startPoint.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const duration = Date.now() - startTime;

      // Determine gesture type
      if (distance < maxTapDistance && duration < 300) {
        callbacks.onTap?.();
      } else if (distance > minSwipeDistance) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            callbacks.onSwipeRight?.();
          } else {
            callbacks.onSwipeLeft?.();
          }
        } else {
          if (deltaY > 0) {
            callbacks.onSwipeDown?.();
          } else {
            callbacks.onSwipeUp?.();
          }
        }
      }

      setGestureState({
        isGesturing: false,
        startPoint: { x: 0, y: 0 },
        currentPoint: { x: 0, y: 0 },
        direction: null,
      });
    };

    // Use passive listeners for better performance
    // eslint-disable-next-line no-undef
    const options: AddEventListenerOptions = { passive: true };
    element.addEventListener('touchstart', handleStart, options);
    element.addEventListener('touchmove', handleMove, options);
    element.addEventListener('touchend', handleEnd, options);

    return () => {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchmove', handleMove);
      element.removeEventListener('touchend', handleEnd);
      clearTimeout(longPressTimer);
    };
  };

  return { gestureState, handleGesture };
}

// Hook for device vibration
export function useVibration() {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const vibratePattern = {
    click: [10],
    success: [100, 50, 100],
    error: [200, 100, 200],
    notification: [50, 50, 50],
  };

  return {
    vibrate,
    patterns: vibratePattern,
    isSupported: 'vibrate' in navigator,
  };
}

// Hook for safe area insets (notch support)
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);

      setSafeArea({
        top: parseInt(
          computedStyle.getPropertyValue('--safe-area-inset-top') || '0'
        ),
        right: parseInt(
          computedStyle.getPropertyValue('--safe-area-inset-right') || '0'
        ),
        bottom: parseInt(
          computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'
        ),
        left: parseInt(
          computedStyle.getPropertyValue('--safe-area-inset-left') || '0'
        ),
      });
    };

    // Set CSS custom properties for safe area
    document.documentElement.style.setProperty(
      '--safe-area-inset-top',
      'env(safe-area-inset-top)'
    );
    document.documentElement.style.setProperty(
      '--safe-area-inset-right',
      'env(safe-area-inset-right)'
    );
    document.documentElement.style.setProperty(
      '--safe-area-inset-bottom',
      'env(safe-area-inset-bottom)'
    );
    document.documentElement.style.setProperty(
      '--safe-area-inset-left',
      'env(safe-area-inset-left)'
    );

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);

    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}
