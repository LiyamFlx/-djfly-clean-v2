import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Home, Sparkles, Play, BarChart, User } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const MainNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: ROUTES.HOME, icon: Home, label: 'Home' },
    { path: ROUTES.STUDIO, icon: Sparkles, label: 'Studio' },
    { path: ROUTES.PLAYER, icon: Play, label: 'Player' },
    { path: ROUTES.PRODUCER, icon: BarChart, label: 'Analytics' },
    { path: ROUTES.PROFILE, icon: User, label: 'Profile' },
  ];
  
  const isActive = (path: string) => {
    if (path === ROUTES.HOME) return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <Music className="w-8 h-8 text-electric-blue" />
            <span className="text-xl font-bold gradient-text">DJfly</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-electric-blue/20 text-electric-blue'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;