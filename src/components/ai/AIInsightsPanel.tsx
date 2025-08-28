import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Users,
  TrendingUp,
  Target,
  Zap,
  Lightbulb,
  Camera,
  Activity,
  Sparkles,
  Music,
  Heart,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { aiPersonalizationService } from '@/services/aiPersonalization';
import { GlassCard, NeonCard } from '@/components/ui/EnhancedCard';
import { AIAnalysisLoading } from '@/components/ui/LoadingStates';

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
  icon?: LucideIcon;
  color?: string;
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
  density: number;
  energy: number;
  mood: string;
}

const isCrowdVisionData = (value: unknown): value is CrowdVisionData => {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['density'] === 'number' &&
    typeof v['energy'] === 'number' &&
    typeof v['mood'] === 'string'
  );
};

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ userId, className = '' }) => {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'recording' | 'analyzing' | 'generating' | 'complete'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const generateInsights = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisStage('recording');
    setAnalysisProgress(0);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAnalysisProgress(25);
      setAnalysisStage('analyzing');

      const rawVisionData = await aiPersonalizationService.analyzeCrowdVision();
      const visionFeatures = await aiPersonalizationService.extractComputerVisionFeatures();

      const visionData = isCrowdVisionData(rawVisionData)
        ? rawVisionData
        : { density: 0.6, energy: 0.7, mood: 'neutral', demographics: { ageGroups: {}, genderDistribution: {} } };

      setAnalysisProgress(60);
      setAnalysisStage('generating');

      const personalInsights = aiPersonalizationService.getPersonalizedInsights(userId);

      const newInsights: InsightCard[] = [
        {
          id: 'crowd-density',
          title: 'Crowd Density',
          value: Math.round(visionData.density * 100),
          unit: '%',
          trend: visionData.density > 0.8 ? 'up' : visionData.density < 0.6 ? 'down' : 'stable',
          confidence: 95,
          category: 'crowd',
          icon: Users,
          color: 'neon-purple',
        },
        {
          id: 'crowd-energy',
          title: 'Energy Level',
          value: Math.round(visionData.energy * 100),
          unit: '%',
          trend: visionData.energy > 0.7 ? 'up' : visionData.energy < 0.4 ? 'down' : 'stable',
          confidence: 92,
          category: 'crowd',
          icon: Zap,
          color: 'neon-green',
        },
        {
          id: 'crowd-mood',
          title: 'Crowd Mood',
          value: visionData.mood,
          confidence: 88,
          category: 'crowd',
          icon: Heart,
          color: 'neon-purple',
        },
        {
          id: 'top-genre',
          title: 'Top Genre',
          value: personalInsights.topGenres[0] || 'House',
          confidence: 85,
          category: 'personal',
          icon: Music,
          color: 'neon-green',
        },
        {
          id: 'energy-profile',
          title: 'Energy Profile',
          value: personalInsights.energyProfile,
          confidence: 90,
          category: 'personal',
          icon: Activity,
          color: 'neon-purple',
        },
        {
          id: 'peak-time',
          title: 'Peak Time',
          value: personalInsights.peakTimes[0] || '10 PM',
          confidence: 87,
          category: 'prediction',
          icon: Clock,
          color: 'neon-green',
        },
      ];

      setInsights(newInsights);
      setAnalysisProgress(100);
      setAnalysisStage('complete');

      setTimeout(() => {
        setAnalysisStage('idle');
        setAnalysisProgress(0);
      }, 3000);
    } catch (error) {
      console.error('Error generating insights:', error);
      setAnalysisStage('idle');
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-neon-green" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-neon-green';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isAnalyzing) {
    return (
      <div className={`p-8 ${className}`}>
        <AIAnalysisLoading
          stage={analysisStage === 'idle' ? 'recording' : analysisStage}
          progress={analysisProgress}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-neon-purple/10 border border-neon-purple/30 rounded-xl">
            <Brain className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <h2 className="heading-secondary text-white">AI Insights</h2>
            <p className="body-small text-gray-400">Real-time crowd and personal analytics</p>
          </div>
        </div>

        <motion.button
          onClick={generateInsights}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-4 h-4" />
          Generate Insights
        </motion.button>
      </motion.div>

      {insights.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <GlassCard
                icon={insight.icon}
                iconPosition="top"
                iconColor={insight.color || 'neon-purple'}
                title={insight.title}
                subtitle={`${insight.value}${insight.unit || ''}`}
                className="h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(insight.trend || 'stable')}
                      <span className="text-sm text-gray-400 capitalize">
                        {insight.trend || 'stable'}
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}% confidence
                    </div>
                  </div>

                  <div className="inline-flex items-center px-2 py-1 bg-neon-purple/10 border border-neon-purple/30 rounded-full">
                    <span className="text-xs font-medium text-neon-purple capitalize">
                      {insight.category}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {showAdvancedAnalytics && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="heading-tertiary text-white">Advanced Analytics</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeonCard
              icon={Camera}
              iconPosition="top"
              iconColor="neon-purple"
              title="Motion Detection"
              subtitle="Real-time crowd movement analysis"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Crowd Flow:</span>
                  <span className="text-sm font-medium text-white">fast</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Motion Vectors:</span>
                  <span className="text-sm font-medium text-white">24</span>
                </div>
              </div>
            </NeonCard>

            <NeonCard
              icon={Target}
              iconPosition="top"
              iconColor="neon-green"
              title="Density Mapping"
              subtitle="Crowd distribution analysis"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Capacity Utilization:</span>
                  <span className="text-sm font-medium text-white">76%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Hotspots:</span>
                  <span className="text-sm font-medium text-white">5</span>
                </div>
              </div>
            </NeonCard>
          </div>
        </motion.div>
      )}

      {insights.length > 0 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            {showAdvancedAnalytics ? 'Hide' : 'Show'} Advanced Analytics
            <motion.div animate={{ rotate: showAdvancedAnalytics ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <TrendingUp className="w-4 h-4" />
            </motion.div>
          </button>
        </motion.div>
      )}

      {insights.length === 0 && !isAnalyzing && (
        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/10 border border-neon-purple/30 rounded-full flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-neon-purple" />
          </div>
          <h3 className="heading-tertiary text-white mb-2">No Insights Yet</h3>
          <p className="body-medium text-gray-400 mb-6">Generate your first AI-powered insights to start optimizing your DJ sets</p>
          <motion.button onClick={generateInsights} className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Sparkles className="w-4 h-4" />
            Generate First Insights
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default AIInsightsPanel;
