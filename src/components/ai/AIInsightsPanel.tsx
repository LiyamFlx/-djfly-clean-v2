import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Eye,
  Users,
  TrendingUp,
  Target,
  Zap,
  Lightbulb,
  BarChart3,
  Camera,
  Activity,
} from 'lucide-react';
import { aiPersonalizationService } from '@/services/aiPersonalization';

interface AIInsightsPanelProps {
  userId: string;
  className?: string;
}

interface InsightCard {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  confidence: number;
  category: 'crowd' | 'personal' | 'prediction' | 'vision';
}

interface PersonalizedInsights {
  recommendations: string[];
  topGenres: string[];
  energyProfile: string;
  peakTimes: string[];
}

interface ComputerVisionFeatures {
  motionDetection: {
    motionVectors: Array<{ x: number; y: number }>;
    crowdFlow: string;
  };
  densityMapping: {
    hotspots: Array<{ x: number; y: number; density: number }>;
    capacityUtilization: number;
  };
}

interface CrowdVisionData {
  demographics: {
    ageGroups: Record<string, number>;
    genderDistribution: Record<string, number>;
  };
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  userId,
  className = '',
}) => {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [personalizedInsights, setPersonalizedInsights] = useState<PersonalizedInsights | null>(null);
  const [crowdVisionData, setCrowdVisionData] = useState<CrowdVisionData | null>(null);
  const [computerVisionFeatures, setComputerVisionFeatures] =
    useState<ComputerVisionFeatures | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);

  const generateInsights = useCallback(async () => {
    setIsAnalyzing(true);

    try {
      // Get crowd vision data
      const visionData = await aiPersonalizationService.analyzeCrowdVision();
      const visionFeatures =
        await aiPersonalizationService.extractComputerVisionFeatures();

      setCrowdVisionData(visionData);
      setComputerVisionFeatures(visionFeatures);

      // Get personalized insights
      const personalInsights =
        aiPersonalizationService.getPersonalizedInsights(userId);
      setPersonalizedInsights(personalInsights);

      // Generate insight cards
      const newInsights: InsightCard[] = [
        // Crowd Insights
        {
          id: 'crowd-density',
          title: 'Crowd Density',
          value: Math.round(visionData.density * 100),
          unit: '%',
          trend:
            visionData.density > 0.8
              ? 'up'
              : visionData.density < 0.6
                ? 'down'
                : 'stable',
          confidence: 0.85,
          category: 'crowd',
        },
        {
          id: 'motion-activity',
          title: 'Motion Activity',
          value: Math.round(visionData.motion * 100),
          unit: '%',
          trend:
            visionData.motion > 0.7
              ? 'up'
              : visionData.motion < 0.4
                ? 'down'
                : 'stable',
          confidence: 0.78,
          category: 'crowd',
        },
        {
          id: 'dancing-intensity',
          title: 'Dancing Intensity',
          value: Math.round(visionData.behavior.dancing * 100),
          unit: '%',
          trend: visionData.behavior.dancing > 0.7 ? 'up' : 'stable',
          confidence: 0.82,
          category: 'crowd',
        },
        {
          id: 'energy-front-center',
          title: 'Front Center Energy',
          value: Math.round(visionData.energyZones.frontCenter * 100),
          unit: '%',
          trend: visionData.energyZones.frontCenter > 0.8 ? 'up' : 'stable',
          confidence: 0.79,
          category: 'crowd',
        },

        // Personal Insights
        {
          id: 'top-genre',
          title: 'Top Genre',
          value: personalInsights.topGenres[0] || 'Electronic',
          trend: 'stable',
          confidence: 0.91,
          category: 'personal',
        },
        {
          id: 'energy-profile',
          title: 'Energy Profile',
          value: personalInsights.energyProfile || 'High',
          trend: 'stable',
          confidence: 0.87,
          category: 'personal',
        },
        {
          id: 'peak-times',
          title: 'Peak Engagement',
          value: personalInsights.peakTimes[0] || '8:30 PM',
          trend: 'stable',
          confidence: 0.83,
          category: 'personal',
        },

        // Predictions
        {
          id: 'next-track-confidence',
          title: 'Next Track Confidence',
          value: Math.round(Math.random() * 20 + 80),
          unit: '%',
          trend: 'up',
          confidence: 0.76,
          category: 'prediction',
        },
        {
          id: 'energy-increase',
          title: 'Predicted Energy Increase',
          value: Math.round(Math.random() * 30 + 15),
          unit: '%',
          trend: 'up',
          confidence: 0.72,
          category: 'prediction',
        },
        {
          id: 'crowd-retention',
          title: 'Crowd Retention Likelihood',
          value: Math.round(Math.random() * 20 + 75),
          unit: '%',
          trend: 'stable',
          confidence: 0.81,
          category: 'prediction',
        },

        // Computer Vision
        {
          id: 'gesture-recognition',
          title: 'Gesture Recognition',
          value: Math.round(
            visionFeatures.behaviorAnalysis.gestureRecognition[0]?.confidence *
              100 || 75
          ),
          unit: '%',
          trend: 'up',
          confidence: 0.88,
          category: 'vision',
        },
        {
          id: 'social-interactions',
          title: 'Social Interactions',
          value: Math.round(
            visionFeatures.behaviorAnalysis.socialInteractions * 100
          ),
          unit: '%',
          trend:
            visionFeatures.behaviorAnalysis.socialInteractions > 0.6
              ? 'up'
              : 'stable',
          confidence: 0.74,
          category: 'vision',
        },
        {
          id: 'crowd-flow',
          title: 'Crowd Flow',
          value: visionFeatures.motionDetection.crowdFlow,
          trend: 'stable',
          confidence: 0.69,
          category: 'vision',
        },
      ];

      setInsights(newInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId]);

  useEffect(() => {
    generateInsights();
    const interval = setInterval(generateInsights, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [generateInsights]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crowd':
        return <Users className="w-4 h-4" />;
      case 'personal':
        return <Brain className="w-4 h-4" />;
      case 'prediction':
        return <Target className="w-4 h-4" />;
      case 'vision':
        return <Camera className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crowd':
        return 'text-blue-400';
      case 'personal':
        return 'text-purple-400';
      case 'prediction':
        return 'text-green-400';
      case 'vision':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return (
          <TrendingUp className="w-4 h-4 text-red-400 transform rotate-180" />
        );
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-400';
    if (confidence > 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  // const getCategoryInsights = (category: string) => {
  //   return insights.filter((insight) => insight.category === category);
  // };

  return (
    <div className={`bg-gray-900 text-white p-6 rounded-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">AI Insights</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showAdvancedAnalytics
                ? 'bg-purple-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Advanced
          </button>
          <button
            onClick={generateInsights}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={getCategoryColor(insight.category)}>
                  {getCategoryIcon(insight.category)}
                </div>
                <h3 className="text-sm font-medium">{insight.title}</h3>
              </div>
              {getTrendIcon(insight.trend || 'stable')}
            </div>

            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold">
                {insight.value}
                {insight.unit && (
                  <span className="text-sm text-gray-400 ml-1">
                    {insight.unit}
                  </span>
                )}
              </div>
              <div
                className={`text-xs ${getConfidenceColor(insight.confidence)}`}
              >
                {Math.round(insight.confidence * 100)}% confidence
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Personalized Recommendations */}
      {personalizedInsights && (
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold">
              Personalized Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalizedInsights.recommendations.map(
              (recommendation: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-gray-700 rounded-lg"
                >
                  <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Advanced Analytics */}
      <AnimatePresence>
        {showAdvancedAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4">Advanced Analytics</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Computer Vision Analysis */}
              {computerVisionFeatures && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Camera className="w-4 h-4 text-orange-400" />
                    Computer Vision Analysis
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Motion Vectors</span>
                      <span>
                        {
                          computerVisionFeatures.motionDetection.motionVectors
                            .length
                        }{' '}
                        detected
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Crowd Flow</span>
                      <span className="capitalize">
                        {computerVisionFeatures.motionDetection.crowdFlow}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hotspots</span>
                      <span>
                        {computerVisionFeatures.densityMapping.hotspots.length}{' '}
                        active
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Capacity Utilization</span>
                      <span>
                        {Math.round(
                          computerVisionFeatures.densityMapping
                            .capacityUtilization * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Crowd Demographics */}
              {crowdVisionData && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Crowd Demographics
                  </h4>

                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Age Distribution</span>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(
                          crowdVisionData.demographics.ageGroups
                        ).map(([age, percentage]) => (
                          <div
                            key={age}
                            className="flex justify-between text-xs"
                          >
                            <span>{age}</span>
                            <span>{Math.round((percentage as number) * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Gender Distribution</span>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(
                          crowdVisionData.demographics.genderDistribution
                        ).map(([gender, percentage]) => (
                          <div
                            key={gender}
                            className="flex justify-between text-xs"
                          >
                            <span className="capitalize">{gender}</span>
                            <span>{Math.round((percentage as number) * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInsightsPanel;
