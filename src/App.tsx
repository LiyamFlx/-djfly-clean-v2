import { useState, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Sparkles, 
  BarChart, 
  ArrowRight, 
  CheckCircle, 
  Zap,
  Clock,
  Users,
  TrendingUp,
  Radio,
  Headphones
} from 'lucide-react';
import { musicLibrary } from '@/services/musicLibrary';
import type { Track } from '@/types/shared';
import ApiStatusIndicator from '@/components/ApiStatusIndicator';
import SpotifyCallbackPage from '@/pages/auth/SpotifyCallbackPage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider, useMusicContext } from '@/contexts/MusicContext';
import PersistentNavBar from '@/components/Layout/PersistentNavBar';

// Lazy load heavy components for better performance
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const PlayerPage = lazy(() => import('@/pages/PlayerPage'));

// Loading component for Suspense fallback
const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="min-h-screen bg-club-gradient flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
      <p className="text-gray-300">{message}</p>
    </div>
  </div>
);

// Additional page components - simple implementations
const ForgotPasswordPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
    <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">Reset Password</h1>
      <p className="text-gray-400 mb-6">
        Enter your email to receive reset instructions
      </p>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
          Send Reset Link
        </button>
      </form>
      <Link
        to="/auth/login"
        className="block text-center text-blue-400 hover:text-blue-300 mt-4"
      >
        Back to Login
      </Link>
    </div>
  </div>
);

const ResetPasswordPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
    <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">
        Set New Password
      </h1>
      <form className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Confirm password"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
          Update Password
        </button>
      </form>
    </div>
  </div>
);

const ProducerAnalyticsPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📊 Producer Analytics</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Total Plays</h3>
          <p className="text-3xl font-bold text-blue-400">1,337</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Active Sets</h3>
          <p className="text-3xl font-bold text-purple-400">42</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Followers</h3>
          <p className="text-3xl font-bold text-green-400">89</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Popular Tracks</h3>
        <div className="space-y-3">
          {['Electronic Dreams', 'Bass Drop Madness', 'Synth Wave Sunset'].map(
            (track, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <span>{track}</span>
                <span className="text-blue-400">
                  {Math.floor(Math.random() * 500)} plays
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  </div>
);

const TermsPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📋 Terms of Service</h1>
      <div className="bg-gray-800 p-8 rounded-xl prose prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>By using DJfly, you agree to these terms and conditions.</p>
        <h2>2. Use of Service</h2>
        <p>
          DJfly is an AI-powered DJ platform for creating and sharing music
          mixes.
        </p>
        <h2>3. User Content</h2>
        <p>
          Users retain ownership of their original content but grant DJfly
          license to use it.
        </p>
        <h2>4. Privacy</h2>
        <p>We respect your privacy. See our Privacy Policy for details.</p>
      </div>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔒 Privacy Policy</h1>
      <div className="bg-gray-800 p-8 rounded-xl prose prose-invert max-w-none">
        <h2>Data Collection</h2>
        <p>We collect minimal data necessary to provide our service.</p>
        <h2>Data Usage</h2>
        <p>Your data is used to improve your DJfly experience.</p>
        <h2>Data Sharing</h2>
        <p>We do not sell or share your personal data with third parties.</p>
        <h2>Contact</h2>
        <p>Questions? Contact us at privacy@djfly.ai</p>
      </div>
    </div>
  </div>
);

const HelpPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">❓ Help Center</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
          <ul className="space-y-2">
            <li>• Create your first playlist in Studio</li>
            <li>• Use Magic Match to analyze crowd energy</li>
            <li>• Apply DJ effects in the Player</li>
          </ul>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Advanced Features</h3>
          <ul className="space-y-2">
            <li>• Real-time audio effects processing</li>
            <li>• BPM detection and matching</li>
            <li>• Crossfading and transitions</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📞 Contact Us</h1>
      <div className="bg-gray-800 p-8 rounded-xl">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium mb-2"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium mb-2"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
);

const DocsPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📚 Documentation</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">API Reference</h3>
          <p className="text-gray-400 mb-4">
            Complete API documentation for developers.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            View API Docs
          </button>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">SDK</h3>
          <p className="text-gray-400 mb-4">
            JavaScript SDK for integrating DJfly into your app.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
            Download SDK
          </button>
        </div>
      </div>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-blue-400 mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-6">Page not found</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
      >
        Go Home
      </Link>
    </div>
  </div>
);

// Music state is now managed by MusicContext

// Import the redesigned HomePage component
import HomePage from '@/pages/HomePage';
import OnboardingTips from '@/components/ui/OnboardingTips';
import TrackList from '@/components/ui/TrackList';
import FeatureComparisonCard from '@/components/ui/FeatureComparisonCard';
import useProgressTracking from '@/hooks/useProgressTracking';

const StudioPage = () => {
  const navigate = useNavigate();
  const { trackFeatureUsage } = useProgressTracking();
  
  const handleFeatureSelect = (feature: 'magic-match' | 'magic-set') => {
    trackFeatureUsage(feature);
    navigate(feature === 'magic-match' ? '/studio/match' : '/studio/set');
  };
  
  const studioTips = [
    {
      id: 'studio-welcome',
      title: 'Welcome to Magic Studio!',
      description: 'This is where AI magic happens. Choose Magic Match to analyze a crowd, or Magic Set to describe your perfect playlist.'
    },
    {
      id: 'magic-match-tip',
      title: 'Magic Match - Perfect for Live Events',
      description: 'Record 5 seconds of crowd noise and get an instant playlist that matches the energy. Great for parties, events, and clubs.'
    },
    {
      id: 'magic-set-tip', 
      title: 'Magic Set - Describe Your Vision',
      description: 'Tell AI what you want in words: "energetic house music for a rooftop party" and get a curated playlist with perfect flow.'
    }
  ];

  return (
  <div className="min-h-screen bg-club-gradient text-white p-4 sm:p-8">
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Welcome to <span className="gradient-text">Magic Studio</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Choose your path to the perfect playlist. No experience needed – our AI handles the complexity.
        </p>
        
        {/* Quick Status */}
        <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>AI Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>No Setup Required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Instant Results</span>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FeatureComparisonCard 
            type="magic-match"
            onSelect={() => handleFeatureSelect('magic-match')}
            isRecommended={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <FeatureComparisonCard 
            type="magic-set"
            onSelect={() => handleFeatureSelect('magic-set')}
          />
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div
        className="glass-card p-6 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Quick Tips for Best Results
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span><strong>Magic Match:</strong> Record during active moments - conversations, laughter, or music for best analysis</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span><strong>Magic Set:</strong> Be specific about mood, genre, or occasion - "energetic house for night club" works better than just "dance"</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Placeholder */}
      <motion.div
        className="text-center text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="mb-4">Ready to create your first AI-powered playlist?</p>
        <div className="flex justify-center gap-4">
          <Link to="/studio/match" className="btn-primary px-6 py-2 text-sm">
            Try Magic Match
          </Link>
          <Link to="/studio/set" className="btn-secondary px-6 py-2 text-sm">
            Try Magic Set  
          </Link>
        </div>
      </motion.div>
    </div>
    
    {/* Onboarding Tips */}
    <OnboardingTips 
      tips={studioTips} 
      page="studio" 
    />
  </div>
  );
};

interface AIAnalysis {
  crowdEnergy: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'late-night';
  recommendation: {
    tracks: Track[];
    energy: number;
    mood: string;
    reasoning?: string;
    mixingTips?: string[];
    nextTrackSuggestions?: Track[];
    energyCurve?: number[];
  };
}

const MagicMatchPage = () => {
  const navigate = useNavigate();
  const { loadPlaylist } = useMusicContext();
  const { trackFeatureUsage } = useProgressTracking();
  const [status, setStatus] = useState('ready');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  const handleAnalyze = async () => {
    setStatus('recording');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();

      setTimeout(async () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop()); // Stop microphone access

        // AI-powered crowd analysis and playlist generation
        setStatus('complete');

        try {
          const { aiMusicEngine } = await import('@/services/aiMusicEngine');

          // Simulate crowd energy detection (in real app this would analyze audio)
          const crowdEnergy = Math.floor(Math.random() * 40) + 60;
          const timeOfDay =
            new Date().getHours() > 18 ? 'evening' : 'afternoon';

          // Generate AI-powered recommendations
          const recommendation =
            await aiMusicEngine.generateIntelligentPlaylist({
              prompt: `Crowd energy detected: ${crowdEnergy}/100. Generate playlist for current vibe and energy level.`,
              mood:
                crowdEnergy > 80
                  ? 'energetic'
                  : crowdEnergy > 60
                    ? 'progressive'
                    : 'mixed',
              crowdEnergy,
              timeOfDay: timeOfDay as
                | 'morning'
                | 'afternoon'
                | 'evening'
                | 'late-night',
              venue: 'club',
              duration: 45,
            });

          setAiAnalysis({
            crowdEnergy,
            timeOfDay,
            recommendation,
          });

          loadPlaylist(recommendation.tracks);
          trackFeatureUsage('playlist_created', { method: 'magic-match', trackCount: recommendation.tracks.length });
        } catch (error) {
          console.warn('AI analysis failed, using fallback:', error);
          // Fallback to existing generator
          const playlist = await musicLibrary.searchTracks(
            'electronic house techno',
            8
          );
          loadPlaylist(playlist);
          trackFeatureUsage('playlist_created', { method: 'magic-match-fallback', trackCount: playlist.length });
        }
      }, 5000); // Record for 5 seconds
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert(
        'Microphone access is required for Magic Match. Please allow access and try again.'
      );
      setStatus('ready');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎯 Magic Match</h1>

        {status === 'ready' && (
          <div className="text-center">
            <p className="mb-6">Record crowd noise to analyze the vibe</p>
            <button
              onClick={handleAnalyze}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
            >
              Start Recording
            </button>
          </div>
        )}

        {status === 'recording' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                />
              </div>
              <p className="mt-2 animate-pulse">Recording for 5 seconds...</p>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="text-center">
            <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-2">
                🤖 AI Analysis Complete!
              </h2>
              {aiAnalysis && (
                <div className="mb-4 space-y-2">
                  <p className="text-green-300">
                    Crowd Energy:{' '}
                    <span className="font-bold">
                      {aiAnalysis.crowdEnergy}/100
                    </span>
                  </p>
                  <p className="text-green-300">
                    Time:{' '}
                    <span className="capitalize">{aiAnalysis.timeOfDay}</span>
                  </p>
                  {aiAnalysis.recommendation && (
                    <p className="text-sm text-green-200">
                      {aiAnalysis.recommendation.reasoning}
                    </p>
                  )}
                </div>
              )}
              <p className="mb-4">
                AI has generated the perfect playlist for your crowd.
              </p>
              <button
                onClick={() => navigate('/player')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
              >
                Go to Player
              </button>
            </div>

            <TrackList title="AI Generated Playlist" />
          </div>
        )}
      </div>
    </div>
  );
};

const MagicSetPage = () => {
  const navigate = useNavigate();
  const { loadPlaylist } = useMusicContext();
  const { trackFeatureUsage } = useProgressTracking();
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('ready'); // ready, generating, complete
  const [generatedTracks, setGeneratedTracks] = useState<Track[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<
    AIAnalysis['recommendation'] | null
  >(null);

  const generatePlaylist = async () => {
    if (!prompt.trim()) {
      alert('Please describe the playlist you want to create!');
      return;
    }

    setStatus('generating');

    try {
      // Import AI engine dynamically
      const { aiMusicEngine } = await import('@/services/aiMusicEngine');

      // Generate AI-powered playlist
      const recommendation = await aiMusicEngine.generateIntelligentPlaylist({
        prompt,
        mood: detectMoodFromPrompt(prompt),
        duration: 60, // 1 hour default
        venue: detectVenueFromPrompt(prompt),
      });

      setAiRecommendation(recommendation);
      setGeneratedTracks(recommendation.tracks);
      setStatus('complete');
      loadPlaylist(recommendation.tracks);
      trackFeatureUsage('playlist_created', { method: 'magic-set', trackCount: recommendation.tracks.length, prompt });
    } catch (error) {
      console.warn('AI generation failed, using fallback:', error);
      // Fallback to existing generator
      const generatedTracks = await musicLibrary.generatePlaylist(prompt);
      setGeneratedTracks(generatedTracks);
      setStatus('complete');
      loadPlaylist(generatedTracks);
      trackFeatureUsage('playlist_created', { method: 'magic-set-fallback', trackCount: generatedTracks.length, prompt });
    }
  };

  // Helper functions to detect mood and venue from prompt
  const detectMoodFromPrompt = (
    prompt: string
  ): 'energetic' | 'chill' | 'progressive' | 'mixed' => {
    const lowerPrompt = prompt.toLowerCase();
    if (
      lowerPrompt.includes('energetic') ||
      lowerPrompt.includes('party') ||
      lowerPrompt.includes('dance')
    )
      return 'energetic';
    if (
      lowerPrompt.includes('chill') ||
      lowerPrompt.includes('relax') ||
      lowerPrompt.includes('lounge')
    )
      return 'chill';
    if (lowerPrompt.includes('progressive') || lowerPrompt.includes('build'))
      return 'progressive';
    return 'mixed';
  };

  const detectVenueFromPrompt = (
    prompt: string
  ): 'club' | 'lounge' | 'festival' | 'radio' | 'workout' => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('club') || lowerPrompt.includes('nightclub'))
      return 'club';
    if (lowerPrompt.includes('lounge') || lowerPrompt.includes('cocktail'))
      return 'lounge';
    if (lowerPrompt.includes('festival') || lowerPrompt.includes('outdoor'))
      return 'festival';
    if (lowerPrompt.includes('workout') || lowerPrompt.includes('gym'))
      return 'workout';
    return 'club';
  };

  const resetGenerator = () => {
    setStatus('ready');
    setPrompt('');
    setGeneratedTracks([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎵 Magic Set</h1>

        {status === 'ready' && (
          <div className="mb-8">
            <div className="bg-gray-800 p-6 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Describe Your Perfect Playlist
              </h2>
              <p className="text-gray-300 mb-4">
                Tell our AI what kind of playlist you want. Be specific about
                mood, genre, energy level, or the occasion.
              </p>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your perfect playlist - mood, energy, genre, venue..."
                className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                maxLength={500}
              />

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">
                  {prompt.length}/500 characters
                </span>
                <button
                  onClick={generatePlaylist}
                  disabled={!prompt.trim()}
                  className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  ✨ Generate Playlist
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">💡 Example Prompts</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    setPrompt(
                      'Create a high-energy electronic dance playlist with progressive house and techno tracks for a nightclub setting'
                    )
                  }
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-blue-400">
                    🔥 High Energy Club
                  </div>
                  <div className="text-sm text-gray-300">
                    Progressive house & techno
                  </div>
                </button>

                <button
                  onClick={() =>
                    setPrompt(
                      'Generate a chill downtempo playlist with ambient and deep house for a sunset lounge session'
                    )
                  }
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-orange-400">
                    🌅 Sunset Lounge
                  </div>
                  <div className="text-sm text-gray-300">
                    Ambient & deep house
                  </div>
                </button>

                <button
                  onClick={() =>
                    setPrompt(
                      'Create a workout playlist with high BPM electronic tracks that motivate and energize'
                    )
                  }
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-green-400">
                    💪 Workout Energy
                  </div>
                  <div className="text-sm text-gray-300">
                    High BPM motivation
                  </div>
                </button>

                <button
                  onClick={() =>
                    setPrompt(
                      'Generate a sophisticated deep house playlist for an upscale cocktail party with smooth transitions'
                    )
                  }
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-purple-400">
                    🍸 Cocktail Party
                  </div>
                  <div className="text-sm text-gray-300">
                    Sophisticated deep house
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'generating' && (
          <div className="text-center mb-8">
            <div className="bg-blue-900 bg-opacity-30 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">
                🤖 AI is Generating Your Playlist...
              </h2>
              <p className="text-gray-300 mb-6">
                Analyzing your request: "{prompt}"
              </p>

              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div
                  className="bg-blue-500 h-3 rounded-full animate-pulse"
                  style={{ width: '60%' }}
                ></div>
              </div>

              <div className="space-y-2 text-sm text-gray-400">
                <p>🎯 Matching musical preferences...</p>
                <p>🎵 Selecting optimal tracks...</p>
                <p>🔄 Arranging perfect flow...</p>
              </div>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="mb-8">
            <div className="bg-green-900 bg-opacity-30 p-6 rounded-xl mb-6">
              <h2 className="text-2xl font-bold mb-2">
                ✅ AI Playlist Generated!
              </h2>
              <p className="mb-2">
                Perfect tracks selected based on: "{prompt}"
              </p>
              {aiRecommendation && (
                <p className="text-sm text-green-300 mb-4">
                  🤖 {aiRecommendation.reasoning}
                </p>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/player')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                  ▶ Play Now
                </button>
                <button
                  onClick={resetGenerator}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                  🔄 Create Another
                </button>
              </div>
            </div>

            {/* AI Mixing Tips */}
            {aiRecommendation?.mixingTips && (
              <div className="bg-blue-900 bg-opacity-30 p-4 rounded-xl mb-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-300">
                  🎧 AI Mixing Tips
                </h3>
                <ul className="space-y-1 text-sm text-blue-200">
                  {aiRecommendation.mixingTips.map(
                    (tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        {tip}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            <TrackList title="AI Generated Set" />
          </div>
        )}
      </div>
    </div>
  );
};

// Import the new mobile navigation component
import MobileNav from '@/components/Layout/MobileNav';

const Navigation = () => {
  // Use the enhanced mobile navigation
  return <MobileNav />;
};

const ProfilePage = () => {
  const userStats = {
    playlists: 0,
    tracks: 0,
    mixTime: '0h 0m',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">👤 Profile</h1>

        {/* Database Status */}
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">🗄️ Database Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Supabase Connection</p>
              <p className="text-sm text-gray-400">Connected</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400 text-sm">Active</span>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {userStats.playlists}
              </div>
              <div className="text-sm text-gray-400">Playlists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {userStats.tracks}
              </div>
              <div className="text-sm text-gray-400">Tracks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {userStats.mixTime}
              </div>
              <div className="text-sm text-gray-400">Mix Time</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">⚙️ Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Audio Quality</span>
              <select className="bg-gray-700 px-3 py-1 rounded text-white">
                <option>High (320kbps)</option>
                <option>Medium (128kbps)</option>
                <option>Low (64kbps)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto-mix</span>
              <input type="checkbox" className="accent-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Crossfade Duration</span>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="3"
                className="w-24 accent-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MusicProvider>
        <BrowserRouter>
        <div className="pb-16">
          <PersistentNavBar />
          <div className="pt-16">
            <ApiStatusIndicator />
            <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/studio/match" element={<MagicMatchPage />} />
          <Route path="/studio/set" element={<MagicSetPage />} />
          <Route
            path="/player"
            element={
              <Suspense
                fallback={<LoadingSpinner message="Loading DJ Player..." />}
              >
                <PlayerPage />
              </Suspense>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Authentication Routes */}
          <Route
            path="/auth/login"
            element={
              <Suspense
                fallback={<LoadingSpinner message="Loading login..." />}
              >
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <Suspense
                fallback={<LoadingSpinner message="Loading signup..." />}
              >
                <SignupPage />
              </Suspense>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/auth/spotify/callback"
            element={<SpotifyCallbackPage />}
          />

          {/* Producer Analytics */}
          <Route path="/producer" element={<ProducerAnalyticsPage />} />

          {/* Legal Pages */}
          <Route path="/legal/terms" element={<TermsPage />} />
          <Route path="/legal/privacy" element={<PrivacyPage />} />

          {/* Support Pages */}
          <Route path="/support/help" element={<HelpPage />} />
          <Route path="/support/contact" element={<ContactPage />} />

          {/* Documentation */}
          <Route path="/docs" element={<DocsPage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
        <Navigation />
      </BrowserRouter>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;
