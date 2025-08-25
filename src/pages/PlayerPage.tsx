import React, { useEffect, useState } from 'react';
import DualDeckPlayer from '@/components/player/DualDeckPlayer';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/ui/button';
import { LogOut, ArrowLeft, Music } from 'lucide-react';
import { type Track } from '@/types/shared';

const PlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  useEffect(() => {
    // Get track and playlist data from navigation state or localStorage
    if (location.state?.track) {
      setCurrentTrack(location.state.track);
    } else {
      const storedTrack = localStorage.getItem('currentTrack');
      if (storedTrack) {
        setCurrentTrack(JSON.parse(storedTrack));
      }
    }

    if (location.state?.playlist) {
      setPlaylist(location.state.playlist);
    } else {
      const storedPlaylist = localStorage.getItem('playlist');
      if (storedPlaylist) {
        setPlaylist(JSON.parse(storedPlaylist));
      }
    }
  }, [location.state]);

  const handleBackToStudio = () => {
    navigate('/studio/match');
  };

  const handleExitSession = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-dj text-dj-text-primary p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={handleBackToStudio}
            className="text-dj-text-secondary hover:text-dj-text-primary"
          >
            Back to Studio
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold gradient-text">DJ Player</h1>
            {currentTrack && (
              <p className="text-sm text-dj-text-secondary">
                Now Playing: {currentTrack.title} - {currentTrack.artist}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={LogOut}
            onClick={handleExitSession}
            className="text-dj-text-secondary hover:text-dj-text-primary"
          >
            Exit Session
          </Button>
        </div>

        {/* Playlist Info */}
        {playlist.length > 0 && (
          <div className="mb-6 p-4 bg-dj-bg-secondary/20 rounded-xl border border-dj-bg-tertiary/30">
            <div className="flex items-center gap-3 mb-3">
              <Music className="w-6 h-6 text-dj-interactive" />
              <h2 className="text-lg font-semibold text-dj-text-primary">
                Current Playlist
              </h2>
              <span className="text-sm text-dj-text-muted">
                {playlist.length} tracks
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {playlist.slice(0, 4).map((track, index) => (
                <div key={track.id} className="text-xs text-dj-text-secondary truncate">
                  {index + 1}. {track.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Player */}
        <div className="bg-dj-bg-secondary/10 rounded-xl border border-dj-bg-tertiary/30 p-6">
          <DualDeckPlayer />
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
