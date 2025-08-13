import React from 'react';

const ProducerAnalyticsPage = () => (
  <div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📊 Producer Analytics</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Total Plays</h3>
          <p className="text-3xl font-bold text-blue-400">1,337</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Active Sets</h3>
          <p className="text-3xl font-bold text-purple-400">42</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Followers</h3>
          <p className="text-3xl font-bold text-green-400">89</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Popular Tracks</h3>
        <div className="space-y-3">
          {['Electronic Dreams', 'Bass Drop Madness', 'Synth Wave Sunset'].map(
            (track, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
              >
                <span>{track}</span>
                <span className="text-blue-400">
                  {Math.floor(Math.random() * 500)} plays
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ProducerAnalyticsPage;
