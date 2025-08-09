import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Mic, 
  Play, 
  BarChart, 
  ArrowRight, 
  CheckCircle, 
  Zap,
  Music,
  Users,
  Clock,
  TrendingUp,
  Headphones,
  Volume2,
  Radio
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState<'match' | 'set' | null>(null);

  const handleTryNow = () => {
    navigate('/studio');
  };

  const handleQuickStart = (feature: 'match' | 'set') => {
    if (feature === 'match') {
      navigate('/studio/match');
    } else {
      navigate('/studio/set');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Redesigned for immediate engagement */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-electric-blue/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-bright-turquoise/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-laser-pink/10 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-electric-blue/5 rounded-full blur-xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Dynamic Animated Logo */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
          >
            <div className="relative">
              <div className="text-8xl mb-4 relative z-10">🎧</div>
              <motion.div 
                className="absolute inset-0 bg-electric-blue/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Compelling Main Title */}
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="block text-white mb-4">Your Perfect DJ</span>
            <span className="block gradient-text animate-gradient">
              In 5 Seconds
            </span>
          </motion.h1>

          {/* Clear Value Proposition */}
          <motion.p
            className="text-xl md:text-3xl text-gray-200 max-w-4xl mx-auto mb-16 leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-bright-turquoise font-semibold">No setup. No learning curve.</span><br />
            Just point, click, and watch AI create the perfect playlist for any crowd.
          </motion.p>

          {/* Immediate Action CTAs - No barriers */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <motion.button
              onClick={handleTryNow}
              className="relative group bg-gradient-to-r from-electric-blue via-bright-turquoise to-laser-pink text-white text-xl font-bold px-12 py-6 rounded-2xl shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-laser-pink via-electric-blue to-bright-turquoise opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Zap className="w-6 h-6" />
                Try Now - FREE
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button
                onClick={() => handleQuickStart('match')}
                className="btn-secondary px-6 py-6 text-lg font-semibold flex items-center gap-2 group"
              >
                <Mic className="w-5 h-5" />
                Magic Match
              </button>
              <button
                onClick={() => handleQuickStart('set')}
                className="btn-secondary px-6 py-6 text-lg font-semibold flex items-center gap-2 group"
              >
                <Sparkles className="w-5 h-5" />
                Magic Set
              </button>
            </motion.div>
          </motion.div>

          {/* Social Proof & Trust Indicators */}
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No Registration Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Works Instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>100% Free</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Visual Journey */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="text-bright-turquoise">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Three simple steps to perfect music, every time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[
              {
                step: '01',
                icon: <Volume2 className="w-12 h-12" />,
                title: 'Capture',
                description: 'Record 5 seconds of crowd noise or describe your vibe',
                color: 'electric-blue'
              },
              {
                step: '02', 
                icon: <Zap className="w-12 h-12" />,
                title: 'AI Magic',
                description: 'Our AI analyzes energy, mood, and musical preferences instantly',
                color: 'bright-turquoise'
              },
              {
                step: '03',
                icon: <Music className="w-12 h-12" />,
                title: 'Perfect Mix',
                description: 'Get a curated playlist with smooth transitions and pro tips',
                color: 'laser-pink'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className={`relative mb-6 mx-auto w-24 h-24 bg-${item.color}/20 rounded-full flex items-center justify-center group-hover:bg-${item.color}/30 transition-all duration-300`}>
                  <div className={`text-${item.color}`}>
                    {item.icon}
                  </div>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${item.color} rounded-full flex items-center justify-center text-black text-sm font-bold`}>
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your <span className="text-laser-pink">Style</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Two powerful ways to create the perfect soundtrack
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Magic Match Preview */}
            <motion.div
              className={`relative group cursor-pointer transition-all duration-500 ${
                activeDemo === 'match' ? 'scale-105' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveDemo(activeDemo === 'match' ? null : 'match')}
              onHoverStart={() => setActiveDemo('match')}
              onHoverEnd={() => setActiveDemo(null)}
            >
              <div className="glass-card p-8 border-2 border-electric-blue/30 group-hover:border-electric-blue/60 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center">
                      <Mic className="w-8 h-8 text-electric-blue" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Magic Match</h3>
                      <p className="text-gray-400">AI Crowd Reading</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-electric-blue group-hover:translate-x-2 transition-transform" />
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Record the room's vibe and watch AI instantly analyze crowd energy, mood, and preferences to generate the perfect playlist.
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-electric-blue" />
                    <span>5-second analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <TrendingUp className="w-4 h-4 text-electric-blue" />
                    <span>Real-time crowd energy detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-4 h-4 text-electric-blue" />
                    <span>Perfect for live events</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickStart('match');
                  }}
                  className="mt-6 w-full btn-primary py-3"
                >
                  Try Magic Match
                </button>
              </div>
            </motion.div>

            {/* Magic Set Preview */}
            <motion.div
              className={`relative group cursor-pointer transition-all duration-500 ${
                activeDemo === 'set' ? 'scale-105' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveDemo(activeDemo === 'set' ? null : 'set')}
              onHoverStart={() => setActiveDemo('set')}
              onHoverEnd={() => setActiveDemo(null)}
            >
              <div className="glass-card p-8 border-2 border-bright-turquoise/30 group-hover:border-bright-turquoise/60 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-bright-turquoise/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-bright-turquoise" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Magic Set</h3>
                      <p className="text-gray-400">AI Playlist Creation</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-bright-turquoise group-hover:translate-x-2 transition-transform" />
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Describe your perfect playlist in words and let AI curate the ideal mix with smooth transitions and professional flow.
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Radio className="w-4 h-4 text-bright-turquoise" />
                    <span>Smart track selection</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <BarChart className="w-4 h-4 text-bright-turquoise" />
                    <span>Perfect energy curve</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Headphones className="w-4 h-4 text-bright-turquoise" />
                    <span>Pro mixing tips included</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickStart('set');
                  }}
                  className="mt-6 w-full btn-secondary py-3"
                >
                  Try Magic Set
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-gray-900 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to <span className="gradient-text">DJ Like a Pro</span>?
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of DJs, event planners, and music lovers who trust AI to create perfect playlists.
            </p>

            <motion.button
              onClick={handleTryNow}
              className="relative group bg-gradient-to-r from-electric-blue via-bright-turquoise to-laser-pink text-white text-2xl font-bold px-16 py-8 rounded-3xl shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-laser-pink via-electric-blue to-bright-turquoise opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <span className="relative z-10 flex items-center justify-center gap-4">
                <Zap className="w-8 h-8" />
                Start Creating Now
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </span>
            </motion.button>

            <p className="text-gray-400 mt-6">
              No account needed • Works instantly • Always free
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
