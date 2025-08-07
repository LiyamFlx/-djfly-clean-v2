/**
 * Real-time Crowd Response Simulator
 * Uses AI to simulate realistic crowd reactions and provide DJ guidance
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { aiMusicEngine } from '@/services/aiMusicEngine';
import type { Track } from '@/services/musicLibrary';

interface CrowdResponseProps {
  currentTrack?: Track;
  previousTracks?: Track[];
  venue?: string;
  onEnergyChange?: (energy: number) => void;
}

interface CrowdResponse {
  energy: number;
  response: string;
  suggestions: string[];
  timestamp: number;
}

const CrowdResponseSimulator: React.FC<CrowdResponseProps> = ({
  currentTrack,
  previousTracks = [],
  venue = 'club',
  onEnergyChange
}) => {
  const [crowdResponse, setCrowdResponse] = useState<CrowdResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [energyHistory, setEnergyHistory] = useState<number[]>([]);

  // Simulate crowd response when track changes
  useEffect(() => {
    if (!currentTrack) return;

    const simulateResponse = async () => {
      setIsAnalyzing(true);
      
      try {
        const response = await aiMusicEngine.simulateCrowdResponse(
          currentTrack,
          previousTracks,
          venue
        );
        
        const crowdData: CrowdResponse = {
          ...response,
          timestamp: Date.now()
        };
        
        setCrowdResponse(crowdData);
        setEnergyHistory(prev => [...prev.slice(-9), response.energy]); // Keep last 10
        onEnergyChange?.(response.energy);
        
      } catch (error) {
        console.warn('Crowd simulation failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // Delay simulation to feel realistic
    const timer = setTimeout(simulateResponse, 1500);
    return () => clearTimeout(timer);
  }, [currentTrack?.id, venue, onEnergyChange]);

  // Get energy trend
  const getEnergyTrend = () => {
    if (energyHistory.length < 2) return 'stable';
    const recent = energyHistory.slice(-3);
    const trend = recent[recent.length - 1] - recent[0];
    if (trend > 5) return 'rising';
    if (trend < -5) return 'falling';
    return 'stable';
  };

  // Get energy color and icon
  const getEnergyDisplay = (energy: number) => {
    if (energy >= 80) return { color: 'text-green-400', bg: 'bg-green-900/30', icon: Zap };
    if (energy >= 60) return { color: 'text-blue-400', bg: 'bg-blue-900/30', icon: TrendingUp };
    if (energy >= 40) return { color: 'text-yellow-400', bg: 'bg-yellow-900/30', icon: Minus };
    return { color: 'text-red-400', bg: 'bg-red-900/30', icon: TrendingDown };
  };

  const getTrendIcon = () => {
    const trend = getEnergyTrend();
    if (trend === 'rising') return TrendingUp;
    if (trend === 'falling') return TrendingDown;
    return Minus;
  };

  if (!currentTrack) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-3 text-gray-400">
          <Users className="w-5 h-5" />
          <span>No track playing - crowd response unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Live Crowd Response</h3>
        </div>
        <div className="text-xs text-gray-400 capitalize">
          {venue} • {new Date().toLocaleTimeString()}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 text-blue-400"
          >
            <div className="animate-pulse">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-sm">Reading crowd energy...</span>
          </motion.div>
        ) : crowdResponse ? (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Energy Meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Energy Level</span>
                <div className="flex items-center gap-2">
                  {(() => {
                    const TrendIcon = getTrendIcon();
                    const trendColor = getEnergyTrend() === 'rising' ? 'text-green-400' : 
                                     getEnergyTrend() === 'falling' ? 'text-red-400' : 'text-gray-400';
                    return <TrendIcon className={`w-4 h-4 ${trendColor}`} />;
                  })()}
                  <span className={getEnergyDisplay(crowdResponse.energy).color}>
                    {crowdResponse.energy}/100
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    crowdResponse.energy >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    crowdResponse.energy >= 60 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                    crowdResponse.energy >= 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${crowdResponse.energy}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Crowd Response */}
            <div className={`${getEnergyDisplay(crowdResponse.energy).bg} border-l-4 ${
              crowdResponse.energy >= 80 ? 'border-green-400' :
              crowdResponse.energy >= 60 ? 'border-blue-400' :
              crowdResponse.energy >= 40 ? 'border-yellow-400' : 'border-red-400'
            } p-3 rounded-r-lg`}>
              <p className="text-sm text-white font-medium">
                {crowdResponse.response}
              </p>
            </div>

            {/* DJ Suggestions */}
            {crowdResponse.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  AI Suggestions
                </h4>
                <div className="space-y-1">
                  {crowdResponse.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-blue-400">•</span>
                      <span className="text-gray-200">{suggestion}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Energy History Mini Chart */}
            {energyHistory.length > 1 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                  Energy Trend
                </h4>
                <div className="flex items-end gap-1 h-8">
                  {energyHistory.slice(-10).map((energy, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 rounded-t ${
                        energy >= 80 ? 'bg-green-400' :
                        energy >= 60 ? 'bg-blue-400' :
                        energy >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      initial={{ height: 0 }}
                      animate={{ height: `${(energy / 100) * 100}%` }}
                      transition={{ delay: index * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-sm text-gray-400">
            Waiting for crowd analysis...
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrowdResponseSimulator;