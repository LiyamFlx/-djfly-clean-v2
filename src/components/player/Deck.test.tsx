import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Deck from './Deck';
import { Track } from '@/types';

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  duration: 180,
  image: 'https://via.placeholder.com/300',
  source: 'demo',
};

describe('Deck', () => {
  it('renders the track title and artist', () => {
    render(<Deck track={mockTrack} deckName="Deck A" />);
    expect(screen.getByText('Test Track')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('shows a message when no track is loaded', () => {
    render(<Deck track={null} deckName="Deck A" />);
    expect(screen.getByText('Load a track')).toBeInTheDocument();
  });
});
