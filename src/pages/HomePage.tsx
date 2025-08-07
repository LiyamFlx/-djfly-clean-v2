import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mic, Play, BarChart } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-bright-turquoise/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-laser-pink/5 rounded-full blur-2xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Animated Icon */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <div className="text-6xl mb-4 animate-bounce-subtle">🎵</div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="block text-white mb-2">AI DJ That Reads</span>
            <span className="block gradient-text animate-pulse">
              Any Room Instantly
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Point your phone at any crowd, get the perfect playlist in 5
            seconds. Professional DJ tools included.
          </motion.p>

          {/* Value Proposition Steps */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-12 h-12 bg-electric-blue/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎧</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Listen</div>
                <div className="text-sm">AI analyzes audio in 5s</div>
              </div>
            </div>

            <div className="hidden sm:block text-gray-500">→</div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-12 h-12 bg-bright-turquoise/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Match</div>
                <div className="text-sm">Perfect playlist generated</div>
              </div>
            </div>

            <div className="hidden sm:block text-gray-500">→</div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-12 h-12 bg-laser-pink/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Mix</div>
                <div className="text-sm">Pro controls & analytics</div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to={ROUTES.STUDIO}
              className="club-button text-lg px-8 py-4 inline-flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Enter Magic Studio
            </Link>

            <Link
              to={ROUTES.PLAYER}
              className="glass-card px-8 py-4 text-white font-semibold text-lg inline-flex items-center justify-center gap-3 hover:bg-white/20 transition-all duration-200"
            >
              <Play className="w-5 h-5" />
              Quick Play
            </Link>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <div className="glass-card p-6 text-center">
              <Mic className="w-12 h-12 text-electric-blue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Magic Match</h3>
              <p className="text-gray-300 text-sm">
                AI reads crowd energy and generates perfect playlists in
                real-time
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <Sparkles className="w-12 h-12 text-bright-turquoise mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Magic Set</h3>
              <p className="text-gray-300 text-sm">
                Create curated sets with AI assistance and manual fine-tuning
              </p>
            </div>

            <div className="glass-card p-6 text-center">
              <BarChart className="w-12 h-12 text-laser-pink mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Live Analytics</h3>
              <p className="text-gray-300 text-sm">
                Real-time crowd insights and performance analytics
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
