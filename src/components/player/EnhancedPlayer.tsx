import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Zap,
  TrendingUp,
  Activity,
  Target,
  Music,
} from 'lucide-react';

interface EnhancedPlayerProps {
  className?: string;
}

interface TrackInfo {
  title: string;
  artist: string;
  bpm: number;
  key: string;
  energy: number;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  waveform: number[];
}

const EnhancedPlayer: React.FC<EnhancedPlayerProps> = ({ className = '' }) => {
  const [trackInfo, setTrackInfo] = useState<TrackInfo>({
    title: 'Sample Track',
    artist: 'DJ Artist',
    bpm: 128,
    key: 'Am',
    energy: 75,
    duration: 180,
    currentTime: 45,
    isPlaying: false,
    waveform: Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2),
  });

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [volume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Simulate track progress
  useEffect(() => {
    if (trackInfo.isPlaying) {
      const interval = setInterval(() => {
        setTrackInfo((prev) => ({
          ...prev,
          currentTime: Math.min(prev.currentTime + 1, prev.duration),
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [trackInfo.isPlaying]);

  const togglePlay = () => {
    setTrackInfo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEnergyColor = (energy: number) => {
    if (energy > 80) return 'text-red-400';
    if (energy > 60) return 'text-orange-400';
    if (energy > 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBPMColor = (bpm: number) => {
    if (bpm > 140) return 'text-red-400';
    if (bpm > 120) return 'text-orange-400';
    if (bpm > 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  const progress = (trackInfo.currentTime / trackInfo.duration) * 100;

  return (
    <div
      className={`bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 ${className}`}
    >
      {/* Track Info Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ rotate: trackInfo.isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 bg-gradient-to-r from-neon-purple to-neon-green rounded-full flex items-center justify-center"
          >
            <Music className="w-8 h-8 text-rich-black" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {trackInfo.title}
            </h3>
            <p className="text-gray-400">{trackInfo.artist}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <Activity className="w-5 h-5" />
        </button>
      </div>

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-gray-800/50 rounded-xl p-4"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-electric-blue" />
                  <span className="text-sm text-gray-400">BPM</span>
                </div>
                <p
                  className={`text-xl font-bold ${getBPMColor(trackInfo.bpm)}`}
                >
                  {trackInfo.bpm}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-neon-purple" />
                  <span className="text-sm text-gray-400">Energy</span>
                </div>
                <p
                  className={`text-xl font-bold ${getEnergyColor(trackInfo.energy)}`}
                >
                  {trackInfo.energy}%
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-neon-green" />
                  <span className="text-sm text-gray-400">Key</span>
                </div>
                <p className="text-xl font-bold text-white">{trackInfo.key}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waveform Visualization */}
      <div className="mb-6">
        <div className="flex items-end space-x-1 h-20 bg-gray-800/30 rounded-lg p-4">
          {trackInfo.waveform.map((height, index) => (
            <motion.div
              key={index}
              animate={
                trackInfo.isPlaying
                  ? { height: [height * 60, height * 80, height * 60] }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: index * 0.02,
              }}
              className="w-1 bg-gradient-to-t from-neon-purple to-neon-green rounded-full"
              style={{ height: `${height * 60}px` }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{formatTime(trackInfo.currentTime)}</span>
          <span>{formatTime(trackInfo.duration)}</span>
        </div>
        <div
          ref={progressRef}
          className="w-full h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={() => {}}
          onClick={(e) => {
            if (progressRef.current) {
              const rect = progressRef.current.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * trackInfo.duration;
              setTrackInfo((prev) => ({ ...prev, currentTime: newTime }));
            }
          }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-neon-purple to-neon-green"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <Shuffle className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <SkipBack className="w-5 h-5" />
          </button>
          <motion.button
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-gradient-to-r from-neon-purple to-neon-green rounded-full flex items-center justify-center text-rich-black font-bold"
          >
            {trackInfo.isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </motion.button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <SkipForward className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-purple to-neon-green"
              initial={{ width: 0 }}
              animate={{ width: `${isMuted ? 0 : volume * 100}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* Energy Level Indicator */}
      <div className="mt-4 flex items-center space-x-2">
        <span className="text-sm text-gray-400">Energy Level:</span>
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getEnergyColor(trackInfo.energy).replace('text-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: `${trackInfo.energy}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-sm text-gray-400">{trackInfo.energy}%</span>
      </div>
    </div>
  );
};

export default EnhancedPlayer;
