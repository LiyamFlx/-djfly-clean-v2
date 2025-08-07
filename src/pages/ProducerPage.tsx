import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, TrendingUp, Users, Clock, Award } from 'lucide-react';
import { useSessionState, useCrowdState } from '@/store';

const ProducerPage: React.FC = () => {
  const sessionState = useSessionState();
  const crowdState = useCrowdState();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Producer Analytics
          </h1>
          <p className="text-gray-300 text-lg">
            Deep insights into your performance and crowd engagement
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-electric-blue/20 rounded-lg">
                <BarChart className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {sessionState.totalTracks}
                </div>
                <div className="text-sm text-gray-400">Tracks Played</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-bright-turquoise/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-bright-turquoise" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(sessionState.averageTrackRating * 100)}%
                </div>
                <div className="text-sm text-gray-400">Avg Rating</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-laser-pink/20 rounded-lg">
                <Users className="w-6 h-6 text-laser-pink" />
              </div>
              <div>
                <div className="text-2xl font-bold">{crowdState.crowdSize}</div>
                <div className="text-sm text-gray-400">Crowd Size</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-electric-blue/20 rounded-lg">
                <Clock className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {sessionState.startTime
                    ? Math.round(
                        (Date.now() - sessionState.startTime.getTime()) / 60000
                      )
                    : 0}
                  m
                </div>
                <div className="text-sm text-gray-400">Session Time</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-6">Performance Timeline</h3>

            {/* Mock Chart Placeholder */}
            <div className="h-64 bg-rich-black/30 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <BarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Performance chart would display here</p>
                <p className="text-sm">
                  Track energy, crowd response over time
                </p>
              </div>
            </div>
          </motion.div>

          {/* Crowd Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold mb-6">Crowd Insights</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Current Energy</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-rich-black/50 rounded-full h-2">
                    <div
                      className="bg-electric-blue h-2 rounded-full transition-all duration-500"
                      style={{ width: `${crowdState.currentEnergy * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {Math.round(crowdState.currentEnergy * 100)}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Engagement Level</span>
                <span className="px-3 py-1 bg-bright-turquoise/20 rounded-full text-sm capitalize">
                  {crowdState.engagementLevel}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mood</span>
                <span className="px-3 py-1 bg-laser-pink/20 rounded-full text-sm capitalize">
                  {crowdState.mood} {crowdState.mood === 'excited' && '🎉'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Energy Trend</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    crowdState.energyTrend === 'rising'
                      ? 'bg-green-500/20 text-green-400'
                      : crowdState.energyTrend === 'falling'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {crowdState.energyTrend}{' '}
                  {crowdState.energyTrend === 'rising' && '📈'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Crowd Satisfaction</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= Math.round(sessionState.crowdSatisfaction * 5)
                            ? 'text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm">
                    {(sessionState.crowdSatisfaction * 5).toFixed(1)}/5
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 glass-card p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-electric-blue" />
            AI Coaching Suggestions
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-rich-black/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-bright-turquoise">
                Energy Management
              </h4>
              <p className="text-sm text-gray-300">
                {crowdState.currentEnergy > 0.8
                  ? 'Crowd energy is very high. Consider maintaining this level with consistent BPM tracks.'
                  : crowdState.currentEnergy < 0.3
                    ? 'Energy is low. Try introducing some crowd favorites to re-engage the audience.'
                    : 'Good energy balance. You can experiment with building or cooling down based on the vibe.'}
              </p>
            </div>

            <div className="bg-rich-black/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-laser-pink">
                Track Selection
              </h4>
              <p className="text-sm text-gray-300">
                {sessionState.setFlow === 'buildup'
                  ? "You're in buildup mode. Gradually increase energy and BPM for maximum impact."
                  : sessionState.setFlow === 'maintain'
                    ? 'Maintaining energy well. Keep the flow consistent with similar energy tracks.'
                    : 'In cooldown phase. Perfect time for deeper tracks and smooth transitions.'}
              </p>
            </div>

            <div className="bg-rich-black/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-electric-blue">
                Crowd Engagement
              </h4>
              <p className="text-sm text-gray-300">
                Based on {crowdState.engagementLevel} engagement,{' '}
                {crowdState.engagementLevel === 'high'
                  ? 'the crowd is very responsive. This is a great time to take creative risks.'
                  : crowdState.engagementLevel === 'low'
                    ? 'try playing more recognizable tracks to increase participation.'
                    : 'engagement is steady. You can maintain the current style or experiment slightly.'}
              </p>
            </div>

            <div className="bg-rich-black/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-bright-turquoise">
                Next Steps
              </h4>
              <p className="text-sm text-gray-300">
                {crowdState.energyTrend === 'rising'
                  ? 'Energy is building! Perfect time to drop a peak-time track and maximize the moment.'
                  : crowdState.energyTrend === 'falling'
                    ? 'Energy is declining. Consider a strategic energy boost or transition to a different vibe.'
                    : 'Energy is stable. You have flexibility to maintain or shift direction based on your goals.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProducerPage;
