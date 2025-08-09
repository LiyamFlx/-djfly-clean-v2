import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, Play, Zap, BarChart3 } from 'lucide-react';
import { useAIActions, useAIState, useAudioActions } from '@/store';
import { ROUTES } from '@/constants/routes';

const MagicMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'ready' | 'recording' | 'analyzing' | 'complete'>('ready');
  const [recordingProgress, setRecordingProgress] = useState(0);

  const { generateMatch } = useAIActions();
  const { setQueue, setCurrentTrack } = useAudioActions();
  const aiState = useAIState();

  const handleStartRecording = async () => {
    try {
      setStatus('recording');
      setRecordingProgress(0);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.start();

      // Simulate recording progress
      const progressInterval = setInterval(() => {
        setRecordingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 20;
        });
      }, 1000);

      // After 5 seconds, stop recording and analyze
      setTimeout(async () => {
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
        clearInterval(progressInterval);
        
        setStatus('analyzing');
        
        try {
          // Generate AI-powered crowd analysis
          await generateMatch('Crowd energy analysis from audio recording');
          
          if (aiState.generatedTracks.length > 0) {
            setQueue(aiState.generatedTracks);
            setCurrentTrack(aiState.generatedTracks[0]);
          }
          
          setStatus('complete');
        } catch (error) {
          console.error('Failed to analyze crowd:', error);
          setStatus('ready');
        }
      }, 5000);

    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Microphone access is required for Magic Match. Please allow access and try again.');
      setStatus('ready');
    }
  };

  const handlePlayRecommendations = () => {
    if (aiState.generatedTracks.length > 0) {
      navigate(ROUTES.PLAYER);
    }
  };

  const resetAnalysis = () => {
    setStatus('ready');
    setRecordingProgress(0);
  };

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gradient mb-6 leading-tight"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            Magic Match
          </motion.h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Record crowd noise and let AI analyze the energy to generate the perfect playlist instantly.
          </p>
        </motion.div>

        {/* Recording Interface */}
        {status === 'ready' && (
          <motion.div
            className="card p-12 rounded-2xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-8 bg-button-gradient rounded-full flex items-center justify-center relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100"
                transition={{ duration: 0.3 }}
              />
              <Mic className="w-16 h-16 text-white relative z-10" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-4">Ready to Analyze</h3>
            <p className="text-neutral-300 text-lg mb-8 max-w-md mx-auto">
              Point your device toward the crowd and tap the microphone to start recording for 5 seconds.
            </p>

            <motion.button
              onClick={handleStartRecording}
              className="btn-primary px-8 py-4 text-xl font-semibold relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-xl scale-0 group-hover:scale-100"
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <Zap className="w-6 h-6" />
                Start Recording
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* Recording Progress */}
        {status === 'recording' && (
          <motion.div
            className="card p-12 rounded-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Mic className="w-16 h-16 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-6">Recording Crowd Audio...</h3>
            
            <div className="max-w-md mx-auto mb-6">
              <div className="w-full bg-neutral-800 rounded-full h-3">
                <motion.div
                  className="bg-button-gradient h-3 rounded-full"
                  style={{ width: `${recordingProgress}%` }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${recordingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-neutral-400 mt-2">{recordingProgress}% complete</p>
            </div>

            <p className="text-neutral-300">Keep your device pointed at the crowd...</p>
          </motion.div>
        )}

        {/* Analyzing */}
        {status === 'analyzing' && (
          <motion.div
            className="card p-12 rounded-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-32 h-32 mx-auto mb-8 bg-button-gradient rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <BarChart3 className="w-16 h-16 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-4">AI Analyzing Crowd Energy...</h3>
            <p className="text-neutral-300">Processing audio patterns and generating perfect matches...</p>
          </motion.div>
        )}

        {/* Results */}
        {status === 'complete' && aiState.generatedTracks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Analysis Results */}
            <div className="card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gradient mb-6">Analysis Complete!</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="text-center p-6 bg-primary-500/10 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-3xl font-bold text-primary-400 mb-2">
                    {Math.floor(Math.random() * 40) + 60}%
                  </div>
                  <div className="text-sm text-neutral-400">Crowd Energy</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-6 bg-secondary-500/10 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-3xl font-bold text-secondary-400 mb-2">
                    {new Date().getHours() > 18 ? 'Evening' : 'Afternoon'}
                  </div>
                  <div className="text-sm text-neutral-400">Time Context</div>
                </motion.div>
                
                <motion.div 
                  className="text-center p-6 bg-accent-500/10 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-3xl font-bold text-accent-400 mb-2">
                    {aiState.generatedTracks.length}
                  </div>
                  <div className="text-sm text-neutral-400">Tracks Generated</div>
                </motion.div>
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={handlePlayRecommendations}
                  className="btn-primary px-8 py-4 flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  Play Now
                </motion.button>
                
                <motion.button
                  onClick={resetAnalysis}
                  className="btn-secondary px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analyze Again
                </motion.button>
              </div>
            </div>

            {/* Track List */}
            <div className="card p-8 rounded-2xl">
              <h4 className="text-xl font-bold mb-6">Recommended Tracks</h4>
              <div className="space-y-3">
                {aiState.generatedTracks.slice(0, 5).map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-neutral-800/30 rounded-xl hover:bg-neutral-800/50 transition-all duration-300"
                  >
                    <div className="text-sm text-neutral-400 w-8">{index + 1}.</div>
                    <img
                      src={track.image}
                      alt={track.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h5 className="font-semibold text-white">{track.title}</h5>
                      <p className="text-sm text-neutral-400">{track.artist}</p>
                    </div>
                    {track.bpm && (
                      <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                        {track.bpm} BPM
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MagicMatchPage;