import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Users, Clock, Award } from 'lucide-react';
import {
  useSessionState,
  useCrowdState,
  useAIActions,
  useAIState,
  useAudioState,
} from '@/store';
import { useMusicContext } from '@/contexts/MusicContext';
import Button from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

const ProducerPage: React.FC = () => {
  const sessionState = useSessionState();
  const crowdState = useCrowdState();
  const { queue } = useAudioState();
  const { getReplacementTrack } = useAIActions();
  const { replacementSuggestion, isAnalyzing } = useAIState();
  const { currentTrack } = useMusicContext();

  // Simulate weak track detection for demo
  const weakTrack = queue.length > 2 ? queue[1] : null;

  const handleGetSuggestion = async () => {
    if (weakTrack) {
      await getReplacementTrack(weakTrack);
    }
  };

  const handleApplySuggestion = () => {
    if (replacementSuggestion) {
      // In a real app, this would update the queue
      console.log('Applying suggestion:', replacementSuggestion);
    }
  };

  return (
    <div className="min-h-screen bg-black-gradient py-8">
      <div className="container-responsive">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.h1
              className="heading-hero gradient-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Producer Dashboard
            </motion.h1>
            <p className="heading-secondary text-gray-300">
              Real-time analytics and AI insights for your sets
            </p>
          </div>

          {/* Stats Grid */}
          <motion.div
            className="grid-responsive-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card text-center">
              <div className="flex items-center justify-center mb-3">
                <BarChart className="w-6 h-6 text-neon-purple" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round((crowdState.energyLevel || 0.75) * 100)}%
              </div>
              <div className="text-sm text-gray-400">Crowd Energy</div>
            </div>

            <div className="glass-card text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-neon-green" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {crowdState.energyTrend === 'rising'
                  ? '+12%'
                  : crowdState.energyTrend === 'falling'
                    ? '-8%'
                    : '~0%'}
              </div>
              <div className="text-sm text-gray-400">Energy Trend</div>
            </div>

            <div className="glass-card text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-electric-blue" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {Math.floor(Math.random() * 200) + 50}
              </div>
              <div className="text-sm text-gray-400">Active Listeners</div>
            </div>

            <div className="glass-card text-center">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-bright-turquoise" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {sessionState.playTime
                  ? Math.floor(sessionState.playTime / 60000)
                  : 0}
                m
              </div>
              <div className="text-sm text-gray-400">Session Time</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProducerPage;
