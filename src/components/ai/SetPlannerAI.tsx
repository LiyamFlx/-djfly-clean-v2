/**
 * AI Set Planning Component
 * Creates optimized set flow with energy curve analysis
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Clock, Zap, TrendingUp, Play, Shuffle } from 'lucide-react';
import { aiMusicEngine } from '@/services/aiMusicEngine';
import type { Track } from '@/types';

interface SetPlannerProps {
  targetDuration: number; // minutes
  venue: string;
  timeSlot: string;
  onPlanGenerated?: (tracks: Track[], plan: SetPlan) => void;
}

interface SetPlan {
  tracks: Track[];
  energyCurve: number[];
  phases: SetPhase[];
  totalDuration: number;
  mixingTips: string[];
}

interface SetPhase {
  name: string;
  startTime: number; // minutes
  duration: number;
  targetEnergy: number;
  description: string;
  tracks: Track[];
}

const SetPlannerAI: React.FC<SetPlannerProps> = ({
  targetDuration,
  venue,
  timeSlot,
  onPlanGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [setPlan, setSetPlan] = useState<SetPlan | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  const generateSetPlan = async () => {
    setIsGenerating(true);

    try {
      // Generate 3 different phases for optimal energy flow
      const phases = await generateSetPhases(targetDuration, venue);

      // Combine all tracks from phases
      const allTracks: Track[] = [];
      const energyCurve: number[] = [];
      const allMixingTips: string[] = [];

      for (const phase of phases) {
        const recommendation = await aiMusicEngine.generateIntelligentPlaylist({
          prompt: `${phase.description} Create ${phase.duration}-minute ${phase.name.toLowerCase()} section for ${venue} at ${timeSlot}`,
          mood: getPhaseMood(phase.targetEnergy),
          duration: phase.duration,
          venue: venue as string,
          timeOfDay: getTimeOfDay(timeSlot),
          crowdEnergy: phase.targetEnergy,
        });

        phase.tracks = recommendation.tracks.slice(
          0,
          Math.ceil(phase.duration / 4)
        ); // ~4 min per track
        allTracks.push(...phase.tracks);
        energyCurve.push(...recommendation.energyCurve);
        allMixingTips.push(...recommendation.mixingTips);
      }

      const plan: SetPlan = {
        tracks: allTracks,
        energyCurve,
        phases,
        totalDuration: targetDuration,
        mixingTips: allMixingTips,
      };

      setSetPlan(plan);
      onPlanGenerated?.(allTracks, plan);
    } catch (error) {
      console.error('Set planning failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate set phases based on duration and context
  const generateSetPhases = async (
    duration: number,
    venue: string
  ): Promise<SetPhase[]> => {
    const phases: SetPhase[] = [];

    if (duration <= 30) {
      // Short set - single build
      phases.push({
        name: 'Power Hour',
        startTime: 0,
        duration: duration,
        targetEnergy: venue === 'club' ? 80 : 60,
        description: 'High-energy continuous flow with peak moments',
        tracks: [],
      });
    } else if (duration <= 60) {
      // Medium set - build and sustain
      phases.push(
        {
          name: 'Warmup',
          startTime: 0,
          duration: duration * 0.3,
          targetEnergy: 50,
          description: 'Establish groove and build initial energy',
          tracks: [],
        },
        {
          name: 'Peak Time',
          startTime: duration * 0.3,
          duration: duration * 0.7,
          targetEnergy: 85,
          description: 'High-energy peak section with crowd favorites',
          tracks: [],
        }
      );
    } else {
      // Long set - full journey
      phases.push(
        {
          name: 'Opening',
          startTime: 0,
          duration: duration * 0.25,
          targetEnergy: 40,
          description: 'Atmospheric opening to draw people in',
          tracks: [],
        },
        {
          name: 'Build',
          startTime: duration * 0.25,
          duration: duration * 0.35,
          targetEnergy: 70,
          description: 'Progressive energy build with crowd engagement',
          tracks: [],
        },
        {
          name: 'Peak',
          startTime: duration * 0.6,
          duration: duration * 0.25,
          targetEnergy: 90,
          description: 'Maximum energy climax with biggest tracks',
          tracks: [],
        },
        {
          name: 'Closing',
          startTime: duration * 0.85,
          duration: duration * 0.15,
          targetEnergy: 60,
          description: 'Memorable closing with emotional impact',
          tracks: [],
        }
      );
    }

    return phases;
  };

  const getPhaseMood = (
    energy: number
  ): 'energetic' | 'chill' | 'progressive' | 'mixed' => {
    if (energy >= 80) return 'energetic';
    if (energy >= 60) return 'progressive';
    if (energy >= 40) return 'mixed';
    return 'chill';
  };

  const getTimeOfDay = (
    timeSlot: string
  ): 'morning' | 'afternoon' | 'evening' | 'late-night' => {
    const slot = timeSlot.toLowerCase();
    if (slot.includes('morning') || slot.includes('am')) return 'morning';
    if (slot.includes('afternoon') || slot.includes('pm')) return 'afternoon';
    if (slot.includes('evening')) return 'evening';
    return 'late-night';
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    return `${hours}h ${mins}min`;
  };

  const getPhaseColor = (energy: number) => {
    if (energy >= 80) return 'from-red-500 to-orange-500';
    if (energy >= 60) return 'from-yellow-500 to-red-500';
    if (energy >= 40) return 'from-blue-500 to-yellow-500';
    return 'from-purple-500 to-blue-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI Set Planner</h3>
        </div>
        <div className="text-sm text-gray-400">
          {formatDuration(targetDuration)} • {venue} • {timeSlot}
        </div>
      </div>

      {!setPlan && !isGenerating && (
        <div className="text-center py-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={generateSetPlan}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Generate AI Set Plan
            </button>
          </motion.div>
          <p className="text-gray-400 text-sm mt-3">
            AI will create an optimized set flow with perfect energy curve
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-8 space-y-4"
          >
            <div className="inline-flex items-center gap-3 text-purple-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
              <span className="font-medium">
                AI is crafting your perfect set...
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <p>🎯 Analyzing venue and time slot...</p>
              <p>🎵 Selecting optimal tracks...</p>
              <p>📈 Calculating energy curve...</p>
              <p>🎧 Generating mixing strategy...</p>
            </div>
          </motion.div>
        )}

        {setPlan && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Energy Curve Visualization */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Energy Flow Curve
              </h4>
              <div className="flex items-end gap-1 h-16 mb-2">
                {setPlan.energyCurve.map((energy, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 rounded-t bg-gradient-to-t ${
                      energy >= 80
                        ? 'from-red-400 to-red-300'
                        : energy >= 60
                          ? 'from-yellow-400 to-yellow-300'
                          : energy >= 40
                            ? 'from-blue-400 to-blue-300'
                            : 'from-purple-400 to-purple-300'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${(energy / 100) * 100}%` }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Start</span>
                <span>{formatDuration(setPlan.totalDuration)}</span>
              </div>
            </div>

            {/* Set Phases */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Set Structure ({setPlan.phases.length} phases)
              </h4>
              {setPlan.phases.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-l-4 border-transparent bg-gray-700 rounded-r-lg p-4 cursor-pointer transition-all ${
                    selectedPhase === index
                      ? 'border-purple-400 bg-purple-900/20'
                      : 'hover:bg-gray-650'
                  }`}
                  onClick={() =>
                    setSelectedPhase(selectedPhase === index ? null : index)
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white">{phase.name}</h5>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{formatDuration(phase.duration)}</span>
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPhaseColor(phase.targetEnergy)}`}
                      ></div>
                      <span>{phase.targetEnergy}% energy</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {phase.description}
                  </p>
                  <div className="text-xs text-gray-400">
                    {formatDuration(phase.startTime)} -{' '}
                    {formatDuration(phase.startTime + phase.duration)} •{' '}
                    {phase.tracks.length} tracks
                  </div>

                  <AnimatePresence>
                    {selectedPhase === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-600 space-y-2"
                      >
                        {phase.tracks.map((track, trackIndex) => (
                          <div
                            key={track.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                                {trackIndex + 1}
                              </span>
                              <div>
                                <p className="text-white font-medium">
                                  {track.title}
                                </p>
                                <p className="text-gray-400">{track.artist}</p>
                              </div>
                            </div>
                            <div className="text-gray-400 text-xs">
                              {track.bpm} BPM • {track.key}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Set
              </button>
              <button
                onClick={generateSetPlan}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Regenerate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SetPlannerAI;
