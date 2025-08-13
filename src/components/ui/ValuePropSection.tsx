import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Zap, Target, TrendingUp, Star } from 'lucide-react';

const ValuePropSection: React.FC = () => {
  const benefits = [
    {
      icon: Clock,
      title: '5 Second Results',
      description: 'Perfect playlists generated faster than you can think',
      stat: '5s',
      color: 'electric-blue',
    },
    {
      icon: Target,
      title: '99% Match Rate',
      description: 'AI understands your vibe better than you do',
      stat: '99%',
      color: 'bright-turquoise',
    },
    {
      icon: Users,
      title: '10K+ Happy DJs',
      description: 'Trusted by professionals worldwide',
      stat: '10K+',
      color: 'laser-pink',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Magic',
      subtitle: 'Record crowd → Get playlist → Start mixing',
      benefit: 'Zero learning curve',
    },
    {
      icon: TrendingUp,
      title: 'Smart Transitions',
      subtitle: 'BPM matching, key compatibility, energy flow',
      benefit: 'Professional results',
    },
    {
      icon: Star,
      title: 'Always Learning',
      subtitle: 'AI improves with every session',
      benefit: 'Gets better over time',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Social Proof Numbers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center group"
            >
              <div
                className={`w-20 h-20 mx-auto mb-4 bg-${benefit.color}/20 rounded-full flex items-center justify-center group-hover:bg-${benefit.color}/30 transition-colors duration-300`}
              >
                <benefit.icon className={`w-10 h-10 text-${benefit.color}`} />
              </div>

              <div className={`text-5xl font-black text-${benefit.color} mb-2`}>
                {benefit.stat}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                {benefit.title}
              </h3>

              <p className="text-gray-300 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Breakdown */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="glass-card p-8 card-interactive"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-bright-turquoise rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-gray-300 mb-3 leading-relaxed">
                    {feature.subtitle}
                  </p>

                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm font-medium">
                      {feature.benefit}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No Account Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Works Instantly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No Downloads</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValuePropSection;
