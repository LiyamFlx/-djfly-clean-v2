import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlaylistGenerator } from '@/services/musicLibrary';
import type { Track } from '@/types';

// This is a simplified global state for the demo.
// In a real app, this would use a state management library like Zustand or Redux.
const appState = {
  queue: [] as Track[],
};

const MagicMatchPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('ready');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    setStatus('recording');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();

      setTimeout(async () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());

        setStatus('complete');

        try {
          const { aiMusicEngine } = await import('@/services/aiMusicEngine');

          const crowdEnergy = Math.floor(Math.random() * 40) + 60;
          const timeOfDay = new Date().getHours() > 18 ? 'evening' : 'afternoon';

          const recommendation = await aiMusicEngine.generateIntelligentPlaylist({
            prompt: `Crowd energy detected: ${crowdEnergy}/100. Generate playlist for current vibe and energy level.`,
            mood: crowdEnergy > 80 ? 'energetic' : crowdEnergy > 60 ? 'progressive' : 'mixed',
            crowdEnergy,
            timeOfDay: timeOfDay as any,
            venue: 'club',
            duration: 45,
          });

          setAiAnalysis({ crowdEnergy, timeOfDay, recommendation });
          appState.queue = recommendation.tracks;
        } catch (error) {
          console.warn('AI analysis failed, using fallback:', error);
          const playlist = await PlaylistGenerator.generateByVibe('mixed');
          appState.queue = playlist;
        }
      }, 5000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required for Magic Match. Please allow access and try again.');
      setStatus('ready');
    }
  };

  return (
    <div className="text-white p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">🎯 Magic Match</h1>
        {status === 'ready' && (
          <div className="text-center">
            <p className="mb-6">Record crowd noise to analyze the vibe</p>
            <button
              onClick={handleAnalyze}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
            >
              Start Recording
            </button>
          </div>
        )}
        {status === 'recording' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>
              <p className="mt-2 animate-pulse">Recording for 5 seconds...</p>
            </div>
          </div>
        )}
        {status === 'complete' && (
          <div className="text-center">
            <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-2">🤖 AI Analysis Complete!</h2>
              {aiAnalysis && (
                <div className="mb-4 space-y-2">
                  <p className="text-green-300">Crowd Energy: <span className="font-bold">{aiAnalysis.crowdEnergy}/100</span></p>
                  <p className="text-green-300">Time: <span className="capitalize">{aiAnalysis.timeOfDay}</span></p>
                  {aiAnalysis.recommendation && <p className="text-sm text-green-200">{aiAnalysis.recommendation.reasoning}</p>}
                </div>
              )}
              <p className="mb-4">AI has generated the perfect playlist for your crowd.</p>
              <button
                onClick={() => navigate('/player')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
              >
                Go to Player
              </button>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-4">Recommended Tracks</h3>
              <div className="space-y-4">
                {appState.queue.map((track) => (
                  <div key={track.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">{track.title}</p>
                      <p className="text-gray-400 text-sm">{track.artist}</p>
                    </div>
                    <div className="text-sm text-gray-400">{track.bpm} BPM • {track.key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default MagicMatchPage;
