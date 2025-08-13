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
      const generatedTracks = await PlaylistGenerator.generateByPrompt(prompt);
      setGeneratedTracks(generatedTracks);
      setStatus('complete');
      appState.queue = generatedTracks;
    }
  };

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
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">
              Generated Tracks ({generatedTracks.length})
            </h3>
            <div className="space-y-3">
              {generatedTracks.map((track, _index) => (
                <div
                  key={track.id}
                  className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{track.title}</p>
                    <p className="text-gray-400 text-sm">{track.artist}</p>
                  </div>
                  <div className="text-sm text-gray-300">
                    {track.bpm} BPM • {track.key}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicSetPage;
