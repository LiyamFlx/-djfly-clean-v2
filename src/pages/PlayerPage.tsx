import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  LogOut,
  MoreHorizontal,
  Heart,
  Share2,
  Download,
  Settings,
  Maximize2,
  RotateCcw,
  BarChart3,
  Headphones,
  Disc3,
  Activity,
} from 'lucide-react';
import { useMusicContext } from '@/contexts/MusicContext';
import TrackList from '@/components/ui/TrackList';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';

const PlayerPage: React.FC = () => {
  const [volume, setVolume] = useState(75);
  const [crossfade, setCrossfade] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeControl, setActiveControl] = useState<string | null>(null);
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

  // Mock data for demonstration
  const demoTracks = [
    {
      id: '1',
      title: 'Midnight Drive',
      artist: 'Synthwave Producer',
      duration: 245,
      bpm: 128,
      key: 'Am',
      energy: 0.8,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'Electric Dreams',
      artist: 'Neon Nights',
      duration: 198,
      bpm: 124,
      key: 'Dm', 
      energy: 0.7,
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Digital Horizon',
      artist: 'Cyber Symphony',
      duration: 312,
      bpm: 132,
      key: 'Gm',
      energy: 0.9,
      image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop'
    }
  ];

  const currentTrackDemo = currentTrack || demoTracks[0];
  const [currentTime, setCurrentTime] = useState(128);
  const progress = (currentTime / currentTrackDemo.duration) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-black via-rich-black to-pure-black">
      {/* Header */}
      <div className="glass-card m-4 p-4">
        <div className="flex-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              icon={LogOut}
              onClick={() => navigate('/')}
            >
              Exit Session
            </Button>
            <div className="h-6 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse" />
              <span className="body-small text-gray-300">Live Session</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={BarChart3}>
              Analytics
            </Button>
            <Button variant="ghost" size="sm" icon={Settings}>
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="container-responsive">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Now Playing */}
            <motion.div
              className="glass-card p-8"
              layout
              animate={isExpanded ? { scale: 1.02 } : { scale: 1 }}
            >
              <div className="flex items-start gap-6 mb-8">
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-neon-purple to-neon-green rounded-2xl flex-center text-4xl overflow-hidden">
                    {currentTrackDemo.image ? (
                      <img 
                        src={currentTrackDemo.image} 
                        alt={currentTrackDemo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Disc3 className="w-16 h-16 text-white animate-spin" style={{animationDuration: '3s'}} />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex-center">
                    <Maximize2 className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="heading-primary mb-2 truncate">{currentTrackDemo.title}</h1>
                  <p className="body-large text-gray-300 mb-4">{currentTrackDemo.artist}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="badge-primary">
                      {currentTrackDemo.bpm} BPM
                    </div>
                    <div className="badge-success">
                      Key: {currentTrackDemo.key}
                    </div>
                    <div className="badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Energy: {Math.round(currentTrackDemo.energy * 100)}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={Heart}>
                      Like
                    </Button>
                    <Button variant="ghost" size="sm" icon={Share2}>
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" icon={Download}>
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" icon={MoreHorizontal}>
                      More
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex-between mb-2">
                  <span className="body-small text-gray-400">{formatTime(currentTime)}</span>
                  <span className="body-small text-gray-400">{formatTime(currentTrackDemo.duration)}</span>
                </div>
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-neon-purple to-neon-green"
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" 
                       style={{ left: `calc(${progress}% - 8px)` }} />
                </div>
              </div>

              {/* Controls */}
              <div className="flex-center gap-6">
                <Button
                  variant="ghost"
                  size="lg"
                  icon={Shuffle}
                  className={activeControl === 'shuffle' ? 'text-neon-purple' : ''}
                  onClick={() => setActiveControl(activeControl === 'shuffle' ? null : 'shuffle')}
                />
                <Button
                  variant="ghost"
                  size="lg"
                  icon={SkipBack}
                  onClick={previousTrack}
                />
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="primary"
                    size="xl"
                    icon={isPlaying ? Pause : Play}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full shadow-neon-purple-lg"
                  />
                </motion.div>
                <Button
                  variant="ghost"
                  size="lg"
                  icon={SkipForward}
                  onClick={nextTrack}
                />
                <Button
                  variant="ghost"
                  size="lg"
                  icon={Repeat}
                  className={activeControl === 'repeat' ? 'text-neon-purple' : ''}
                  onClick={() => setActiveControl(activeControl === 'repeat' ? null : 'repeat')}
                />
              </div>
            </motion.div>

            {/* DJ Controls */}
            <div className="glass-card p-6">
              <h3 className="heading-tertiary mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-neon-purple" />
                DJ Controls
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Volume */}
                <div>
                  <label className="body-small text-gray-300 mb-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Volume: {volume}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${volume}%, #374151 ${volume}%, #374151 100%)`
                    }}
                  />
                </div>

                {/* Crossfade */}
                <div>
                  <label className="body-small text-gray-300 mb-3 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Crossfade: {crossfade}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crossfade}
                    onChange={(e) => setCrossfade(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10B981 0%, #10B981 ${crossfade}%, #374151 ${crossfade}%, #374151 100%)`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="glass-card p-6">
              <h3 className="heading-tertiary mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-neon-green" />
                Audio Visualization
              </h3>
              <div className="h-32 bg-rich-black rounded-xl flex items-end justify-center gap-1 p-4 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-neon-purple to-neon-green rounded-full"
                    animate={{
                      height: [
                        Math.random() * 60 + 20,
                        Math.random() * 80 + 10,
                        Math.random() * 60 + 20
                      ]
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.05
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Queue */}
            <div className="glass-card p-6">
              <div className="flex-between mb-6">
                <h3 className="heading-tertiary flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-neon-purple" />
                  Up Next
                </h3>
                <Button variant="ghost" size="sm">
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-3">
                {demoTracks.slice(1).map((track, index) => (
                  <motion.div
                    key={track.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-pure-white/5 cursor-pointer transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex-center text-xs font-semibold">
                      {index + 2}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{track.title}</p>
                      <p className="body-small text-gray-400 truncate">{track.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="body-small text-gray-400">{formatTime(track.duration)}</p>
                      <p className="text-xs text-neon-green">{track.bpm} BPM</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                variant="secondary" 
                fullWidth 
                className="mt-6"
                onClick={() => navigate('/library')}
              >
                Add More Tracks
              </Button>
            </div>

            {/* AI Suggestions */}
            <div className="glass-card p-6">
              <h3 className="heading-tertiary mb-6 flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-neon-green" />
                AI Suggestions
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-neon-purple/10 border border-neon-purple/30 rounded-xl">
                  <p className="body-small text-neon-purple font-medium mb-2">Perfect Mix Match</p>
                  <p className="text-sm text-gray-300">Try "Cosmic Journey" by StarLab - matches your current energy and key!</p>
                </div>
                
                <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl">
                  <p className="body-small text-neon-green font-medium mb-2">Energy Transition</p>
                  <p className="text-sm text-gray-300">Consider building up with tracks around 135 BPM for the next 10 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;