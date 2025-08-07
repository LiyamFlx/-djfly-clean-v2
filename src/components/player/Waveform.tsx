import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import type { Track } from '@/types';

interface WaveformProps {
  track: Track | null;
}

const Waveform: React.FC<WaveformProps> = ({ track }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F4A85',
        progressColor: '#00D4FF',
        barWidth: 2,
        barGap: 1,
        height: 80,
      });
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (track?.preview_url && wavesurferRef.current) {
      wavesurferRef.current.load(track.preview_url);
    }
  }, [track]);

  return <div ref={waveformRef} />;
};

export default Waveform;
