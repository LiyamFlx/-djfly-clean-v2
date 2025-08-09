import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  LogOut,
} from 'lucide-react';
import { useMusicContext } from '@/contexts/MusicContext';
import TrackList from '@/components/ui/TrackList';
import { useNavigate } from 'react-router-dom';

const PlayerPage: React.FC = () => {
  const [isFinishModalOpen, setFinishModalOpen] = useState(false);
  const [volume, setVolume] = useState(75);
  const navigate = useNavigate();
  const {
    currentTrack,
    queue,
    isPlaying,
    playTrack,
    setIsPlaying,
    nextTrack,
    previousTrack
  } = useMusicContext();

  const progress = 0; // Simplified for now - can add audio time tracking later

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTrack = currentTrack || {
    title: 'No track selected',
    artist: 'Generate a set in Magic Studio to start playing',
    bpm: 0,
    key: '',
    genre: '',
  };

  const handleConfirmFinish = () => {
    setFinishModalOpen(false);
    // Here you would typically dispatch an action to finalize the session
    // e.g., useSessionActions().endSession();
    navigate('/producer');
  };

  const sessionDurationMinutes = 0; // Simplified for now

  return (
    <div className="min-h-screen bg-club-gradient">
      {/* End Set Button */}
      <button
        onClick={() => setFinishModalOpen(true)}
        className="absolute top-6 right-6 glass-card p-3 rounded-full text-gray-300 hover:text-white hover:shadow-lg transition-all z-10"
        aria-label="End Set"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {/* FinishSetModal temporarily disabled */}
      {isFinishModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">End Set?</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to end this set?</p>
            <div className="flex gap-3">
              <button 
                onClick={handleConfirmFinish}
                className="btn-primary flex-1"
              >
                End Set
              </button>
              <button 
                onClick={() => setFinishModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Player Interface */}
      <div className="flex flex-col min-h-screen">
        {/* Track Display */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full text-center"
          >
            {/* Album Art */}
            <motion.div
              className="relative mb-8"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full shadow-2xl shadow-electric-blue/20 bg-gradient-to-br from-electric-blue/20 to-bright-turquoise/20 flex items-center justify-center">
                <div className="text-6xl">🎵</div>
              </div>
            </motion.div>

            {/* Track Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                {displayTrack.title}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                {displayTrack.artist}
              </p>

              {/* Track Features */}
              <div className="flex justify-center gap-4 text-sm">
                {displayTrack.bpm > 0 && (
                  <span className="px-3 py-1 bg-electric-blue/20 rounded-full">
                    {displayTrack.bpm} BPM
                  </span>
                )}
                {displayTrack.genre && (
                  <span className="px-3 py-1 bg-laser-pink/20 rounded-full">
                    {displayTrack.genre}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{formatTime(0)}</span>
                <span>{formatTime(180)}</span>
              </div>

              <div className="w-full bg-rich-black/50 rounded-full h-2 cursor-pointer">
                <motion.div
                  className="bg-gradient-to-r from-electric-blue to-bright-turquoise h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 mb-8"
            >
              <button className="p-3 text-gray-400 hover:text-white transition-colors">
                <Shuffle className="w-6 h-6" />
              </button>

              <button className="p-3 text-gray-400 hover:text-white transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-6 bg-gradient-to-r from-electric-blue to-bright-turquoise rounded-full text-rich-black hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button className="p-3 text-gray-400 hover:text-white transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>

              <button className="p-3 text-gray-400 hover:text-white transition-colors">
                <Repeat className="w-6 h-6" />
              </button>
            </motion.div>

            {/* Volume Control */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 max-w-xs mx-auto"
            >
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1 h-2 bg-rich-black/50 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-400 w-10">
                {volume}%
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Track List */}
        <div className="mx-4 mb-4">
          <TrackList title="Current Playlist" showPlayButton={true} />
        </div>

      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00D4FF, #00FFCC);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00D4FF, #00FFCC);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default PlayerPage;
