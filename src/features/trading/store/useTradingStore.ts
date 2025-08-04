import { create } from 'zustand';
import { apiService } from '../services/api';
import { WatchlistItem } from '../types';

interface TradingState {
  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (symbol: string) => Promise<void>;
  removeFromWatchlist: (symbol: string) => void;
  refreshWatchlist: () => Promise<void>;
  
  // Market Status
  marketStatus: {
    isOpen: boolean;
    status: 'open' | 'closed' | 'premarket' | 'postmarket';
    lastUpdated: Date | null;
  };
  refreshMarketStatus: () => Promise<void>;
  
  // Stock Data
  currentSymbol: string | null;
  setCurrentSymbol: (symbol: string | null) => void;
  stockData: any;
  loading: boolean;
  error: string | null;
  fetchStockData: (symbol: string) => Promise<void>;
  
  // Stock Screener
  screenerFilters: Record<string, any>;
  setScreenerFilters: (filters: Record<string, any>) => void;
  screenerResults: any[];
  isScreenerLoading: boolean;
  runScreener: () => Promise<void>;
  
  // News
  news: any[];
  isNewsLoading: boolean;
  fetchNews: (tickers?: string) => Promise<void>;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  // Initial state
  watchlist: [],
  marketStatus: {
    isOpen: false,
    status: 'closed',
    lastUpdated: null,
  },
  currentSymbol: null,
  stockData: null,
  loading: false,
  error: null,
  screenerFilters: {},
  screenerResults: [],
  isScreenerLoading: false,
  news: [],
  isNewsLoading: false,

  // Actions
  addToWatchlist: async (symbol) => {
    const { watchlist, refreshWatchlist } = get();
    
    // Check if already in watchlist
    if (watchlist.some(item => item.symbol === symbol)) {
      return;
    }
    
    try {
      // Add to watchlist with basic info
      const newItem: WatchlistItem = {
        symbol,
        addedAt: new Date().toISOString(),
        price: 0,
        change: 0,
        changePercent: 0,
        name: symbol,
      };
      
      set(state => ({
        watchlist: [...state.watchlist, newItem]
      }));
      
      // Refresh to get latest data
      await get().refreshWatchlist();
      
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  },
  
  removeFromWatchlist: (symbol) => {
    set(state => ({
      watchlist: state.watchlist.filter(item => item.symbol !== symbol)
    }));
  },
  
  refreshWatchlist: async () => {
    const { watchlist } = get();
    
    if (watchlist.length === 0) return;
    
    try {
      // Get quotes for all symbols in watchlist
      const symbols = watchlist.map(item => item.symbol).join(',');
      const { data: quotes, error } = await apiService.getStockQuote(symbols);
      
      if (error) throw new Error(error);
      
      // Update watchlist with latest prices
      set(state => ({
        watchlist: state.watchlist.map(item => {
          const quote = quotes?.['Global Quote'];
          if (!quote) return item;
          
          return {
            ...item,
            price: parseFloat(quote['05. price']) || item.price,
            change: parseFloat(quote['09. change']) || item.change,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || item.changePercent,
          };
        })
      }));
      
    } catch (error) {
      console.error('Error refreshing watchlist:', error);
    }
  },
  
  refreshMarketStatus: async () => {
    try {
      const { data, error } = await apiService.getMarketStatus();
      
      if (error) throw new Error(error);
      
      set({
        marketStatus: {
          isOpen: data?.isTheStockMarketOpen || false,
          status: data?.isTheStockMarketOpen ? 'open' : 
                 data?.isTheEuronextMarketOpen ? 'premarket' : 'closed',
          lastUpdated: new Date(),
        }
      });
      
    } catch (error) {
      console.error('Error refreshing market status:', error);
    }
  },
  
  setCurrentSymbol: (symbol) => {
    set({ currentSymbol: symbol });
    if (symbol) {
      get().fetchStockData(symbol);
    }
  },
  
  fetchStockData: async (symbol) => {
    set({ loading: true, error: null });
    
    try {
      const [quote, profile, history] = await Promise.all([
        apiService.getStockQuote(symbol),
        apiService.getCompanyProfile(symbol),
        apiService.getHistoricalPrices(symbol, 'daily')
      ]);
      
      if (quote.error || profile.error || history.error) {
        throw new Error(quote.error || profile.error || history.error);
      }
      
      set({
        stockData: {
          quote: quote.data?.['Global Quote'],
          profile: profile.data?.[0],
          history: history.data
        },
        loading: false
      });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch stock data',
        loading: false
      });
    }
  },
  
  setScreenerFilters: (filters) => {
    set({ screenerFilters: filters });
  },
  
  runScreener: async () => {
    const { screenerFilters } = get();
    set({ isScreenerLoading: true });
    
    try {
      const { data, error } = await apiService.getStockScreener(screenerFilters);
      
      if (error) throw new Error(error);
      
      set({
        screenerResults: data || [],
        isScreenerLoading: false
      });
      
    } catch (error) {
      console.error('Error running screener:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to run stock screener',
        isScreenerLoading: false
      });
    }
  },
  
  fetchNews: async (tickers = '') => {
    set({ isNewsLoading: true });
    
    try {
      const { data, error } = await apiService.getMarketNews(tickers);
      
      if (error) throw new Error(error);
      
      set({
        news: data || [],
        isNewsLoading: false
      });
      
    } catch (error) {
      console.error('Error fetching news:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch news',
        isNewsLoading: false
      });
    }
  },
}));
