import React from 'react';
import DualDeckPlayer from '@/components/player/DualDeckPlayer';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const PlayerPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-black via-rich-black to-pure-black p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end mb-4">
        <Button
          variant="ghost"
          size="sm"
          icon={LogOut}
          onClick={() => navigate('/')}
        >
          Exit Session
        </Button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DualDeckPlayer />
      </div>
    </div>
  );
};

export default PlayerPage;
