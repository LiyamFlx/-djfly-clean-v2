import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Settings, Zap, BarChart3, ChevronDown } from 'lucide-react';
import { advancedAudioService } from '@/services/advancedAudio';
import Slider from '@/components/ui/Slider';
import { useTheme } from '@/contexts/ThemeContext';

interface DualDeckPlayerProps {
  className?: string;
}

interface DeckControls {
  isPlaying: boolean;
  volume: number;
  pitch: number;
  currentTime: number;
  duration: number;
  waveform: Float32Array;
  energy: number;
}

interface MixingState {
  crossfader: number;
  masterVolume: number;
  eq: { low: number; mid: number; high: number };
  effects: { reverb: number; delay: number; filter: number };
}

interface TransitionQuality {
  score: number;
  factors: {
    bpmMatch: number;
    keyCompatibility: number;
    energyFlow: number;
    timing: number;
  };
  suggestions: string[];
}

interface AudioAnalytics {
  deckA?: Partial<DeckControls>;
  deckB?: Partial<DeckControls>;
  mixing?: Partial<MixingState>;
  transitionQuality?: Partial<TransitionQuality>;
}

const TransitionRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score > 80 ? '#abff4f' : score > 60 ? '#F59E0B' : '#9d4edd';

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="text-gray-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
          stroke={color}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
};

const DualDeckPlayer: React.FC<DualDeckPlayerProps> = ({ className = '' }) => {
  const { skin, setSkin, availableSkins } = useTheme();
  const [deckA, setDeckA] = useState<DeckControls>({
    isPlaying: false,
    volume: 1.0,
    pitch: 1.0,
    currentTime: 0,
    duration: 0,
    waveform: new Float32Array(1000),
    energy: 0,
  });

  const [deckB, setDeckB] = useState<DeckControls>({
    isPlaying: false,
    volume: 1.0,
    pitch: 1.0,
    currentTime: 0,
    duration: 0,
    waveform: new Float32Array(1000),
    energy: 0,
  });

  const [mixingState, setMixingState] = useState<MixingState>({
    crossfader: 0.5,
    masterVolume: 1.0,
    eq: { low: 0, mid: 0, high: 0 },
    effects: { reverb: 0, delay: 0, filter: 0 },
  });

  const [transitionQuality, setTransitionQuality] = useState<TransitionQuality>(
    {
      score: 0,
      factors: { bpmMatch: 0, keyCompatibility: 0, energyFlow: 0, timing: 0 },
      suggestions: [],
    }
  );

  const analyticsInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Start analytics monitoring
    analyticsInterval.current = setInterval(() => {
      try {
        const analytics = advancedAudioService.getAnalytics() as AudioAnalytics;

        if (analytics.deckA) {
          setDeckA((prev) => ({
            ...prev,
            isPlaying: analytics.deckA?.isPlaying ?? prev.isPlaying,
            currentTime: analytics.deckA?.currentTime ?? prev.currentTime,
            volume: analytics.deckA?.volume ?? prev.volume,
            pitch: analytics.deckA?.pitch ?? prev.pitch,
            energy: analytics.deckA?.energy ?? prev.energy,
            waveform: analytics.deckA?.waveform ?? prev.waveform,
            duration: analytics.deckA?.duration ?? prev.duration,
          }));
        }

        if (analytics.deckB) {
          setDeckB((prev) => ({
            ...prev,
            isPlaying: analytics.deckB?.isPlaying ?? prev.isPlaying,
            currentTime: analytics.deckB?.currentTime ?? prev.currentTime,
            volume: analytics.deckB?.volume ?? prev.volume,
            pitch: analytics.deckB?.pitch ?? prev.pitch,
            energy: analytics.deckB?.energy ?? prev.energy,
            waveform: analytics.deckB?.waveform ?? prev.waveform,
            duration: analytics.deckB?.duration ?? prev.duration,
          }));
        }

        if (analytics.mixing) {
          setMixingState((prev) => ({
            ...prev,
            ...analytics.mixing,
          }));
        }

        if (analytics.transitionQuality) {
          setTransitionQuality((prev) => ({
            ...prev,
            ...analytics.transitionQuality,
          }));
        }
      } catch (error) {
        console.warn('Analytics update failed:', error);
      }
    }, 100);

    return () => {
      if (analyticsInterval.current) {
        clearInterval(analyticsInterval.current);
      }
    };
  }, []);

  const togglePlay = (deck: 'A' | 'B') => {
    try {
      advancedAudioService.togglePlay(deck);
    } catch (error) {
      console.error(`Failed to toggle play for deck ${deck}:`, error);
    }
  };

  const setVolume = (deck: 'A' | 'B', volume: number) => {
    try {
      advancedAudioService.setDeckVolume(deck, volume);
      if (deck === 'A') {
        setDeckA((prev) => ({ ...prev, volume }));
      } else {
        setDeckB((prev) => ({ ...prev, volume }));
      }
    } catch (error) {
      console.error(`Failed to set volume for deck ${deck}:`, error);
    }
  };

  const setPitch = (deck: 'A' | 'B', pitch: number) => {
    try {
      advancedAudioService.setPitch(deck, pitch);
      if (deck === 'A') {
        setDeckA((prev) => ({ ...prev, pitch }));
      } else {
        setDeckB((prev) => ({ ...prev, pitch }));
      }
    } catch (error) {
      console.error(`Failed to set pitch for deck ${deck}:`, error);
    }
  };

  const setCrossfader = (position: number) => {
    try {
      advancedAudioService.setCrossfader(position);
      setMixingState((prev) => ({ ...prev, crossfader: position }));
    } catch (error) {
      console.error('Failed to set crossfader:', error);
    }
  };

  const setEQ = (band: 'low' | 'mid' | 'high', value: number) => {
    try {
      advancedAudioService.setEQ(band, value);
      setMixingState((prev) => ({
        ...prev,
        eq: { ...prev.eq, [band]: value },
      }));
    } catch (error) {
      console.error(`Failed to set EQ ${band}:`, error);
    }
  };

  const setEffect = (effect: 'reverb' | 'delay' | 'filter', value: number) => {
    try {
      advancedAudioService.setEffect(effect, value);
      setMixingState((prev) => ({
        ...prev,
        effects: { ...prev.effects, [effect]: value },
      }));
    } catch (error) {
      console.error(`Failed to set effect ${effect}:`, error);
    }
  };

  const setMasterVolume = (volume: number) => {
    try {
      // advancedAudioService.setMasterVolume?.(volume);
      setMixingState((prev) => ({ ...prev, masterVolume: volume }));
    } catch (error) {
      console.error('Failed to set master volume:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEnergyColor = (energy: number): string => {
    if (energy > 0.7) return 'text-red-400';
    if (energy > 0.4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const WaveformDisplay: React.FC<{
    waveform: Float32Array;
    color: string;
    energy: number;
  }> = ({ waveform, color, energy }) => (
    <div className="h-24 bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: 1 + energy * 0.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {Array.from(waveform).map((value, index) => (
          <div
            key={index}
            className={`${color} mx-px`}
            style={{
              height: `${Math.max(1, Math.abs(value) * 100)}%`,
              width: `${100 / waveform.length}%`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className={`bg-gray-900 text-white p-6 rounded-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Magic Player</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={skin.id}
              onChange={(e) => setSkin(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white pl-3 pr-8 py-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-neon-purple"
            >
              {availableSkins.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Player Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deck A */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neon-purple">Deck A</h3>
            <div
              className={`flex items-center gap-1 ${getEnergyColor(deckA.energy)}`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">{Math.round(deckA.energy * 100)}%</span>
            </div>
          </div>
          <WaveformDisplay waveform={deckA.waveform} color="bg-neon-purple" energy={deckA.energy} />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => togglePlay('A')}
                className="btn-primary"
                animate={{
                  boxShadow: deckA.isPlaying ? '0 0 20px rgba(0, 212, 255, 0.7)' : 'none',
                }}
                transition={{
                  duration: 0.8,
                  repeat: deckA.isPlaying ? Infinity : 0,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              >
                {deckA.isPlaying ? <Pause /> : <Play />}
              </motion.button>
              <span className="text-sm text-gray-400 font-mono">
                {formatTime(deckA.currentTime)} / {formatTime(deckA.duration)}
              </span>
            </div>
            <div className="space-y-2">
              <label htmlFor="deck-a-volume" className="text-xs font-semibold uppercase tracking-wider">Volume</label>
              <Slider id="deck-a-volume" min="0" max="1" step="0.01" value={deckA.volume} onChange={(e) => setVolume('A', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label htmlFor="deck-a-pitch" className="text-xs font-semibold uppercase tracking-wider">Pitch</label>
              <Slider id="deck-a-pitch" min="0.5" max="2.0" step="0.01" value={deckA.pitch} onChange={(e) => setPitch('A', parseFloat(e.target.value))} />
              <span className="text-xs text-gray-400">{deckA.pitch.toFixed(2)}x</span>
            </div>
          </div>
        </div>

        {/* Mixing Controls */}
        <div className="glass-card p-4 flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-center">Mixer</h3>

          <div className="flex justify-center">
            <TransitionRing score={transitionQuality.score} />
          </div>

          <div className="space-y-2">
            <label htmlFor="master-volume" className="text-xs font-semibold uppercase tracking-wider text-center block">Master</label>
            <Slider id="master-volume" min="0" max="1" step="0.01" value={mixingState.masterVolume} onChange={(e) => setMasterVolume(parseFloat(e.target.value))} />
          </div>

          <div className="space-y-2">
            <label htmlFor="crossfader" className="text-xs font-semibold uppercase tracking-wider text-center block">Crossfader</label>
            <Slider id="crossfader" min="0" max="1" step="0.01" value={mixingState.crossfader} onChange={(e) => setCrossfader(parseFloat(e.target.value))} />
          </div>

          <div className="flex justify-around items-end h-full">
            <div className="flex flex-col items-center space-y-2">
              <Slider id="eq-low" min="-12" max="12" step="1" value={mixingState.eq.low} onChange={(e) => setEQ('low', parseInt(e.target.value))} orientation="vertical" />
              <label htmlFor="eq-low" className="text-xs font-semibold uppercase">Low</label>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Slider id="eq-mid" min="-12" max="12" step="1" value={mixingState.eq.mid} onChange={(e) => setEQ('mid', parseInt(e.target.value))} orientation="vertical" />
              <label htmlFor="eq-mid" className="text-xs font-semibold uppercase">Mid</label>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Slider id="eq-high" min="-12" max="12" step="1" value={mixingState.eq.high} onChange={(e) => setEQ('high', parseInt(e.target.value))} orientation="vertical" />
              <label htmlFor="eq-high" className="text-xs font-semibold uppercase">High</label>
            </div>
          </div>
        </div>

        {/* Deck B */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neon-green">Deck B</h3>
            <div className={`flex items-center gap-1 ${getEnergyColor(deckB.energy)}`}>
              <Zap className="w-4 h-4" />
              <span className="text-sm">{Math.round(deckB.energy * 100)}%</span>
            </div>
          </div>
          <WaveformDisplay waveform={deckB.waveform} color="bg-neon-green" energy={deckB.energy} />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <motion.button
                onClick={() => togglePlay('B')}
                className="btn-accent"
                animate={{
                  boxShadow: deckB.isPlaying ? '0 0 20px rgba(0, 255, 204, 0.7)' : 'none',
                }}
                transition={{
                  duration: 0.8,
                  repeat: deckB.isPlaying ? Infinity : 0,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              >
                {deckB.isPlaying ? <Pause /> : <Play />}
              </motion.button>
              <span className="text-sm text-gray-400 font-mono">
                {formatTime(deckB.currentTime)} / {formatTime(deckB.duration)}
              </span>
            </div>
            <div className="space-y-2">
              <label htmlFor="deck-b-volume" className="text-xs font-semibold uppercase tracking-wider">Volume</label>
              <Slider id="deck-b-volume" min="0" max="1" step="0.01" value={deckB.volume} onChange={(e) => setVolume('B', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label htmlFor="deck-b-pitch" className="text-xs font-semibold uppercase tracking-wider">Pitch</label>
              <Slider id="deck-b-pitch" min="0.5" max="2.0" step="0.01" value={deckB.pitch} onChange={(e) => setPitch('B', parseFloat(e.target.value))} />
              <span className="text-xs text-gray-400">{deckB.pitch.toFixed(2)}x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Effects Section */}
      <div className="mt-6 glass-card p-4">
        <h3 className="text-lg font-semibold mb-4">Effects</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="effect-reverb" className="text-xs font-semibold uppercase">Reverb</label>
            <Slider id="effect-reverb" min="0" max="1" step="0.01" value={mixingState.effects.reverb} onChange={(e) => setEffect('reverb', parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label htmlFor="effect-delay" className="text-xs font-semibold uppercase">Delay</label>
            <Slider id="effect-delay" min="0" max="1" step="0.01" value={mixingState.effects.delay} onChange={(e) => setEffect('delay', parseFloat(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label htmlFor="effect-filter" className="text-xs font-semibold uppercase">Filter</label>
            <Slider id="effect-filter" min="0" max="1" step="0.01" value={mixingState.effects.filter} onChange={(e) => setEffect('filter', parseFloat(e.target.value))} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualDeckPlayer;
