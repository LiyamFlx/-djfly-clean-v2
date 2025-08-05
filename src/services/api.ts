import { Track } from '@/types';

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const VITE_SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const VITE_SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// --- Spotify API ---

let spotifyAccessToken: string | null = null;

async function getSpotifyToken(): Promise<string> {
  if (spotifyAccessToken) {
    return spotifyAccessToken;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(VITE_SPOTIFY_CLIENT_ID + ':' + VITE_SPOTIFY_CLIENT_SECRET),
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify token');
  }

  const data = await response.json();
  spotifyAccessToken = data.access_token;

  // Token expires, for a real app, we'd handle renewal
  setTimeout(() => spotifyAccessToken = null, data.expires_in * 1000);

  return spotifyAccessToken!;
}

export async function searchSpotifyTrack(query: string): Promise<Track | null> {
  const token = await getSpotifyToken();
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Spotify search failed:', await response.text());
    return null;
  }

  const data = await response.json();
  const item = data.tracks.items[0];

  if (!item) {
    return null;
  }

  return {
    id: item.id,
    title: item.name,
    artist: item.artists.map((a: any) => a.name).join(', '),
    image: item.album.images[0]?.url || '/default-album-art.png',
    duration: item.duration_ms / 1000,
    previewUrl: item.preview_url,
    bpm: 0, // Spotify API doesn't provide BPM directly in search
    energy: 0, // Requires audio analysis
    genre: '', // Not in standard track object
  };
}


// --- OpenAI API ---

export async function getAiPlaylist(prompt: string, onProgress: (progress: number) => void): Promise<Track[]> {
  if (!VITE_OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured.");
  }
  onProgress(10);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${VITE_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a world-class DJ assistant. Based on the user's prompt, generate a list of 8-10 tracks. Your response must be a JSON object with a single key 'playlist' which is an array of strings, where each string is in the format 'Artist - Song Title'. Do not include any other text, just the JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    })
  });
  onProgress(50);

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("OpenAI API Error:", errorBody);
    throw new Error(`OpenAI request failed: ${errorBody.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);
  const trackQueries: string[] = content.playlist;

  console.log("AI Generated Track Queries:", trackQueries); // Verification log

  onProgress(60);

  const trackPromises = trackQueries.map(async (query, index) => {
    const track = await searchSpotifyTrack(query);
    onProgress(60 + Math.round(((index + 1) / trackQueries.length) * 40));
    return track;
  });

  const tracks = await Promise.all(trackPromises);

  const finalTracks = tracks.filter((track): track is Track => track !== null && !!track.previewUrl);

  console.log("Fetched Spotify Tracks with Previews:", finalTracks); // Verification log

  return finalTracks;
}
