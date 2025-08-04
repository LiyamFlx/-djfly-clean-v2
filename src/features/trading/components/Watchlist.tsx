import React, { useEffect } from 'react';
import { useTradingStore } from '../store/useTradingStore';
import { WatchlistItem } from '../types';

export const Watchlist: React.FC = () => {
  const { 
    watchlist, 
    loading, 
    error, 
    refreshWatchlist, 
    removeFromWatchlist,
    setCurrentSymbol
  } = useTradingStore();

  // Refresh watchlist on mount and every 30 seconds
  useEffect(() => {
    refreshWatchlist();
    const interval = setInterval(refreshWatchlist, 30000);
    return () => clearInterval(interval);
  }, [refreshWatchlist]);

  if (loading && watchlist.length === 0) {
    return <div className="p-4">Loading watchlist...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (watchlist.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        Your watchlist is empty. Add stocks to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {watchlist.map((item: WatchlistItem) => (
            <tr 
              key={item.symbol}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => setCurrentSymbol(item.symbol)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{item.symbol}</div>
                <div className="text-sm text-gray-500">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900">${item.price.toFixed(2)}</div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.change >= 0 ? '↑' : '↓'} ${Math.abs(item.change).toFixed(2)} ({item.changePercent.toFixed(2)}%)
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(item.symbol);
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
