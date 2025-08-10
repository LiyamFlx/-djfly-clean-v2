import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Target,
  Music,
  Zap,
  Brain,
  Users,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';
// import { ROUTES } from '@/constants/routes';

const StudioPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'magic-match',
      title: 'Magic Match',
      subtitle: 'AI Crowd Analysis',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      description: 'Record crowd noise to get AI-powered track recommendations',
      benefits: [
        'Real-time crowd energy analysis',
        'Instant playlist generation',
        'Perfect for live events',
        'No manual track selection needed',
      ],
      timeEstimate: '30 seconds',
      difficulty: 'Beginner',
      bestFor: 'Live DJing & Events',
      route: '/studio/match',
    },
    {
      id: 'magic-set',
      title: 'Magic Set',
      subtitle: 'Custom Playlist Creator',
      icon: Music,
      color: 'from-purple-500 to-pink-500',
      description: 'Create custom playlists with AI assistance',
      benefits: [
        'Custom mood and venue selection',
        'Advanced track filtering',
        'BPM and key matching',
        'Professional set planning',
      ],
      timeEstimate: '2-3 minutes',
      difficulty: 'Intermediate',
      bestFor: 'Set Planning & Preparation',
      route: '/studio/set',
    },
  ];

  return (
    <div className="min-h-screen bg-black-gradient text-white section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="heading-primary mb-6 text-gradient leading-tight"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            Magic Studio
          </motion.h1>
          <p className="body-large text-neutral-300 max-w-3xl mx-auto">
            Choose your AI-powered music creation method. Both tools use
            advanced machine learning to deliver perfect mixes for any
            situation.
          </p>
        </motion.div>

        {/* Feature Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isSelected = selectedFeature === feature.id;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative group cursor-pointer hover-lift ${
                  isSelected ? 'ring-2 ring-neon-purple' : ''
                }`}
                onClick={() => setSelectedFeature(feature.id)}
              >
                <div className="glass-card p-8 h-full hover:border-neon-purple hover-glow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <p className="text-gray-400">{feature.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        {feature.timeEstimate}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    {feature.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + i * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{feature.difficulty}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{feature.bestFor}</span>
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={feature.route}
                    className={`block w-full py-4 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${
                      isSelected
                        ? 'btn-primary'
                        : 'bg-neutral-700 hover:bg-neutral-600 text-white'
                    }`}
                  >
                    {isSelected
                      ? 'Selected - Click to Continue'
                      : `Try ${feature.title}`}
                  </Link>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-rich-black" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary-400" />
            <span>Quick Actions</span>
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all">
              <Brain className="w-4 h-4" />
              <span>AI Quick Mix</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all">
              <TrendingUp className="w-4 h-4" />
              <span>Trending Now</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all">
              <Music className="w-4 h-4" />
              <span>My Library</span>
            </button>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            Need help choosing?
            <button className="text-primary-400 hover:text-secondary-400 ml-1 underline">
              Watch our tutorial
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StudioPage;
