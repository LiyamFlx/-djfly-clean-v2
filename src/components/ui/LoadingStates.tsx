import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Brain, Sparkles, Zap, Pulse } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  _color?: string; // Prefix with underscore to indicate unused
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  _color = 'neon-purple',
  message = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-2 border-dark-gray border-t-neon-purple rounded-full relative`}
      >
        {/* Enhanced glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-neon-purple/20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-300 text-sm font-medium"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  animated?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  lines = 3,
  animated = true,
}) => {
  return (
    <motion.div 
      className={`glass-card p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        <motion.div 
          className="h-4 loading-shimmer rounded w-3/4"
          animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className="h-3 loading-shimmer rounded w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            style={{
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface AIAnalysisLoadingProps {
  stage: 'recording' | 'analyzing' | 'generating' | 'complete';
  progress?: number;
}

export const AIAnalysisLoading: React.FC<AIAnalysisLoadingProps> = ({
  stage,
  progress = 0,
}) => {
  const stages = {
    recording: {
      icon: Music,
      message: 'Listening to crowd energy...',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      borderColor: 'border-blue-400/30',
    },
    analyzing: {
      icon: Brain,
      message: 'Analyzing audio patterns...',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      borderColor: 'border-purple-400/30',
    },
    generating: {
      icon: Sparkles,
      message: 'Generating perfect playlist...',
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      borderColor: 'border-green-400/30',
    },
    complete: {
      icon: Zap,
      message: 'Ready to mix!',
      color: 'text-electric-blue',
      bgColor: 'bg-electric-blue/20',
      borderColor: 'border-electric-blue/30',
    },
  };

  const currentStage = stages[stage];
  const Icon = currentStage.icon;

  return (
    <motion.div 
      className="flex flex-col items-center justify-center space-y-8 p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      {/* Enhanced Animated Icon Container */}
      <motion.div
        className={`relative p-6 rounded-full ${currentStage.bgColor} ${currentStage.borderColor} border-2`}
        animate={stage === 'recording' ? { 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        } : {
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: stage === 'recording' ? Infinity : Infinity,
          repeatDelay: 1,
        }}
      >
        {/* Background glow */}
        <motion.div
          className={`absolute inset-0 rounded-full ${currentStage.bgColor}`}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <motion.div
          className={`${currentStage.color} relative z-10`}
          animate={stage === 'analyzing' ? { 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            duration: 4,
            repeat: stage === 'analyzing' ? Infinity : 0,
            ease: "linear"
          }}
        >
          <Icon className="w-16 h-16" />
        </motion.div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      {progress > 0 && (
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-green/20 rounded-full" />
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-electric-blue via-neon-purple to-bright-turquoise relative"
            >
              {/* Progress bar glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-electric-blue/50 to-bright-turquoise/50"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
          <motion.p 
            className="text-center text-sm text-gray-400 mt-3 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}% complete
          </motion.p>
        </motion.div>
      )}

      {/* Enhanced Stage Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.h3 
          className="text-2xl font-bold text-white mb-3"
          animate={stage !== 'complete' ? { 
            scale: [1, 1.02, 1],
            color: [currentStage.color, 'text-white', currentStage.color]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {currentStage.message}
        </motion.h3>
        <motion.p 
          className="text-gray-400 text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {stage === 'recording' && 'Capturing crowd energy levels and audio patterns...'}
          {stage === 'analyzing' && 'Processing audio data with advanced AI algorithms...'}
          {stage === 'generating' && 'Creating the perfect mix based on analysis...'}
          {stage === 'complete' && 'Your AI-powered set is ready to rock the crowd!'}
        </motion.p>
      </motion.div>

      {/* Enhanced Animated Dots */}
      {stage !== 'complete' && (
        <motion.div 
          className="flex space-x-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 ${currentStage.bgColor} rounded-full`}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Success Animation for Complete Stage */}
      {stage === 'complete' && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mt-4"
        >
          <motion.div
            className="w-16 h-16 bg-neon-green/20 border-2 border-neon-green/40 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px rgba(171, 255, 79, 0.3)',
                '0 0 40px rgba(171, 255, 79, 0.6)',
                '0 0 20px rgba(171, 255, 79, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-8 h-8 text-neon-green" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

interface TrackSkeletonProps {
  count?: number;
  animated?: boolean;
}

export const TrackSkeleton: React.FC<TrackSkeletonProps> = ({ 
  count = 5, 
  animated = true 
}) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex items-center space-x-4 p-4 glass-card hover:scale-105 transition-transform duration-300"
        >
          <motion.div 
            className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse relative overflow-hidden"
            animate={animated ? { 
              background: [
                'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)',
                'linear-gradient(90deg, #4b5563 25%, #6b7280 50%, #4b5563 75%)',
                'linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="flex-1 space-y-3">
            <motion.div 
              className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"
              animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
            <motion.div 
              className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"
              animate={animated ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 + 0.2 }}
            />
          </div>
          <motion.div 
            className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"
            animate={animated ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        </motion.div>
      ))}
    </div>
  );
};

interface WaveformSkeletonProps {
  bars?: number;
  animated?: boolean;
}

export const WaveformSkeleton: React.FC<WaveformSkeletonProps> = ({
  bars = 50,
  animated = true,
}) => {
  return (
    <motion.div 
      className="flex items-end space-x-1 h-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-electric-blue to-bright-turquoise rounded-full relative overflow-hidden"
          style={{ height: `${Math.random() * 40 + 20}px` }}
          animate={animated ? { 
            height: [
              `${Math.random() * 40 + 20}px`,
              `${Math.random() * 60 + 30}px`,
              `${Math.random() * 40 + 20}px`
            ],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.05,
          }}
        >
          {/* Bar glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-neon-purple/50 to-transparent"
            animate={animated ? { opacity: [0, 1, 0] } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.05,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoadingSpinner;
