import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} 
        relative overflow-hidden rounded-xl
        bg-neutral-800/50 border border-neutral-700
        hover:bg-neutral-700/50 hover:border-neutral-600
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-neon-purple/80 focus:ring-offset-2 focus:ring-offset-pure-black
        group
        ${className}
      `}
      whileHover={{ 
        scale: 1.05,
        y: -2,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {/* Enhanced background transition effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 via-neon-green/20 to-neon-purple/20"
        initial={{ x: theme === 'dark' ? '100%' : '-100%' }}
        animate={{ x: theme === 'dark' ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Enhanced glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow:
            theme === 'dark'
              ? '0 0 20px rgba(157, 78, 221, 0.4), inset 0 0 20px rgba(157, 78, 221, 0.1)'
              : '0 0 20px rgba(255, 193, 7, 0.4), inset 0 0 20px rgba(255, 193, 7, 0.1)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Icon container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: 0.4, 
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            className="relative"
          >
            {theme === 'dark' ? (
              <Moon className={`${iconSizes[size]} text-neon-purple`} />
            ) : (
              <Sun className={`${iconSizes[size]} text-yellow-500`} />
            )}
            
            {/* Icon glow effect */}
            <motion.div
              className={`absolute inset-0 rounded-full ${
                theme === 'dark' ? 'bg-neon-purple/20' : 'bg-yellow-500/20'
              }`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced hover effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Particle effect on theme change */}
      <AnimatePresence>
        {theme === 'dark' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-neon-purple rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${50 + (Math.cos(i * 60 * Math.PI / 180) * 30)}%`,
                  y: `${50 + (Math.sin(i * 60 * Math.PI / 180) * 30)}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Enhanced theme toggle with label
export const ThemeToggleWithLabel: React.FC<ThemeToggleProps> = (props) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-3 group">
      <ThemeToggle {...props} />
      {props.showLabel && (
        <motion.span
          className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </motion.span>
      )}
    </div>
  );
};

// Enhanced theme toggle with enhanced visual feedback
export const EnhancedThemeToggle: React.FC<ThemeToggleProps> = (props) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative">
      <ThemeToggle {...props} />
      
      {/* Enhanced background glow */}
      <motion.div
        className="absolute inset-0 rounded-xl -z-10"
        animate={{
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgba(157, 78, 221, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 193, 7, 0.1) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Floating particles */}
      <AnimatePresence>
        {theme === 'dark' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-neon-purple rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                }}
                animate={{
                  x: `${50 + (Math.cos(i * 120 * Math.PI / 180) * 20)}%`,
                  y: `${50 + (Math.sin(i * 120 * Math.PI / 180) * 20)}%`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
