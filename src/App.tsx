import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Simple state management
let appState = {
  currentTrack: null as any,
  queue: [] as any[],
  isPlaying: false
};

const HomePage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">DJfly</h1>
      <p className="text-xl mb-8">AI-powered DJ platform</p>
      <div className="space-x-4">
        <Link to="/studio" className="bg-blue-600 px-6 py-3 rounded">Studio</Link>
        <Link to="/player" className="bg-purple-600 px-6 py-3 rounded">Player</Link>
      </div>
    </div>
  </div>
);

const StudioPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">Studio</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Link to="/studio/match" className="bg-blue-600 p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4">🎯 Magic Match</h2>
          <p>Analyze crowd and generate playlist</p>
        </Link>
        <Link to="/studio/set" className="bg-purple-600 p-8 rounded-xl">
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
  
  const handleAnalyze = () => {
    setStatus('recording');
    setTimeout(() => {
      setStatus('complete');
      appState.queue = [
        { id: '1', title: 'High Energy Track', artist: 'AI Generated' },
        { id: '2', title: 'Crowd Pleaser', artist: 'DJ AI' }
      ];
      appState.currentTrack = appState.queue[0];
    }, 2000);
  };
  
  const goToPlayer = () => {
    navigate('/player');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">Magic Match</h1>
        
        <div 
          className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center cursor-pointer ${
            status === 'recording' ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'
          }`}
          onClick={handleAnalyze}
        >
          <span className="text-4xl">{status === 'recording' ? '🔴' : '🎤'}</span>
        </div>
        
        <h2 className="text-xl mb-8">
          {status === 'ready' && 'Tap to analyze crowd'}
          {status === 'recording' && 'Listening...'}
          {status === 'complete' && 'Analysis complete!'}
        </h2>
        
        {status === 'complete' && (
          <div className="bg-gray-800 p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold mb-4">Crowd Analysis</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold text-blue-400">80%</div>
                <div className="text-sm">Energy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">High</div>
                <div className="text-sm">Engagement</div>
              </div>
            </div>
            <button 
              onClick={goToPlayer}
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded font-bold"
            >
              🎵 Go to Player
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
  const [status, setStatus] = useState('ready');

  const generateSet = () => {
    if (!prompt.trim()) {
      alert('Please enter a description');
      return;
    }
    
    setStatus('generating');
    setTimeout(() => {
      setStatus('complete');
      appState.queue = [
        { id: '1', title: 'Custom Track 1', artist: 'Generated' },
        { id: '2', title: 'Custom Track 2', artist: 'AI Mix' }
      ];
      appState.currentTrack = appState.queue[0];
    }, 2000);
  };

  const goToPlayer = () => {
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
            placeholder="e.g., High energy dance music for a party"
            className="w-full bg-gray-700 p-4 rounded text-white h-24 resize-none"
          />
          <button 
            onClick={generateSet}
            disabled={status === 'generating'}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded mt-4 w-full disabled:opacity-50"
          >
            {status === 'generating' ? 'Generating...' : 'Generate Set'}
          </button>
        </div>
        
        {status === 'generating' && (
          <div className="text-center py-8">
            <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Creating your playlist...</p>
          </div>
        )}
        
        {status === 'complete' && (
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Generated Set</h3>
            <div className="space-y-3 mb-6">
              {appState.queue.map((track: any, index: number) => (
                <div key={track.id} className="flex items-center space-x-4 bg-gray-700 p-3 rounded">
                  <span className="text-lg font-bold text-purple-400">{index + 1}</span>
                  <div>
                    <div className="font-semibold">{track.title}</div>
                    <div className="text-gray-400">{track.artist}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={goToPlayer}
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded font-bold w-full"
            >
              ▶️ Go to Player
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PlayerPage = () => {
  const [, forceUpdate] = useState({});
  
  // Force re-render when needed
  const refresh = () => forceUpdate({});

  const togglePlay = () => {
    appState.isPlaying = !appState.isPlaying;
    refresh();
  };

  const nextTrack = () => {
    const currentIndex = appState.queue.findIndex((t: any) => t.id === appState.currentTrack?.id);
    const nextIndex = (currentIndex + 1) % appState.queue.length;
    appState.currentTrack = appState.queue[nextIndex];
    refresh();
  };

  if (!appState.currentTrack) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Player</h1>
          <div className="bg-gray-800 p-8 rounded-xl">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-xl mb-4">No Track Loaded</h2>
            <p className="text-gray-400 mb-8">Generate a playlist in Studio first</p>
            <Link to="/studio" className="bg-blue-600 px-6 py-3 rounded">Go to Studio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-8">🎧 Player</h1>
        
        <div className="bg-gray-800 p-8 rounded-xl mb-8">
          <div className={`w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center ${
            appState.isPlaying ? 'animate-spin' : ''
          }`} style={{ animationDuration: '4s' }}>
            <span className="text-6xl">🎵</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{appState.currentTrack.title}</h2>
          <p className="text-gray-400 mb-6">{appState.currentTrack.artist}</p>
          
          <div className="flex items-center justify-center space-x-6 mb-6">
            <button 
              onClick={nextTrack}
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
            >
              ⏮
            </button>
            
            <button 
              onClick={togglePlay}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-6 rounded-full text-3xl"
            >
              {appState.isPlaying ? '⏸' : '▶️'}
            </button>
            
            <button 
              onClick={nextTrack}
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
            >
              ⏭
            </button>
          </div>
          
          <div className="text-center">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              appState.isPlaying ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              {appState.isPlaying ? '🔴 PLAYING' : '⏸ PAUSED'}
            </span>
          </div>
        </div>
        
        {appState.queue.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-4">Queue ({appState.queue.length} tracks)</h3>
            <div className="space-y-2">
              {appState.queue.map((track: any, index: number) => (
                <div 
                  key={track.id} 
                  className={`flex items-center space-x-3 p-3 rounded cursor-pointer ${
                    track.id === appState.currentTrack?.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    appState.currentTrack = track;
                    refresh();
                  }}
                >
                  <span className="text-sm w-6">{index + 1}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{track.title}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 z-50">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-400">DJfly</Link>
      <div className="space-x-6">
        <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
        <Link to="/studio" className="text-gray-300 hover:text-white">Studio</Link>
        <Link to="/player" className="text-gray-300 hover:text-white">Player</Link>
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
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;