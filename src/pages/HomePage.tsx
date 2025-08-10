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
      <section className="relative min-h-screen flex items-center justify-center section-padding">
        {/* Neon Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-neon-green/15 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-neon-purple/10 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-neon-green/8 rounded-full blur-xl animate-pulse-slow" />
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
                className="absolute inset-0 bg-neon-purple/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Compelling Main Title */}
          <motion.h1
            className="heading-primary mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="block text-pure-white mb-4">Your Perfect DJ</span>
            <span className="block gradient-text animate-gradient">
              In 5 Seconds
            </span>
          </motion.h1>

          {/* Clear Value Proposition */}
          <motion.p
            className="body-large text-gray-200 max-w-4xl mx-auto mb-16 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="text-neon-green font-semibold">No setup. No learning curve.</span><br />
            Just point, click, and watch AI create the perfect playlist for any crowd.
          </motion.p>

          {/* Immediate Action CTAs - No barriers */}
          <motion.div
            className="flex-responsive justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <motion.button
              onClick={handleTryNow}
              className="relative group bg-purple-gradient text-pure-white text-xl font-bold px-12 py-6 rounded-2xl shadow-neon-purple-lg overflow-hidden hover-lift touch-button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-neon-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                className="btn-secondary px-6 py-6 text-lg font-semibold flex items-center gap-2 group hover-glow touch-button"
              >
                <Mic className="w-5 h-5" />
                Magic Match
              </button>
              <button
                onClick={() => handleQuickStart('set')}
                className="btn-secondary px-6 py-6 text-lg font-semibold flex items-center gap-2 group hover-glow touch-button"
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
      <section className="section-padding bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary text-pure-white mb-6">
              How It <span className="text-neon-green">Works</span>
            </h2>
            <p className="body-large text-gray-300 max-w-2xl mx-auto">
              Three simple steps to perfect music, every time
            </p>
          </motion.div>

          <div className="grid-responsive mb-16">
            {[
              {
                step: '01',
                icon: <Volume2 className="w-12 h-12" />,
                title: 'Capture',
                description: 'Record 5 seconds of crowd noise or describe your vibe',
                color: 'neon-purple'
              },
              {
                step: '02', 
                icon: <Zap className="w-12 h-12" />,
                title: 'AI Magic',
                description: 'Our AI analyzes energy, mood, and musical preferences instantly',
                color: 'neon-green'
              },
              {
                step: '03',
                icon: <Music className="w-12 h-12" />,
                title: 'Perfect Mix',
                description: 'Get a curated playlist with smooth transitions and pro tips',
                color: 'neon-purple'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center group hover-lift"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className={`relative mb-6 mx-auto w-24 h-24 bg-${item.color}/20 rounded-full flex items-center justify-center group-hover:bg-${item.color}/30 transition-all duration-300`}>
                  <div className={`text-${item.color}`}>
                    {item.icon}
                  </div>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${item.color} rounded-full flex items-center justify-center text-black text-sm font-bold`}>
                    {item.step}
                  </div>
                </div>
                <h3 className="heading-tertiary text-pure-white mb-4">{item.title}</h3>
                <p className="body-medium text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Preview */}
      <section className="section-padding bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary text-pure-white mb-6">
              Choose Your <span className="text-neon-purple">Style</span>
            </h2>
            <p className="body-large text-gray-300 max-w-2xl mx-auto">
              Two powerful ways to create the perfect soundtrack
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div className="glass-card p-8 border-2 border-neon-purple/30 group-hover:border-neon-purple/60 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center">
                      <Mic className="w-8 h-8 text-neon-purple" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-pure-white">Magic Match</h3>
                      <p className="text-light-gray">AI Crowd Reading</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-neon-purple group-hover:translate-x-2 transition-transform" />
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
              <div className="glass-card p-8 border-2 border-neon-green/30 group-hover:border-neon-green/60 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-neon-green" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-pure-white">Magic Set</h3>
                      <p className="text-light-gray">AI Playlist Creation</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-neon-green group-hover:translate-x-2 transition-transform" />
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Describe your perfect playlist in words and let AI curate the ideal mix with smooth transitions and professional flow.
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Radio className="w-4 h-4 text-neon-green" />
                    <span>Smart track selection</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <BarChart className="w-4 h-4 text-neon-green" />
                    <span>Perfect energy curve</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Headphones className="w-4 h-4 text-neon-green" />
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
      <section className="section-padding bg-gradient-to-t from-gray-900 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-primary text-pure-white mb-8">
              Ready to <span className="gradient-text">DJ Like a Pro</span>?
            </h2>
            
            <p className="body-large text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of DJs, event planners, and music lovers who trust AI to create perfect playlists.
            </p>

            <motion.button
              onClick={handleTryNow}
              className="relative group bg-neon-gradient text-pure-white text-2xl font-bold px-16 py-8 rounded-3xl shadow-neon-purple-lg overflow-hidden hover-lift touch-button"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-purple-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
