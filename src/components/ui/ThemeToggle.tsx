import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
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

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]} 
        relative overflow-hidden rounded-xl
        bg-neutral-800/50 border border-neutral-700
        hover:bg-neutral-700/50 hover:border-neutral-600
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary-400/20
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {/* Background transition effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20"
        initial={{ x: theme === 'dark' ? '100%' : '-100%' }}
        animate={{ x: theme === 'dark' ? '100%' : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />

      {/* Icon container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'dark' ? (
            <Moon className={`${iconSizes[size]} text-primary-400`} />
          ) : (
            <Sun className={`${iconSizes[size]} text-yellow-500`} />
          )}
        </motion.div>
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow:
            theme === 'dark'
              ? '0 0 10px rgba(0, 212, 255, 0.2)'
              : '0 0 10px rgba(255, 193, 7, 0.2)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
