import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaylistGenerator } from '@/services/musicLibrary';
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

<<<<<<< HEAD
  const { generateSet } = useAIActions();
  const { setQueue, setCurrentTrack, setIsPlaying, playTrack } =
    useAudioActions();
  const aiState = useAIState();

  React.useEffect(() => {
    if (aiState.generatedTracks.length > 0 && !aiState.isGenerating) {
      setQueue(aiState.generatedTracks);
      setCurrentTrack(aiState.generatedTracks[0]);
      setIsPlaying(true);
    }
  }, [
    aiState.generatedTracks,
    aiState.isGenerating,
    setQueue,
    setCurrentTrack,
    setIsPlaying,
  ]);

  const handleGenerateSet = async () => {
    if (!prompt.trim()) return;
=======
  const generatePlaylist = async () => {
    if (!prompt.trim()) {
      alert('Please describe the playlist you want to create!');
      return;
    }

    setStatus('generating');
>>>>>>> fix-spotify-connection

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
      const generatedTracks = await PlaylistGenerator.generateByPrompt(prompt);
      setGeneratedTracks(generatedTracks);
      setStatus('complete');
      appState.queue = generatedTracks;
    }
  };

<<<<<<< HEAD
  const handlePlayFromTrack = (track: Track) => {
    setQueue(aiState.generatedTracks);
    playTrack(track);
=======
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
>>>>>>> fix-spotify-connection
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

  const resetGenerator = () => {
    setStatus('ready');
    setPrompt('');
    setGeneratedTracks([]);
  };

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">🎵 Magic Set</h1>
      {status === 'ready' && (
        <div className="mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'An upbeat electronic playlist for a beach party...'"
            className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg"
          />
          <button
            onClick={generatePlaylist}
            disabled={!prompt.trim()}
            className="w-full mt-4 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-600"
          >
            ✨ Generate Playlist
          </button>
        </div>
      )}
      {status === 'generating' && (
        <div className="text-center">
          <p className="animate-pulse">🤖 AI is Generating Your Playlist...</p>
        </div>
<<<<<<< HEAD

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
=======
      )}
      {status === 'complete' && (
        <div>
          <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
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
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
              >
                ▶ Play Now
              </button>
              <button
                onClick={resetGenerator}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full"
              >
                🔄 Create Another
              </button>
>>>>>>> fix-spotify-connection
            </div>
          </div>
<<<<<<< HEAD
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
            </div>

=======
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">
              Generated Tracks ({generatedTracks.length})
            </h3>
>>>>>>> fix-spotify-connection
            <div className="space-y-3">
              {generatedTracks.map((track, _index) => (
                <div
                  key={track.id}
<<<<<<< HEAD
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-rich-black/30 rounded-lg hover:bg-rich-black/50 transition-colors group"
=======
                  className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
>>>>>>> fix-spotify-connection
                >
                  <div>
                    <p className="font-medium">{track.title}</p>
                    <p className="text-gray-400 text-sm">{track.artist}</p>
                  </div>
                  <div className="text-sm text-gray-300">
                    {track.bpm} BPM • {track.key}
                  </div>
<<<<<<< HEAD

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
        <motion.div
          className="card p-8 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gradient mb-4">
            Manual Curation
          </h3>
          <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
            Search and add tracks manually, or upload your own music files
          </p>

          <div className="flex gap-4">
            <motion.input
              type="text"
              placeholder="Search tracks by title, artist, or genre..."
              className="flex-1 px-6 py-4 bg-neutral-800/50 border border-white/20 rounded-xl text-white placeholder-neutral-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 focus:outline-none text-lg transition-all duration-300"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.button
              className="control-button px-6 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Error Display */}
        {aiState.error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 rounded-xl border border-red-500/50 bg-red-500/5"
          >
            <p className="text-red-400 text-lg font-medium">
              Error: {aiState.error}
            </p>
          </motion.div>
        )}
      </motion.div>
=======
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
>>>>>>> fix-spotify-connection
    </div>
  );
};

export default MagicSetPage;
