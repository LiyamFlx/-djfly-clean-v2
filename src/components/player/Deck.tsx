import type { Track } from '@/types';
import Waveform from './Waveform';

interface DeckProps {
  track: Track | null;
  deckName: string;
}

const Deck: React.FC<DeckProps> = ({ track, deckName }) => {
  if (!track) {
    return (
      <div className="flex-1 p-4 bg-rich-black/50 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">Load a track</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 bg-rich-black/50 rounded-lg">
      <h3 className="text-lg font-bold mb-2">{deckName}</h3>
      <div className="flex items-center gap-4">
        <img
          src={track.image}
          alt={track.title}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-bold text-white truncate">{track.title}</h4>
          <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        </div>
      </div>
      <div className="mt-4">
        <Waveform track={track} />
      </div>
    </div>
  );
};

export default Deck;
