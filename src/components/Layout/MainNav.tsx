import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Play,
  BarChart,
  User,
  Menu,
  X,
  FileText,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import Button from '@/components/ui/button';

interface NavItemProps {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}

const navItems: NavItemProps[] = [
  { path: ROUTES.HOME, icon: Home, label: 'Home' },
  { path: ROUTES.STUDIO, icon: Sparkles, label: 'Studio' },
  { path: ROUTES.PLAYER, icon: Play, label: 'Player' },
  { path: ROUTES.PRODUCER, icon: BarChart, label: 'Analytics' },
  { path: '/docs', icon: FileText, label: 'Docs' },
  { path: ROUTES.PROFILE, icon: User, label: 'Profile' },
];

const NavItem: React.FC<NavItemProps> = React.memo(
  ({ path, icon: Icon, label, onClick }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = React.useMemo(
      () =>
        location.pathname === path ||
        (path !== ROUTES.HOME && location.pathname.startsWith(path)),
      [location.pathname, path]
    );

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onClick) {
        onClick();
      } else {
        navigate(path);
      }
    };

    return (
      <motion.button
        onClick={handleClick}
        className={isActive ? 'nav-link-active' : 'nav-link'}
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
        aria-current={isActive ? 'page' : undefined}
      >
        <motion.div
          animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        <span className="font-medium">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-neon-purple/10 border border-neon-purple/30 rounded-xl -z-10"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            initial={false}
          />
        )}
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-neon-purple/5 rounded-xl -z-20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>
    );
  }
);

NavItem.displayName = 'NavItem';

const MainNav: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isScrolled = scrollY > 20;

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-pure-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container-responsive">
          <div className="flex-between py-4">
            {/* Enhanced Logo */}
            <motion.button
              onClick={() => navigate(ROUTES.HOME)}
              className="flex items-center gap-3 hover:scale-105 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="text-2xl relative"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🎧
              </motion.div>
              <motion.span 
                className="heading-tertiary gradient-text relative"
                whileHover={{ scale: 1.05 }}
              >
                DJfly
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-purple to-neon-green"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </motion.button>

            {/* Enhanced Desktop Navigation */}
            <div className="hide-mobile">
              <motion.div 
                className="flex items-center gap-2 bg-pure-white/5 backdrop-blur-xl border border-pure-white/10 rounded-2xl p-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <NavItem {...item} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Enhanced CTA Button - Desktop */}
            <div className="hide-mobile">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  variant="primary"
                  size="sm"
                  icon={Zap}
                  onClick={() => navigate('/studio')}
                  className="relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-purple/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Start Creating</span>
                </Button>
              </motion.div>
            </div>

            {/* Enhanced Mobile Menu Toggle */}
            <motion.button
              className="show-mobile p-3 rounded-xl hover:bg-pure-white/10 transition-all duration-300 relative overflow-hidden group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Background glow effect */}
              <motion.div
                className="absolute inset-0 bg-neon-purple/10 rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className="relative z-10"
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    className="relative z-10"
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              className="fixed inset-0 bg-pure-black/90 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Enhanced Mobile Menu Content */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-rich-black/95 border-l border-white/10 z-50 backdrop-blur-xl"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                {/* Enhanced Header */}
                <motion.div 
                  className="flex-between p-6 border-b border-white/10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="text-2xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      🎧
                    </motion.div>
                    <span className="heading-tertiary gradient-text">
                      DJfly
                    </span>
                  </div>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-pure-white/10 transition-all duration-300 hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </motion.div>

                {/* Enhanced Navigation Items */}
                <div className="flex-1 py-6">
                  <div className="space-y-3 px-6">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (index + 1), duration: 0.4, type: "spring" }}
                      >
                        <NavItem {...item} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Enhanced CTA Section */}
                <motion.div 
                  className="p-6 border-t border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Zap}
                    fullWidth
                    onClick={() => {
                      navigate('/studio');
                      setIsMobileMenuOpen(false);
                    }}
                    className="relative overflow-hidden group"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-purple/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">Start Creating</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-20" />
    </>
  );
};

export default MainNav;
