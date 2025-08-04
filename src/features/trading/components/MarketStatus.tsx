import React, { useEffect, useState } from 'react';
import { useTradingStore } from '../store/useTradingStore';

interface MarketStatusProps {
  className?: string;
}

export const MarketStatus: React.FC<MarketStatusProps> = ({ className = '' }) => {
  const { marketStatus, refreshMarketStatus } = useTradingStore();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  // Set up time updates and market status refresh
  useEffect(() => {
    setIsClient(true);
    
    // Initial update
    updateTime();
    refreshMarketStatus();
    
    // Update time every second
    const timeInterval = setInterval(updateTime, 1000);
    
    // Refresh market status every minute
    const marketStatusInterval = setInterval(refreshMarketStatus, 60000);
    
    return () => {
      clearInterval(timeInterval);
      clearInterval(marketStatusInterval);
    };
  }, [refreshMarketStatus]);

  const updateTime = () => {
    // Get current time in New York timezone
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    setCurrentTime(formatter.format(new Date()));
  };

  // Don't render on server-side to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  const getStatusText = () => {
    if (!marketStatus.lastUpdated) return 'Checking market status...';
    
    switch (marketStatus.status) {
      case 'open':
        return 'Market Open';
      case 'closed':
        return 'Market Closed';
      case 'premarket':
        return 'Pre-Market';
      case 'postmarket':
        return 'After Hours';
      default:
        return 'Market Status Unknown';
    }
  };

  const getStatusColor = () => {
    if (!marketStatus.lastUpdated) return 'bg-gray-200';
    
    switch (marketStatus.status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'premarket':
      case 'postmarket':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center">
        <span className="font-medium mr-2">Market:</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          <span className={`w-2 h-2 rounded-full mr-1.5 ${
            marketStatus.status === 'open' ? 'bg-green-500' : 
            marketStatus.status === 'closed' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></span>
          {getStatusText()}
        </span>
      </div>
      
      <div className="hidden sm:flex items-center">
        <span className="font-medium mr-2">NY Time:</span>
        <span className="font-mono">{currentTime} ET</span>
      </div>
      
      {marketStatus.lastUpdated && (
        <div className="text-xs text-gray-500">
          Updated: {new Date(marketStatus.lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
