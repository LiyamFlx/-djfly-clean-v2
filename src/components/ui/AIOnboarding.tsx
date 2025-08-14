import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Music, Users, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  interactive?: boolean;
  demoAction?: () => void;
}

const AIOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    experience: '',
    genres: [] as string[],
    useCase: '',
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to the Future of DJing',
      description:
        'AI that reads any room and creates perfect playlists in seconds. Let me show you how it works.',
      icon: Brain,
    },
    {
      id: 'experience',
      title: 'Tell Me About Yourself',
      description:
        'Are you a professional DJ, hobbyist, or just love great music?',
      icon: Users,
      interactive: true,
    },
    {
      id: 'demo-magic-match',
      title: 'Magic Match Demo',
      description:
        'Watch me analyze a crowd and generate the perfect playlist.',
      icon: Zap,
      demoAction: () => {
        // Trigger demo Magic Match flow
      },
    },
    {
      id: 'demo-magic-set',
      title: 'Magic Set Demo',
      description: 'See how I create playlists from text descriptions.',
      icon: Sparkles,
      demoAction: () => {
        // Trigger demo Magic Set flow
      },
    },
    {
      id: 'ready',
      title: "You're Ready to Rock!",
      description: 'Choose your first adventure and let the AI magic begin.',
      icon: Music,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('djfly-onboarding-completed', 'true');
    // Close onboarding
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-2xl w-full relative overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-bright-turquoise/5 rounded-full blur-3xl"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative z-10">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Skip intro
              </button>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-electric-blue to-bright-turquoise h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-electric-blue to-bright-turquoise rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                {React.createElement(steps[currentStep].icon, {
                  className: 'w-10 h-10 text-white',
                })}
              </motion.div>

              {/* Content */}
              <h2 className="text-3xl font-bold text-white mb-4">
                {steps[currentStep].title}
              </h2>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {steps[currentStep].description}
              </p>

              {/* Interactive Elements */}
              {steps[currentStep].interactive && currentStep === 1 && (
                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-3 gap-4">
                    {['Professional DJ', 'Hobbyist', 'Music Lover'].map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() =>
                            setUserPreferences({
                              ...userPreferences,
                              experience: option,
                            })
                          }
                          className={`p-4 rounded-lg border-2 transition-all ${
                            userPreferences.experience === option
                              ? 'border-electric-blue bg-electric-blue/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-sm font-medium text-white">
                            {option}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Demo Actions */}
              {steps[currentStep].demoAction && (
                <button
                  onClick={steps[currentStep].demoAction}
                  className="btn-primary px-8 py-3 mb-6"
                >
                  Try Demo
                </button>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4">
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="btn-hero flex items-center gap-3"
                    disabled={
                      steps[currentStep].interactive &&
                      !userPreferences.experience
                    }
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSkip}
                    className="btn-hero flex items-center gap-3"
                  >
                    Start Creating
                    <Sparkles className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AIOnboarding;
