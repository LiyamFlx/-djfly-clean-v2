import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Settings, Zap, BarChart3 } from 'lucide-react';
import { advancedAudioService } from '@/services/advancedAudio';

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

  const [mixingState, setMixingState] = useState({
    crossfader: 0.5,
    masterVolume: 1.0,
    eq: { low: 0, mid: 0, high: 0 },
    effects: { reverb: 0, delay: 0, filter: 0 },
  });

  const [transitionQuality, setTransitionQuality] = useState({
    score: 0,
    factors: { bpmMatch: 0, keyCompatibility: 0, energyFlow: 0, timing: 0 },
    suggestions: [] as string[],
  });

  const [showAnalytics, setShowAnalytics] = useState(false);
  const analyticsInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Start analytics monitoring
    analyticsInterval.current = setInterval(() => {
      const analytics = advancedAudioService.getAnalytics();

      if (analytics.deckA) {
        setDeckA((prev) => ({
          ...prev,
          isPlaying: analytics.deckA.isPlaying,
          currentTime: analytics.deckA.currentTime,
          volume: analytics.deckA.volume,
          pitch: analytics.deckA.pitch,
          energy: analytics.deckA.energy,
        }));
      }

      if (analytics.deckB) {
        setDeckB((prev) => ({
          ...prev,
          isPlaying: analytics.deckB.isPlaying,
          currentTime: analytics.deckB.currentTime,
          volume: analytics.deckB.volume,
          pitch: analytics.deckB.pitch,
          energy: analytics.deckB.energy,
        }));
      }

      setMixingState(analytics.mixing);
      setTransitionQuality(analytics.transitionQuality);
    }, 100);

    return () => {
      if (analyticsInterval.current) {
        clearInterval(analyticsInterval.current);
      }
    };
  }, []);

  const togglePlay = (deck: 'A' | 'B') => {
    advancedAudioService.togglePlay(deck);
  };

  const setVolume = (deck: 'A' | 'B', volume: number) => {
    advancedAudioService.setDeckVolume(deck, volume);
  };

  const setPitch = (deck: 'A' | 'B', pitch: number) => {
    advancedAudioService.setPitch(deck, pitch);
  };

  const setCrossfader = (position: number) => {
    advancedAudioService.setCrossfader(position);
  };

  const setEQ = (band: 'low' | 'mid' | 'high', value: number) => {
    advancedAudioService.setEQ(band, value);
  };

  // const setEffect = (effect: 'reverb' | 'delay' | 'filter', value: number) => {
  //   advancedAudioService.setEffect(effect, value);
  // };

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

  const getTransitionColor = (score: number): string => {
    if (score > 80) return 'text-green-400';
    if (score > 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-gray-900 text-white p-6 rounded-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Magic Player</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showAnalytics ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Dual Deck Layout */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Deck A */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-400">Deck A</h3>
            <div
              className={`flex items-center gap-1 ${getEnergyColor(deckA.energy)}`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">{Math.round(deckA.energy * 100)}%</span>
            </div>
          </div>

          {/* Waveform */}
          <div className="h-24 bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {deckA.waveform.map((value, index) => (
                <div
                  key={index}
                  className="bg-blue-400 mx-px"
                  style={{
                    height: `${Math.max(1, value * 100)}%`,
                    width: `${100 / deckA.waveform.length}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePlay('A')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {deckA.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {deckA.isPlaying ? 'Pause' : 'Play'}
              </button>
              <span className="text-sm text-gray-400">
                {formatTime(deckA.currentTime)} / {formatTime(deckA.duration)}
              </span>
            </div>

            <div className="space-y-2">
              <label htmlFor="deck-a-volume" className="text-sm text-gray-300">
                Volume
              </label>
              <input
                id="deck-a-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={deckA.volume}
                onChange={(e) => setVolume('A', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="deck-a-pitch" className="text-sm text-gray-300">
                Pitch
              </label>
              <input
                id="deck-a-pitch"
                type="range"
                min="0.5"
                max="2.0"
                step="0.01"
                value={deckA.pitch}
                onChange={(e) => setPitch('A', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">
                {deckA.pitch.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>

        {/* Deck B */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-400">Deck B</h3>
            <div
              className={`flex items-center gap-1 ${getEnergyColor(deckB.energy)}`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">{Math.round(deckB.energy * 100)}%</span>
            </div>
          </div>

          {/* Waveform */}
          <div className="h-24 bg-gray-700 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {deckB.waveform.map((value, index) => (
                <div
                  key={index}
                  className="bg-green-400 mx-px"
                  style={{
                    height: `${Math.max(1, value * 100)}%`,
                    width: `${100 / deckB.waveform.length}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePlay('B')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors"
              >
                {deckB.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {deckB.isPlaying ? 'Pause' : 'Play'}
              </button>
              <span className="text-sm text-gray-400">
                {formatTime(deckB.currentTime)} / {formatTime(deckB.duration)}
              </span>
            </div>

            <div className="space-y-2">
              <label htmlFor="deck-b-volume" className="text-sm text-gray-300">
                Volume
              </label>
              <input
                id="deck-b-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={deckB.volume}
                onChange={(e) => setVolume('B', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="deck-b-pitch" className="text-sm text-gray-300">
                Pitch
              </label>
              <input
                id="deck-b-pitch"
                type="range"
                min="0.5"
                max="2.0"
                step="0.01"
                value={deckB.pitch}
                onChange={(e) => setPitch('B', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">
                {deckB.pitch.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mixing Controls */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Mixing Controls</h3>

        <div className="grid grid-cols-3 gap-6">
          {/* Crossfader */}
          <div className="space-y-3">
            <label htmlFor="crossfader" className="text-sm text-gray-300">
              Crossfader
            </label>
            <div className="relative">
              <input
                id="crossfader"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={mixingState.crossfader}
                onChange={(e) => setCrossfader(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Deck A</span>
                <span>Deck B</span>
              </div>
            </div>
          </div>

          {/* Master Volume */}
          <div className="space-y-3">
            <label htmlFor="master-volume" className="text-sm text-gray-300">
              Master Volume
            </label>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <input
                id="master-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={mixingState.masterVolume}
                onChange={(e) =>
                  setMixingState((prev) => ({
                    ...prev,
                    masterVolume: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="text-xs text-gray-400">
                {Math.round(mixingState.masterVolume * 100)}%
              </span>
            </div>
          </div>

          {/* EQ */}
          <div className="space-y-3">
            <span className="text-sm text-gray-300">EQ</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor="eq-low" className="text-xs w-8">
                  L
                </label>
                <input
                  id="eq-low"
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={mixingState.eq.low}
                  onChange={(e) => setEQ('low', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs w-8">{mixingState.eq.low}dB</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="eq-mid" className="text-xs w-8">
                  M
                </label>
                <input
                  id="eq-mid"
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={mixingState.eq.mid}
                  onChange={(e) => setEQ('mid', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs w-8">{mixingState.eq.mid}dB</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="eq-high" className="text-xs w-8">
                  H
                </label>
                <input
                  id="eq-high"
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={mixingState.eq.high}
                  onChange={(e) => setEQ('high', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs w-8">{mixingState.eq.high}dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Live Analytics</h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Transition Quality */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Transition Quality</h4>
                  <span
                    className={`text-lg font-bold ${getTransitionColor(transitionQuality.score)}`}
                  >
                    {transitionQuality.score}/100
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>BPM Match</span>
                    <span>{transitionQuality.factors.bpmMatch}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Key Compatibility</span>
                    <span>{transitionQuality.factors.keyCompatibility}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Energy Flow</span>
                    <span>{transitionQuality.factors.energyFlow}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Timing</span>
                    <span>{transitionQuality.factors.timing}%</span>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Suggestions</h4>
                <div className="space-y-2">
                  {transitionQuality.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-300 bg-gray-700 p-2 rounded"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DualDeckPlayer;
