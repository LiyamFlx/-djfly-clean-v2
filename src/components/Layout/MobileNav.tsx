import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Sparkles,
  Play,
  BarChart,
  User,
  X,
  Music,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface MobileNavProps {
  className?: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: ROUTES.HOME, icon: Home, label: 'Home', color: 'text-blue-400' },
    { path: ROUTES.STUDIO, icon: Sparkles, label: 'Studio', color: 'text-purple-400' },
    { path: ROUTES.PLAYER, icon: Play, label: 'Player', color: 'text-green-400' },
    { path: ROUTES.PRODUCER, icon: BarChart, label: 'Analytics', color: 'text-orange-400' },
    { path: ROUTES.PROFILE, icon: User, label: 'Profile', color: 'text-pink-400' },
  ];

  const currentItem = navItems.find(item => 
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
              style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
            >
              {/* Current Page Indicator */}
              {currentItem && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-6"
                >
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 ${currentItem.color}`}>
                    <currentItem.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">Currently: {currentItem.label}</span>
                  </div>
                </motion.div>
              )}

              {/* Navigation Items */}
              <div className="grid grid-cols-2 gap-4">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path || 
                    (item.path !== ROUTES.HOME && location.pathname.startsWith(item.path));

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block p-4 rounded-2xl transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-electric-blue/20 to-bright-turquoise/20 border border-electric-blue/30'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                            isActive ? 'bg-gradient-to-r from-electric-blue to-bright-turquoise' : 'bg-white/10'
                          }`}>
                            <item.icon className={`w-6 h-6 ${isActive ? 'text-rich-black' : item.color}`} />
                          </div>
                          <span className={`text-sm font-medium ${isActive ? 'text-electric-blue' : 'text-gray-300'}`}>
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <div className="flex justify-center gap-4">
                  <button className="px-4 py-2 bg-gradient-to-r from-laser-pink to-purple-600 rounded-full text-white text-sm font-medium">
                    🎵 Quick Mix
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white text-sm font-medium">
                    🎯 AI Match
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
