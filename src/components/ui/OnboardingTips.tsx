import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, ArrowRight, Check } from 'lucide-react';

interface Tip {
  id: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingTipsProps {
  tips: Tip[];
  page: string;
  onComplete?: () => void;
}

const OnboardingTips: React.FC<OnboardingTipsProps> = ({ tips, page, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [completedPages, setCompletedPages] = useState<string[]>([]);

  useEffect(() => {
    // Check if user has seen tips for this page
    const seenPages = JSON.parse(localStorage.getItem('djfly-onboarding-seen') || '[]');
    setCompletedPages(seenPages);
    
    if (!seenPages.includes(page) && tips.length > 0) {
      // Show tips after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [page, tips.length]);

  const handleNext = () => {
    if (currentTipIndex < tips.length - 1) {
      setCurrentTipIndex(currentTipIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    const seenPages = [...completedPages, page];
    setCompletedPages(seenPages);
    localStorage.setItem('djfly-onboarding-seen', JSON.stringify(seenPages));
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible || tips.length === 0) return null;

  const currentTip = tips[currentTipIndex];
  const isLastTip = currentTipIndex === tips.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-card p-6 max-w-md w-full border border-bright-turquoise/30"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bright-turquoise/20 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-bright-turquoise" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{currentTip.title}</h3>
                <p className="text-sm text-gray-400">
                  Tip {currentTipIndex + 1} of {tips.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentTipIndex + 1) / tips.length) * 100}%` }}
              className="bg-gradient-to-r from-bright-turquoise to-electric-blue h-2 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Tip Content */}
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed">
              {currentTip.description}
            </p>
          </div>

          {/* Action Button */}
          {currentTip.action && (
            <button
              onClick={currentTip.action.onClick}
              className="w-full mb-4 btn-secondary py-3 text-sm"
            >
              {currentTip.action.label}
            </button>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Skip tips
            </button>
            
            <div className="flex items-center gap-2">
              {currentTipIndex > 0 && (
                <button
                  onClick={() => setCurrentTipIndex(currentTipIndex - 1)}
                  className="text-gray-400 hover:text-white transition-colors text-sm px-3 py-1"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
              >
                {isLastTip ? (
                  <>
                    <Check className="w-4 h-4" />
                    Got it!
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTips;