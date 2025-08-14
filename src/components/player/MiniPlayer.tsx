import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, X, Music } from 'lucide-react';
import { useMusicContext } from '@/contexts/MusicContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying, nextTrack, clearQueue } =
    useMusicContext();

  if (!currentTrack) {
    return null;
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50"
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '100%' }}
        transition={{ type: 'tween', ease: 'circOut', duration: 0.5 }}
      >
        <div className="bg-gray-800/80 backdrop-blur-lg border-t border-gray-700/60 p-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to={ROUTES.PLAYER} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden relative">
                {currentTrack.image ? (
                  <img
                    src={currentTrack.image}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-600">
                    <Music className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold group-hover:text-neon-purple transition-colors">
                  {currentTrack.title}
                </h4>
                <p className="text-sm text-gray-400">{currentTrack.artist}</p>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={nextTrack}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              <button
                onClick={clearQueue}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;
