import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SetInsights, SetMetrics } from '@/services/analytics';

interface SetAnalyticsDashboardProps {
  insights: SetInsights;
  sessionData: SetMetrics;
  onClose: () => void;
  onStartNewSet: () => void;
}

const SetAnalyticsDashboard: React.FC<SetAnalyticsDashboardProps> = ({
  insights,
  sessionData,
  onClose,
  onStartNewSet,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'details' | 'recommendations' | 'next-set'
  >('overview');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti for high scores
    if (insights.performanceScore >= 85) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [insights.performanceScore]);

  const getPerformanceGrade = (score: number) => {
    if (score >= 90)
      return { grade: 'A+', color: 'text-green-400', bg: 'bg-green-900' };
    if (score >= 85)
      return { grade: 'A', color: 'text-green-400', bg: 'bg-green-900' };
    if (score >= 80)
      return { grade: 'B+', color: 'text-blue-400', bg: 'bg-blue-900' };
    if (score >= 75)
      return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-900' };
    if (score >= 70)
      return { grade: 'C+', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    if (score >= 65)
      return { grade: 'C', color: 'text-yellow-400', bg: 'bg-yellow-900' };
    return { grade: 'D', color: 'text-red-400', bg: 'bg-red-900' };
  };

  const grade = getPerformanceGrade(insights.performanceScore);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${Math.floor(seconds % 60)}s`;
  };

  const TabButton = ({
    label,
    isActive,
    onClick,
  }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
        isActive
          ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  y: -100,
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  opacity: 0,
                  y: window.innerHeight + 100,
                  rotate: 360,
                  transition: { duration: 3, ease: 'linear' },
                }}
                className={`absolute w-3 h-3 ${
                  [
                    'bg-blue-400',
                    'bg-purple-400',
                    'bg-pink-400',
                    'bg-yellow-400',
                    'bg-green-400',
                  ][i % 5]
                }`}
                style={{ left: Math.random() * window.innerWidth }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">🎊 Set Complete!</h2>
              <p className="text-blue-100 mt-1">
                {sessionData.tracksPlayed.length} tracks •{' '}
                {formatDuration(sessionData.totalDuration)}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`inline-flex items-center px-6 py-3 rounded-xl ${grade.bg} ${grade.color} text-2xl font-bold`}
              >
                {grade.grade}
              </div>
              <div className="text-blue-100 mt-1">Performance Grade</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 px-6">
          <div className="flex space-x-1">
            <TabButton
              label="📊 Overview"
              isActive={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <TabButton
              label="📈 Details"
              isActive={activeTab === 'details'}
              onClick={() => setActiveTab('details')}
            />
            <TabButton
              label="💡 Insights"
              isActive={activeTab === 'recommendations'}
              onClick={() => setActiveTab('recommendations')}
            />
            <TabButton
              label="🚀 Next Set"
              isActive={activeTab === 'next-set'}
              onClick={() => setActiveTab('next-set')}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Performance Score */}
                <div className="bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Performance Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-center mb-4">
                        <div className="text-6xl font-bold text-blue-400 mb-2">
                          {insights.performanceScore}
                        </div>
                        <div className="text-gray-300">Overall Score</div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">
                            Crowd Engagement
                          </span>
                          <span className="text-white">
                            {(sessionData.crowdEngagement.overall * 10).toFixed(
                              0
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                            style={{
                              width: `${sessionData.crowdEngagement.overall * 10}%`,
                            }}
                          />
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">
                            Technical Skills
                          </span>
                          <span className="text-white">
                            {Math.max(
                              0,
                              90 -
                                sessionData.technicalIssues.audioDropouts * 10 -
                                sessionData.technicalIssues.effectGlitches * 5
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-400 h-2 rounded-full transition-all duration-1000 delay-200"
                            style={{
                              width: `${Math.max(0, 90 - sessionData.technicalIssues.audioDropouts * 10 - sessionData.technicalIssues.effectGlitches * 5)}%`,
                            }}
                          />
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Track Selection</span>
                          <span className="text-white">
                            {Math.min(
                              100,
                              (sessionData.tracksPlayed.length / 15) * 100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-purple-400 h-2 rounded-full transition-all duration-1000 delay-500"
                            style={{
                              width: `${Math.min(100, (sessionData.tracksPlayed.length / 15) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Key Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            {sessionData.avgBPM.toFixed(0)}
                          </div>
                          <div className="text-xs text-gray-400">Avg BPM</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-400">
                            {sessionData.crowdEngagement.peakMoments.length}
                          </div>
                          <div className="text-xs text-gray-400">
                            Peak Moments
                          </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">
                            {Object.keys(sessionData.effectUsageStats).length}
                          </div>
                          <div className="text-xs text-gray-400">
                            Effects Used
                          </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            {sessionData.transitionQuality.length > 0
                              ? (
                                  sessionData.transitionQuality.reduce(
                                    (sum, q) => sum + q,
                                    0
                                  ) / sessionData.transitionQuality.length
                                ).toFixed(1)
                              : '7.5'}
                          </div>
                          <div className="text-xs text-gray-400">
                            Avg Transition
                          </div>
                        </div>
                      </div>

                      {/* Comparison */}
                      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                        <h4 className="font-semibold text-white mb-3">
                          Comparison
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              vs Previous Sets
                            </span>
                            <span
                              className={
                                insights.comparisons.previousSets >
                                insights.performanceScore
                                  ? 'text-red-400'
                                  : 'text-green-400'
                              }
                            >
                              {insights.comparisons.previousSets >
                              insights.performanceScore
                                ? '↓'
                                : '↑'}
                              {Math.abs(
                                insights.comparisons.previousSets -
                                  insights.performanceScore
                              )}{' '}
                              pts
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">vs Average DJ</span>
                            <span
                              className={
                                insights.performanceScore >
                                insights.comparisons.avgDJScore
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }
                            >
                              {insights.performanceScore >
                              insights.comparisons.avgDJScore
                                ? '↑'
                                : '↓'}
                              {Math.abs(
                                insights.performanceScore -
                                  insights.comparisons.avgDJScore
                              )}{' '}
                              pts
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Percentile Rank
                            </span>
                            <span className="text-blue-400">
                              Top {100 - insights.comparisons.topPercentile}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths and Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-900 bg-opacity-30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-green-400 mb-4">
                      🌟 Strengths
                    </h3>
                    <ul className="space-y-2">
                      {insights.strengths.map((strength, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-2 text-green-100"
                        >
                          <span className="text-green-400 mt-1">✓</span>
                          <span className="text-sm">{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-900 bg-opacity-30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-blue-400 mb-4">
                      💪 Growth Areas
                    </h3>
                    <ul className="space-y-2">
                      {insights.improvements.map((improvement, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          className="flex items-start space-x-2 text-blue-100"
                        >
                          <span className="text-blue-400 mt-1">→</span>
                          <span className="text-sm">{improvement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Track History */}
                <div className="bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🎵 Track History
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {sessionData.tracksPlayed.map((track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {track.title}
                            </div>
                            <div className="text-sm text-gray-400">
                              {track.artist}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-300">
                            {formatDuration(track.playDuration)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {track.bpmDetected} BPM
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(Math.round(track.crowdResponse))].map(
                              (_, i) => (
                                <span
                                  key={i}
                                  className="text-yellow-400 text-xs"
                                >
                                  ★
                                </span>
                              )
                            )}
                            <span className="text-xs text-gray-400">
                              ({track.crowdResponse.toFixed(1)})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Genre Distribution */}
                <div className="bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    🎨 Genre Distribution
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(sessionData.genreDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .map(([genre, count]) => (
                        <div
                          key={genre}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-300">{genre}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-purple-400 h-2 rounded-full"
                                style={{
                                  width: `${(count / sessionData.tracksPlayed.length) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-white w-8">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Technical Performance */}
                <div className="bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    ⚙️ Technical Performance
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${
                            sessionData.technicalIssues.audioDropouts === 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {sessionData.technicalIssues.audioDropouts}
                        </div>
                        <div className="text-xs text-gray-400">
                          Audio Dropouts
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${
                            sessionData.technicalIssues.effectGlitches === 0
                              ? 'text-green-400'
                              : 'text-yellow-400'
                          }`}
                        >
                          {sessionData.technicalIssues.effectGlitches}
                        </div>
                        <div className="text-xs text-gray-400">
                          Effect Glitches
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${
                            sessionData.technicalIssues.transitionErrors === 0
                              ? 'text-green-400'
                              : 'text-orange-400'
                          }`}
                        >
                          {sessionData.technicalIssues.transitionErrors}
                        </div>
                        <div className="text-xs text-gray-400">
                          Transition Errors
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Track Recommendations */}
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">
                    🎵 Track Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {insights.recommendations.tracks.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-2 text-blue-100"
                      >
                        <span className="text-blue-400 mt-1">🎵</span>
                        <span className="text-sm">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Genre Recommendations */}
                <div className="bg-gradient-to-r from-purple-900 to-pink-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">
                    🎨 Genre Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {insights.recommendations.genres.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="flex items-start space-x-2 text-purple-100"
                      >
                        <span className="text-purple-400 mt-1">🎨</span>
                        <span className="text-sm">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Effects Recommendations */}
                <div className="bg-gradient-to-r from-green-900 to-teal-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-green-400 mb-4">
                    ⚡ Effects Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {insights.recommendations.effects.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                        className="flex items-start space-x-2 text-green-100"
                      >
                        <span className="text-green-400 mt-1">⚡</span>
                        <span className="text-sm">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Technique Recommendations */}
                <div className="bg-gradient-to-r from-orange-900 to-red-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-orange-400 mb-4">
                    🎯 Technique Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {insights.recommendations.techniques.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.9 }}
                        className="flex items-start space-x-2 text-orange-100"
                      >
                        <span className="text-orange-400 mt-1">🎯</span>
                        <span className="text-sm">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'next-set' && (
              <motion.div
                key="next-set"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Next Set Plan */}
                <div className="bg-gradient-to-r from-indigo-900 to-blue-900 bg-opacity-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-indigo-400 mb-4">
                    🚀 Your Next Set Plan
                  </h3>

                  {/* BPM Range */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-2">
                      🎵 Recommended BPM Range
                    </h4>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-blue-400">
                          {insights.nextSetPlan.recommendedBPMRange.min} -{' '}
                          {insights.nextSetPlan.recommendedBPMRange.max}
                        </span>
                        <div className="text-gray-400 text-sm mt-1">
                          BPM Sweet Spot
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Genres */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-3">
                      🎨 Suggested Genres
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {insights.nextSetPlan.suggestedGenres.map(
                        (genre, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-600 bg-opacity-50 rounded-full text-sm text-purple-200"
                          >
                            {genre}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Key Recommendations */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-white mb-2">
                      🎼 Harmonic Mixing Tips
                    </h4>
                    <ul className="space-y-2">
                      {insights.nextSetPlan.keyRecommendations.map(
                        (tip, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2 text-gray-300"
                          >
                            <span className="text-yellow-400 mt-1">🎼</span>
                            <span className="text-sm">{tip}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Effects to Try */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">
                      ⚡ Effects to Experiment With
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {insights.nextSetPlan.effectsToTry.map(
                        (effect, index) => (
                          <div
                            key={index}
                            className="bg-gray-800 rounded-lg p-3"
                          >
                            <div className="font-medium text-green-400">
                              {effect}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Items */}
                <div className="bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    ✅ Action Items for Next Session
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1 accent-blue-500" />
                      <span className="text-gray-300">
                        Prepare tracks in the{' '}
                        {insights.nextSetPlan.recommendedBPMRange.min}-
                        {insights.nextSetPlan.recommendedBPMRange.max} BPM range
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1 accent-blue-500" />
                      <span className="text-gray-300">
                        Practice harmonic mixing with compatible keys
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1 accent-blue-500" />
                      <span className="text-gray-300">
                        Experiment with{' '}
                        {insights.nextSetPlan.effectsToTry[0] || 'new effects'}
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" className="mt-1 accent-blue-500" />
                      <span className="text-gray-300">
                        Focus on{' '}
                        {insights.improvements[0] || 'maintaining energy flow'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>

          <div className="flex space-x-3">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              📊 View History
            </button>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              💾 Export Data
            </button>
            <button
              onClick={onStartNewSet}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
            >
              🚀 Start New Set
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SetAnalyticsDashboard;
