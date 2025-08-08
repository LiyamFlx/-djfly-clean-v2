/**
 * Test API Connections
 * Utility to verify that all API services are working with real credentials
 */

import { secureConfig } from '@/config/secureConfig';

export const testApiConnections = async () => {
  console.log('🔍 Testing API connections...');
  
  const results = {
    openai: false,
    spotify: false,
    supabase: false,
    youtube: false,
    lastfm: false,
    googleStudio: false,
  };

  // Test OpenAI
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${secureConfig.openai.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    results.openai = response.ok;
    console.log(`OpenAI: ${results.openai ? '✅' : '❌'} ${response.status}`);
  } catch (error) {
    console.log('OpenAI: ❌ Connection failed');
  }

  // Test Spotify
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${secureConfig.spotify.clientId}:${secureConfig.spotify.clientSecret}`)}`,
      },
      body: 'grant_type=client_credentials',
    });
    results.spotify = response.ok;
    console.log(`Spotify: ${results.spotify ? '✅' : '❌'} ${response.status}`);
  } catch (error) {
    console.log('Spotify: ❌ Connection failed');
  }

  // Test Supabase
  try {
    const response = await fetch(`${secureConfig.supabase.url}/rest/v1/`, {
      headers: {
        'apikey': secureConfig.supabase.anonKey!,
        'Authorization': `Bearer ${secureConfig.supabase.anonKey}`,
      },
    });
    results.supabase = response.status !== 401;
    console.log(`Supabase: ${results.supabase ? '✅' : '❌'} ${response.status}`);
  } catch (error) {
    console.log('Supabase: ❌ Connection failed');
  }

  // Test YouTube
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=${secureConfig.youtube.apiKey}`);
    results.youtube = response.ok;
    console.log(`YouTube: ${results.youtube ? '✅' : '❌'} ${response.status}`);
  } catch (error) {
    console.log('YouTube: ❌ Connection failed');
  }

  // Test Last.fm
  try {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.search&track=test&api_key=${secureConfig.lastfm?.apiKey}&format=json`);
    results.lastfm = response.ok;
    console.log(`Last.fm: ${results.lastfm ? '✅' : '❌'} ${response.status}`);
  } catch (error) {
    console.log('Last.fm: ❌ Connection failed');
  }

  // Test Google Studio
  try {
    const response = await fetch(`https://www.googleapis.com/analytics/v3/management/accounts?key=${secureConfig.googleStudio?.apiKey}`);
    results.googleStudio = response.status !== 401;
    console.log(`Google Studio: ${results.googleStudio ? '✅' : '❌'} ${response.status}`);
  } catch (error) {
    console.log('Google Studio: ❌ Connection failed');
  }

  // Summary
  const workingApis = Object.values(results).filter(Boolean).length;
  const totalApis = Object.keys(results).length;
  
  console.log(`\n📊 API Connection Summary:`);
  console.log(`Working: ${workingApis}/${totalApis} APIs`);
  
  if (workingApis === totalApis) {
    console.log('🎉 All APIs are working correctly!');
  } else {
    console.log('⚠️ Some APIs need attention');
  }

  return results;
};

// Auto-run test if in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    testApiConnections();
  }, 2000);
}
