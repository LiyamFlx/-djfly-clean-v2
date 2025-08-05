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
    {/* Demo Banner */}
    <div className="bg-yellow-600 text-black text-center py-2 mb-4 rounded">
      🚀 DJfly v1.2.0 Demo - Live Testing Environment
    </div>
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
    {/* Demo Banner */}
    <div className="bg-yellow-600 text-black text-center py-2 mb-4 rounded">
      🚀 DJfly v1.2.0 Demo - Live Testing Environment
    </div>
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
          { id: 'match1', title: 'Summer Electronic Vibes', artist: 'AI Generated', bpm: 125, key: 'Am', previewUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 180 },
          { id: 'match2', title: 'Deep House Flow', artist: 'AI Generated', bpm: 128, key: 'G', previewUrl: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg', duration: 180 },
          { id: 'match3', title: 'Progressive Energy', artist: 'AI Generated', bpm: 126, key: 'C', previewUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', duration: 180 },
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
    
    // Try real API first, fallback to mock
    try {
      const { generatePlaylistWithAPI } = await import('./services/api');
      generatePlaylistWithAPI(description, (progress) => {
        console.log('Generation progress:', progress);
      }).then((tracks) => {
        if (tracks.length > 0) {
          setGeneratedTracks(tracks);
          setStatus('complete');
          appState.queue = tracks;
        } else {
          throw new Error('No tracks generated');
        }
      }).catch(() => {
        // Fallback to demo tracks
        const mockTracks: Track[] = [
          { id: '1', title: 'Summer Vibes', artist: 'DJfly AI', bpm: 120, key: 'C', genre: 'Electronic', previewUrl: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg', duration: 180 },
          { id: '2', title: 'Deep House Flow', artist: 'DJfly AI', bpm: 122, key: 'G', genre: 'House', previewUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', duration: 180 },
          { id: '3', title: 'Energetic Beats', artist: 'DJfly AI', bpm: 128, key: 'Am', genre: 'Techno', previewUrl: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg', duration: 180 },
          { id: '4', title: 'Chill Sunset', artist: 'DJfly AI', bpm: 110, key: 'F', genre: 'Ambient', previewUrl: 'https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg', duration: 180 },
          { id: '5', title: 'Party Anthem', artist: 'DJfly AI', bpm: 132, key: 'D', genre: 'Progressive', previewUrl: 'https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg', duration: 180 },
        ];
        setGeneratedTracks(mockTracks);
        setStatus('complete');
        appState.queue = mockTracks;
      });
    } catch {
      // Fallback to demo tracks immediately if import fails
      setTimeout(() => {
        const mockTracks: Track[] = [
          { id: '1', title: 'Summer Vibes', artist: 'DJfly AI', bpm: 120, key: 'C', genre: 'Electronic', previewUrl: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg', duration: 180 },
          { id: '2', title: 'Deep House Flow', artist: 'DJfly AI', bpm: 122, key: 'G', genre: 'House', previewUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', duration: 180 },
          { id: '3', title: 'Energetic Beats', artist: 'DJfly AI', bpm: 128, key: 'Am', genre: 'Techno', previewUrl: 'https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg', duration: 180 },
          { id: '4', title: 'Chill Sunset', artist: 'DJfly AI', bpm: 110, key: 'F', genre: 'Ambient', previewUrl: 'https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg', duration: 180 },
          { id: '5', title: 'Party Anthem', artist: 'DJfly AI', bpm: 132, key: 'D', genre: 'Progressive', previewUrl: 'https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg', duration: 180 },
        ];
        setGeneratedTracks(mockTracks);
        setStatus('complete');
        appState.queue = mockTracks;
      }, 3000);
    }
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
  
  // DJ Effects State
  const [bassLevel, setBassLevel] = useState(50);
  const [midLevel, setMidLevel] = useState(50);
  const [trebleLevel, setTrebleLevel] = useState(50);
  const [filterFreq, setFilterFreq] = useState(20000);
  const [reverbWet, setReverbWet] = useState(0);
  const [delayTime, setDelayTime] = useState(0);
  const [showEffects, setShowEffects] = useState(false);

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
        audio.play().catch(e => {
          console.error("Audio play failed:", e);
          setIsPlaying(false);
          appState.isPlaying = false;
        });
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
                          <label className="block text-sm text-gray-400 mb-2">Bass</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={bassLevel} 
                            onChange={(e) => setBassLevel(Number(e.target.value))}
                            className="w-full accent-purple-500"
                          />
                          <span className="text-xs text-gray-400">{bassLevel}%</span>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Mid</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={midLevel} 
                            onChange={(e) => setMidLevel(Number(e.target.value))}
                            className="w-full accent-purple-500"
                          />
                          <span className="text-xs text-gray-400">{midLevel}%</span>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Treble</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={trebleLevel} 
                            onChange={(e) => setTrebleLevel(Number(e.target.value))}
                            className="w-full accent-purple-500"
                          />
                          <span className="text-xs text-gray-400">{trebleLevel}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Effects Section */}
                    <div>
                      <h4 className="text-lg font-semibold mb-4">✨ Effects</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Filter (Hz)</label>
                          <input 
                            type="range" 
                            min="200" 
                            max="20000" 
                            value={filterFreq} 
                            onChange={(e) => setFilterFreq(Number(e.target.value))}
                            className="w-full accent-blue-500"
                          />
                          <span className="text-xs text-gray-400">{filterFreq} Hz</span>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Reverb</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={reverbWet} 
                            onChange={(e) => setReverbWet(Number(e.target.value))}
                            className="w-full accent-blue-500"
                          />
                          <span className="text-xs text-gray-400">{reverbWet}%</span>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Delay</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={delayTime} 
                            onChange={(e) => setDelayTime(Number(e.target.value))}
                            className="w-full accent-blue-500"
                          />
                          <span className="text-xs text-gray-400">{delayTime}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preset Buttons */}
                  <div className="mt-6 flex gap-2 flex-wrap">
                    <button 
                      onClick={() => {
                        setBassLevel(80); setMidLevel(60); setTrebleLevel(70);
                        setFilterFreq(15000); setReverbWet(20); setDelayTime(10);
                      }}
                      className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm"
                    >
                      🔥 Party Mode
                    </button>
                    <button 
                      onClick={() => {
                        setBassLevel(30); setMidLevel(50); setTrebleLevel(40);
                        setFilterFreq(8000); setReverbWet(50); setDelayTime(30);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
                    >
                      🌊 Chill Vibes
                    </button>
                    <button 
                      onClick={() => {
                        setBassLevel(50); setMidLevel(50); setTrebleLevel(50);
                        setFilterFreq(20000); setReverbWet(0); setDelayTime(0);
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
              <h3 className="text-lg font-semibold mb-4">Up Next ({appState.queue.length} tracks)</h3>
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
                        <p className={`${track.id === currentTrack.id ? 'text-blue-400 font-semibold' : ''}`}>{track.title}</p>
                        <p className="text-sm text-gray-400">{track.artist} • {track.genre}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">{track.bpm} BPM</span>
                        <br/>
                        <span className="text-xs text-purple-400">{track.key}</span>
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
          <Link to="/" className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors">
            🏠 Home
          </Link>
          <Link to="/studio" className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors">
            🎛️ Studio
          </Link>
          <Link to="/player" className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors">
            🎧 Player
          </Link>
          <Link to="/profile" className="flex-1 py-4 text-center hover:bg-gray-800 transition-colors">
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
    mixTime: '0h 0m'
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
              <p className="text-sm text-gray-400">Demo mode - database disabled</p>
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
              <div className="text-2xl font-bold text-blue-400">{userStats.playlists}</div>
              <div className="text-sm text-gray-400">Playlists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{userStats.tracks}</div>
              <div className="text-sm text-gray-400">Tracks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{userStats.mixTime}</div>
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
        </Routes>
      </div>
      <Navigation />
    </BrowserRouter>
  );
}

export default App;
