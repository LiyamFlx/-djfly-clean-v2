import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, Sparkles, CheckCircle } from 'lucide-react';

interface FeatureCardProps {
  type: 'magic-match' | 'magic-set';
  onSelect: () => void;
  isRecommended?: boolean;
}

const FeatureComparisonCard: React.FC<FeatureCardProps> = ({
  type,
  onSelect,
  isRecommended,
}) => {
  const config = {
    'magic-match': {
      title: 'Magic Match',
      subtitle: 'AI Crowd Reading',
      description:
        'Record the room and get an instant playlist that matches the crowd energy',
      icon: '🎯',
      color: 'electric-blue',
      gradient: 'from-electric-blue to-cyan-400',
      time: '5 seconds',
      difficulty: 'Zero effort',
      bestFor: 'Live events, parties, clubs',
      features: [
        'Records crowd noise',
        'Analyzes energy & mood',
        'Instant playlist generation',
        'Perfect for events',
      ],
      cta: 'Start Recording',
    },
    'magic-set': {
      title: 'Magic Set',
      subtitle: 'AI Playlist Curation',
      description:
        'Describe your perfect playlist and let AI create it with professional flow',
      icon: '✨',
      color: 'bright-turquoise',
      gradient: 'from-bright-turquoise to-laser-pink',
      time: '30 seconds',
      difficulty: 'Describe in words',
      bestFor: 'Custom playlists, specific vibes',
      features: [
        'Text-based creation',
        'Smart track selection',
        'Perfect energy curve',
        'Pro mixing tips',
      ],
      cta: 'Describe Your Vision',
    },
  };

  const feature = config[type];

  return (
    <motion.div
      className={`relative glass-card p-8 cursor-pointer transition-all duration-300 group ${
        isRecommended ? 'ring-2 ring-green-400 ring-opacity-50' : ''
      }`}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-6 bg-green-400 text-black px-3 py-1 rounded-full text-xs font-bold">
          ⭐ Recommended
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`text-6xl`}>{feature.icon}</div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {feature.title}
            </h3>
            <p className={`text-${feature.color} font-semibold`}>
              {feature.subtitle}
            </p>
          </div>
        </div>

        <motion.div
          className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </motion.div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-lg leading-relaxed mb-6">
        {feature.description}
      </p>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-black/20 rounded-lg">
        <div className="text-center">
          <Clock className={`w-5 h-5 text-${feature.color} mx-auto mb-1`} />
          <div className="text-sm font-medium text-white">{feature.time}</div>
          <div className="text-xs text-gray-400">Setup Time</div>
        </div>
        <div className="text-center">
          <Users className={`w-5 h-5 text-${feature.color} mx-auto mb-1`} />
          <div className="text-sm font-medium text-white">
            {feature.difficulty}
          </div>
          <div className="text-xs text-gray-400">Difficulty</div>
        </div>
        <div className="text-center">
          <Sparkles className={`w-5 h-5 text-${feature.color} mx-auto mb-1`} />
          <div className="text-sm font-medium text-white">Pro Quality</div>
          <div className="text-xs text-gray-400">Output</div>
        </div>
      </div>

      {/* Features List */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-400 mb-3">PERFECT FOR:</p>
        <p className="text-white text-sm mb-4">{feature.bestFor}</p>

        <div className="space-y-2">
          {feature.features.map((feat, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className={`w-full py-4 bg-gradient-to-r ${feature.gradient} text-white font-bold text-lg rounded-xl group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3`}
      >
        <span>{feature.cta}</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export default FeatureComparisonCard;
