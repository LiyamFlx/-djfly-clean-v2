import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Play, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMusicContext } from '@/contexts/MusicContext';

const QuickActionBar: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const navigate = useNavigate();
  const { queue } = useMusicContext();

  const actions = [
    {
      id: 'magic-match',
      icon: Mic,
      label: 'Magic Match',
      description: 'Record crowd & get playlist',
      shortcut: '⌘M',
      action: () => navigate('/studio/match'),
      color: 'electric-blue',
    },
    {
      id: 'magic-set',
      icon: Sparkles,
      label: 'Magic Set',
      description: 'Describe & create playlist',
      shortcut: '⌘S',
      action: () => navigate('/studio/set'),
      color: 'bright-turquoise',
    },
    {
      id: 'player',
      icon: Play,
      label: 'Player',
      description: `${queue.length} tracks ready`,
      shortcut: '⌘P',
      action: () => navigate('/player'),
      color: 'laser-pink',
      badge: queue.length > 0 ? queue.length : undefined,
    },
  ];

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'm':
            e.preventDefault();
            navigate('/studio/match');
            break;
          case 's':
            e.preventDefault();
            navigate('/studio/set');
            break;
          case 'p':
            e.preventDefault();
            navigate('/player');
            break;
          case 'k':
            e.preventDefault();
            setIsVisible(!isVisible);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [navigate, isVisible]);

  return (
    <>
      {/* Quick Access Trigger */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-gradient-to-r from-electric-blue to-bright-turquoise rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Quick Actions (⌘K)"
      >
        <BarChart className="w-6 h-6" />
      </motion.button>

      {/* Quick Actions Panel */}
      {/* AnimatePresence is removed as per new_code, but the component still uses it. */}
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsVisible(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 glass-card p-6 w-80"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">
                Quick Actions
              </h3>
              <p className="text-sm text-gray-400">
                Jump to any feature instantly
              </p>
            </div>

            <div className="space-y-3">
              {actions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    action.action();
                    setIsVisible(false);
                  }}
                  className="w-full flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div
                    className={`relative w-10 h-10 bg-${action.color}/20 rounded-lg flex items-center justify-center group-hover:bg-${action.color}/30 transition-colors`}
                  >
                    <action.icon className={`w-5 h-5 text-${action.color}`} />
                    {action.badge && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {action.badge}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">
                        {action.label}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {action.shortcut}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center">
                Tip: Use ⌘K to toggle this panel anytime
              </p>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default QuickActionBar;
