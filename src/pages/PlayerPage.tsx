import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { useAudioState, useAudioActions, useCrowdState, useSessionState } from '@/store';

const PlayerPage: React.FC = () => {
  const audioState = useAudioState();
  const crowdState = useCrowdState();
  const sessionState = useSessionState();
  const { togglePlayback, setVolume } = useAudioActions();

  const currentTrack = audioState.currentTrack;
  const progress = audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className="min-h-screen bg-club-gradient flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No track selected</h2>
          <p className="text-gray-400 mb-8">Generate a set in Magic Studio to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-club-gradient">
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
              animate={{ rotate: audioState.isPlaying ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <img
                src={currentTrack.image}
                alt={currentTrack.title}
                className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full shadow-2xl shadow-electric-blue/20"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-electric-blue/20 to-laser-pink/20"></div>
            </motion.div>

            {/* Track Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                {currentTrack.title}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                {currentTrack.artist}
              </p>

              {/* Track Features */}
              <div className="flex justify-center gap-4 text-sm">
                {currentTrack.bpm && (
                  <span className="px-3 py-1 bg-electric-blue/20 rounded-full">
                    {currentTrack.bpm} BPM
                  </span>
                )}
                {currentTrack.energy && (
                  <span className="px-3 py-1 bg-bright-turquoise/20 rounded-full">
                    {Math.round(currentTrack.energy * 100)}% Energy
                  </span>
                )}
                {currentTrack.genre && (
                  <span className="px-3 py-1 bg-laser-pink/20 rounded-full">
                    {currentTrack.genre}
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
                <span>{formatTime(audioState.currentTime)}</span>
                <span>{formatTime(audioState.duration)}</span>
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
                onClick={togglePlayback}
                className="p-6 bg-gradient-to-r from-electric-blue to-bright-turquoise rounded-full text-rich-black hover:scale-105 transition-transform"
              >
                {audioState.isPlaying ? (
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
                max="1"
                step="0.01"
                value={audioState.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-rich-black/50 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-gray-400 w-10">
                {Math.round(audioState.volume * 100)}%
              </span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Live Analytics Panel */}
        {crowdState.lastUpdated && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card mx-4 mb-4 p-4 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4 text-center">Live Analytics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-electric-blue">
                  {Math.round(crowdState.currentEnergy * 100)}%
                </div>
                <div className="text-xs text-gray-400">Crowd Energy</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-bright-turquoise capitalize">
                  {crowdState.mood}
                </div>
                <div className="text-xs text-gray-400">Mood</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-laser-pink capitalize">
                  {crowdState.engagementLevel}
                </div>
                <div className="text-xs text-gray-400">Engagement</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-electric-blue">
                  {sessionState.totalTracks}
                </div>
                <div className="text-xs text-gray-400">Tracks Played</div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Queue Preview */}
        {audioState.queue.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card mx-4 mb-4 p-4 rounded-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Up Next</h3>
            
            <div className="space-y-2">
              {audioState.queue.slice(1, 4).map((track, index) => (
                <div key={track.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="text-sm text-gray-400 w-6">{index + 2}.</div>
                  <img src={track.image} alt={track.title} className="w-10 h-10 rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{track.title}</div>
                    <div className="text-xs text-gray-400 truncate">{track.artist}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(track.duration)}
                  </div>
                </div>
              ))}
              
              {audioState.queue.length > 4 && (
                <div className="text-center text-sm text-gray-400 py-2">
                  +{audioState.queue.length - 4} more tracks
                </div>
              )}
            </div>
          </motion.div>
        )}
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