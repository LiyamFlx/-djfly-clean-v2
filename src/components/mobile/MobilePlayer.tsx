import { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Heart,
  Share,
  Shuffle,
  Repeat,
} from 'lucide-react';
import { useAudioState, useAudioActions } from '@/store';
import { Track } from '@/types';

interface MobilePlayerProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export default function MobilePlayer({
  isExpanded,
  onToggleExpanded,
}: MobilePlayerProps) {
  const audioState = useAudioState();
  const { togglePlayback, setVolume } = useAudioActions();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const currentTrack = audioState.currentTrack;
  const progress =
    audioState.duration > 0
      ? (audioState.currentTime / audioState.duration) * 100
      : 0;

  // Handle swipe gestures
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50;

    if (Math.abs(info.offset.x) > threshold) {
      // Handle previous/next track - would need to implement these actions
      console.log('Swipe detected:', info.offset.x > 0 ? 'previous' : 'next');
    }

    if (Math.abs(info.offset.y) > threshold) {
      if (info.offset.y < 0 && !isExpanded) {
        onToggleExpanded();
      } else if (info.offset.y > 0 && isExpanded) {
        onToggleExpanded();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      {/* Mini Player (collapsed state) */}
      {!isExpanded && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
        >
          <motion.div
            className="flex items-center p-4 cursor-pointer"
            onClick={onToggleExpanded}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 0.98 }}
          >
            {/* Album Art */}
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
              {currentTrack.image ? (
                <img
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  🎵
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 ml-3 min-w-0">
              <h4 className="text-white font-medium truncate text-sm">
                {currentTrack.title}
              </h4>
              <p className="text-gray-400 text-xs truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayback();
              }}
              className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white ml-2"
            >
              {audioState.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {/* Expand Indicator */}
            <ChevronUp className="w-5 h-5 text-gray-400 ml-2" />
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Full Player (expanded state) */}
      {isExpanded && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 z-50 overflow-hidden"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pt-12">
            <button
              onClick={onToggleExpanded}
              className="p-2 rounded-full bg-gray-800/50 text-white"
            >
              <ChevronDown className="w-6 h-6" />
            </button>

            <div className="text-center">
              <p className="text-gray-400 text-sm">Playing from</p>
              <p className="text-white font-medium">AI Generated Mix</p>
            </div>

            <button className="p-2 rounded-full bg-gray-800/50 text-white">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* Album Art */}
          <motion.div
            className="px-8 mt-8"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 0.95 }}
          >
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-800 shadow-2xl">
              {currentTrack.image ? (
                <img
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-6xl">
                  🎵
                </div>
              )}
            </div>
          </motion.div>

          {/* Track Info */}
          <div className="px-8 mt-8">
            <h1 className="text-white text-2xl font-bold truncate">
              {currentTrack.title}
            </h1>
            <p className="text-gray-400 text-lg mt-1 truncate">
              {currentTrack.artist}
            </p>

            {/* Additional Info */}
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              {currentTrack.bpm && <span>{currentTrack.bpm} BPM</span>}
              {currentTrack.key && <span>Key: {currentTrack.key}</span>}
              {currentTrack.genre && <span>{currentTrack.genre}</span>}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 mt-8">
            <div className="relative">
              <div className="h-1 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
                style={{ left: `${progress}%`, marginLeft: '-6px' }}
              />
            </div>

            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>{formatTime(audioState.currentTime)}</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="px-8 mt-8">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-6">
              <button className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                <Heart className="w-6 h-6" />
              </button>

              <button className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                <Shuffle className="w-6 h-6" />
              </button>

              <button className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                <Share className="w-6 h-6" />
              </button>

              <button className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors">
                <Repeat className="w-6 h-6" />
              </button>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => console.log('Previous track')}
                className="p-3 rounded-full text-white hover:bg-gray-800/50 transition-colors"
              >
                <SkipBack className="w-8 h-8" />
              </button>

              <button
                onClick={togglePlayback}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                {audioState.isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>

              <button
                onClick={() => console.log('Next track')}
                className="p-3 rounded-full text-white hover:bg-gray-800/50 transition-colors"
              >
                <SkipForward className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="px-8 mt-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {showVolumeSlider && (
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audioState.volume}
                    onChange={(e) =>
                      handleVolumeChange(parseInt(e.target.value))
                    }
                    className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                  />
                </motion.div>
              )}
            </div>
          </div>

          {/* Queue Preview */}
          <div className="px-8 mt-8 mb-8">
            <h3 className="text-white font-medium mb-4">Up Next</h3>
            <div className="space-y-3">
              {audioState.queue
                .slice(0, 3)
                .map((track: Track, index: number) => (
                  <div
                    key={track.id}
                    className="flex items-center space-x-3 opacity-70"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      {track.image ? (
                        <img
                          src={track.image}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                          🎵
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">
                        {track.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {track.artist}
                      </p>
                    </div>
                    <span className="text-gray-500 text-xs">{index + 1}</span>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
