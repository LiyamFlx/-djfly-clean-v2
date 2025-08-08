import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Play, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAIActions, useAIState, useAudioActions } from '@/store';
import { ROUTES } from '@/constants/routes';
import type { Track } from '@/types';

const MagicSetPage: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  const { generateSet } = useAIActions();
  const { setQueue, setCurrentTrack } = useAudioActions();
  const aiState = useAIState();

  const handleGenerateSet = async () => {
    if (!prompt.trim()) return;

    try {
      await generateSet(prompt);
    } catch (error) {
      console.error('Failed to generate set:', error);
    }
  };

  const handlePlaySet = () => {
    if (aiState.generatedTracks.length > 0) {
      setQueue(aiState.generatedTracks);
      setCurrentTrack(aiState.generatedTracks[0]);
      navigate(ROUTES.PLAYER);
    }
  };

  const removeTrack = (trackId: string) => {
    // This would integrate with the store to remove from generated tracks
    console.log('Remove track:', trackId);
  };

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-4">
            Magic Set Generator
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Describe your vision and let AI create the perfect set. Fine-tune
            with manual adjustments and save for later.
          </p>
        </div>

        {/* Prompt Input */}
        <div className="glass-card p-6 rounded-xl">
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Describe your ideal set
          </label>
          <div className="space-y-4">
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
                              placeholder="Describe your perfect playlist - mood, energy, genre, venue..."
              className="w-full px-4 py-3 bg-rich-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none resize-none"
              rows={4}
            />

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400">Quick ideas:</span>
              {[
                'Wedding reception mix',
                'Workout energy boost',
                'Chill study session',
                'Dance floor heater',
              ].map((idea) => (
                <button
                  key={idea}
                  onClick={() => setPrompt(idea)}
                  className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  {idea}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateSet}
              disabled={!prompt.trim() || aiState.isGenerating}
              className="club-button w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {aiState.isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-rich-black/30 border-t-rich-black rounded-full animate-spin" />
                  Generating... ({aiState.progress}%)
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Magic Set
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Set */}
        {aiState.generatedTracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Generated Set</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePlaySet}
                  className="club-button flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Play Set
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {aiState.generatedTracks.map((track: Track, index: number) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-rich-black/30 rounded-lg hover:bg-rich-black/50 transition-colors"
                >
                  <div className="text-sm text-gray-400 w-8">{index + 1}.</div>

                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">
                      {track.title}
                    </h4>
                    <p className="text-sm text-gray-400 truncate">
                      {track.artist}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {track.bpm && <span>{track.bpm} BPM</span>}
                    {track.energy && (
                      <span className="px-2 py-1 bg-electric-blue/20 rounded-full">
                        {Math.round(track.energy * 100)}% Energy
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeTrack(track.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Set Statistics */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-electric-blue">
                    {aiState.generatedTracks.length}
                  </div>
                  <div className="text-sm text-gray-400">Tracks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-bright-turquoise">
                    {Math.round(
                      aiState.generatedTracks.reduce(
                        (acc, t) => acc + (t.duration || 0),
                        0
                      ) / 60
                    )}
                  </div>
                  <div className="text-sm text-gray-400">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-laser-pink">
                    {Math.round(
                      (aiState.generatedTracks.reduce(
                        (acc, t) => acc + (t.energy || 0),
                        0
                      ) /
                        aiState.generatedTracks.length) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-400">Avg Energy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-electric-blue">
                    {Math.round(
                      aiState.generatedTracks.reduce(
                        (acc, t) => acc + (t.bpm || 120),
                        0
                      ) / aiState.generatedTracks.length
                    )}
                  </div>
                  <div className="text-sm text-gray-400">Avg BPM</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Manual Track Addition */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Manual Curation</h3>
          <p className="text-gray-400 text-sm mb-4">
            Search and add tracks manually, or upload your own music files
          </p>

          <div className="flex gap-2">
            <input
              type="text"
                              placeholder="Search tracks by title, artist, or genre..."
              className="flex-1 px-4 py-2 bg-rich-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-electric-blue focus:ring-1 focus:ring-electric-blue focus:outline-none"
            />
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {aiState.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 rounded-xl border-red-500/50"
          >
            <p className="text-red-400">Error: {aiState.error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MagicSetPage;
