import React, { useEffect, useState } from 'react';
import { Watchlist } from './Watchlist';
import { StockScreener } from './StockScreener';
import { StockDetail } from './StockDetail';
import { MarketStatus } from './MarketStatus';
import { useTradingStore } from '../store/useTradingStore';

const TABS = [
  { id: 'watchlist', label: 'My Watchlist' },
  { id: 'screener', label: 'Stock Screener' },
  { id: 'portfolio', label: 'My Portfolio' },
  { id: 'news', label: 'Market News' },
];

export const TradingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('watchlist');
  const { refreshMarketStatus } = useTradingStore();

  // Refresh market status on mount
  useEffect(() => {
    refreshMarketStatus();
  }, [refreshMarketStatus]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'watchlist':
        return <Watchlist />;
      case 'screener':
        return <StockScreener />;
      case 'portfolio':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">My Portfolio</h2>
            <p className="text-gray-600">Portfolio tracking coming soon!</p>
          </div>
        );
      case 'news':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Market News</h2>
            <p className="text-gray-600">Market news feed coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Trading Dashboard</h1>
            <MarketStatus />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stocks..."
                  className="w-full p-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <nav className="flex border-b">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="p-4">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-2/3">
            <StockDetail />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Data provided by Financial Modeling Prep and Alpha Vantage APIs
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            This is for demonstration purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};
