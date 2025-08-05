import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Play, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCrowdActions, useCrowdState, useAIActions } from '@/store';
import { ROUTES } from '@/constants/routes';

const MagicMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { startListening, stopListening, updateCrowdMetrics } = useCrowdActions();
  const { analyzeAudio } = useAIActions();
  const crowdState = useCrowdState();
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioBuffer = await audioBlob.arrayBuffer();
        
        // Analyze the audio
        await analyzeAudio(audioBuffer);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      startListening();
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          stopRecording();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopListening();
    }
  };
  
  const resetAnalysis = () => {
    updateCrowdMetrics({
      currentEnergy: 0.5,
      mood: 'unknown',
      engagementLevel: 'medium',
      crowdSize: 0,
      energyTrend: 'stable',
    });
  };
  
  const generatePlaylist = async () => {
    // Use crowd analysis to generate appropriate playlist
    const energyLevel = crowdState.currentEnergy > 0.7 ? 'high energy' : 
                      crowdState.currentEnergy > 0.4 ? 'medium energy' : 'chill';
    
    const prompt = `Create a ${energyLevel} ${crowdState.mood} playlist for a crowd of ${crowdState.crowdSize} people`;
    
    // This would call the AI service
    console.log('Generating playlist with prompt:', prompt);
    
    // For demo, redirect to player
    navigate(ROUTES.PLAYER);
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
        <div className="text-center">
          <h2 className="text-3xl font-bold gradient-text mb-4">
            Magic Match
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Point your device at the crowd and let AI analyze the energy, mood, 
            and vibe to generate the perfect playlist in real-time.
          </p>
        </div>

        {/* Recording Control */}
        <div className="glass-card p-8 rounded-xl text-center">
          <motion.div
            className={`mx-auto mb-6 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500/20 border-4 border-red-500 animate-pulse' 
                : 'bg-electric-blue/20 border-4 border-electric-blue hover:scale-105'
            }`}
            whileHover={{ scale: isRecording ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className="w-full h-full flex items-center justify-center"
            >
              {isRecording ? (
                <MicOff className="w-12 h-12 text-red-400" />
              ) : (
                <Mic className="w-12 h-12 text-electric-blue" />
              )}
            </button>
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isRecording ? 'Listening to the crowd...' : 'Ready to analyze'}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4">
            {isRecording 
              ? 'Recording ambient audio to analyze crowd energy and mood'
              : 'Tap the microphone to start crowd analysis'
            }
          </p>
          
          {isRecording && (
            <div className="w-full bg-rich-black/50 rounded-full h-2 mb-4">
              <motion.div
                className="bg-electric-blue h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 10, ease: 'linear' }}
              />
            </div>
          )}
        </div>

        {/* Crowd Analysis Results */}
        {crowdState.lastUpdated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Crowd Analysis</h3>
              <div className="flex gap-2">
                <button
                  onClick={resetAnalysis}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={generatePlaylist}
                  className="club-button flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Generate Playlist
                </button>
              </div>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-electric-blue mb-1">
                  {Math.round(crowdState.currentEnergy * 100)}%
                </div>
                <div className="text-sm text-gray-400">Energy Level</div>
                <div className="w-full bg-rich-black/50 rounded-full h-2 mt-2">
                  <div 
                    className="bg-electric-blue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${crowdState.currentEnergy * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-bright-turquoise mb-1 capitalize">
                  {crowdState.mood}
                </div>
                <div className="text-sm text-gray-400">Mood</div>
                <div className="text-xs text-gray-500 mt-1">
                  {crowdState.mood === 'excited' && '🎉'}
                  {crowdState.mood === 'chill' && '😌'}
                  {crowdState.mood === 'energetic' && '⚡'}
                  {crowdState.mood === 'mellow' && '🌙'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-laser-pink mb-1 capitalize">
                  {crowdState.engagementLevel}
                </div>
                <div className="text-sm text-gray-400">Engagement</div>
                <div className="text-xs text-gray-500 mt-1">
                  {crowdState.engagementLevel === 'high' && '🔥'}
                  {crowdState.engagementLevel === 'medium' && '👍'}
                  {crowdState.engagementLevel === 'low' && '😐'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-electric-blue mb-1">
                  {crowdState.crowdSize}
                </div>
                <div className="text-sm text-gray-400">People</div>
                <div className="text-xs text-gray-500 mt-1">
                  Est. crowd size
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-rich-black/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">AI Recommendations</h4>
              <div className="space-y-2 text-sm text-gray-300">
                {crowdState.currentEnergy > 0.7 && (
                  <p>• High energy detected - recommend upbeat dance tracks</p>
                )}
                {crowdState.mood === 'chill' && (
                  <p>• Chill mood - suggest downtempo and ambient tracks</p>
                )}
                {crowdState.crowdSize > 100 && (
                  <p>• Large crowd - popular mainstream hits will work well</p>
                )}
                {crowdState.energyTrend === 'rising' && (
                  <p>• Energy is building - gradually increase BPM</p>
                )}
                {crowdState.energyTrend === 'falling' && (
                  <p>• Energy declining - consider mixing in crowd favorites</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">How it works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-electric-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">1</span>
              </div>
              <div>
                <div className="font-medium mb-1">Point & Listen</div>
                <div className="text-gray-400">
                  Point your device at the crowd and tap record to capture ambient audio
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-bright-turquoise/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">2</span>
              </div>
              <div>
                <div className="font-medium mb-1">AI Analysis</div>
                <div className="text-gray-400">
                  Our AI analyzes energy levels, mood, and crowd engagement in real-time
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-laser-pink/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">3</span>
              </div>
              <div>
                <div className="font-medium mb-1">Perfect Match</div>
                <div className="text-gray-400">
                  Get instant playlist recommendations tailored to your crowd
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MagicMatchPage;