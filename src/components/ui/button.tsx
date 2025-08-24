import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <motion.div
    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  />
);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };

  const baseClasses = 'btn';
  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={combinedClasses}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      whileHover={!isDisabled ? { 
        scale: 1.02,
        y: -2,
      } : {}}
      transition={{ 
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      {...props}
    >
      {/* Enhanced background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      {/* Content container */}
      <motion.span 
        className="flex items-center justify-center gap-2 relative z-10"
        animate={loading ? { opacity: [1, 0.7, 1] } : {}}
        transition={{ duration: 1.5, repeat: loading ? Infinity : 0 }}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          Icon && iconPosition === 'left' && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <Icon className="w-4 h-4" />
            </motion.div>
          )
        )}
        <motion.span 
          className="font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.span>
        {!loading && Icon && iconPosition === 'right' && (
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3, type: "spring", delay: 0.1 }}
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
      </motion.span>

      {/* Enhanced focus ring */}
      <motion.div
        className="absolute inset-0 rounded-xl ring-2 ring-neon-purple/0 ring-offset-2 ring-offset-pure-black"
        initial={{ opacity: 0 }}
        whileFocus={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default Button;
