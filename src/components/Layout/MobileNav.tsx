import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Sparkles, Play, BarChart, User, X, Music, Mic, Zap, Star } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface MobileNavProps {
  className?: string;
}

const MobileNav: React.FC<MobileNavProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      path: ROUTES.HOME, 
      icon: Home, 
      label: 'Home', 
      color: 'text-blue-400',
      description: 'Welcome & Overview'
    },
    {
      path: ROUTES.STUDIO,
      icon: Sparkles,
      label: 'Studio',
      color: 'text-purple-400',
      description: 'Create AI Playlists',
      badge: 'Start Here'
    },
    {
      path: ROUTES.PLAYER,
      icon: Play,
      label: 'Player',
      color: 'text-green-400',
      description: 'Play & Mix Tracks'
    },
    {
      path: ROUTES.PRODUCER,
      icon: BarChart,
      label: 'Analytics',
      color: 'text-orange-400',
      description: 'Track Performance'
    },
    {
      path: ROUTES.PROFILE,
      icon: User,
      label: 'Profile',
      color: 'text-pink-400',
      description: 'Settings & Stats'
    },
  ];

  const quickActions = [
    {
      label: 'Magic Match',
      description: 'Record crowd & get playlist',
      icon: Mic,
      action: () => {
        setIsOpen(false);
        navigate('/studio/match');
      },
      gradient: 'from-electric-blue to-bright-turquoise'
    },
    {
      label: 'Magic Set', 
      description: 'Describe vibe & create mix',
      icon: Sparkles,
      action: () => {
        setIsOpen(false);
        navigate('/studio/set');
      },
      gradient: 'from-bright-turquoise to-laser-pink'
    },
    {
      label: 'Quick Play',
      description: 'Start mixing immediately',
      icon: Zap,
      action: () => {
        setIsOpen(false);
        navigate('/player');
      },
      gradient: 'from-laser-pink to-purple-600'
    }
  ];

  const currentItem = navItems.find(
    (item) =>
      location.pathname === item.path ||
      (item.path !== ROUTES.HOME && location.pathname.startsWith(item.path))
  );

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-electric-blue to-bright-turquoise rounded-full shadow-lg flex items-center justify-center text-rich-black font-bold ${
          isOpen ? 'rotate-45' : ''
        } transition-all duration-300 hover:scale-110 active:scale-95`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Music className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Slide-up Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl p-6"
              style={{
                paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
              }}
            >
              {/* Current Page Indicator */}
              {currentItem && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-6"
                >
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 ${currentItem.color}`}
                  >
                    <currentItem.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Currently: {currentItem.label}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions - Priority Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Quick Start
                </h3>
                <div className="grid gap-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={action.action}
                      className={`group w-full p-4 rounded-2xl bg-gradient-to-r ${action.gradient} bg-opacity-20 border border-white/20 hover:bg-opacity-30 transition-all duration-300 text-left`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white group-hover:text-bright-turquoise transition-colors">
                            {action.label}
                          </div>
                          <div className="text-sm text-gray-300">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Navigation Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                  Navigation
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {navItems.map((item, index) => {
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== ROUTES.HOME &&
                        location.pathname.startsWith(item.path));

                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`relative block p-3 rounded-xl transition-all duration-300 group ${
                            isActive
                              ? 'bg-gradient-to-r from-electric-blue/20 to-bright-turquoise/20 border border-electric-blue/40'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                          }`}
                        >
                          {item.badge && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-black px-2 py-0.5 rounded-full">
                              {item.badge}
                            </div>
                          )}
                          <div className="text-center">
                            <div
                              className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                                isActive
                                  ? 'bg-gradient-to-r from-electric-blue to-bright-turquoise'
                                  : 'bg-white/10 group-hover:bg-white/20'
                              }`}
                            >
                              <item.icon
                                className={`w-5 h-5 ${isActive ? 'text-rich-black' : item.color}`}
                              />
                            </div>
                            <div
                              className={`text-xs font-medium mb-1 ${isActive ? 'text-electric-blue' : 'text-gray-300'}`}
                            >
                              {item.label}
                            </div>
                            <div className="text-xs text-gray-400 leading-tight">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Help & Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 pt-4 border-t border-white/10 text-center"
              >
                <p className="text-xs text-gray-400 mb-2">
                  New to DJfly? Start with <span className="text-bright-turquoise font-semibold">Magic Match</span> or <span className="text-laser-pink font-semibold">Magic Set</span>
                </p>
                <Link 
                  to="/support/help" 
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Need help? View guide →
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
