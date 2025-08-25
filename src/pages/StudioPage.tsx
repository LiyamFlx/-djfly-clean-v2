import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Mic, Clock, TrendingUp, Play } from 'lucide-react';
import Button from '@/components/ui/button';
import { GlassCard, NeonCard } from '@/components/ui/EnhancedCard';

const StudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'match' | 'set'>('match');

  const features = [
    {
      id: 'match',
      title: 'Magic Match',
      description: 'Analyze crowd energy and get perfect track recommendations',
      icon: Mic,
      color: 'dj-interactive',
      action: () => navigate('/studio/match'),
    },
    {
      id: 'set',
      title: 'Magic Set',
      description: 'Generate complete DJ sets tailored to your venue and crowd',
      icon: Music,
      color: 'success-500',
      action: () => navigate('/studio/set'),
    },
  ];

  const stats = [
    { icon: Clock, value: '2.5M+', label: 'Minutes Mixed' },
    { icon: TrendingUp, value: '98%', label: 'Success Rate' },
    { icon: Music, value: '50K+', label: 'Tracks Analyzed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-dj text-dj-text-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">AI Studio</h1>
          <p className="text-xl text-dj-text-secondary">
            Professional AI tools designed for modern DJs who demand excellence
          </p>
        </div>

        {/* Quick Player Access */}
        <div className="mb-8">
          <NeonCard className="text-center p-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-dj-interactive/20 to-success-500/20 rounded-full flex items-center justify-center">
              <Play className="w-10 h-10 text-dj-interactive" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-dj-text-primary">Ready to Mix?</h2>
            <p className="text-dj-text-secondary mb-4">
              Jump straight into the DJ player with your current playlist
            </p>
            <Button
              variant="primary"
              size="lg"
              icon={Play}
              onClick={() => navigate('/player')}
              className="shadow-dj-soft"
            >
              Go to Player
            </Button>
          </NeonCard>
        </div>

        {/* Feature Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-dj-bg-secondary/20 rounded-2xl p-2 backdrop-blur-xl border border-dj-bg-tertiary/30">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id as 'match' | 'set')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === feature.id
                    ? 'bg-dj-interactive text-white font-semibold shadow-dj-soft'
                    : 'text-dj-text-secondary hover:text-dj-text-primary'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Feature */}
        <div className="mb-12">
          <GlassCard className="text-center p-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`${activeTab === feature.id ? 'block' : 'hidden'}`}
              >
                <div
                  className={`w-24 h-24 mx-auto mb-6 bg-${feature.color}/20 rounded-full flex items-center justify-center`}
                >
                  <feature.icon className={`w-12 h-12 text-${feature.color}`} />
                </div>

                <h2 className="text-3xl font-bold mb-4 text-dj-text-primary">{feature.title}</h2>
                <p className="text-lg text-dj-text-secondary mb-8 max-w-2xl mx-auto">
                  {feature.description}
                </p>

                <Button
                  variant="primary"
                  size="xl"
                  icon={feature.icon}
                  onClick={feature.action}
                  className="shadow-dj-soft"
                >
                  Try {feature.title}
                </Button>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-dj-interactive/20 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-dj-interactive" />
                </div>
                <div className="text-3xl font-bold text-dj-interactive mb-2">
                  {stat.value}
                </div>
                <div className="text-dj-text-secondary">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <GlassCard className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center text-dj-text-primary">
              Quick Start
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-dj-bg-secondary/20 rounded-lg border border-dj-bg-tertiary/30">
                <h3 className="text-lg font-semibold mb-4 text-dj-text-primary">New to AI DJing?</h3>
                <p className="text-dj-text-secondary mb-4">
                  Start with Magic Match to analyze crowd energy and get your
                  first AI-powered playlist.
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Mic}
                  onClick={() => navigate('/studio/match')}
                  fullWidth
                >
                  Start with Magic Match
                </Button>
              </div>

              <div className="p-6 bg-dj-bg-secondary/20 rounded-lg border border-dj-bg-tertiary/30">
                <h3 className="text-lg font-semibold mb-4 text-dj-text-primary">
                  Ready for Advanced?
                </h3>
                <p className="text-dj-text-secondary mb-4">
                  Use Magic Set to generate complete DJ sets with energy curves
                  and transitions.
                </p>
                <Button
                  variant="accent"
                  size="lg"
                  icon={Music}
                  onClick={() => navigate('/studio/set')}
                  fullWidth
                >
                  Create Magic Set
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
