import React, { useState } from 'react';
import { Mic, Play, Music, Zap, Target, TrendingUp } from 'lucide-react';
import { useAIActions, useAIState } from '@/store';
import Button from '@/components/ui/button';
import { type Track } from '@/types/shared';
import { GlassCard, NeonCard } from '@/components/ui/EnhancedCard';

const MagicMatchPage: React.FC = () => {
  const { generateSet } = useAIActions();
  const aiState = useAIState();
  const [status, setStatus] = useState<
    'idle' | 'recording' | 'analyzing' | 'complete'
  >('idle');
  const [prompt, setPrompt] = useState('');

  const handleStartRecording = async () => {
    setStatus('recording');
    setTimeout(() => {
      setStatus('analyzing');
      setTimeout(() => {
        setStatus('complete');
      }, 2000);
    }, 3000);
  };

  const handleGenerateMatch = async () => {
    try {
      setStatus('analyzing');
      const analysisPrompt = prompt || 'crowd energy analysis';
      await generateSet(analysisPrompt);
      setStatus('complete');
    } catch (error) {
      console.error('Failed to generate match:', error);
      setStatus('idle');
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-dj text-dj-text-primary p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Magic Match
          </h1>
          <p className="text-xl text-dj-text-secondary">
            Analyze crowd energy and get perfect track recommendations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Analysis */}
          <div className="space-y-6">
            <GlassCard className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-dj-interactive/20 to-secondary-500/20 rounded-full flex items-center justify-center">
                <Mic className="w-12 h-12 text-dj-interactive" />
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-dj-text-primary">
                Crowd Energy Analysis
              </h2>

              {status === 'idle' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Describe your crowd or event..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input w-full text-center"
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    icon={Mic}
                    onClick={handleStartRecording}
                    className="w-full"
                  >
                    Start Analysis
                  </Button>
                </div>
              )}

              {status === 'recording' && (
                <div className="space-y-4">
                  <div className="text-success-500 text-lg mb-2 font-semibold">
                    Recording Crowd Energy...
                  </div>
                  <div className="w-16 h-16 mx-auto border-4 border-success-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-dj-text-secondary text-sm">
                    Listening to ambient sounds and crowd reactions
                  </p>
                </div>
              )}

              {status === 'analyzing' && (
                <div className="space-y-4">
                  <div className="text-dj-interactive text-lg mb-2 font-semibold">
                    Analyzing Energy Patterns...
                  </div>
                  <div className="w-16 h-16 mx-auto border-4 border-dj-interactive border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-dj-text-secondary text-sm">
                    Processing audio data and crowd metrics
                  </p>
                </div>
              )}

              {status === 'complete' && (
                <div className="space-y-4">
                  <div className="text-success-500 text-lg mb-2 font-semibold flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    Analysis Complete!
                  </div>
                  <Button
                    variant="accent"
                    size="lg"
                    icon={Play}
                    onClick={handleGenerateMatch}
                    className="w-full"
                  >
                    Generate Playlist
                  </Button>
                </div>
              )}
            </GlassCard>

            {/* Crowd Metrics Display */}
            {status === 'complete' && (
              <NeonCard className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-dj-text-primary flex items-center gap-2">
                  <Target className="w-5 h-5 text-dj-interactive" />
                  Crowd Insights
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-dj-bg-tertiary/50 rounded-lg">
                    <div className="text-dj-text-muted">Energy Level</div>
                    <div className="text-success-500 font-bold text-lg">85%</div>
                  </div>
                  <div className="text-center p-3 bg-dj-bg-tertiary/50 rounded-lg">
                    <div className="text-dj-text-muted">Mood</div>
                    <div className="text-accent-500 font-bold text-lg">Energetic</div>
                  </div>
                  <div className="text-center p-3 bg-dj-bg-tertiary/50 rounded-lg">
                    <div className="text-dj-text-muted">Preferred BPM</div>
                    <div className="text-secondary-500 font-bold text-lg">128</div>
                  </div>
                  <div className="text-center p-3 bg-dj-bg-tertiary/50 rounded-lg">
                    <div className="text-dj-text-muted">Genre</div>
                    <div className="text-primary-500 font-bold text-lg">House</div>
                  </div>
                </div>
              </NeonCard>
            )}
          </div>

          {/* Right Column - Generated Tracks */}
          <div className="space-y-6">
            {status === 'complete' && aiState.recommendations.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-dj-text-primary">
                    Generated Playlist
                  </h3>
                  <p className="text-dj-text-secondary mb-4">
                    Perfect tracks for your crowd energy
                  </p>
                </div>

                {aiState.recommendations[0] && (
                  <div className="space-y-4">
                    {/* Playlist Info */}
                    <GlassCard className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-success-500" />
                          <span className="font-semibold text-dj-text-primary">
                            {aiState.recommendations[0].genre} Mix
                          </span>
                        </div>
                        <div className="text-sm text-dj-text-muted">
                          {aiState.recommendations[0].tracks.length} tracks
                        </div>
                      </div>
                      <p className="text-sm text-dj-text-secondary">
                        {aiState.recommendations[0].description}
                      </p>
                    </GlassCard>

                    {/* Track List */}
                    <div className="space-y-3">
                      {aiState.recommendations[0].tracks.map((track: Track, index: number) => (
                        <GlassCard key={track.id} className="p-4 hover:scale-[1.02] transition-transform duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-dj-interactive/20 to-secondary-500/20 rounded-lg flex items-center justify-center">
                              <Music className="w-6 h-6 text-dj-interactive" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-dj-text-primary truncate">
                                {index + 1}. {track.title}
                              </div>
                              <div className="text-sm text-dj-text-secondary truncate">
                                {track.artist} • {track.album}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-dj-text-muted">
                                  {formatDuration(track.duration)}
                                </span>
                                <span className="text-xs text-dj-text-muted">
                                  {track.bpm} BPM
                                </span>
                                <span className="text-xs text-dj-text-muted">
                                  {track.key}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Play}
                              onClick={() => console.log('Play track:', track.title)}
                              className="shrink-0"
                            >
                              Play
                            </Button>
                          </div>
                        </GlassCard>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        icon={Play}
                        onClick={() => console.log('Play all tracks')}
                        className="flex-1"
                      >
                        Play All
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        icon={Zap}
                        onClick={() => console.log('Save playlist')}
                        className="flex-1"
                      >
                        Save Playlist
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <GlassCard className="h-full flex items-center justify-center">
                <div className="text-center text-dj-text-secondary">
                  <Music className="w-16 h-16 mx-auto mb-4 text-dj-text-muted" />
                  <p className="text-lg font-medium">No playlist generated yet</p>
                  <p className="text-sm">Complete the crowd analysis to get track recommendations</p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicMatchPage;
