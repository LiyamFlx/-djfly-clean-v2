import { useState, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlaylistGenerator } from '@/services/musicLibrary';
import type { Track } from '@/types/api';
import ApiStatusIndicator from '@/components/ApiStatusIndicator';

// Lazy load heavy components for better performance
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const PlayerPage = lazy(() => import('@/pages/PlayerPage'));
const GuestMode = lazy(() => import('@/components/auth/GuestMode'));

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

// Export Track interface from musicLibrary
// interface Track is imported from musicLibrary service

// Simple state management with initial tracks
const appState = {
  currentTrack: null as Track | null,
  queue: [] as Track[],
  isPlaying: false,
};

// Initialize with tracks asynchronously
PlaylistGenerator.generateByVibe('mixed').then((tracks) => {
  if (tracks.length > 0) {
    appState.queue = tracks;
    console.log('🎵 Initial playlist loaded:', tracks.length, 'tracks');
  }
});

const HomePage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    {/* Demo Banner */}
    <div className="bg-yellow-600 text-black text-center py-2 mb-4 rounded">
      🚀 DJfly v1.2.0 Demo - Live Testing Environment
    </div>
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-4">DJfly</h1>
      <p className="text-xl mb-8">
        AI-powered DJ platform that reads any room instantly
      </p>

      {/* Quick Demo Access */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-600/30 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-3">
          🎵 Try DJfly Now - No Signup Required
        </h2>
        <p className="text-gray-300 mb-4">
          Experience AI-powered music discovery with our 10-minute demo
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/guest"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            🚀 Start Free Demo
          </Link>
          <Link
            to="/studio"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🎛️ Full Studio
          </Link>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-400">
            🤖 AI Music Discovery
          </h3>
          <p className="text-sm text-gray-300">
            Our AI analyzes crowd energy and generates perfect playlists
            instantly
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-purple-400">
            🎯 Smart Matching
          </h3>
          <p className="text-sm text-gray-300">
            Record crowd noise to get AI-powered track recommendations
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-400">
            🎧 Professional Tools
          </h3>
          <p className="text-sm text-gray-300">
            Real-time effects, BPM matching, and seamless mixing
          </p>
        </div>
      </div>

      <div className="space-x-4">
        <Link
          to="/player"
          className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 transition-colors"
        >
          🎵 Player
        </Link>
      </div>
    </div>
  </div>
);

const StudioPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    {/* Demo Banner */}
    <div className="bg-yellow-600 text-black text-center py-2 mb-4 rounded">
      🚀 DJfly v1.2.0 Demo - Live Testing Environment
    </div>
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">Studio</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Link
          to="/studio/match"
          className="bg-blue-600 p-8 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <h2 className="text-xl font-bold mb-4">🎯 Magic Match</h2>
          <p>Analyze crowd and generate playlist</p>
        </Link>
        <Link
          to="/studio/set"
          className="bg-purple-600 p-8 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <h2 className="text-xl font-bold mb-4">🎵 Magic Set</h2>
          <p>Create custom playlist</p>
        </Link>
      </div>
    </div>
  </div>
);

interface AIAnalysis {
  crowdEnergy: number;
  timeOfDay: string;
  recommendation: {
    tracks: Track[];
    energy: number;
    mood: string;
  };
}

const MagicMatchPage = () => {
  const navigate = useNavigate();
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
          const crowdEnergy = Math.floor(Math.random() * 40) + 60; // 60-100 for demo
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
              timeOfDay: timeOfDay as string,
              venue: 'club',
              duration: 45,
            });

          setAiAnalysis({
            crowdEnergy,
            timeOfDay,
            recommendation,
          });

          appState.queue = recommendation.tracks;
        } catch (error) {
          console.warn('AI analysis failed, using fallback:', error);
          // Fallback to existing generator
          const playlist = await PlaylistGenerator.generateByVibe('mixed');
          appState.queue = playlist;
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

            <div className="text-left">
              <h3 className="text-xl font-semibold mb-4">Recommended Tracks</h3>
              <div className="space-y-4">
                {appState.queue.map((track) => (
                  <div
                    key={track.id}
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{track.title}</p>
                      <p className="text-gray-400 text-sm">{track.artist}</p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {track.bpm} BPM • {track.key}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MagicSetPage = () => {
  const navigate = useNavigate();
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
      appState.queue = recommendation.tracks;
    } catch (error) {
      console.warn('AI generation failed, using fallback:', error);
      // Fallback to existing generator
      const generatedTracks = await PlaylistGenerator.generateByPrompt(prompt);
      setGeneratedTracks(generatedTracks);
      setStatus('complete');
      appState.queue = generatedTracks;
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
                placeholder="e.g., 'Create an upbeat electronic playlist for a beach party with progressive house and tech house tracks that build energy throughout the night...'"
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

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">
                Generated Tracks ({generatedTracks.length})
              </h3>
              <div className="space-y-3">
                {generatedTracks.map((track, index) => (
                  <div key={track.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{track.title}</p>
                          <p className="text-gray-400 text-sm">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">
                          {track.bpm} BPM • {track.key}
                        </div>
                        <div className="text-xs text-purple-400">
                          {track.genre}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Navigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex justify-around">
          <Link
            to="/"
            className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors"
          >
            🏠 Home
          </Link>
          <Link
            to="/studio"
            className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors"
          >
            🎛️ Studio
          </Link>
          <Link
            to="/player"
            className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors"
          >
            🎧 Player
          </Link>
          <Link
            to="/profile"
            className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors"
          >
            👤 Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

const ProfilePage = () => {
  const userStats = {
    playlists: 0,
    tracks: 0,
    mixTime: '0h 0m',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pb-20">
      {/* Demo Banner */}
      <div className="bg-yellow-600 text-black text-center py-2 mb-4 rounded">
        🚀 DJfly v1.2.0 Demo - Live Testing Environment
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">👤 Profile</h1>

        {/* Database Status */}
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">🗄️ Database Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Supabase Connection</p>
              <p className="text-sm text-gray-400">
                Demo mode - database disabled
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-400 text-sm">Demo Mode</span>
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
    <BrowserRouter>
      <div className="pb-16">
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

          {/* Guest Mode Route */}
          <Route
            path="/guest"
            element={
              <Suspense
                fallback={<LoadingSpinner message="Setting up demo..." />}
              >
                <GuestMode onStartDemo={() => {}} onSignUp={() => {}} />
              </Suspense>
            }
          />

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
      <Navigation />
    </BrowserRouter>
  );
}

export default App;
