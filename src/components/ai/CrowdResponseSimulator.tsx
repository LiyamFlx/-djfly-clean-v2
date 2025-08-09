/**
 * Real-time Crowd Response Simulator
 * Uses AI to simulate realistic crowd reactions and provide DJ guidance
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Zap,
  Heart,
  Music,
  Mic,
  Camera,
  Activity,
  BarChart3,
} from 'lucide-react';
import { advancedAudioService } from '@/services/advancedAudio';

interface CrowdResponseSimulatorProps {
  className?: string;
}

interface CrowdEnergy {
  level: number; // 0-100
  trend: 'rising' | 'falling' | 'stable';
  factors: {
    audioEnergy: number;
    crowdDensity: number;
    motionActivity: number;
    vocalResponse: number;
  };
  predictions: {
    nextMinute: number;
    peakTime: number;
    dropTime: number;
  };
}

interface CrowdSegment {
  id: string;
  energy: number;
  mood: 'excited' | 'engaged' | 'neutral' | 'bored';
  demographics: {
    age: string;
    gender: string;
    groupSize: number;
  };
  behavior: {
    dancing: number;
    singing: number;
    clapping: number;
    phoneRecording: number;
  };
}

const CrowdResponseSimulator: React.FC<CrowdResponseSimulatorProps> = ({
  className = '',
}) => {
  const [crowdEnergy, setCrowdEnergy] = useState<CrowdEnergy>({
    level: 65,
    trend: 'rising',
    factors: {
      audioEnergy: 0.7,
      crowdDensity: 0.8,
      motionActivity: 0.6,
      vocalResponse: 0.5,
    },
    predictions: {
      nextMinute: 75,
      peakTime: 85,
      dropTime: 45,
    },
  });

  const [crowdSegments, setCrowdSegments] = useState<CrowdSegment[]>([
    {
      id: 'front-center',
      energy: 85,
      mood: 'excited',
      demographics: { age: '18-25', gender: 'mixed', groupSize: 12 },
      behavior: {
        dancing: 0.9,
        singing: 0.7,
        clapping: 0.8,
        phoneRecording: 0.6,
      },
    },
    {
      id: 'back-left',
      energy: 60,
      mood: 'engaged',
      demographics: { age: '25-35', gender: 'mixed', groupSize: 8 },
      behavior: {
        dancing: 0.6,
        singing: 0.4,
        clapping: 0.7,
        phoneRecording: 0.3,
      },
    },
    {
      id: 'back-right',
      energy: 45,
      mood: 'neutral',
      demographics: { age: '30-40', gender: 'mixed', groupSize: 6 },
      behavior: {
        dancing: 0.3,
        singing: 0.2,
        clapping: 0.5,
        phoneRecording: 0.8,
      },
    },
  ]);

  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const updateCrowdEnergy = useCallback(() => {
    const analytics = advancedAudioService.getAnalytics() as any;

    // Calculate new energy based on audio and crowd factors
    const audioEnergy =
      ((analytics as any).deckA?.energy || 0) +
      ((analytics as any).deckB?.energy || 0);
    const crowdDensity = Math.random() * 0.3 + 0.7; // Simulated crowd density
    const motionActivity = Math.random() * 0.4 + 0.5; // Simulated motion
    const vocalResponse = Math.random() * 0.5 + 0.3; // Simulated vocal response

    const newEnergy = Math.min(
      100,
      Math.max(
        0,
        (audioEnergy * 0.4 +
          crowdDensity * 0.3 +
          motionActivity * 0.2 +
          vocalResponse * 0.1) *
          100
      )
    );

    const trend =
      newEnergy > crowdEnergy.level
        ? 'rising'
        : newEnergy < crowdEnergy.level
          ? 'falling'
          : 'stable';

    setCrowdEnergy((prev) => ({
      ...prev,
      level: newEnergy,
      trend,
      factors: {
        audioEnergy,
        crowdDensity,
        motionActivity,
        vocalResponse,
      },
      predictions: {
        nextMinute: Math.min(100, newEnergy + (Math.random() * 20 - 10)),
        peakTime: Math.min(100, newEnergy + Math.random() * 15),
        dropTime: Math.max(0, newEnergy - Math.random() * 30),
      },
    }));
  }, [crowdEnergy.level]);

  const updateCrowdSegments = useCallback(() => {
    setCrowdSegments((prev) =>
      prev.map((segment) => {
        const energyChange = (Math.random() - 0.5) * 20;
        const newEnergy = Math.min(
          100,
          Math.max(0, segment.energy + energyChange)
        );

        const mood =
          newEnergy > 80
            ? 'excited'
            : newEnergy > 60
              ? 'engaged'
              : newEnergy > 40
                ? 'neutral'
                : 'bored';

        return {
          ...segment,
          energy: newEnergy,
          mood,
          behavior: {
            dancing: Math.min(
              1,
              Math.max(
                0,
                segment.behavior.dancing + (Math.random() - 0.5) * 0.2
              )
            ),
            singing: Math.min(
              1,
              Math.max(
                0,
                segment.behavior.singing + (Math.random() - 0.5) * 0.2
              )
            ),
            clapping: Math.min(
              1,
              Math.max(
                0,
                segment.behavior.clapping + (Math.random() - 0.5) * 0.2
              )
            ),
            phoneRecording: Math.min(
              1,
              Math.max(
                0,
                segment.behavior.phoneRecording + (Math.random() - 0.5) * 0.2
              )
            ),
          },
        };
      })
    );
  }, []);

  useEffect(() => {
    if (isSimulating) {
      simulationInterval.current = setInterval(() => {
        updateCrowdEnergy();
        updateCrowdSegments();
      }, 2000);
    } else {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    }

    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, [isSimulating]);

  const getEnergyColor = (energy: number): string => {
    if (energy > 80) return 'text-red-400';
    if (energy > 60) return 'text-yellow-400';
    if (energy > 40) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'excited':
        return <Zap className="w-4 h-4 text-red-400" />;
      case 'engaged':
        return <Heart className="w-4 h-4 text-yellow-400" />;
      case 'neutral':
        return <Music className="w-4 h-4 text-blue-400" />;
      case 'bored':
        return <Activity className="w-4 h-4 text-gray-400" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className={`bg-gray-900 text-white p-6 rounded-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Crowd Response Simulator</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isSimulating
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSimulating ? (
              <>
                <Activity className="w-4 h-4" />
                Stop Simulation
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Start Simulation
              </>
            )}
          </button>
          <button
            onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Energy */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall Energy</h3>
            {getTrendIcon(crowdEnergy.trend)}
          </div>

          <div className="text-center mb-4">
            <div
              className={`text-4xl font-bold ${getEnergyColor(crowdEnergy.level)}`}
            >
              {Math.round(crowdEnergy.level)}%
            </div>
            <div className="text-sm text-gray-400 capitalize">
              {crowdEnergy.trend} energy
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Audio Energy:</span>
              <span>{Math.round(crowdEnergy.factors.audioEnergy * 100)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Crowd Density:</span>
              <span>{Math.round(crowdEnergy.factors.crowdDensity * 100)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Motion Activity:</span>
              <span>
                {Math.round(crowdEnergy.factors.motionActivity * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Vocal Response:</span>
              <span>
                {Math.round(crowdEnergy.factors.vocalResponse * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Crowd Segments */}
        <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Crowd Segments</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {crowdSegments.map((segment) => (
              <div key={segment.id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize">
                    {segment.id.replace('-', ' ')}
                  </span>
                  {getMoodIcon(segment.mood)}
                </div>

                <div
                  className={`text-2xl font-bold ${getEnergyColor(segment.energy)}`}
                >
                  {Math.round(segment.energy)}%
                </div>

                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs">
                    <span>Dancing:</span>
                    <span>{Math.round(segment.behavior.dancing * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Singing:</span>
                    <span>{Math.round(segment.behavior.singing * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Clapping:</span>
                    <span>{Math.round(segment.behavior.clapping * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Recording:</span>
                    <span>
                      {Math.round(segment.behavior.phoneRecording * 100)}%
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  {segment.demographics.age} • {segment.demographics.groupSize}{' '}
                  people
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Energy Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Next Minute</div>
            <div
              className={`text-2xl font-bold ${getEnergyColor(crowdEnergy.predictions.nextMinute)}`}
            >
              {Math.round(crowdEnergy.predictions.nextMinute)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Peak Time</div>
            <div
              className={`text-2xl font-bold ${getEnergyColor(crowdEnergy.predictions.peakTime)}`}
            >
              {Math.round(crowdEnergy.predictions.peakTime)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Drop Time</div>
            <div
              className={`text-2xl font-bold ${getEnergyColor(crowdEnergy.predictions.dropTime)}`}
            >
              {Math.round(crowdEnergy.predictions.dropTime)}%
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <AnimatePresence>
        {showAdvancedAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 p-4 rounded-lg mt-6"
          >
            <h3 className="text-lg font-semibold mb-4">Advanced Analytics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Real-time Sensors */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Real-time Sensors</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Motion Detection</span>
                    </div>
                    <span className="text-sm">
                      {Math.round(Math.random() * 100)}% active
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Audio Analysis</span>
                    </div>
                    <span className="text-sm">
                      {Math.round(Math.random() * 100)}% response
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm">Density Mapping</span>
                    </div>
                    <span className="text-sm">
                      {Math.round(Math.random() * 100)}% capacity
                    </span>
                  </div>
                </div>
              </div>

              {/* Predictive Analytics */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Predictive Analytics</h4>

                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Peak Energy Time:</span>
                      <span className="text-green-400">~2 minutes</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Energy Sustain:</span>
                      <span className="text-blue-400">~8 minutes</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Crowd Retention:</span>
                      <span className="text-yellow-400">~15 minutes</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: '85%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrowdResponseSimulator;
