import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Settings, HelpCircle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const StudioPage: React.FC = () => {
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);

  const isSetActive = location.pathname.includes('/set');
  const isMatchActive = location.pathname.includes('/match');

  // If we're on the main studio route, redirect to match (most popular)
  if (location.pathname === ROUTES.STUDIO) {
    return <Navigate to={ROUTES.STUDIO_MATCH} replace />;
  }

  return (
    <div className="min-h-screen bg-club-gradient">
      {/* Header */}
      <div className="sticky top-16 z-40 glass-card border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center space-y-6">
            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold gradient-text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Magic Studio
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-gray-300 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Feel the crowd, react in real time, and flow between creation and
              performance—with AI speed and human style
            </motion.p>

            {/* Tab Navigation */}
            <motion.div
              className="flex flex-col items-center space-y-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center mb-4">
                <p className="text-lg text-white font-semibold mb-2">
                  What&apos;s your situation right now?
                </p>
                <p className="text-sm text-gray-400">
                  Choose the approach that fits your current needs
                </p>
              </div>

              <div className="glass-card rounded-2xl p-2 border border-white/20 relative">
                {/* Active tab background */}
                <motion.div
                  className={`absolute top-2 h-16 rounded-xl ${
                    isMatchActive
                      ? 'bg-gradient-to-r from-electric-blue to-bright-turquoise shadow-lg shadow-electric-blue/25'
                      : 'bg-gradient-to-r from-laser-pink to-electric-blue shadow-lg shadow-laser-pink/25'
                  }`}
                  initial={false}
                  animate={{
                    x: isMatchActive ? 0 : '100%',
                    width: '50%',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />

                <div className="flex space-x-2 relative z-10">
                  <Link
                    to={ROUTES.STUDIO_MATCH}
                    className={`relative px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 ${
                      isMatchActive
                        ? 'text-rich-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                    <div className="flex flex-col items-start">
                      <span className="text-base">🎯 Read the Room</span>
                      <span className="text-xs opacity-75 font-normal">
                        I need to adapt to the crowd
                      </span>
                    </div>
                  </Link>

                  <Link
                    to={ROUTES.STUDIO_SET}
                    className={`relative px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-3 ${
                      isSetActive
                        ? 'text-rich-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <div className="flex flex-col items-start">
                      <span className="text-base">🎵 Plan My Set</span>
                      <span className="text-xs opacity-75 font-normal">
                        I know what I want to play
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Context Descriptions */}
            <motion.div
              className="text-center max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isMatchActive && (
                <motion.div
                  key="match-description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-400 text-sm glass-card rounded-lg p-4"
                >
                  <div className="text-electric-blue font-semibold mb-2">
                    ✨ Most Popular Choice
                  </div>
                  <strong className="text-gray-300">Perfect for:</strong> Live
                  events, parties, reading crowd energy, adapting to the vibe.
                  Just point your phone and get instant playlists.
                </motion.div>
              )}
              {isSetActive && (
                <motion.div
                  key="set-description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-400 text-sm glass-card rounded-lg p-4"
                >
                  <div className="text-laser-pink font-semibold mb-2">
                    🎨 For Planned Performances
                  </div>
                  <strong className="text-gray-300">Perfect for:</strong>{' '}
                  Curated experiences, specific themes, wedding playlists,
                  podcast mixes. Full creative control.
                </motion.div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: isMatchActive ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isMatchActive ? -20 : 20 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-rich-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowHelp(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 gradient-text">
              Magic Studio Help
            </h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <strong className="text-white">Magic Match:</strong> Point your
                device at the crowd, let AI analyze the energy, and get instant
                playlist recommendations.
              </div>
              <div>
                <strong className="text-white">Magic Set:</strong> Create custom
                playlists with AI assistance, manual curation, and fine-tuning
                controls.
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="club-button w-full mt-6"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StudioPage;
