import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, Home, Sparkles, Play, BarChart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '@/constants/routes';

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
  { path: ROUTES.PROFILE, icon: User, label: 'Profile' },
];

const NavItem: React.FC<NavItemProps> = React.memo(({ path, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = React.useMemo(() => 
    location.pathname === path || (path !== ROUTES.HOME && location.pathname.startsWith(path)),
    [location.pathname, path]
  );

  const handleClick = () => {
    onClick?.();
    navigate(path);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-electric-blue/20 text-electric-blue'
          : 'text-gray-300 hover:text-white hover:bg-white/10'
      }`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span className="text-base font-medium">{label}</span>
    </button>
  );
});

NavItem.displayName = 'NavItem';

const MainNav: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(prevScrolled => {
        if (prevScrolled !== isScrolled) {
          return isScrolled;
        }
        return prevScrolled;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Remove scrolled from dependency array

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-electric-blue" />
            <span className="text-xl font-bold bg-gradient-to-r from-electric-blue to-bright-turquoise bg-clip-text text-transparent">
              DJfly
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-expanded={isMobileMenuOpen ? true : false}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-haspopup="true"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 backdrop-blur-md">
              {navItems.map((item) => (
                <NavItem 
                  key={item.path} 
                  {...item} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MainNav;