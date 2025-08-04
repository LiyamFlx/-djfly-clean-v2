import React, { useEffect } from 'react';
import { useTradingStore } from '../store/useTradingStore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const StockDetail: React.FC = () => {
  const { 
    currentSymbol, 
    stockData, 
    loading, 
    error, 
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    fetchStockData 
  } = useTradingStore();

  // Fetch stock data when symbol changes
  useEffect(() => {
    if (currentSymbol) {
      fetchStockData(currentSymbol);
    }
  }, [currentSymbol, fetchStockData]);

  if (!currentSymbol) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Select a stock to view details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        Error loading stock data: {error}
      </div>
    );
  }

  if (!stockData?.quote || !stockData.profile) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
        No data available for {currentSymbol}
      </div>
    );
  }

  const { quote, profile, history } = stockData;
  const isInWatchlist = watchlist.some(item => item.symbol === currentSymbol);

  // Prepare chart data
  const chartData = {
    labels: history ? Object.keys(history['Time Series (Daily)'] || {}).slice(0, 30).reverse() : [],
    datasets: [
      {
        label: 'Stock Price',
        data: history ? Object.values(history['Time Series (Daily)'] || {})
          .slice(0, 30)
          .reverse()
          .map((day: any) => day['4. close']) : [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Price: $${parseFloat(context.raw).toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value: any) {
            return `$${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{profile.companyName} ({profile.symbol})</h1>
          <p className="text-gray-600">{profile.exchange} • {profile.industry} • {profile.country}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            ${parseFloat(quote['05. price']).toFixed(2)}
          </div>
          <div className={`text-lg ${parseFloat(quote['09. change']) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(quote['09. change']) >= 0 ? '↑' : '↓'} 
            ${Math.abs(parseFloat(quote['09. change'])).toFixed(2)} 
            ({parseFloat(quote['10. change percent']).toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">30-Day Price History</h2>
        <div className="h-64">
          {history ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Historical data not available
            </div>
          )}
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Company Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">CEO:</span> {profile.ceo || 'N/A'}</p>
            <p><span className="font-medium">Sector:</span> {profile.sector}</p>
            <p><span className="font-medium">Industry:</span> {profile.industry}</p>
            <p><span className="font-medium">Employees:</span> {profile.fullTimeEmployees?.toLocaleString() || 'N/A'}</p>
            <p><span className="font-medium">Website:</span> 
              {profile.website ? (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              ) : 'N/A'}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Market Data</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Open:</span> ${parseFloat(quote['02. open']).toFixed(2)}</p>
            <p><span className="font-medium">High:</span> ${parseFloat(quote['03. high']).toFixed(2)}</p>
            <p><span className="font-medium">Low:</span> ${parseFloat(quote['04. low']).toFixed(2)}</p>
            <p><span className="font-medium">Previous Close:</span> ${parseFloat(quote['08. previous close']).toFixed(2)}</p>
            <p><span className="font-medium">Volume:</span> {parseInt(quote['06. volume']).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Company Description */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">About {profile.companyName}</h2>
        <p className="text-gray-700">
          {profile.description || 'No description available.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => isInWatchlist ? removeFromWatchlist(currentSymbol) : addToWatchlist(currentSymbol)}
          className={`px-4 py-2 rounded-md ${isInWatchlist 
            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
          View Full Analysis
        </button>
      </div>
    </div>
  );
};
