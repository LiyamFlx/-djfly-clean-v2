/**
 * Guest Session Timer Component  
 * Shows remaining time and upgrade prompts for guest users
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, X, Plus } from 'lucide-react';
import { useGuestSession } from '@/store/authStore';

interface GuestTimerProps {
  onUpgrade?: () => void;
  onExtend?: () => void;
  className?: string;
}

const GuestTimer: React.FC<GuestTimerProps> = ({ 
  onUpgrade, 
  onExtend,
  className = '' 
}) => {
  const { 
    isGuestMode, 
    guestTimeRemaining, 
    timeRemainingFormatted, 
    isTimeRunningLow,
    canExtendSession,
    extendGuestSession
  } = useGuestSession();

  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [hasShownLowTimeWarning, setHasShownLowTimeWarning] = useState(false);

  // Show upgrade prompt when time is running low
  useEffect(() => {
    if (isTimeRunningLow && !hasShownLowTimeWarning && isGuestMode) {
      setShowUpgradePrompt(true);
      setHasShownLowTimeWarning(true);
    }
  }, [isTimeRunningLow, hasShownLowTimeWarning, isGuestMode]);

  if (!isGuestMode) return null;

  const handleExtendSession = () => {
    extendGuestSession();
    onExtend?.();
    setShowUpgradePrompt(false);
  };

  const progressPercentage = Math.max(0, (guestTimeRemaining / (10 * 60)) * 100);
  const isUrgent = guestTimeRemaining < 60; // Last minute
  const isWarning = guestTimeRemaining < 120; // Last 2 minutes

  return (
    <>
      {/* Timer Display */}
      <motion.div 
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          isUrgent 
            ? 'bg-red-900/50 text-red-300 border border-red-600/30' 
            : isWarning
            ? 'bg-amber-900/50 text-amber-300 border border-amber-600/30'
            : 'bg-blue-900/50 text-blue-300 border border-blue-600/30'
        } ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Clock className={`w-4 h-4 ${isUrgent ? 'animate-pulse' : ''}`} />
        <span>{timeRemainingFormatted}</span>
        {isWarning && (
          <button
            onClick={() => setShowUpgradePrompt(true)}
            className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors"
          >
            <Zap className="w-3 h-3" />
          </button>
        )}
      </motion.div>

      {/* Progress Bar (for urgent timing) */}
      {isWarning && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-gray-900 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className={`h-full ${isUrgent ? 'bg-red-500' : 'bg-amber-500'}`}
            initial={{ width: '100%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}

      {/* Upgrade Prompt Modal */}
      <AnimatePresence>
        {showUpgradePrompt && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {isUrgent ? 'Session Ending Soon!' : 'Time Running Low'}
                </h3>
                <button
                  onClick={() => setShowUpgradePrompt(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    isUrgent ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {timeRemainingFormatted}
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    remaining in your demo session
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {/* Primary CTA - Upgrade */}
                  <button
                    onClick={onUpgrade}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Unlock Full Access
                  </button>

                  {/* Secondary CTA - Extend (if available) */}
                  {canExtendSession && (
                    <button
                      onClick={handleExtendSession}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Extend Demo (+5 min)
                    </button>
                  )}

                  {/* Continue Demo */}
                  <button
                    onClick={() => setShowUpgradePrompt(false)}
                    className="w-full text-gray-400 hover:text-white transition-colors py-2"
                  >
                    Continue Demo
                  </button>
                </div>

                {/* Benefits Preview */}
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-600/20 rounded-lg p-3 mt-4">
                  <h4 className="text-green-400 font-medium text-sm mb-2">
                    Unlock with Account:
                  </h4>
                  <ul className="text-xs text-green-200 space-y-1">
                    <li>• Unlimited session time</li>
                    <li>• Access 70+ million Spotify tracks</li>
                    <li>• Save and organize your sets</li>
                    <li>• AI-powered recommendations</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuestTimer;