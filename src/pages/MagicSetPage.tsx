import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Trash2, Sparkles } from 'lucide-react';
import { musicLibrary } from '@/services/musicLibrary';
import type { Track } from '@/types';

// This is a simplified global state for the demo.
// In a real app, this would use a state management library like Zustand or Redux.
const appState = {
  queue: [] as Track[],
};

const MagicSetPage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('ready'); // ready, generating, complete
  const [generatedTracks, setGeneratedTracks] = useState<Track[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);

  const detectMoodFromPrompt = (
    prompt: string
  ): 'energetic' | 'chill' | 'progressive' | 'mixed' => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('energetic') || lowerPrompt.includes('party'))
      return 'energetic';
    if (lowerPrompt.includes('chill') || lowerPrompt.includes('lounge'))
      return 'chill';
    if (lowerPrompt.includes('progressive') || lowerPrompt.includes('build'))
      return 'progressive';
    return 'mixed';
  };

  const detectVenueFromPrompt = (
    prompt: string
  ): 'club' | 'lounge' | 'festival' | 'radio' | 'workout' => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('club')) return 'club';
    if (lowerPrompt.includes('lounge')) return 'lounge';
    if (lowerPrompt.includes('festival')) return 'festival';
    if (lowerPrompt.includes('workout')) return 'workout';
    return 'club';
  };

  const generatePlaylist = async () => {
    if (!prompt.trim()) {
      alert('Please describe the playlist you want to create!');
      return;
    }

    setStatus('generating');

    try {
      const { aiMusicEngine } = await import('@/services/aiMusicEngine');

      const recommendation = await aiMusicEngine.generateIntelligentPlaylist({
        prompt,
        mood: detectMoodFromPrompt(prompt),
        duration: 60,
        venue: detectVenueFromPrompt(prompt),
      });

      setAiRecommendation(recommendation);
      setGeneratedTracks(recommendation.tracks);
      setStatus('complete');
      appState.queue = recommendation.tracks;
    } catch (error) {
      console.warn('AI generation failed, using fallback:', error);
      const generatedTracks = await musicLibrary.generatePlaylist(prompt);
      setGeneratedTracks(generatedTracks);
      setStatus('complete');
      appState.queue = generatedTracks;
    }
  };

  const handlePlayFromTrack = (track: Track) => {
    // In a real app, this would use a state management library
    console.log('Playing track:', track);
  };

  const removeTrack = (trackId: string) => {
    setGeneratedTracks((prev) => prev.filter((track) => track.id !== trackId));
  };

  const resetGenerator = () => {
    setStatus('ready');
    setPrompt('');
    setGeneratedTracks([]);
  };

  return (
    <div className="min-h-screen bg-gradient-dj text-dj-text-primary p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            🎵 Magic Set Generator
          </h1>
          <p className="text-lg text-dj-text-secondary">
            Describe your perfect playlist and let AI create the magic
          </p>
        </motion.div>

        {status === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-8"
          >
                          <label
                htmlFor="prompt"
                className="block text-sm font-medium text-dj-text-secondary mb-2"
              >
                Describe your ideal set
              </label>
              <div className="space-y-4">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your perfect playlist - mood, energy, genre, venue..."
                  className="input w-full resize-none"
                  rows={4}
                />

                {/* Quick Prompts */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-dj-text-muted">Quick ideas:</span>
                  {[
                    'Wedding reception mix',
                    'Workout energy boost',
                    'Chill study session',
                    'Dance floor heater',
                  ].map((idea) => (
                    <button
                      key={idea}
                      onClick={() => setPrompt(idea)}
                      className="px-3 py-1 text-xs bg-dj-bg-tertiary/50 hover:bg-dj-bg-tertiary text-dj-text-secondary hover:text-dj-text-primary rounded-full transition-colors"
                    >
                      {idea}
                    </button>
                  ))}
                </div>

              <button
                onClick={generatePlaylist}
                disabled={!prompt.trim()}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate Playlist
              </button>
            </div>
          </motion.div>
        )}

        {status === 'generating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-spin w-12 h-12 border-4 border-dj-interactive border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-dj-text-secondary">
              🤖 AI is generating your perfect playlist...
            </p>
          </motion.div>
        )}

        {status === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="glass-card p-6 rounded-xl mb-6 text-center border border-green-500/30 bg-green-500/5">
              <h2 className="text-2xl font-bold mb-2 text-green-400">
                ✅ AI Playlist Generated!
              </h2>
              {aiRecommendation && (
                <p className="text-sm text-green-300 mb-4">
                  🤖 {aiRecommendation.reasoning}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/player')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Play Now
                </button>
                <button
                  onClick={resetGenerator}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  🔄 Create Another
                </button>
              </div>
            </div>

            {generatedTracks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">
                    Generated Tracks ({generatedTracks.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {generatedTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-dj-bg-tertiary/30 rounded-lg hover:bg-dj-bg-tertiary/50 transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{track.title}</p>
                        <p className="text-dj-text-muted text-sm">{track.artist}</p>
                      </div>
                      <div className="text-sm text-dj-text-secondary">
                        {track.bpm} BPM • {track.key}
                      </div>

                      <motion.button
                        onClick={() => handlePlayFromTrack(track)}
                        className="p-2 rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play className="w-5 h-5" />
                      </motion.button>
                      <button
                        onClick={() => removeTrack(track.id)}
                        className="p-2 text-dj-text-muted hover:text-error-500 transition-colors"
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
                      <div className="text-2xl font-bold text-dj-interactive">
                        {generatedTracks.length}
                      </div>
                      <div className="text-sm text-dj-text-muted">Tracks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-bright-turquoise">
                        {Math.round(
                          generatedTracks.reduce(
                            (acc, t) => acc + (t.duration || 0),
                            0
                          ) / 60
                        )}
                      </div>
                      <div className="text-sm text-dj-text-muted">Minutes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-laser-pink">
                        {Math.round(
                          (generatedTracks.reduce(
                            (acc, t) => acc + (t.energy || 0),
                            0
                          ) /
                            generatedTracks.length) *
                            100
                        )}
                        %
                      </div>
                      <div className="text-sm text-dj-text-muted">Avg Energy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-electric-blue">
                        {Math.round(
                          generatedTracks.reduce(
                            (acc, t) => acc + (t.bpm || 120),
                            0
                          ) / generatedTracks.length
                        )}
                      </div>
                      <div className="text-sm text-dj-text-muted">Avg BPM</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Manual Track Addition */}
            <motion.div
              className="glass-card p-6 rounded-xl mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold gradient-text mb-4">
                Manual Curation
              </h3>
              <p className="text-dj-text-secondary mb-6">
                Search and add tracks manually, or upload your own music files
              </p>

              <div className="flex gap-4">
                <motion.input
                  type="text"
                  placeholder="Search tracks by title, artist, or genre..."
                  className="input flex-1"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  className="px-4 py-3 bg-neon-purple hover:bg-neon-purple/80 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MagicSetPage;
