import React, { useState, useEffect } from 'react';
import { useTradingStore } from '../store/useTradingStore';
import { ScreenerFilter } from '../types';

export const StockScreener: React.FC = () => {
  const {
    screenerFilters,
    screenerResults,
    isScreenerLoading,
    error,
    setScreenerFilters,
    runScreener,
    setCurrentSymbol
  } = useTradingStore();

  const [filters, setFilters] = useState<ScreenerFilter>(screenerFilters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initial screener run with default filters
    if (Object.keys(screenerResults).length === 0) {
      runScreener();
    }
  }, []);

  const handleFilterChange = (field: keyof ScreenerFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const handleApplyFilters = () => {
    setScreenerFilters(filters);
    runScreener();
  };

  const handleResetFilters = () => {
    const resetFilters = {};
    setFilters(resetFilters);
    setScreenerFilters(resetFilters);
    runScreener();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Stock Screener</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMoreThan || ''}
                  onChange={(e) => handleFilterChange('priceMoreThan', parseFloat(e.target.value))}
                  className="w-1/2 p-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceLowerThan || ''}
                  onChange={(e) => handleFilterChange('priceLowerThan', parseFloat(e.target.value))}
                  className="w-1/2 p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Market Cap Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Market Cap (M)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.marketCapMoreThan || ''}
                  onChange={(e) => handleFilterChange('marketCapMoreThan', parseFloat(e.target.value) * 1000000)}
                  className="w-1/2 p-2 border rounded-md"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.marketCapLowerThan ? filters.marketCapLowerThan / 1000000 : ''}
                  onChange={(e) => handleFilterChange('marketCapLowerThan', parseFloat(e.target.value) * 1000000)}
                  className="w-1/2 p-2 border rounded-md"
                />
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Min Volume (M)</label>
              <input
                type="number"
                value={filters.volumeMoreThan ? filters.volumeMoreThan / 1000000 : ''}
                onChange={(e) => handleFilterChange('volumeMoreThan', parseFloat(e.target.value) * 1000000)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Sector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sector</label>
              <select
                value={filters.sector || ''}
                onChange={(e) => handleFilterChange('sector', e.target.value || undefined)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Sectors</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Consumer Cyclical">Consumer Cyclical</option>
                <option value="Industrials">Industrials</option>
                <option value="Energy">Energy</option>
                <option value="Utilities">Utilities</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Consumer Defensive">Consumer Defensive</option>
                <option value="Communication Services">Communication Services</option>
                <option value="Basic Materials">Basic Materials</option>
              </select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                placeholder="e.g., US, UK, JP"
                value={filters.country || ''}
                onChange={(e) => handleFilterChange('country', e.target.value || undefined)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Exchange */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Exchange</label>
              <select
                value={filters.exchange || ''}
                onChange={(e) => handleFilterChange('exchange', e.target.value || undefined)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Exchanges</option>
                <option value="nyse">NYSE</option>
                <option value="nasdaq">NASDAQ</option>
                <option value="amex">AMEX</option>
                <option value="euronext">Euronext</option>
                <option value="tsx">TSX</option>
                <option value="etf">ETF</option>
                <option value="mutual_fund">Mutual Fund</option>
                <option value="commodity">Commodity</option>
                <option value="index">Index</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="forex">Forex</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleApplyFilters}
              disabled={isScreenerLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isScreenerLoading ? 'Applying...' : 'Apply Filters'}
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isScreenerLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading results...
                  </td>
                </tr>
              ) : screenerResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No stocks match your criteria. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                screenerResults.map((stock: any) => (
                  <tr 
                    key={stock.symbol}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setCurrentSymbol(stock.symbol)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {stock.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stock.companyName}</div>
                      <div className="text-sm text-gray-500">{stock.exchangeShortName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${stock.price?.toFixed(2) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        stock.changes >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {stock.changes >= 0 ? '↑' : '↓'} {Math.abs(stock.changes).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stock.marketCap ? `$${(stock.marketCap / 1000000).toFixed(2)}M` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stock.volume ? (stock.volume / 1000000).toFixed(2) + 'M' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stock.sector || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
