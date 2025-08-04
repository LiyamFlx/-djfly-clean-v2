import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const handler: Handler = async (event) => {
  const { endpoint, ...params } = JSON.parse(event.body || '{}');

  if (!endpoint) {
    return { statusCode: 400, body: 'Spotify API endpoint is required' };
  }

  const auth = Buffer.from(
    `${process.env.VITE_SPOTIFY_CLIENT_ID}:${process.env.VITE_SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    // First, get an access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const { access_token } = await tokenResponse.json();

    // Now, make the request to the Spotify API
    const searchParams = new URLSearchParams(params);
    const spotifyResponse = await fetch(
      `https://api.spotify.com/v1/${endpoint}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!spotifyResponse.ok) {
      throw new Error('Failed to make request to Spotify API');
    }

    const data = await spotifyResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to proxy request to Spotify' }),
    };
  }
};

export { handler };
