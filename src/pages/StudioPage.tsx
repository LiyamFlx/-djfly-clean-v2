import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Music, Mic, Clock, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/button';

const StudioPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'match' | 'set'>('match');

  const features = [
    {
      id: 'match',
      title: 'Magic Match',
      description: 'Analyze crowd energy and get perfect track recommendations',
      icon: Mic,
      color: 'neon-purple',
      action: () => navigate('/studio/match'),
    },
    {
      id: 'set',
      title: 'Magic Set',
      description: 'Generate complete DJ sets tailored to your venue and crowd',
      icon: Music,
      color: 'neon-green',
      action: () => navigate('/studio/set'),
    },
  ];

  const stats = [
    { icon: Clock, value: '2.5M+', label: 'Minutes Mixed' },
    { icon: TrendingUp, value: '98%', label: 'Success Rate' },
    { icon: Music, value: '50K+', label: 'Tracks Analyzed' },
  ];

  return (
    <div className="min-h-screen bg-black-gradient text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Studio</h1>
          <p className="text-xl text-gray-300">
            Professional AI tools designed for modern DJs who demand excellence
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-xl">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id as 'match' | 'set')}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === feature.id
                    ? 'bg-neon-purple text-black font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Feature */}
        <div className="glass-card mb-12">
          <div className="text-center">
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

                <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  {feature.description}
                </p>

                <Button
                  variant="primary"
                  size="xl"
                  icon={feature.icon}
                  onClick={feature.action}
                  className={`shadow-${feature.color}-lg`}
                >
                  Try {feature.title}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="glass-card text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-purple/20 rounded-full flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-neon-purple" />
              </div>
              <div className="text-3xl font-bold text-neon-purple mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass-card">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">New to AI DJing?</h3>
              <p className="text-gray-300 mb-4">
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

            <div className="p-6 bg-white/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Ready for Advanced?
              </h3>
              <p className="text-gray-300 mb-4">
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
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
