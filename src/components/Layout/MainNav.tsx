import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Music,
  Home,
  Sparkles,
  Play,
  BarChart,
  User,
  Menu,
  X,
  FileText,
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-neon-purple/10 border border-neon-purple/30 rounded-lg -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-pure-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-responsive">
          <div className="flex-between py-4">
            {/* Logo */}
            <motion.button
              onClick={() => navigate(ROUTES.HOME)}
              className="flex items-center gap-3 hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl">🎧</div>
              <span className="heading-tertiary gradient-text">DJfly</span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hide-mobile">
              <div className="flex items-center gap-2 bg-pure-white/5 backdrop-blur-xl border border-pure-white/10 rounded-2xl p-2">
                {navItems.map((item) => (
                  <NavItem key={item.path} {...item} />
                ))}
              </div>
            </div>

            {/* CTA Button - Desktop */}
            <div className="hide-mobile">
              <Button
                variant="primary"
                size="sm"
                icon={Sparkles}
                onClick={() => navigate('/studio')}
              >
                Start Creating
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="show-mobile p-2 rounded-xl hover:bg-pure-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-pure-black/80 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Content */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-rich-black border-l border-white/10 z-50 backdrop-blur-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎧</div>
                    <span className="heading-tertiary gradient-text">DJfly</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-pure-white/10 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-6">
                  <div className="space-y-2 px-6">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <NavItem {...item} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="p-6 border-t border-white/10">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Sparkles}
                    fullWidth
                    onClick={() => {
                      navigate('/studio');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Start Creating
                  </Button>
                </div>
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