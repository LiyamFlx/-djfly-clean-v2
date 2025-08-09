import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Music, Zap } from 'lucide-react';

interface SmartLoaderProps {
  isLoading: boolean;
  stage?: 'analyzing' | 'generating' | 'matching' | 'finalizing';
  progress?: number; // 0-100
  message?: string;
  className?: string;
}

const SmartLoader: React.FC<SmartLoaderProps> = ({
  isLoading,
  stage = 'analyzing',
  progress = 0,
  message,
  className = ''
}) => {
  const [currentMessage, setCurrentMessage] = useState(message || '');

  const stageConfig = {
    analyzing: {
      icon: Loader2,
      color: 'text-electric-blue',
      bgColor: 'bg-electric-blue',
      messages: ['Analyzing your request...', 'Reading the vibe...', 'Understanding preferences...']
    },
    generating: {
      icon: Sparkles,
      color: 'text-bright-turquoise', 
      bgColor: 'bg-bright-turquoise',
      messages: ['Generating playlist...', 'Selecting perfect tracks...', 'AI is working magic...']
    },
    matching: {
      icon: Music,
      color: 'text-laser-pink',
      bgColor: 'bg-laser-pink', 
      messages: ['Matching energy levels...', 'Finding perfect flow...', 'Optimizing transitions...']
    },
    finalizing: {
      icon: Zap,
      color: 'text-green-400',
      bgColor: 'bg-green-400',
      messages: ['Finalizing your set...', 'Adding mixing tips...', 'Almost ready!']
    }
  };

  const config = stageConfig[stage];
  const Icon = config.icon;

  useEffect(() => {
    if (!message && isLoading) {
      const messages = config.messages;
      let index = 0;
      
      const interval = setInterval(() => {
        setCurrentMessage(messages[index % messages.length]);
        index++;
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLoading, stage, message, config.messages]);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}
      >
        <motion.div
          className="glass-card p-8 max-w-md w-full mx-4 text-center"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          {/* Animated Icon */}
          <div className={`w-16 h-16 mx-auto mb-6 ${config.color}`}>
            <Icon 
              className="w-full h-full animate-spin" 
              style={{ animationDuration: stage === 'analyzing' ? '2s' : '1.5s' }}
            />
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <motion.div
                className={`h-2 rounded-full ${config.bgColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          )}

          {/* Dynamic Message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg font-medium text-white mb-2"
            >
              {message || currentMessage}
            </motion.p>
          </AnimatePresence>

          {/* Stage Indicator */}
          <p className={`text-sm ${config.color} capitalize`}>
            {stage.replace('_', ' ')} • AI Working
          </p>

          {/* Accessibility */}
          <div className="sr-only" role="status" aria-live="polite">
            {currentMessage}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SmartLoader;