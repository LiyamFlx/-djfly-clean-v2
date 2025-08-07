/**
 * Guest Mode Component
 * Enables frictionless demo experience without user registration
 */

import { motion } from 'framer-motion';
import { Play, Music, Zap, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface GuestModeProps {
  onStartDemo: () => void;
  onSignUp: () => void;
}

const GuestMode: React.FC<GuestModeProps> = ({ onStartDemo, onSignUp }) => {
  const navigate = useNavigate();
  const { enableGuestMode } = useAuthStore();

  const handleStartDemo = () => {
    enableGuestMode();
    onStartDemo();
    navigate('/studio?mode=guest');
  };

  const demoFeatures = [
    {
      icon: Music,
      title: "Mix Demo Tracks",
      description: "12 curated professional DJ tracks ready to mix"
    },
    {
      icon: Zap,
      title: "Real-time Effects",
      description: "Professional EQ, filters, reverb, and delay"
    },
    {
      icon: Share,
      title: "Share Your Sets",
      description: "Create shareable links with 'Made with DJfly' branding"
    }
  ];

  const limitations = [
    "10-minute session limit",
    "Demo track library only", 
    "Sets include DJfly watermark",
    "Can't save sets permanently"
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Try DJfly Now
        </h1>
        <p className="text-xl text-gray-300">
          No signup required. Start mixing in seconds.
        </p>
      </motion.div>

      {/* Demo Features */}
      <motion.div 
        className="grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {demoFeatures.map((feature, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4 text-center">
            <feature.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <button
          onClick={handleStartDemo}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Demo (No Signup)
        </button>
        
        <button
          onClick={onSignUp}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200"
        >
          Sign Up for Full Access
        </button>
      </motion.div>

      {/* Demo Limitations */}
      <motion.div 
        className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h4 className="text-amber-400 font-medium mb-2 text-sm uppercase tracking-wide">
          Demo Limitations
        </h4>
        <ul className="text-sm text-amber-200 space-y-1">
          {limitations.map((limitation, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1 h-1 bg-amber-400 rounded-full flex-shrink-0" />
              {limitation}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Upgrade Benefits Preview */}
      <motion.div 
        className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-600/30 rounded-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h4 className="text-green-400 font-medium mb-2 text-sm uppercase tracking-wide">
          Unlock with Account
        </h4>
        <ul className="text-sm text-green-200 space-y-1">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0" />
            Access 70+ million tracks via Spotify
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0" />
            Unlimited session time
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0" />
            Save and organize your sets
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-green-400 rounded-full flex-shrink-0" />
            AI-powered music recommendations
          </li>
        </ul>
      </motion.div>

      {/* Quick Demo Video/Preview */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Ready to Mix?</h3>
          <p className="text-gray-400 text-sm">
            Click "Start Demo" and you'll be mixing in under 10 seconds
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default GuestMode;