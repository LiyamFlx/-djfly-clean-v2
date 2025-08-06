import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { audioEngine } from '@/services/audioEngine';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Additional page components - simple implementations
const ForgotPasswordPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
    <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">Reset Password</h1>
      <p className="text-gray-400 mb-6">Enter your email to receive reset instructions</p>
      <form className="space-y-4">
        <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none" />
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">Send Reset Link</button>
      </form>
      <Link to="/auth/login" className="block text-center text-blue-400 hover:text-blue-300 mt-4">Back to Login</Link>
    </div>
  </div>
);

const ResetPasswordPage = () => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
    <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">Set New Password</h1>
      <form className="space-y-4">
        <input type="password" placeholder="New password" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none" />
        <input type="password" placeholder="Confirm password" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none" />
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">Update Password</button>
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
          {['Electronic Dreams', 'Bass Drop Madness', 'Synth Wave Sunset'].map((track, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <span>{track}</span>
              <span className="text-blue-400">{Math.floor(Math.random() * 500)} plays</span>
            </div>
          ))}
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
        <p>DJfly is an AI-powered DJ platform for creating and sharing music mixes.</p>
        <h2>3. User Content</h2>
        <p>Users retain ownership of their original content but grant DJfly license to use it.</p>
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
            <label className="block text-sm font-medium mb-2">Name</label>
            <input className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea rows={5} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"></textarea>
          </div>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">Send Message</button>
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
          <p className="text-gray-400 mb-4">Complete API documentation for developers.</p>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">View API Docs</button>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">SDK</h3>
          <p className="text-gray-400 mb-4">JavaScript SDK for integrating DJfly into your app.</p>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">Download SDK</button>
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
      <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold">Go Home</Link>
    </div>
  </div>
);

// Track interface
interface Track {
  id: string; // Spotify IDs are strings
  title: string;
  artist: string;
  image?: string;
  duration?: number;
  previewUrl?: string;
  bpm?: number;
  key?: string;
  genre?: string;
}

// Simple state management
const appState = {
  currentTrack: null as Track | null,
  queue: [] as Track[],
  isPlaying: false,
};

const HomePage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    {/* Demo Banner */}
    <div className="bg-yellow-600 text-black text-center py-2 mb-4 rounded">
      🚀 DJfly v1.2.0 Demo - Live Testing Environment
    </div>
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">DJfly</h1>
      <p className="text-xl mb-8">AI-powered DJ platform</p>
      <div className="space-x-4">
        <Link
          to="/studio"
          className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Studio
        </Link>
        <Link
          to="/player"
          className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 transition-colors"
        >
          Player
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

const MagicMatchPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('ready');

  const handleAnalyze = async () => {
    setStatus('recording');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();

      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop()); // Stop microphone access

        // Simulate analysis and generate playlist
        setStatus('complete');
        // In a real app, you'd analyze the recorded audio data.
        // For now, we just generate a mock playlist as before.
        appState.queue = [
          {
            id: 'match1',
            title: 'Summer Electronic Vibes',
            artist: 'AI Generated',
            bpm: 125,
            key: 'Am',
            previewUrl:
              'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            duration: 180,
          },
          {
            id: 'match2',
            title: 'Deep House Flow',
            artist: 'AI Generated',
            bpm: 128,
            key: 'G',
            previewUrl:
              'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
            duration: 180,
          },
          {
            id: 'match3',
            title: 'Progressive Energy',
            artist: 'AI Generated',
            bpm: 126,
            key: 'C',
            previewUrl:
              'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
            duration: 180,
          },
        ];
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
              <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
              <p className="mb-4">
                We've generated the perfect playlist for your crowd.
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

  const generatePlaylist = () => {
    if (!prompt.trim()) {
      alert('Please describe the playlist you want to create!');
      return;
    }

    setStatus('generating');

    // Simulate AI generation (keeping working demo)
    setTimeout(() => {
      const mockTracks: Track[] = [
        {
          id: '1',
          title: 'Summer Vibes',
          artist: 'DJfly AI',
          bpm: 120,
          key: 'C',
          genre: 'Electronic',
          previewUrl:
            'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
          duration: 180,
        },
        {
          id: '2',
          title: 'Deep House Flow',
          artist: 'DJfly AI',
          bpm: 122,
          key: 'G',
          genre: 'House',
          previewUrl:
            'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
          duration: 180,
        },
        {
          id: '3',
          title: 'Energetic Beats',
          artist: 'DJfly AI',
          bpm: 128,
          key: 'Am',
          genre: 'Techno',
          previewUrl:
            'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg',
          duration: 180,
        },
        {
          id: '4',
          title: 'Chill Sunset',
          artist: 'DJfly AI',
          bpm: 110,
          key: 'F',
          genre: 'Ambient',
          previewUrl:
            'https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg',
          duration: 180,
        },
        {
          id: '5',
          title: 'Party Anthem',
          artist: 'DJfly AI',
          bpm: 132,
          key: 'D',
          genre: 'Progressive',
          previewUrl:
            'https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg',
          duration: 180,
        },
      ];

      setGeneratedTracks(mockTracks);
      setStatus('complete');
      appState.queue = mockTracks;
    }, 3000);
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
                ✅ Playlist Generated!
              </h2>
              <p className="mb-4">
                Perfect tracks selected based on: "{prompt}"
              </p>
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

const PlayerPage = () => {
  const [isPlaying, setIsPlaying] = useState(appState.isPlaying);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentTrack, setCurrentTrack] = useState(
    appState.currentTrack || appState.queue[0]
  );
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'one' | 'all'>('none');

  // DJ Effects State
  const [bassLevel, setBassLevel] = useState(50);
  const [midLevel, setMidLevel] = useState(50);
  const [trebleLevel, setTrebleLevel] = useState(50);
  const [filterFreq, setFilterFreq] = useState(20000);
  const [reverbWet, setReverbWet] = useState(0);
  const [delayTime, setDelayTime] = useState(0);
  const [showEffects, setShowEffects] = useState(false);

  // Visualization state
  const [vuMeter, setVuMeter] = useState({ left: 0, right: 0 });
  const [detectedBPM, setDetectedBPM] = useState(120);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNextTrack = useCallback(() => {
    const currentIndex = appState.queue.findIndex(
      (t) => t.id === currentTrack?.id
    );
    if (currentIndex !== -1) {
      let nextIndex;
      if (shuffle) {
        nextIndex = Math.floor(Math.random() * appState.queue.length);
      } else {
        nextIndex = (currentIndex + 1) % appState.queue.length;
      }
      const nextTrack = appState.queue[nextIndex];
      appState.currentTrack = nextTrack;
      setCurrentTrack(nextTrack);
    }
  }, [currentTrack, shuffle]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Update VU meter and BPM detection
      const vu = audioEngine.getVUMeter();
      setVuMeter(vu);
      const bpm = audioEngine.getBPM();
      setDetectedBPM(bpm);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeat === 'all' || appState.queue.length > 1) {
        handleNextTrack();
      } else {
        setIsPlaying(false);
        appState.isPlaying = false;
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, handleNextTrack, repeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack && currentTrack.previewUrl) {
      if (audio.src !== currentTrack.previewUrl) {
        audio.src = currentTrack.previewUrl;
        // Connect audio engine when new track loads
        audio.addEventListener('loadeddata', () => {
          audioEngine.connectAudioElement(audio);
        }, { once: true });
      }
      if (isPlaying) {
        audioEngine.resumeContext().then(() => {
          audio.play().catch((e) => {
            console.error('Audio play failed:', e);
            setIsPlaying(false);
            appState.isPlaying = false;
          });
        });
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  // Apply audio effects in real-time
  useEffect(() => {
    audioEngine.applyEffects({
      bass: bassLevel,
      mid: midLevel,
      treble: trebleLevel,
      lowPassFilter: filterFreq,
      reverb: reverbWet,
      delay: delayTime,
      gain: volume
    });
  }, [bassLevel, midLevel, trebleLevel, filterFreq, reverbWet, delayTime, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    appState.isPlaying = newIsPlaying;
  };

  const nextTrack = () => {
    handleNextTrack();
  };

  const prevTrack = () => {
    const currentIndex = appState.queue.findIndex(
      (t) => t.id === currentTrack?.id
    );
    if (currentIndex !== -1) {
      const prevIndex =
        (currentIndex - 1 + appState.queue.length) % appState.queue.length;
      const prevTrack = appState.queue[prevIndex];
      appState.currentTrack = prevTrack;
      setCurrentTrack(prevTrack);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const trackDuration = duration || currentTrack?.duration || 180;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <audio ref={audioRef} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎧 Player</h1>

        {currentTrack ? (
          <div className="text-center">
            <div className="w-64 h-64 bg-gray-800 rounded-xl mx-auto mb-8 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🎵
              </div>
            </div>

            <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
            <p className="text-gray-400 mb-8">{currentTrack.artist}</p>

            <div className="mb-4">
              <div 
                className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2 cursor-pointer relative"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                  style={{ width: `${(currentTime / trackDuration) * 100}%` }}
                ></div>
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                  style={{ left: `${(currentTime / trackDuration) * 100}%`, marginLeft: '-8px' }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-purple-400">BPM: {detectedBPM}</span>
                  <span className="text-xs text-green-400">
                    L:{Math.round(vuMeter.left)}% R:{Math.round(vuMeter.right)}%
                  </span>
                </div>
                <span>{formatTime(trackDuration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6 mb-8">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-full hover:bg-gray-800 transition-colors ${shuffle ? 'text-blue-400' : 'text-gray-400'}`}
                aria-label="Shuffle"
              >
                🔀
              </button>
              <button
                onClick={prevTrack}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Previous track"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={nextTrack}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                aria-label="Next track"
              >
                ⏭
              </button>
              <button
                onClick={() => setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none')}
                className={`p-2 rounded-full hover:bg-gray-800 transition-colors ${repeat !== 'none' ? 'text-blue-400' : 'text-gray-400'}`}
                aria-label="Repeat"
              >
                {repeat === 'one' ? '🔂' : '🔁'}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <span className="text-gray-400">🔈</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 accent-blue-500"
              />
              <span className="text-gray-400 w-10 text-right">{volume}%</span>
            </div>

            {/* DJ Effects Panel */}
            <div className="mt-8">
              <button
                onClick={() => setShowEffects(!showEffects)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg mb-4 transition-colors"
              >
                🎛️ DJ Effects {showEffects ? '▼' : '▶'}
              </button>

              {showEffects && (
                <div className="bg-gray-800 p-6 rounded-xl mb-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* EQ Section */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">🎚️ EQ</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Bass
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={bassLevel}
                            onChange={(e) =>
                              setBassLevel(Number(e.target.value))
                            }
                            className="w-full accent-purple-500"
                          />
                          <span className="text-xs text-gray-400">
                            {bassLevel}%
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Mid
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={midLevel}
                            onChange={(e) =>
                              setMidLevel(Number(e.target.value))
                            }
                            className="w-full accent-purple-500"
                          />
                          <span className="text-xs text-gray-400">
                            {midLevel}%
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Treble
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={trebleLevel}
                            onChange={(e) =>
                              setTrebleLevel(Number(e.target.value))
                            }
                            className="w-full accent-purple-500"
                          />
                          <span className="text-xs text-gray-400">
                            {trebleLevel}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Effects Section */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">✨ Effects</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Filter (Hz)
                          </label>
                          <input
                            type="range"
                            min="200"
                            max="20000"
                            value={filterFreq}
                            onChange={(e) =>
                              setFilterFreq(Number(e.target.value))
                            }
                            className="w-full accent-blue-500"
                          />
                          <span className="text-xs text-gray-400">
                            {filterFreq} Hz
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Reverb
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={reverbWet}
                            onChange={(e) =>
                              setReverbWet(Number(e.target.value))
                            }
                            className="w-full accent-blue-500"
                          />
                          <span className="text-xs text-gray-400">
                            {reverbWet}%
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Delay
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={delayTime}
                            onChange={(e) =>
                              setDelayTime(Number(e.target.value))
                            }
                            className="w-full accent-blue-500"
                          />
                          <span className="text-xs text-gray-400">
                            {delayTime}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Buttons */}
                  <div className="mt-6 flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        audioEngine.applyPreset('party');
                        setBassLevel(75);
                        setMidLevel(60);
                        setTrebleLevel(70);
                        setFilterFreq(15000);
                        setReverbWet(20);
                        setDelayTime(10);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm"
                    >
                      🔥 Party Mode
                    </button>
                    <button
                      onClick={() => {
                        audioEngine.applyPreset('chill');
                        setBassLevel(40);
                        setMidLevel(55);
                        setTrebleLevel(45);
                        setFilterFreq(8000);
                        setReverbWet(40);
                        setDelayTime(25);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                    >
                      🌊 Chill Vibes
                    </button>
                    <button
                      onClick={() => {
                        audioEngine.applyPreset('vocal');
                        setBassLevel(30);
                        setMidLevel(70);
                        setTrebleLevel(60);
                        setFilterFreq(12000);
                        setReverbWet(15);
                        setDelayTime(5);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-sm"
                    >
                      🎤 Vocal Boost
                    </button>
                    <button
                      onClick={() => {
                        audioEngine.applyPreset('clear');
                        setBassLevel(50);
                        setMidLevel(50);
                        setTrebleLevel(50);
                        setFilterFreq(22000);
                        setReverbWet(0);
                        setDelayTime(0);
                      }}
                      className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
                    >
                      🔄 Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                Up Next ({appState.queue.length} tracks)
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {appState.queue.map((track, index) => (
                  <div
                    key={track.id}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-700 ${track.id === currentTrack.id ? 'bg-blue-900 bg-opacity-30' : 'bg-gray-800'}`}
                    onClick={() => {
                      setCurrentTrack(track);
                      appState.currentTrack = track;
                    }}
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-gray-400">{index + 1}.</span>
                      <div className="flex-1">
                        <p
                          className={`${track.id === currentTrack.id ? 'text-blue-400 font-semibold' : ''}`}
                        >
                          {track.title}
                        </p>
                        <p className="text-sm text-gray-400">
                          {track.artist} • {track.genre}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">
                          {track.bpm} BPM
                        </span>
                        <br />
                        <span className="text-xs text-purple-400">
                          {track.key}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400 mb-6">No tracks in queue</p>
            <Link
              to="/studio"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              Add Tracks
            </Link>
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/studio/match" element={<MagicMatchPage />} />
          <Route path="/studio/set" element={<MagicSetPage />} />
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Authentication Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
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
