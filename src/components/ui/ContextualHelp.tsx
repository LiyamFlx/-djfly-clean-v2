import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ArrowRight, CheckCircle } from 'lucide-react';

interface HelpStep {
  id: string;
  title: string;
  description: string;
  element?: string; // CSS selector to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface ContextualHelpProps {
  steps: HelpStep[];
  isVisible: boolean;
  onComplete: () => void;
  onDismiss: () => void;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({
  steps,
  isVisible,
  onComplete,
  onDismiss,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(
    null
  );

  useEffect(() => {
    if (isVisible && steps[currentStep]?.element) {
      const element = document.querySelector(steps[currentStep].element);
      setHighlightedElement(element);

      // Scroll element into view smoothly
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible || steps.length === 0) return null;

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Highlight Overlay */}
        {highlightedElement && (
          <div
            className="absolute border-4 border-electric-blue rounded-lg pointer-events-none"
            style={{
              top: highlightedElement.getBoundingClientRect().top - 8,
              left: highlightedElement.getBoundingClientRect().left - 8,
              width: highlightedElement.getBoundingClientRect().width + 16,
              height: highlightedElement.getBoundingClientRect().height + 16,
              zIndex: 51,
            }}
          />
        )}

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card p-6 max-w-md w-full relative z-52"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-electric-blue/20 rounded-full flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-electric-blue" />
              </div>
              <span className="text-sm text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <motion.div
              className="bg-electric-blue h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              {currentStepData.title}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-electric-blue' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4" />
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

          {/* Skip Option */}
          <button
            onClick={onDismiss}
            className="w-full mt-4 text-center text-gray-400 hover:text-white text-sm transition-colors"
          >
            Skip tutorial
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Preset help flows for different pages
export const HELP_FLOWS = {
  studio: [
    {
      id: 'welcome',
      title: 'Welcome to Magic Studio!',
      description:
        'This is where AI creates perfect playlists. Choose your path below.',
    },
    {
      id: 'magic-match',
      title: 'Magic Match - For Live Events',
      description:
        'Record crowd noise to instantly get a playlist that matches the energy and vibe.',
      element: '[data-help="magic-match"]',
    },
    {
      id: 'magic-set',
      title: 'Magic Set - Describe Your Vision',
      description:
        'Tell AI what you want in words and get a curated playlist with perfect flow.',
      element: '[data-help="magic-set"]',
    },
  ],
  magicMatch: [
    {
      id: 'record-intro',
      title: 'Record the Room',
      description:
        'Click to record 5 seconds of crowd noise. AI will analyze energy, mood, and preferences.',
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description:
        'Our AI reads the crowd energy and generates the perfect playlist automatically.',
    },
    {
      id: 'results',
      title: 'Your Perfect Playlist',
      description:
        'Review your AI-generated tracks and click "Go to Player" to start mixing!',
    },
  ],
};

export default ContextualHelp;
