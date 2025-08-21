import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Play,
  User,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { useMusicContext } from '@/contexts/MusicContext';

const PersistentNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { queue, currentTrack, isPlaying } = useMusicContext();

  // Don't show on auth pages
  if (location.pathname.startsWith('/auth')) return null;

  const getCurrentStep = () => {
    const path = location.pathname;
    if (path === '/') return 1;
    if (
      path.startsWith('/studio') &&
      !path.includes('/match') &&
      !path.includes('/set')
    )
      return 2;
    if (path.includes('/match') || path.includes('/set')) return 3;
    if (path === '/player') return 4;
    return 1;
  };

  const currentStep = getCurrentStep();

  const steps = [
    {
      id: 1,
      label: 'Discover',
      icon: Home,
      path: '/',
      active: currentStep >= 1,
    },
    {
      id: 2,
      label: 'Choose',
      icon: Sparkles,
      path: '/studio',
      active: currentStep >= 2,
    },
    {
      id: 3,
      label: 'Create',
      icon:
        currentStep === 3 && location.pathname.includes('/match') ? User : FileText,
      path: location.pathname.includes('/match')
        ? '/studio/match'
        : '/studio/set',
      active: currentStep >= 3,
    },
    {
      id: 4,
      label: 'Play',
      icon: Play,
      path: '/player',
      active: currentStep >= 4,
      badge: queue.length,
    },
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-bright-turquoise rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DJ</span>
            </div>
            <span className="font-bold text-white text-lg">DJfly</span>
          </div>

          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-1">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => navigate(step.path)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    step.active
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{step.label}</span>
                  {step.badge && step.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {step.badge}
                    </span>
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-px ${step.active ? 'bg-electric-blue' : 'bg-gray-600'} transition-colors`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Current Status */}
          <div className="flex items-center gap-3">
            {currentTrack && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-gray-400'}`}
                />
                <span className="text-gray-300 max-w-32 truncate">
                  {currentTrack.title}
                </span>
              </div>
            )}

            {queue.length > 0 && (
              <button
                onClick={() => navigate('/player')}
                className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Play ({queue.length})</span>
                <span className="sm:hidden">{queue.length}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep} of 4
            </span>
            <span className="text-sm text-gray-400">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-electric-blue to-bright-turquoise h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersistentNavBar;
