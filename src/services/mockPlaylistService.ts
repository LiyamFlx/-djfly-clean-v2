import { Track } from '@/types/shared';

export interface PlaylistRecommendation {
  tracks: Track[];
  energy: number;
  mood: string;
  genre: string;
  bpm: number;
  description: string;
}

export class MockPlaylistService {
  private static readonly mockTracks: Track[] = [
    {
      id: '1',
      title: 'Midnight Groove',
      artist: 'DJ Pulse',
      album: 'Night Vibes',
      duration: 180,
      bpm: 128,
      key: 'C#m',
      energy: 85,
      genre: 'House',
      url: '/demo-track-1.mp3',
      artwork: '/icon-192.svg',
      tags: ['house', 'groove', 'night']
    },
    {
      id: '2',
      title: 'Electric Dreams',
      artist: 'Synthwave Collective',
      album: 'Digital Sunset',
      duration: 195,
      bpm: 120,
      key: 'Am',
      energy: 78,
      genre: 'Synthwave',
      url: '/demo-track-1.mp3',
      artwork: '/icon-192.svg',
      tags: ['synthwave', 'retro', 'electronic']
    },
    {
      id: '3',
      title: 'Bass Drop',
      artist: 'Subwoofer',
      album: 'Heavy Bass',
      duration: 165,
      bpm: 140,
      key: 'F#m',
      energy: 92,
      genre: 'Dubstep',
      url: '/demo-track-1.mp3',
      artwork: '/icon-192.svg',
      tags: ['dubstep', 'bass', 'heavy']
    },
    {
      id: '4',
      title: 'Chill Vibes',
      artist: 'Ambient Flow',
      album: 'Peaceful Moments',
      duration: 210,
      bpm: 90,
      key: 'Dmaj',
      energy: 45,
      genre: 'Ambient',
      url: '/demo-track-1.mp3',
      artwork: '/icon-192.svg',
      tags: ['ambient', 'chill', 'peaceful']
    },
    {
      id: '5',
      title: 'Dance Floor Heat',
      artist: 'Club Master',
      album: 'Weekend Warriors',
      duration: 175,
      bpm: 130,
      key: 'Gmaj',
      energy: 88,
      genre: 'EDM',
      url: '/demo-track-1.mp3',
      artwork: '/icon-192.svg',
      tags: ['edm', 'dance', 'club']
    },
    {
      id: '6',
      title: 'Jazz Fusion',
      artist: 'Smooth Operators',
      album: 'Modern Jazz',
      duration: 240,
      bpm: 110,
      key: 'Bbmaj',
      energy: 65,
      genre: 'Jazz',
      url: '/demo-track-1.mp3',
      artwork: '/icon-192.svg',
      tags: ['jazz', 'fusion', 'smooth']
    },
    {
      id: '7',
      title: 'Rock Anthem',
      artist: 'Power Chord',
      album: 'Guitar Heroes',
      duration: 200,
      bpm: 140,
      key: 'Em',
      energy: 95,
      genre: 'Rock',
      url: '/demo-track-1.mp3',
      artwork: '/icon-192.svg',
      tags: ['rock', 'guitar', 'anthem']
    },
    {
      id: '8',
      title: 'Hip Hop Flow',
      artist: 'MC Rhyme',
      album: 'Street Poetry',
      duration: 185,
      bpm: 95,
      key: 'Cmaj',
      energy: 72,
      genre: 'Hip Hop',
      url: '/demo-track-1.mp3',
      artwork: '/icon-192.svg',
      tags: ['hip hop', 'rap', 'street']
    }
  ];

  static async generatePlaylist(prompt: string): Promise<PlaylistRecommendation> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Analyze the prompt to determine mood and energy
    const promptLower = prompt.toLowerCase();
    
    let mood = 'energetic';
    let energy = 85;
    let genre = 'House';
    let bpm = 128;
    let description = '';

    if (promptLower.includes('chill') || promptLower.includes('relax')) {
      mood = 'chill';
      energy = 45;
      genre = 'Ambient';
      bpm = 90;
      description = 'Perfect for a relaxed atmosphere with smooth, calming tracks.';
    } else if (promptLower.includes('party') || promptLower.includes('dance')) {
      mood = 'energetic';
      energy = 92;
      genre = 'EDM';
      bpm = 130;
      description = 'High-energy tracks to get the crowd moving and dancing.';
    } else if (promptLower.includes('workout') || promptLower.includes('gym')) {
      mood = 'intense';
      energy = 95;
      genre = 'Rock';
      bpm = 140;
      description = 'Powerful tracks to fuel your workout and boost motivation.';
    } else if (promptLower.includes('study') || promptLower.includes('focus')) {
      mood = 'focused';
      energy = 55;
      genre = 'Jazz';
      bpm = 110;
      description = 'Concentration-friendly tracks with smooth jazz and ambient sounds.';
    } else if (promptLower.includes('romantic') || promptLower.includes('date')) {
      mood = 'romantic';
      energy = 60;
      genre = 'Jazz';
      bpm = 100;
      description = 'Romantic atmosphere with smooth jazz and soulful tracks.';
    } else {
      // Default energetic playlist
      mood = 'energetic';
      energy = 85;
      genre = 'House';
      bpm = 128;
      description = 'Balanced mix of energetic tracks perfect for any occasion.';
    }

    // Filter tracks based on mood and energy
    let selectedTracks = this.mockTracks;
    
    if (mood === 'chill') {
      selectedTracks = this.mockTracks.filter(track => track.energy < 70);
    } else if (mood === 'energetic') {
      selectedTracks = this.mockTracks.filter(track => track.energy > 70);
    } else if (mood === 'intense') {
      selectedTracks = this.mockTracks.filter(track => track.energy > 85);
    }

    // Shuffle and select 6 tracks
    const shuffled = [...selectedTracks].sort(() => 0.5 - Math.random());
    const finalTracks = shuffled.slice(0, 6);

    return {
      tracks: finalTracks,
      energy,
      mood,
      genre,
      bpm,
      description
    };
  }

  static async getTrackRecommendations(context: any): Promise<Track[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return random tracks based on context
    const shuffled = [...this.mockTracks].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }
}
