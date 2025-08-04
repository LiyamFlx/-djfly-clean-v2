import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useAudioState, useAudioActions, useUIState } from '@/store';

const AudioEngine = () => {
  const { deckA, deckB, crossfader, volume } = useAudioState();
  const { masterTabId } = useUIState();
  const [tabId] = useState(() => Math.random().toString(36).substring(2));
  const { updateDeckProgress } = useAudioActions();

  const howlARef = useRef<Howl | null>(null);
  const howlBRef = useRef<Howl | null>(null);

  // Deck A
  useEffect(() => {
    if (deckA.track?.preview_url) {
      const howl = new Howl({
        src: [deckA.track.preview_url],
        html5: true,
        onplay: () => {
          requestAnimationFrame(step);
        },
        onend: () => {
          // Handle track end
        },
      });
      howlARef.current = howl;
    }
    return () => {
      howlARef.current?.unload();
    };
  }, [deckA.track]);

  // Deck B
  useEffect(() => {
    if (deckB.track?.preview_url) {
      const howl = new Howl({
        src: [deckB.track.preview_url],
        html5: true,
        onplay: () => {
          requestAnimationFrame(step);
        },
        onend: () => {
          // Handle track end
        },
      });
      howlBRef.current = howl;
    }
    return () => {
      howlBRef.current?.unload();
    };
  }, [deckB.track]);

  // Play/Pause
  useEffect(() => {
    if (deckA.isPlaying && masterTabId === tabId) {
      howlARef.current?.play();
    } else {
      howlARef.current?.pause();
    }
  }, [deckA.isPlaying, masterTabId, tabId]);

  useEffect(() => {
    if (deckB.isPlaying && masterTabId === tabId) {
      howlBRef.current?.play();
    } else {
      howlBRef.current?.pause();
    }
  }, [deckB.isPlaying, masterTabId, tabId]);

  // Crossfader and Volume
  useEffect(() => {
    const volA = Math.cos((crossfader * Math.PI) / 2);
    const volB = Math.cos(((1 - crossfader) * Math.PI) / 2);
    howlARef.current?.volume(volA * volume);
    howlBRef.current?.volume(volB * volume);
  }, [crossfader, volume]);

  const step = () => {
    if (howlARef.current?.playing()) {
      updateDeckProgress('A', howlARef.current.seek(), howlARef.current.duration());
    }
    if (howlBRef.current?.playing()) {
      updateDeckProgress('B', howlBRef.current.seek(), howlBRef.current.duration());
    }
    requestAnimationFrame(step);
  };

  return null;
};

export default AudioEngine;
