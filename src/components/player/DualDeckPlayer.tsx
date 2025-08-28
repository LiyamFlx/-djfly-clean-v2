import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Settings, Zap, Volume2, Music, Target, Activity } from 'lucide-react';
import { advancedAudioService } from '@/services/advancedAudio';
import Slider from '@/components/ui/Slider';
import { GlassCard, NeonCard } from '@/components/ui/EnhancedCard';

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
    <motion.div 
      className="relative w-32 h-32"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
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
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {score}
        </motion.span>
      </div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ boxShadow: `0 0 20px ${color}40` }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

const DeckDisplay: React.FC<{
  deck: DeckControls;
  deckLabel: 'A' | 'B';
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onPitchChange: (pitch: number) => void;
  isActive: boolean;
}> = ({ deck, deckLabel, onTogglePlay, onVolumeChange, onPitchChange, isActive }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className={`relative ${isActive ? 'z-10' : 'z-0'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard
        icon={Music}
        iconPosition="top"
        iconColor={isActive ? 'dj-interactive' : 'gray'}
        title={`Deck ${deckLabel}`}
        subtitle={deck.isPlaying ? 'Playing' : 'Stopped'}
        className={`h-full transition-all duration-300 ${
          isActive ? 'border-dj-interactive/50 shadow-dj-soft' : ''
        }`}
      >
        <div className="space-y-6">
          {/* Play/Pause Button */}
          <motion.button
            onClick={onTogglePlay}
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
              deck.isPlaying 
                ? 'bg-success-500 text-white shadow-success-500/20'
                : 'bg-dj-interactive text-white shadow-dj-interactive/20'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {deck.isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Pause className="w-8 h-8" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Play className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Time Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {formatTime(deck.currentTime)}
            </div>
            <div className="text-sm text-gray-400">
              {formatTime(deck.duration)}
            </div>
          </div>

          {/* Energy Meter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Energy</span>
              <span className="text-success-500 font-medium">
                {Math.round(deck.energy * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-success-500 to-dj-interactive"
                initial={{ width: 0 }}
                animate={{ width: `${deck.energy * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Volume</span>
              <span className="text-white font-medium">
                {Math.round(deck.volume * 100)}%
              </span>
            </div>
            <Slider
              value={deck.volume}
              onChange={(e) => onVolumeChange(Number((e.target as HTMLInputElement).value))}
              className="w-full"
            />
          </div>

          {/* Pitch Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Pitch</span>
              <span className="text-white font-medium">
                {deck.pitch.toFixed(2)}x
              </span>
            </div>
            <Slider
              value={deck.pitch}
              onChange={(e) => onPitchChange(Number((e.target as HTMLInputElement).value))}
              min={0.5}
              max={2.0}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const DualDeckPlayer: React.FC<DualDeckPlayerProps> = ({ className = '' }) => {
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

  const [transitionQuality, setTransitionQuality] = useState<TransitionQuality>({
    score: 0,
    factors: { bpmMatch: 0, keyCompatibility: 0, energyFlow: 0, timing: 0 },
    suggestions: [],
  });

  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [activeDeck, setActiveDeck] = useState<'A' | 'B' | null>(null);

  const analyticsInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
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
            currentTime: analytics.deckA?.currentTime ?? prev.currentTime,
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
      setActiveDeck(deck);
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

  const setCrossfader = (value: number) => {
    try {
      advancedAudioService.setCrossfader(value);
      setMixingState((prev) => ({ ...prev, crossfader: value }));
    } catch (error) {
      console.error('Failed to set crossfader:', error);
    }
  };

  const setMasterVolume = (value: number) => {
    try {
      advancedAudioService.setMasterVolume(value);
      setMixingState((prev) => ({ ...prev, masterVolume: value }));
    } catch (error) {
      console.error('Failed to set master volume:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-dj-interactive/10 border border-dj-interactive/30 rounded-xl">
            <Music className="w-6 h-6 text-dj-interactive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-dj-text-primary">Dual Deck Player</h2>
            <p className="text-sm text-dj-text-secondary">Professional DJ mixing interface</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => setShowAdvancedControls(!showAdvancedControls)}
          className="btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-4 h-4" />
          {showAdvancedControls ? 'Hide' : 'Show'} Advanced
        </motion.button>
      </motion.div>

      {/* Main Player Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deck A */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DeckDisplay
            deck={deckA}
            deckLabel="A"
            onTogglePlay={() => togglePlay('A')}
            onVolumeChange={(volume) => setVolume('A', volume)}
            onPitchChange={(pitch) => setPitch('A', pitch)}
            isActive={activeDeck === 'A'}
          />
        </motion.div>

        {/* Mixing Controls */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Crossfader */}
          <GlassCard
            icon={Activity}
            iconPosition="top"
            iconColor="dj-interactive"
            title="Crossfader"
            subtitle="Mix between decks"
          >
            <div className="space-y-4">
              <Slider
                value={mixingState.crossfader}
                onChange={(e) => setCrossfader(Number((e.target as HTMLInputElement).value))}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>Deck A</span>
                <span>Deck B</span>
              </div>
            </div>
          </GlassCard>

          {/* Master Volume */}
          <GlassCard
            icon={Volume2}
            iconPosition="top"
            iconColor="success-500"
            title="Master Volume"
            subtitle="Overall output level"
          >
            <div className="space-y-4">
              <Slider
                value={mixingState.masterVolume}
                onChange={(e) => setMasterVolume(Number((e.target as HTMLInputElement).value))}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-400">
                {Math.round(mixingState.masterVolume * 100)}%
              </div>
            </div>
          </GlassCard>

          {/* Transition Quality */}
          <NeonCard
            icon={Target}
            iconPosition="top"
            iconColor="dj-interactive"
            title="Transition Quality"
            subtitle="How smooth is your current transition"
          >
            <div className="flex items-center justify-between">
              <TransitionRing score={transitionQuality.score} />
              <div className="space-y-2">
                <div className="text-sm text-gray-400">BPM Match</div>
                <div className="text-sm text-gray-400">Key Compatibility</div>
                <div className="text-sm text-gray-400">Energy Flow</div>
                <div className="text-sm text-gray-400">Timing</div>
              </div>
            </div>
          </NeonCard>
        </motion.div>

        {/* Deck B */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DeckDisplay
            deck={deckB}
            deckLabel="B"
            onTogglePlay={() => togglePlay('B')}
            onVolumeChange={(volume) => setVolume('B', volume)}
            onPitchChange={(pitch) => setPitch('B', pitch)}
            isActive={activeDeck === 'B'}
          />
        </motion.div>
      </div>

      {/* Advanced Controls */}
      <AnimatePresence>
        {showAdvancedControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              {/* EQ Controls */}
              <GlassCard
                icon={Settings}
                iconPosition="top"
                iconColor="success-500"
                title="Equalizer"
                subtitle="Frequency adjustments"
              >
                <div className="space-y-4">
                  {Object.entries(mixingState.eq).map(([band, value]) => (
                    <div key={band} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{band}</span>
                        <span className="text-white">{value}dB</span>
                      </div>
                      <Slider
                        value={value}
                        onChange={(newValue) => 
                          setMixingState(prev => ({
                            ...prev,
                            eq: { ...prev.eq, [band]: newValue }
                          }))
                        }
                        min={-12}
                        max={12}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Effects Controls */}
              <GlassCard
                icon={Zap}
                iconPosition="top"
                iconColor="dj-interactive"
                title="Effects"
                subtitle="Audio processing"
              >
                <div className="space-y-4">
                  {Object.entries(mixingState.effects).map(([effect, value]) => (
                    <div key={effect} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 capitalize">{effect}</span>
                        <span className="text-white">{Math.round(value * 100)}%</span>
                      </div>
                      <Slider
                        value={value}
                        onChange={(newValue) => 
                          setMixingState(prev => ({
                            ...prev,
                            effects: { ...prev.effects, [effect]: newValue }
                          }))
                        }
                        min={0}
                        max={1}
                        step={0.01}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DualDeckPlayer;
