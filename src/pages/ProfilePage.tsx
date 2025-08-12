import React from 'react';

const ProfilePage = () => {
  const userStats = {
    playlists: 0,
    tracks: 0,
    mixTime: '0h 0m',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">👤 Profile</h1>
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">🗄️ Database Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Supabase Connection</p>
              <p className="text-sm text-gray-400">Demo mode - database disabled</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-400 text-sm">Demo Mode</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{userStats.playlists}</div>
              <div className="text-sm text-gray-400">Playlists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{userStats.tracks}</div>
              <div className="text-sm text-gray-400">Tracks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{userStats.mixTime}</div>
              <div className="text-sm text-gray-400">Mix Time</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">⚙️ Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Audio Quality</span>
              <select className="bg-gray-700 px-3 py-1 rounded text-white">
                <option>High (320kbps)</option>
                <option>Medium (128kbps)</option>
                <option>Low (64kbps)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto-mix</span>
              <input type="checkbox" className="accent-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Crossfade Duration</span>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="3"
                className="w-24 accent-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
