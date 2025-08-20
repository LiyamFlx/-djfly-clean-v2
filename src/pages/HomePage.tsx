import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Play,
  BarChart,
  ArrowRight,
  Music,
  Users,
  Clock,
  TrendingUp,
  Headphones,
  Volume2,
  Radio,
  Star,
  Shield,
  Cpu,
} from 'lucide-react';
import Button from '@/components/ui/button';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

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

  const features = [
    {
      icon: Sparkles,
      title: 'AI Magic Match',
      description:
        'Instantly analyze crowd energy and get perfect track recommendations',
      color: 'neon-purple',
      action: () => handleQuickStart('match'),
    },
    {
      icon: Radio,
      title: 'AI Set Generator',
      description: 'Generate complete DJ sets tailored to your venue and crowd',
      color: 'neon-green',
      action: () => handleQuickStart('set'),
    },
    {
      icon: BarChart,
      title: 'Real-time Analytics',
      description:
        'Track performance metrics and optimize your sets in real-time',
      color: 'neon-purple',
      action: () => navigate('/producer'),
    },
    {
      icon: Volume2,
      title: 'Professional Player',
      description: 'Advanced DJ controls with seamless mixing capabilities',
      color: 'neon-green',
      action: () => navigate('/player'),
    },
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'DJs Worldwide' },
    { icon: Music, value: '1M+', label: 'Tracks Analyzed' },
    { icon: Clock, value: '99.9%', label: 'Uptime' },
    { icon: TrendingUp, value: '4.9/5', label: 'User Rating' },
  ];

  const benefits = [
    {
      icon: Cpu,
      title: 'AI-Powered Intelligence',
      description:
        'Advanced machine learning algorithms analyze crowd responses and musical patterns to deliver perfect recommendations every time.',
    },
    {
      icon: Shield,
      title: 'Professional Grade',
      description:
        'Built for professional DJs with enterprise-level reliability, security, and performance standards.',
    },
    {
      icon: Star,
      title: 'Instant Results',
      description:
        'Get immediate insights and recommendations without complex setup or learning curves.',
    },
  ];

  return (
    <div className="min-h-screen bg-ui-bg-deep text-ui-text">
      {/* Hero Section */}
      <section className="relative min-h-screen flex-center section-padding">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-neon-green/15 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative container-responsive text-center">
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              className="mb-12"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
            >
              <div className="text-8xl mb-6">🎧</div>
              <h1 className="heading-hero gradient-text mb-6">DJfly</h1>
              <div className="heading-secondary text-gray-300 mb-8 max-w-3xl mx-auto">
                The AI-powered DJ platform that reads any room instantly
              </div>
            </motion.div>

            {/* Main CTA */}
            <motion.div
              className="flex-responsive justify-center items-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button
                variant="primary"
                size="xl"
                icon={Sparkles}
                onClick={handleTryNow}
                className="shadow-neon-purple-lg"
              >
                Start Creating Magic
              </Button>
              <Button
                variant="ghost"
                size="xl"
                icon={Play}
                onClick={() => navigate('/demo')}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid-responsive-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {stats.map((stat, _index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card text-center hover-scale"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-neon-purple" />
                  <div className="heading-tertiary gradient-text">
                    {stat.value}
                  </div>
                  <div className="body-small text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-rich-black/50">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-display gradient-text mb-6">
              Everything you need to DJ like a pro
            </h2>
            <p className="body-large text-gray-300 max-w-2xl mx-auto">
              Professional-grade AI tools designed for modern DJs who demand
              excellence
            </p>
          </motion.div>

          <div className="grid-responsive-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={feature.action}
                onHoverStart={() => setActiveFeature(index)}
                onHoverEnd={() => setActiveFeature(null)}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`p-4 rounded-2xl bg-${feature.color}/10 border border-${feature.color}/30`}
                  >
                    <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-tertiary mb-3 group-hover:text-neon-purple transition-colors">
                      {feature.title}
                    </h3>
                    <p className="body-medium text-gray-300 mb-4">
                      {feature.description}
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 text-${feature.color} font-medium`}
                    >
                      Try Now
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          activeFeature === index ? 'translate-x-1' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-display mb-6">
              Why DJs choose <span className="gradient-text">DJfly</span>
            </h2>
          </motion.div>

          <div className="grid-responsive gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="glass-card text-center hover-lift"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-neon-purple/10 border border-neon-purple/30 rounded-2xl flex-center">
                  <benefit.icon className="w-8 h-8 text-neon-purple" />
                </div>
                <h3 className="heading-tertiary mb-4">{benefit.title}</h3>
                <p className="body-medium text-gray-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-neon-purple/10 to-neon-green/10 border-y border-white/10">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-display mb-6">
              Ready to revolutionize your DJ sets?
            </h2>
            <p className="body-large text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of DJs worldwide who trust DJfly to deliver
              unforgettable experiences.
            </p>
            <div className="flex-responsive justify-center">
              <Button
                variant="primary"
                size="xl"
                icon={Sparkles}
                onClick={handleTryNow}
                className="shadow-neon-purple-lg"
              >
                Get Started Free
              </Button>
              <Button
                variant="secondary"
                size="xl"
                icon={Headphones}
                onClick={() => navigate('/docs')}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-padding-sm">
        <div className="container-responsive text-center">
          <motion.div
            className="flex justify-center items-center gap-2 text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-neon-purple text-neon-purple"
                />
              ))}
            </div>
            <span className="body-small">
              Trusted by 50,000+ professional DJs worldwide
            </span>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
