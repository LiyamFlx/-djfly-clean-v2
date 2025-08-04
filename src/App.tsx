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
        <Link to="/studio" className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 transition-colors">Studio</Link>
        <Link to="/player" className="bg-purple-600 px-6 py-3 rounded hover:bg-purple-700 transition-colors">Player</Link>
      </div>
    </div>
  </div>
);

const StudioPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-8">Studio</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Link to="/studio/match" className="bg-blue-600 p-8 rounded-xl hover:bg-blue-700 transition-colors">
          <h2 className="text-xl font-bold mb-4">🎯 Magic Match</h2>
          <p>Analyze crowd and generate playlist</p>
        </Link>
        <Link to="/studio/set" className="bg-purple-600 p-8 rounded-xl hover:bg-purple-700 transition-colors">
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
        { id: 1, title: 'Track 1', artist: 'Artist 1', bpm: 120, key: 'C' },
        { id: 2, title: 'Track 2', artist: 'Artist 2', bpm: 122, key: 'C#' },
        { id: 3, title: 'Track 3', artist: 'Artist 3', bpm: 124, key: 'D' },
      ];
    }, 2000);
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
                <div className="h-full bg-blue-500 animate-pulse"></div>
              </div>
              <p className="mt-2">Analyzing crowd noise...</p>
            </div>
          </div>
        )}

        {status === 'complete' && (
          <div className="text-center">
            <div className="bg-green-900 bg-opacity-30 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-2">Analysis Complete!</h2>
              <p className="mb-4">We've generated the perfect playlist for your crowd.</p>
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
                  <div key={track.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
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
  const [tracks, setTracks] = useState([
    { id: 1, title: 'Track 1', artist: 'Artist 1', bpm: 120, key: 'C', selected: false },
    { id: 2, title: 'Track 2', artist: 'Artist 2', bpm: 122, key: 'C#', selected: false },
    { id: 3, title: 'Track 3', artist: 'Artist 3', bpm: 124, key: 'D', selected: false },
  ]);

  const toggleTrack = (id: number) => {
    setTracks(tracks.map(track => 
      track.id === id ? { ...track, selected: !track.selected } : track
    ));
  };

  const addToQueue = () => {
    const selectedTracks = tracks.filter(track => track.selected);
    appState.queue = [...appState.queue, ...selectedTracks];
    alert(`${selectedTracks.length} tracks added to queue!`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎵 Magic Set</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Tracks</h2>
          <div className="space-y-2">
            {tracks.map(track => (
              <div 
                key={track.id} 
                className={`p-4 rounded-lg cursor-pointer transition-colors ${track.selected ? 'bg-blue-900 bg-opacity-50' : 'bg-gray-800 hover:bg-gray-750'}`}
                onClick={() => toggleTrack(track.id)}
              >
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={track.selected}
                    onChange={() => {}}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="ml-4 flex-1">
                    <p className="font-medium">{track.title}</p>
                    <p className="text-gray-400 text-sm">{track.artist}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {track.bpm} BPM • {track.key}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => {
              const selected = tracks.filter(t => t.selected);
              setTracks(tracks.map(t => ({ ...t, selected: false })));
              alert(`Cleared ${selected.length} selections`);
            }}
            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-900 hover:bg-opacity-30 transition-colors"
          >
            Clear Selection
          </button>
          <button 
            onClick={addToQueue}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add to Queue
          </button>
        </div>
      </div>
    </div>
  );
};

const PlayerPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  
  const currentTrack = appState.currentTrack || appState.queue[0];
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    appState.isPlaying = !isPlaying;
  };
  
  const nextTrack = () => {
    const currentIndex = appState.queue.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % appState.queue.length;
    appState.currentTrack = appState.queue[nextIndex];
    setCurrentTime(0);
  };
  
  const prevTrack = () => {
    const currentIndex = appState.queue.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + appState.queue.length) % appState.queue.length;
    appState.currentTrack = appState.queue[prevIndex];
    setCurrentTime(0);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
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
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(currentTime / 180) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>0:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
                <span>3:00</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-6 mb-8">
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
            
            <div className="mt-12">
              <h3 className="text-lg font-semibold mb-4">Up Next</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {appState.queue.map((track, index) => (
                  <div 
                    key={track.id} 
                    className={`p-3 rounded-lg ${track.id === currentTrack.id ? 'bg-blue-900 bg-opacity-30' : 'bg-gray-800'}`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-gray-400">{index + 1}.</span>
                      <div className="flex-1">
                        <p className={`${track.id === currentTrack.id ? 'text-blue-400' : ''}`}>{track.title}</p>
                        <p className="text-sm text-gray-400">{track.artist}</p>
                      </div>
                      <span className="text-xs text-gray-500">{track.bpm} BPM</span>
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
          <Link to="/" className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors">
            🏠 Home
          </Link>
          <Link to="/studio" className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors">
            🎛️ Studio
          </Link>
          <Link to="/player" className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors">
            🎧 Player
          </Link>
        </div>
      </div>
    </nav>
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
        </Routes>
      </div>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;
