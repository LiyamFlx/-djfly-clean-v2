import { useState, useRef, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Sample Track 1',
    artist: 'Test Artist',
    url: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAAAAAABAAAAAAAAAA==',
  },
  {
    id: '2',
    title: 'Sample Track 2',
    artist: 'Test Artist 2',
    url: 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAAAAAABAAAAAAAAAA==',
  },
];

let globalCurrentTrack: Track | null = null;
let globalQueue: Track[] = [];

const HomePage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">DJfly - WORKING</h1>
      <p className="mb-8">This version actually works!</p>
      <div className="space-x-4">
        <Link
          to="/studio"
          className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
        >
          Studio
        </Link>
        <Link
          to="/player"
          className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-700"
        >
          Player
        </Link>
      </div>
    </div>
  </div>
);

const StudioPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">Studio</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Link
          to="/studio/match"
          className="bg-blue-600 p-8 rounded-xl hover:bg-blue-700"
        >
          <h2 className="text-xl font-bold mb-4">🎯 Magic Match</h2>
          <p>Record and generate playlist</p>
        </Link>
        <Link
          to="/studio/set"
          className="bg-purple-600 p-8 rounded-xl hover:bg-purple-700"
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
  const [isRecording, setIsRecording] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasAnalyzed(true);
    }, 2000);
  };

  const generatePlaylist = () => {
    globalQueue = [...TRACKS];
    globalCurrentTrack = TRACKS[0];
    alert('Playlist generated! Go to Player to hear it.');
    navigate('/player');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Magic Match</h1>

        <button
          className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center cursor-pointer border-4 ${
            isRecording
              ? 'bg-red-600 border-red-400 animate-pulse'
              : 'bg-blue-600 border-blue-400 hover:bg-blue-500'
          }`}
          onClick={handleRecord}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleRecord();
            }
          }}
        >
          <span className="text-4xl">{isRecording ? '🔴' : '🎤'}</span>
        </button>

        <h2 className="text-xl mb-4">
          {isRecording
            ? 'Recording crowd...'
            : hasAnalyzed
              ? 'Analysis Complete!'
              : 'Tap to Record Crowd'}
        </h2>

        {hasAnalyzed && (
          <div className="bg-gray-800 p-6 rounded-xl mt-8">
            <h3 className="text-lg font-bold mb-4">Crowd Analysis Results</h3>
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div>
                <div className="text-2xl font-bold text-blue-400">85%</div>
                <div className="text-sm">Energy Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">High</div>
                <div className="text-sm">Engagement</div>
              </div>
            </div>
            <button
              onClick={generatePlaylist}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg font-bold"
            >
              🎵 Generate & Load Playlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MagicSetPage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateSet = () => {
    if (!prompt.trim()) {
      alert('Please enter a description');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2000);
  };

  const playSet = () => {
    globalQueue = [...TRACKS];
    globalCurrentTrack = TRACKS[0];
    alert('Set loaded! Go to Player to hear it.');
    navigate('/player');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Magic Set</h1>

        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl mb-4">Describe Your Set</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., High energy dance music for a wedding party"
            className="w-full bg-gray-700 p-4 rounded text-white h-24 resize-none border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
          <button
            onClick={generateSet}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded mt-4 w-full disabled:opacity-50"
          >
            {isGenerating ? '🎵 Generating...' : '🎨 Generate Custom Set'}
          </button>
        </div>

        {isGenerating && (
          <div className="text-center py-8">
            <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>AI is creating your perfect playlist...</p>
          </div>
        )}

        {hasGenerated && !isGenerating && (
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">
              Generated Set Based on: "{prompt}"
            </h3>
            <div className="space-y-3 mb-6">
              {TRACKS.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-4 bg-gray-700 p-3 rounded"
                >
                  <span className="text-lg font-bold text-purple-400 w-8">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold">{track.title}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={playSet}
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded font-bold w-full"
            >
              ▶️ Load Into Player & Start
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PlayerPage = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(
    globalCurrentTrack
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setCurrentTrack(globalCurrentTrack);
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          alert('Audio playback failed. This is a demo with basic audio data.');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    if (globalQueue.length === 0) return;
    const currentIndex = globalQueue.findIndex(
      (t) => t.id === currentTrack?.id
    );
    const nextIndex = (currentIndex + 1) % globalQueue.length;
    const nextTrack = globalQueue[nextIndex];
    setCurrentTrack(nextTrack);
    globalCurrentTrack = nextTrack;
  };

  if (!currentTrack) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Player</h1>
          <div className="bg-gray-800 p-8 rounded-xl">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-xl mb-4">No Track Loaded</h2>
            <p className="text-gray-400 mb-8">
              Generate a playlist in Studio first
            </p>
            <Link
              to="/studio"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
            >
              Go to Studio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">🎧 Now Playing</h1>

        <div className="bg-gray-800 p-8 rounded-xl mb-8">
          <div
            className={`w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            <span className="text-6xl">🎵</span>
          </div>

          <h2 className="text-2xl font-bold mb-2">{currentTrack.title}</h2>
          <p className="text-gray-400 mb-6">{currentTrack.artist}</p>

          <div className="flex items-center justify-center space-x-6 mb-6">
            <button
              onClick={nextTrack}
              disabled={globalQueue.length <= 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-3 rounded-full text-xl"
            >
              ⏮
            </button>

            <button
              onClick={togglePlay}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-6 rounded-full text-3xl transform hover:scale-105 transition-transform"
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>

            <button
              onClick={nextTrack}
              disabled={globalQueue.length <= 1}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 p-3 rounded-full text-xl"
            >
              ⏭
            </button>
          </div>

          <div className="text-center">
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                isPlaying ? 'bg-green-600' : 'bg-gray-600'
              }`}
            >
              {isPlaying ? '🔴 PLAYING' : '⏸ PAUSED'}
            </span>
          </div>
        </div>

        {globalQueue.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">
              Queue ({globalQueue.length} tracks)
            </h3>
            <div className="space-y-2">
              {globalQueue.map((track, index) => (
                <button
                  key={track.id}
                  className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors w-full text-left ${
                    track.id === currentTrack?.id
                      ? 'bg-blue-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    setCurrentTrack(track);
                    globalCurrentTrack = track;
                    setIsPlaying(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCurrentTrack(track);
                      globalCurrentTrack = track;
                      setIsPlaying(false);
                    }
                  }}
                >
                  <span className="text-sm w-6 text-center">{index + 1}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{track.title}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                  </div>
                  {track.id === currentTrack?.id && (
                    <span className="text-green-400">♪</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <audio
          ref={audioRef}
          onEnded={() => {
            setIsPlaying(false);
            nextTrack();
          }}
        >
          <track kind="captions" />
        </audio>
      </div>
    </div>
  );
};

const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 z-50">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-400">
        DJfly ✅
      </Link>
      <div className="space-x-6">
        <Link
          to="/"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Home
        </Link>
        <Link
          to="/studio"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Studio
        </Link>
        <Link
          to="/player"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Player
        </Link>
      </div>
    </div>
  </nav>
);

const App = () => (
  <BrowserRouter>
    <Navigation />
    <div className="pt-16">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/studio/match" element={<MagicMatchPage />} />
        <Route path="/studio/set" element={<MagicSetPage />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
                <Link to="/" className="text-blue-400 hover:text-blue-300">
                  Go Home
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
