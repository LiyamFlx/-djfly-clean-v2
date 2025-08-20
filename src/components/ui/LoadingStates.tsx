import React from 'react';
import { motion } from 'framer-motion';
import { Music, Brain, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  _color?: string; // Prefix with underscore to indicate unused
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'neon-purple',
  message = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-2 border-dark-gray border-t-neon-purple rounded-full`}
      />
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-300 text-sm animate-pulse"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  lines = 3,
}) => {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="space-y-4">
        <div className="h-4 loading-shimmer rounded w-3/4"></div>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 loading-shimmer rounded w-full"></div>
        ))}
      </div>
    </div>
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
    },
    analyzing: {
      icon: Brain,
      message: 'Analyzing audio patterns...',
      color: 'text-purple-400',
    },
    generating: {
      icon: Sparkles,
      message: 'Generating perfect playlist...',
      color: 'text-green-400',
    },
    complete: {
      icon: Music,
      message: 'Ready to mix!',
      color: 'text-electric-blue',
    },
  };

  const currentStage = stages[stage];
  const Icon = currentStage.icon;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Animated Icon */}
      <motion.div
        animate={stage === 'recording' ? { scale: [1, 1.1, 1] } : {}}
        transition={{
          duration: 2,
          repeat: stage === 'recording' ? Infinity : 0,
        }}
        className={`${currentStage.color}`}
      >
        <Icon className="w-16 h-16" />
      </motion.div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full max-w-md">
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-electric-blue to-bright-turquoise"
            />
          </div>
          <p className="text-center text-sm text-gray-400 mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}

      {/* Stage Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          {currentStage.message}
        </h3>
        <p className="text-gray-400 text-sm">
          {stage === 'recording' && 'Capturing crowd energy levels...'}
          {stage === 'analyzing' && 'Processing audio data with AI...'}
          {stage === 'generating' && 'Creating the perfect mix...'}
          {stage === 'complete' && 'Your AI-powered set is ready!'}
        </p>
      </motion.div>

      {/* Animated Dots */}
      {stage !== 'complete' && (
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-electric-blue rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface TrackSkeletonProps {
  count?: number;
}

export const TrackSkeleton: React.FC<TrackSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg"
        >
          <div className="w-12 h-12 bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
        </motion.div>
      ))}
    </div>
  );
};

interface WaveformSkeletonProps {
  bars?: number;
}

export const WaveformSkeleton: React.FC<WaveformSkeletonProps> = ({
  bars = 50,
}) => {
  return (
    <div className="flex items-end space-x-1 h-20">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: [20, 60, 20] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.05,
          }}
          className="w-1 bg-gradient-to-t from-electric-blue to-bright-turquoise rounded-full"
          style={{ height: `${Math.random() * 40 + 20}px` }}
        />
      ))}
    </div>
  );
};

export default LoadingSpinner;
