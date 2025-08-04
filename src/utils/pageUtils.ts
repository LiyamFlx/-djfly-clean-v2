import React from 'react';
import { motion } from 'framer-motion';

interface PageProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const createPage = (title: string, content: React.ReactNode) => {
  const PageComponent: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <motion.h1 
        className="text-3xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        {content}
      </motion.div>
    </div>
  );

  return PageComponent;
};

export const ComingSoon: React.FC<{ feature?: string }> = ({ feature = 'This feature' }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-electric-blue/10 mb-4">
      <svg className="w-8 h-8 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
    <p className="text-gray-400 max-w-md mx-auto">
      {feature} is currently under development. Please check back later for updates!
    </p>
  </div>
);
