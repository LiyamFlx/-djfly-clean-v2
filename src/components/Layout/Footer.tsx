import React from 'react';
import { Music } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-rich-black/80 backdrop-blur-sm border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center mb-4">
            <Music className="h-6 w-6 text-electric-blue mr-2" />
            <span className="text-xl font-bold gradient-text">DJfly</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 DJfly. Empowering DJs with AI-powered performance tools.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;