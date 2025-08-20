import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Users, Clock } from 'lucide-react';
import { useSessionState } from '@/hooks/useSessionState';
import { useCrowdState } from '@/hooks/useCrowdState';
import { useAIState } from '@/hooks/useAIState';
import { useAIActions } from '@/hooks/useAIActions';

const ProducerPage: React.FC = () => {
  const { sessionState } = useSessionState();
  const { crowdState } = useCrowdState();
  const { aiState } = useAIState();
  const { getReplacementTrack } = useAIActions();

  const handleGetSuggestion = async () => {
    try {
      // Mock track for demonstration
      const mockTrack = {
        id: 'mock-1',
        title: 'Sample Track',
        artist: 'Sample Artist',
        duration: 180,
        bpm: 128,
        key: 'C',
        energy: 0.8,
      };

      await getReplacementTrack(mockTrack, { energy: 0.8, bpm: 128 });
    } catch (error) {
      console.error('Failed to get suggestion:', error);
    }
  };

  const handleApplySuggestion = async () => {
    try {
      console.log('Applying suggestion...');
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black-gradient text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Producer Analytics</h1>
          <p className="text-xl text-gray-300">
            Real-time insights and AI-powered recommendations for your DJ sets
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="glass-card text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
              <BarChart className="w-8 h-8 text-neon-purple" />
            </div>
            <div className="text-2xl font-bold text-neon-purple">
              {Math.round((crowdState.energyLevel || 0.75) * 100)}%
            </div>
            <div className="text-gray-400">Crowd Energy</div>
          </motion.div>

          <motion.div
            className="glass-card text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-neon-green/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-neon-green" />
            </div>
            <div className="text-2xl font-bold text-neon-green">
              {sessionState.playTime
                ? Math.floor(sessionState.playTime / 60000)
                : 0}
            </div>
            <div className="text-gray-400">Minutes Mixed</div>
          </motion.div>

          <motion.div
            className="glass-card text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {crowdState.crowdSize || 150}
            </div>
            <div className="text-gray-400">Crowd Size</div>
          </motion.div>

          <motion.div
            className="glass-card text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {sessionState.totalTracks || 0}
            </div>
            <div className="text-gray-400">Tracks Played</div>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-card mb-8">
          <h2 className="text-2xl font-semibold mb-6">AI Recommendations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Track Suggestions</h3>
              <p className="text-gray-300 mb-4">
                AI is analyzing your set and crowd response to suggest the
                perfect next tracks.
              </p>
              <button
                onClick={handleGetSuggestion}
                className="px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors"
              >
                Get Suggestion
              </button>
            </div>

            <div className="p-6 bg-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Set Optimization</h3>
              <p className="text-gray-300 mb-4">
                Optimize your set flow and energy curve for maximum crowd
                engagement.
              </p>
              <button
                onClick={handleApplySuggestion}
                className="px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-neon-green/80 transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Analytics */}
        <div className="glass-card">
          <h2 className="text-2xl font-semibold mb-6">Real-time Analytics</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Crowd Response</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Energy Level</span>
                  <span className="text-neon-green">
                    {Math.round((crowdState.energyLevel || 0.75) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Mood</span>
                  <span className="text-neon-purple">
                    {crowdState.mood || 'energetic'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Engagement</span>
                  <span className="text-blue-500">
                    {crowdState.engagementLevel || 'high'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Duration</span>
                  <span className="text-white">
                    {sessionState.mixedMinutes || 0} min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Energy</span>
                  <span className="text-neon-green">
                    {Math.round((sessionState.averageEnergy || 0.7) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Set Flow</span>
                  <span className="text-yellow-500">
                    {sessionState.setFlow || 'smooth'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerPage;
