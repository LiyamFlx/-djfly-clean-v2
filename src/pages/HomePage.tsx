import React from 'react';
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
  Zap,
  Brain,
  Target,
} from 'lucide-react';
import Button from '@/components/ui/button';
import { CardGrid, FeatureCard, GlassCard } from '@/components/ui/EnhancedCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
      subtitle: 'Perfect track matching',
    },
    {
      icon: Radio,
      title: 'AI Set Generator',
      description: 'Generate complete DJ sets tailored to your venue and crowd',
      color: 'neon-green',
      action: () => handleQuickStart('set'),
      subtitle: 'Complete set creation',
    },
    {
      icon: BarChart,
      title: 'Real-time Analytics',
      description:
        'Track performance metrics and optimize your sets in real-time',
      color: 'neon-purple',
      action: () => navigate('/producer'),
      subtitle: 'Performance insights',
    },
    {
      icon: Volume2,
      title: 'Professional Player',
      description: 'Advanced DJ controls with seamless mixing capabilities',
      color: 'neon-green',
      action: () => navigate('/player'),
      subtitle: 'Pro-grade mixing',
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
      subtitle: 'Machine Learning',
    },
    {
      icon: Shield,
      title: 'Professional Grade',
      description:
        'Built for professional DJs with enterprise-level reliability, security, and performance standards.',
      subtitle: 'Enterprise Ready',
    },
    {
      icon: Star,
      title: 'Instant Results',
      description:
        'Get immediate insights and recommendations without complex setup or learning curves.',
      subtitle: 'Zero Setup',
    },
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: 'Crowd Analysis',
      description: 'Real-time crowd energy detection and mood analysis',
      color: 'neon-purple',
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'AI-powered track selection based on crowd response',
      color: 'neon-green',
    },
    {
      icon: Zap,
      title: 'Instant Mixing',
      description: 'Automatic BPM and key matching for seamless transitions',
      color: 'neon-purple',
    },
  ];

  return (
    <div className="min-h-screen bg-ui-bg-deep text-ui-text">
      {/* Hero Section */}
      <section className="relative min-h-screen flex-center section-padding">
        {/* Enhanced Animated Background */}
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
          {/* Additional floating elements */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl"
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
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
              <motion.div 
                className="text-8xl mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
              >
                🎧
              </motion.div>
              <h1 className="heading-hero gradient-text mb-6">DJfly</h1>
              <div className="heading-secondary text-gray-300 mb-8 max-w-3xl mx-auto">
                The AI-powered DJ platform that reads any room instantly
              </div>
            </motion.div>

            {/* Enhanced Main CTA */}
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
                className="shadow-neon-purple-lg relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-purple/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Start Creating Magic</span>
              </Button>
              <Button
                variant="ghost"
                size="xl"
                icon={Play}
                onClick={() => navigate('/demo')}
                className="hover:bg-white/10 hover:text-white"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              className="grid-responsive-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <GlassCard
                    size="sm"
                    icon={stat.icon}
                    iconPosition="top"
                    iconColor="neon-purple"
                    title={stat.value}
                    subtitle={stat.label}
                    className="text-center hover:scale-105 transition-transform duration-300"
                  >
                    <span className="sr-only">{stat.label}</span>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="section-padding bg-rich-black/50">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-display gradient-text mb-6">
              Everything you need to DJ like a pro
            </h2>
            <p className="body-large text-gray-300 max-w-2xl mx-auto">
              Professional-grade AI tools designed for modern DJs who demand
              excellence
            </p>
          </motion.div>

          {/* Enhanced Feature Cards */}
          <CardGrid columns={2} gap="xl">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <FeatureCard
                  icon={feature.icon}
                  iconPosition="left"
                  iconColor={feature.color}
                  title={feature.title}
                  subtitle={feature.subtitle}
                  onClick={feature.action}
                  glow={true}
                  className="h-full"
                >
                  <p className="body-medium text-gray-300 mb-6">
                    {feature.description}
                  </p>
                  <motion.div
                    className={`inline-flex items-center gap-2 text-${feature.color} font-medium group cursor-pointer`}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    Try Now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.div>
                </FeatureCard>
              </motion.div>
            ))}
          </CardGrid>
        </div>
      </section>

      {/* New AI Features Section */}
      <section className="section-padding-sm bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-green/5">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="heading-primary gradient-text mb-4">
              Powered by Advanced AI
            </h3>
            <p className="body-medium text-gray-400 max-w-xl mx-auto">
              Cutting-edge artificial intelligence that understands music and crowd dynamics
            </p>
          </motion.div>

          <CardGrid columns={3} gap="lg">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard
                  icon={feature.icon}
                  iconPosition="top"
                  iconColor={feature.color}
                  title={feature.title}
                  subtitle={feature.description}
                  className="text-center hover:scale-105 transition-transform duration-300"
                >
                  <span className="sr-only">{feature.title}</span>
                </GlassCard>
              </motion.div>
            ))}
          </CardGrid>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-display mb-6">
              Why DJs choose <span className="gradient-text">DJfly</span>
            </h2>
            <p className="body-large text-gray-300 max-w-2xl mx-auto">
              Built by DJs, for DJs, with the power of artificial intelligence
            </p>
          </motion.div>

          <CardGrid columns={3} gap="xl">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard
                  icon={benefit.icon}
                  iconPosition="top"
                  iconColor="neon-purple"
                  title={benefit.title}
                  subtitle={benefit.subtitle}
                  className="text-center h-full"
                >
                  <p className="body-medium text-gray-300">
                    {benefit.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </CardGrid>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="section-padding bg-gradient-to-r from-neon-purple/10 to-neon-green/10 border-y border-white/10">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-display mb-6">
              Ready to revolutionize your DJ sets?
            </h2>
            <p className="body-large text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professional DJs who trust DJfly to deliver
              unforgettable experiences
            </p>
            <div className="flex-responsive justify-center items-center gap-6">
              <Button
                variant="primary"
                size="lg"
                icon={Zap}
                onClick={handleTryNow}
                className="shadow-neon-purple-lg"
              >
                Start Free Trial
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={Headphones}
                onClick={() => navigate('/demo')}
              >
                Watch Demo
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
