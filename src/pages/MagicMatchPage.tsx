import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Play, Zap, Music } from 'lucide-react';
import { useAIActions } from '@/hooks/useAIActions';
import { useAIState } from '@/hooks/useAIState';
import Button from '@/components/ui/button';
import { type Track } from '@/types/shared';

const MagicMatchPage: React.FC = () => {
  const { generateMatch } = useAIActions();
  const { aiState } = useAIState();
  const [isRecording, setIsRecording] = useState(false);
  const [crowdEnergy, setCrowdEnergy] = useState(0.5);
  const [crowdMood, setCrowdMood] = useState('energetic');
  const [status, setStatus] = useState<
    'idle' | 'recording' | 'analyzing' | 'complete'
  >('idle');

  const handleStartRecording = async () => {
    setIsRecording(true);
    setStatus('recording');

    // Simulate recording process
    setTimeout(() => {
      setStatus('analyzing');
      // Simulate analysis
      setTimeout(() => {
        setStatus('complete');
        setIsRecording(false);
      }, 2000);
    }, 3000);
  };

  const handleGenerateMatch = async () => {
    try {
      setStatus('analyzing');
      await generateMatch('crowd energy analysis');
      setStatus('complete');
    } catch (error) {
      console.error('Failed to generate match:', error);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-black-gradient text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Magic Match</h1>
          <p className="text-xl text-gray-300">
            Analyze crowd energy and get perfect track recommendations
          </p>
        </div>

        {/* Recording Section */}
        <div className="glass-card mb-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-neon-purple/20 rounded-full flex items-center justify-center">
              <Mic className="w-12 h-12 text-neon-purple" />
            </div>

            <h2 className="text-2xl font-semibold mb-4">
              Crowd Energy Analysis
            </h2>

            {status === 'idle' && (
              <Button
                variant="primary"
                size="lg"
                icon={Mic}
                onClick={handleStartRecording}
                className="mb-4"
              >
                Start Recording
              </Button>
            )}

            {status === 'recording' && (
              <div className="mb-4">
                <div className="text-neon-green text-lg mb-2">Recording...</div>
                <div className="w-16 h-16 mx-auto border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {status === 'analyzing' && (
              <div className="mb-4">
                <div className="text-neon-purple text-lg mb-2">
                  Analyzing...
                </div>
                <div className="w-16 h-16 mx-auto border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {status === 'complete' && (
              <div className="mb-4">
                <div className="text-neon-green text-lg mb-2">
                  Analysis Complete!
                </div>
                <Button
                  variant="accent"
                  size="lg"
                  icon={Play}
                  onClick={handleGenerateMatch}
                >
                  Generate Playlist
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {status === 'complete' &&
          aiState.generatedTracks &&
          aiState.generatedTracks.length > 0 && (
            <div className="glass-card">
              <h3 className="text-xl font-semibold mb-4">Generated Tracks</h3>
              <div className="grid gap-4">
                {aiState.generatedTracks.map((track: Track, index: number) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-neon-purple/20 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{track.title}</div>
                      <div className="text-sm text-gray-400">
                        {track.artist}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Play}
                      onClick={() => console.log('Play track:', track.title)}
                    >
                      Play
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default MagicMatchPage;
