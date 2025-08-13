import React from 'react';
<<<<<<< HEAD
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
  const { savePlaylist } = useMusicContext();

  // Mock logic to find a weak track
  const findWeakSpot = () => {
    // In a real app, this would be based on analytics data
    if (queue.length > 2) {
      return queue[1];
    }
    return null;
  };

  const weakTrack = findWeakSpot();

  const handleGetSuggestion = () => {
    if (weakTrack) {
      getReplacementTrack(weakTrack, {
        prompt: `Find a replacement for ${weakTrack.title} by ${weakTrack.artist} that has higher energy.`,
        previousTracks: queue.slice(0, queue.indexOf(weakTrack)),
      });
    }
  };

  const handleApplySuggestion = () => {
    if (weakTrack && replacementSuggestion) {
      const weakTrackIndex = queue.findIndex((t) => t.id === weakTrack.id);
      if (weakTrackIndex !== -1) {
        const newQueue = [...queue];
        newQueue[weakTrackIndex] = replacementSuggestion;

        // For simplicity, we'll give the new playlist a generated name.
        // In a real app, we might prompt the user for a name.
        const newPlaylistName = `My Set v${Math.floor(Math.random() * 100)}`;
        savePlaylist(newPlaylistName, newQueue);

        alert(
          `New playlist "${newPlaylistName}" created with the suggested track!`
        );
      }
    }
  };

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
=======

const ProducerAnalyticsPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📊 Producer Analytics</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Total Plays</h3>
          <p className="text-3xl font-bold text-blue-400">1,337</p>
>>>>>>> fix-spotify-connection
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Active Sets</h3>
          <p className="text-3xl font-bold text-purple-400">42</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Followers</h3>
          <p className="text-3xl font-bold text-green-400">89</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Popular Tracks</h3>
        <div className="space-y-3">
          {['Electronic Dreams', 'Bass Drop Madness', 'Synth Wave Sunset'].map(
            (track, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <span>{track}</span>
                <span className="text-blue-400">
                  {Math.floor(Math.random() * 500)} plays
                </span>
              </div>
            )
          )}
        </div>
<<<<<<< HEAD

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

        {/* Improve This Set */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 glass-card p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Improve This Set
          </h3>
          {weakTrack ? (
            <div className="space-y-4">
              <p className="text-gray-300">
                AI has identified a potential weak spot in your set:{' '}
                <strong className="text-white">{weakTrack.title}</strong> by{' '}
                <strong className="text-white">{weakTrack.artist}</strong>.
              </p>
              <Button onClick={handleGetSuggestion} disabled={isAnalyzing}>
                {isAnalyzing ? 'Analyzing...' : 'Get AI Suggestion'}
              </Button>

              {replacementSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-rich-black/50 rounded-lg"
                >
                  <p className="text-gray-300 mb-2">
                    Suggestion: Replace with{' '}
                    <strong className="text-white">
                      {replacementSuggestion.title}
                    </strong>{' '}
                    by{' '}
                    <strong className="text-white">
                      {replacementSuggestion.artist}
                    </strong>
                    .
                  </p>
                  <Button variant="accent" onClick={handleApplySuggestion}>
                    Apply & Create New Version
                  </Button>
                </motion.div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">
              Play a set to get AI improvement suggestions.
            </p>
          )}
        </motion.div>
=======
>>>>>>> fix-spotify-connection
      </div>
    </div>
  </div>
);

export default ProducerAnalyticsPage;
