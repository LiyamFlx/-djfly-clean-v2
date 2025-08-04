import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import { useAudioState, useAudioActions, useCrowdState, useSessionState } from '@/store';
import Deck from '@/components/player/Deck';
import { Slider } from '@/components/ui/slider';
import AudioEngine from '@/components/player/AudioEngine';
import MagicDancer from '@/components/player/MagicDancer';
import { useUIState, useUIActions } from '@/store';
import { Button } from '@/components/ui/button';

const PlayerPage: React.FC = () => {
  const { deckA, deckB, crossfader, queue } = useAudioState();
  const { setCrossfader, setTrackForDeck } = useAudioActions();
  const { masterTabId } = useUIState();
  const { setMasterTabId } = useUIActions();
  const [tabId] = useState(() => Math.random().toString(36).substring(2));
  const crowdState = useCrowdState();
  const sessionState = useSessionState();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Load first two tracks into decks
  useState(() => {
    if (queue.length > 0 && !deckA.track) {
      setTrackForDeck('A', queue[0]);
    }
    if (queue.length > 1 && !deckB.track) {
      setTrackForDeck('B', queue[1]);
    }
  });

  if (queue.length === 0) {
    return (
      <div className="min-h-screen bg-club-gradient flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your set is empty</h2>
          <p className="text-gray-400 mb-8">Generate a set in Magic Studio to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-club-gradient">
      <AudioEngine />
      <MagicDancer />
      {masterTabId !== tabId && (
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={() => setMasterTabId(tabId)}>Take Control</Button>
        </div>
      )}
      {/* Main Player Interface */}
      <div className="flex flex-col min-h-screen p-4">
        <div className="flex-1 flex gap-4">
          <Deck track={deckA.track} deckName="Deck A" />
          <Deck track={deckB.track} deckName="Deck B" />
        </div>
        <div className="flex-shrink-0 p-4 bg-rich-black/50 rounded-lg mt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[crossfader]}
                onValueChange={(value) => setCrossfader(value[0])}
                max={1}
                step={0.01}
              />
            </div>
          </div>
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