import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useMusicContext } from '@/contexts/MusicContext';

interface TrackListProps {
  title?: string;
  showPlayButton?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ 
  title = "Recommended Tracks",
  showPlayButton = true 
}) => {
  const { queue, currentTrack, isPlaying, playTrack } = useMusicContext();

  if (queue.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No tracks in queue</p>
        <p className="text-sm text-gray-500 mt-2">
          Generate a set in Magic Studio to start playing
        </p>
      </div>
    );
  }

  return (
    <div className="text-left">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {queue.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isTrackPlaying = isCurrentTrack && isPlaying;
          
          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800 p-4 rounded-lg flex items-center justify-between transition-all duration-200 ${
                isCurrentTrack ? 'ring-2 ring-electric-blue/50 bg-electric-blue/10' : 'hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                {showPlayButton && (
                  <button
                    onClick={() => playTrack(track)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isCurrentTrack 
                        ? 'bg-electric-blue text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {isTrackPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                )}
                
                <div className="flex-1">
                  <p className={`font-medium ${isCurrentTrack ? 'text-electric-blue' : 'text-white'}`}>
                    {track.title}
                  </p>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                  {track.genre && (
                    <span className="inline-block mt-1 px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded">
                      {track.genre}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  {track.bpm && <span>{track.bpm} BPM</span>}
                  {track.key && <span>{track.key}</span>}
                </div>
                {track.duration && (
                  <div className="mt-1 text-xs">
                    {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {queue.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400 text-center">
          {queue.length} tracks • {Math.round(queue.reduce((total, track) => total + (track.duration || 240), 0) / 60)} min total
        </div>
      )}
    </div>
  );
};

export default TrackList;