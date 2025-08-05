import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
  
  const handleAnalyze = async () => {
    setStatus('recording');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();

      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach(track => track.stop()); // Stop microphone access

        // Simulate analysis and generate playlist
        setStatus('complete');
        // In a real app, you'd analyze the recorded audio data.
        // For now, we just generate a mock playlist as before.
        appState.queue = [
          { id: 'match1', title: 'Vibe-Matched Track A', artist: 'Mic Analyzer', bpm: 125, key: 'Am', previewUrl: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2bbe651082.mp3', duration: 30 },
          { id: 'match2', title: 'Vibe-Matched Track B', artist: 'Mic Analyzer', bpm: 128, key: 'G', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/08/audio_79071a44a2.mp3', duration: 30 },
          { id: 'match3', title: 'Vibe-Matched Track C', artist: 'Mic Analyzer', bpm: 126, key: 'C', previewUrl: 'https://cdn.pixabay.com/audio/2023/09/14/audio_3702ff6b59.mp3', duration: 30 },
        ];

      }, 5000); // Record for 5 seconds

    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required for Magic Match. Please allow access and try again.");
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
    
    // Simulate AI generation
    setTimeout(() => {
      const mockTracks: Track[] = [
        { id: '1', title: 'Summer Vibes', artist: 'AI Generated', bpm: 120, key: 'C', genre: 'Electronic', previewUrl: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2bbe651082.mp3', duration: 30 },
        { id: '2', title: 'Deep House Flow', artist: 'AI Generated', bpm: 122, key: 'G', genre: 'House', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/08/audio_79071a44a2.mp3', duration: 30 },
        { id: '3', title: 'Energetic Beats', artist: 'AI Generated', bpm: 128, key: 'Am', genre: 'Techno', previewUrl: 'https://cdn.pixabay.com/audio/2023/09/14/audio_3702ff6b59.mp3', duration: 30 },
        { id: '4', title: 'Chill Sunset', artist: 'AI Generated', bpm: 110, key: 'F', genre: 'Ambient', previewUrl: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2bbe651082.mp3', duration: 30 },
        { id: '5', title: 'Party Anthem', artist: 'AI Generated', bpm: 132, key: 'D', genre: 'Progressive', previewUrl: 'https://cdn.pixabay.com/audio/2024/02/08/audio_79071a44a2.mp3', duration: 30 },
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
              <h2 className="text-xl font-semibold mb-4">Describe Your Perfect Playlist</h2>
              <p className="text-gray-300 mb-4">
                Tell our AI what kind of playlist you want. Be specific about mood, genre, energy level, or the occasion.
              </p>
              
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Create an upbeat electronic playlist for a beach party with progressive house and tech house tracks that build energy throughout the night...'"
                className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                maxLength={500}
              />
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">{prompt.length}/500 characters</span>
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
                  onClick={() => setPrompt('Create a high-energy electronic dance playlist with progressive house and techno tracks for a nightclub setting')}
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-blue-400">🔥 High Energy Club</div>
                  <div className="text-sm text-gray-300">Progressive house & techno</div>
                </button>
                
                <button
                  onClick={() => setPrompt('Generate a chill downtempo playlist with ambient and deep house for a sunset lounge session')}
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-orange-400">🌅 Sunset Lounge</div>
                  <div className="text-sm text-gray-300">Ambient & deep house</div>
                </button>
                
                <button
                  onClick={() => setPrompt('Create a workout playlist with high BPM electronic tracks that motivate and energize')}
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-green-400">💪 Workout Energy</div>
                  <div className="text-sm text-gray-300">High BPM motivation</div>
                </button>
                
                <button
                  onClick={() => setPrompt('Generate a sophisticated deep house playlist for an upscale cocktail party with smooth transitions')}
                  className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-purple-400">🍸 Cocktail Party</div>
                  <div className="text-sm text-gray-300">Sophisticated deep house</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'generating' && (
          <div className="text-center mb-8">
            <div className="bg-blue-900 bg-opacity-30 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">🤖 AI is Generating Your Playlist...</h2>
              <p className="text-gray-300 mb-6">Analyzing your request: "{prompt}"</p>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div className="bg-blue-500 h-3 rounded-full animate-pulse" style={{ width: '60%' }}></div>
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
              <h2 className="text-2xl font-bold mb-2">✅ Playlist Generated!</h2>
              <p className="mb-4">Perfect tracks selected based on: "{prompt}"</p>
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
              <h3 className="text-xl font-semibold mb-4">Generated Tracks ({generatedTracks.length})</h3>
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
                          <p className="text-gray-400 text-sm">{track.artist}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">{track.bpm} BPM • {track.key}</div>
                        <div className="text-xs text-purple-400">{track.genre}</div>
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
  const [volume, setVolume] = useState(80);
  const [currentTrack, setCurrentTrack] = useState(appState.currentTrack || appState.queue[0]);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNextTrack = () => {
    const currentIndex = appState.queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % appState.queue.length;
      const nextTrack = appState.queue[nextIndex];
      appState.currentTrack = nextTrack;
      setCurrentTrack(nextTrack);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => handleNextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, handleNextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack && currentTrack.previewUrl) {
      if (audio.src !== currentTrack.previewUrl) {
        audio.src = currentTrack.previewUrl;
      }
      if (isPlaying) {
        audio.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);
  
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
    const currentIndex = appState.queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + appState.queue.length) % appState.queue.length;
      const prevTrack = appState.queue[prevIndex];
      appState.currentTrack = prevTrack;
      setCurrentTrack(prevTrack);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };

  const trackDuration = currentTrack?.duration || 180; // default to 3 mins

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
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(currentTime / trackDuration) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                <span>{Math.floor(trackDuration / 60)}:{Math.floor(trackDuration % 60).toString().padStart(2, '0')}</span>
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
