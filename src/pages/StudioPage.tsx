import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  ArrowRight,
  Mic,
  Settings,
  Activity,
  Radio,
} from 'lucide-react';
import Button from '@/components/ui/button';

const StudioPage: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const navigate = useNavigate();

  const features = [
    {
      id: 'magic-match',
      title: 'AI Magic Match',
      subtitle: 'Instant Crowd Analysis',
      icon: Target,
      color: 'neon-purple',
      gradient: 'from-neon-purple to-neon-purple-light',
      description:
        'Record crowd energy and get AI-powered track recommendations in real-time',
      benefits: [
        'Real-time crowd energy analysis',
        'Instant perfect track matches',
        'Professional venue optimization',
        'No manual selection needed',
      ],
      timeEstimate: '30 seconds',
      difficulty: 'Beginner',
      bestFor: 'Live Events & Clubs',
      route: '/studio/match',
    },
    {
      id: 'magic-set',
      title: 'AI Set Generator',
      subtitle: 'Complete Mix Creation',
      icon: Radio,
      color: 'neon-green',
      gradient: 'from-neon-green to-neon-green-light',
      description:
        'Generate complete DJ sets tailored to your venue, time, and crowd preferences',
      benefits: [
        'Full set playlist generation',
        'Venue-specific optimization',
        'BPM and energy flow control',
        'Professional transition suggestions',
      ],
      timeEstimate: '2-3 minutes',
      difficulty: 'Intermediate',
      bestFor: 'Set Planning & Preparation',
      route: '/studio/set',
    },
  ];

  const stats = [
    {
      icon: Users,
      label: 'Active DJs',
      value: '50,000+',
      color: 'text-neon-purple',
    },
    {
      icon: Music,
      label: 'Tracks Analyzed',
      value: '1M+',
      color: 'text-neon-green',
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: '98%',
      color: 'text-neon-purple',
    },
    {
      icon: Clock,
      label: 'Avg Response',
      value: '0.5s',
      color: 'text-neon-green',
    },
  ];

  const handleFeatureSelect = (feature: (typeof features)[0]) => {
    navigate(feature.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-black via-rich-black to-pure-black">
      {/* Header */}
      <div className="section-padding-sm bg-gradient-to-r from-neon-purple/10 to-neon-green/10 border-b border-white/10">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">🎛️</div>
            <h1 className="heading-display gradient-text mb-6">AI Studio</h1>
            <p className="body-large text-gray-300 max-w-2xl mx-auto mb-8">
              Professional AI tools for modern DJs. Analyze crowds, generate
              perfect sets, and create unforgettable experiences.
            </p>

            {/* Quick Stats */}
            <div className="grid-responsive-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card text-center p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className={`heading-tertiary ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="caption text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Features */}
      <div className="section-padding">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-primary mb-4">Choose Your AI Tool</h2>
            <p className="body-large text-gray-300">
              Select the perfect AI assistant for your DJing needs
            </p>
          </motion.div>

          <div className="grid-responsive-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`feature-card group relative overflow-hidden ${
                  selectedFeature === feature.id
                    ? 'ring-2 ring-' + feature.color
                    : ''
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                onHoverStart={() => setSelectedFeature(feature.id)}
                onHoverEnd={() => setSelectedFeature(null)}
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}
                />

                <div className="relative z-10 p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-4 rounded-2xl bg-${feature.color}/10 border border-${feature.color}/30`}
                      >
                        <feature.icon
                          className={`w-8 h-8 text-${feature.color}`}
                        />
                      </div>
                      <div>
                        <h3 className="heading-tertiary mb-2">
                          {feature.title}
                        </h3>
                        <p
                          className={`body-small text-${feature.color} font-medium`}
                        >
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="body-medium text-gray-300 mb-6">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="mb-8">
                    <h4 className="body-medium font-semibold mb-4">
                      Key Features:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {feature.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-${feature.color}`}
                          />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="badge bg-pure-white/10 text-gray-300">
                      ⏱️ {feature.timeEstimate}
                    </div>
                    <div className="badge bg-pure-white/10 text-gray-300">
                      📊 {feature.difficulty}
                    </div>
                    <div className="badge bg-pure-white/10 text-gray-300">
                      🎯 {feature.bestFor}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant={
                      feature.color === 'neon-purple' ? 'primary' : 'accent'
                    }
                    size="lg"
                    fullWidth
                    icon={ArrowRight}
                    onClick={() => handleFeatureSelect(feature)}
                    className="group-hover:scale-105 transition-transform"
                  >
                    Start {feature.title}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="section-padding bg-rich-black/50">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-primary mb-4">How AI Studio Works</h2>
            <p className="body-large text-gray-300 max-w-2xl mx-auto">
              Our advanced AI analyzes musical patterns, crowd energy, and venue
              acoustics to deliver perfect recommendations
            </p>
          </motion.div>

          <div className="grid-responsive gap-8">
            {[
              {
                step: '01',
                title: 'Input Analysis',
                description:
                  'Upload audio, describe your event, or record crowd noise for real-time analysis',
                icon: Mic,
                color: 'neon-purple',
              },
              {
                step: '02',
                title: 'AI Processing',
                description:
                  'Advanced algorithms analyze energy levels, BPM, key signatures, and crowd preferences',
                icon: Brain,
                color: 'neon-green',
              },
              {
                step: '03',
                title: 'Smart Recommendations',
                description:
                  'Receive curated track suggestions with mixing cues and transition timing',
                icon: Activity,
                color: 'neon-purple',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                className="glass-card text-center p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 bg-${step.color}/10 border border-${step.color}/30 rounded-2xl flex-center`}
                >
                  <step.icon className={`w-8 h-8 text-${step.color}`} />
                </div>
                <div className={`text-2xl font-bold text-${step.color} mb-4`}>
                  {step.step}
                </div>
                <h3 className="heading-tertiary mb-4">{step.title}</h3>
                <p className="body-medium text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-primary mb-6">
              Ready to revolutionize your DJ sets?
            </h2>
            <p className="body-large text-gray-300 mb-8">
              Join thousands of professional DJs using AI to create
              unforgettable experiences
            </p>
            <div className="flex-responsive justify-center gap-4">
              <Button
                variant="primary"
                size="xl"
                icon={Target}
                onClick={() => navigate('/studio/match')}
              >
                Try Magic Match
              </Button>
              <Button
                variant="accent"
                size="xl"
                icon={Radio}
                onClick={() => navigate('/studio/set')}
              >
                Generate Set
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
