import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EnhancedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: 'default' | 'glass' | 'neon' | 'feature' | 'interactive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'top' | 'left' | 'right';
  iconColor?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  glow?: boolean;
  border?: boolean;
  shadow?: boolean;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconPosition = 'top',
  iconColor = 'neon-purple',
  title,
  subtitle,
  children,
  className = '',
  onClick,
  loading = false,
  disabled = false,
  glow = false,
  border = true,
  shadow = true,
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const variantClasses = {
    default: 'bg-rich-black border-gray-800',
    glass: 'glass-card',
    neon: 'neon-card',
    feature: 'feature-card',
    interactive: 'glass-card cursor-pointer hover:scale-105',
  };

  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const iconPositionClasses = {
    top: 'flex-col text-center',
    left: 'flex-row text-left',
    right: 'flex-row-reverse text-right',
  };

  const isInteractive = onClick && !disabled && !loading;
  const cardVariant = variant === 'interactive' ? 'glass' : variant;

  return (
    <motion.div
      className={`
        ${variantClasses[cardVariant]}
        ${sizeClasses[size]}
        ${border ? 'border' : ''}
        ${shadow ? 'shadow-lg' : ''}
        ${glow ? 'shadow-neon-purple-soft' : ''}
        ${isInteractive ? 'hover:shadow-2xl' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${loading ? 'animate-pulse' : ''}
        transition-all duration-300 ease-out
        ${className}
      `}
      whileHover={isInteractive ? { 
        y: -4,
        scale: 1.02,
      } : {}}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
      onClick={isInteractive ? onClick : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      {...props}
    >
      {/* Enhanced background glow effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-green/5 rounded-2xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Icon section */}
      {Icon && (
        <motion.div
          className={`flex items-center gap-4 ${iconPositionClasses[iconPosition]} mb-4`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <motion.div
            className={`${iconSizeClasses[size]} rounded-full bg-${iconColor}/10 border border-${iconColor}/20 flex items-center justify-center relative overflow-hidden`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {/* Icon background glow */}
            <motion.div
              className={`absolute inset-0 bg-${iconColor}/20 rounded-full`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            <Icon className={`${iconSizeClasses[size].replace('w-', 'w-').replace('h-', 'h-')} text-${iconColor}`} />
          </motion.div>
          
          {(title || subtitle) && (
            <div className="flex-1">
              {title && (
                <motion.h3 
                  className="text-lg font-semibold text-white mb-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {title}
                </motion.h3>
              )}
              {subtitle && (
                <motion.p 
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Title and subtitle (when icon is not present) */}
      {!Icon && (title || subtitle) && (
        <motion.div className="mb-4">
          {title && (
            <motion.h3 
              className="text-xl font-semibold text-white mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {title}
            </motion.h3>
          )}
          {subtitle && (
            <motion.p 
              className="text-base text-gray-400 leading-relaxed"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Loading overlay */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-rich-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* Enhanced hover effect */}
      {isInteractive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 rounded-2xl"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
};

// Specialized card variants
export const GlassCard: React.FC<Omit<EnhancedCardProps, 'variant'> & { variant?: never }> = (props) => (
  <EnhancedCard {...props} variant="glass" />
);

export const NeonCard: React.FC<Omit<EnhancedCardProps, 'variant'> & { variant?: never }> = (props) => (
  <EnhancedCard {...props} variant="neon" />
);

export const FeatureCard: React.FC<Omit<EnhancedCardProps, 'variant'> & { variant?: never }> = (props) => (
  <EnhancedCard {...props} variant="feature" />
);

export const InteractiveCard: React.FC<Omit<EnhancedCardProps, 'variant'> & { variant?: never }> = (props) => (
  <EnhancedCard {...props} variant="interactive" />
);

// Card grid component
interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = 3,
  gap = 'lg',
  className = '',
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  return (
    <motion.div
      className={`grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default EnhancedCard;
