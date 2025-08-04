import { cache } from '../../utils/cache';

const API_KEYS = {
  ALPHA_VANTAGE: 'JFH07GVNN39J1RZ6',
  FINANCIAL_MODELING_PREP: 'WXZO5r7m1tICZmJU5Zkw2MO4riDpMZJr'
};

const BASE_URLS = {
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  FINANCIAL_MODELING_PREP: 'https://financialmodelingprep.com/api/v3'
};

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

class ApiService {
  private cache = cache;
  
  async get<T>(url: string, cacheKey: string, ttl: number = 5 * 60 * 1000): Promise<ApiResponse<T>> {
    try {
      // Try to get from cache first
      const cached = this.cache.get<T>(cacheKey);
      if (cached) return { data: cached, error: null };
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the successful response
      this.cache.set(cacheKey, data, ttl);
      
      return { data, error: null };
    } catch (error) {
      console.error('API Error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }
  
  // Stock Quote
  async getStockQuote(symbol: string) {
    const url = `${BASE_URLS.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEYS.ALPHA_VANTAGE}`;
    return this.get(url, `quote_${symbol}`, 60000); // 1 minute cache for quotes
  }
  
  // Stock Search
  async searchStocks(keywords: string) {
    const url = `${BASE_URLS.ALPHA_VANTAGE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${API_KEYS.ALPHA_VANTAGE}`;
    return this.get<{ bestMatches: Array<{
      '1. symbol': string;
      '2. name': string;
      '3. type': string;
      '4. region': string;
      '8. currency': string;
    }>}>(url, `search_${keywords}`, 24 * 60 * 60 * 1000); // 24h cache for searches
  }
  
  // Get Company Profile
  async getCompanyProfile(symbol: string) {
    const url = `${BASE_URLS.FINANCIAL_MODELING_PREP}/profile/${symbol}?apikey=${API_KEYS.FINANCIAL_MODELING_PREP}`;
    return this.get<Array<{
      symbol: string;
      price: number;
      changes: number;
      companyName: string;
      exchange: string;
      industry: string;
      website: string;
      description: string;
      ceo: string;
      sector: string;
      country: string;
      fullTimeEmployees: string;
      image: string;
    }>>(url, `profile_${symbol}`, 24 * 60 * 60 * 1000); // 24h cache for company profiles
  }
  
  // Get Historical Prices
  async getHistoricalPrices(symbol: string, interval: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const functionMap = {
      daily: 'TIME_SERIES_DAILY',
      weekly: 'TIME_SERIES_WEEKLY',
      monthly: 'TIME_SERIES_MONTHLY'
    };
    
    const url = `${BASE_URLS.ALPHA_VANTAGE}?function=${functionMap[interval]}&symbol=${symbol}&apikey=${API_KEYS.ALPHA_VANTAGE}&outputsize=compact`;
    return this.get(url, `historical_${symbol}_${interval}`, 5 * 60 * 1000); // 5 minute cache for historical data
  }
  
  // Get Market Status
  async getMarketStatus() {
    const url = `${BASE_URLS.FINANCIAL_MODELING_PREP}/market-hours?apikey=${API_KEYS.FINANCIAL_MODELING_PREP}`;
    return this.get<{
      isTheStockMarketOpen: boolean;
      isTheEuronextMarketOpen: boolean;
      isTheForexMarketOpen: boolean;
      isTheCryptoMarketOpen: boolean;
    }>(url, 'market_status', 60000); // 1 minute cache for market status
  }
  
  // Get Stock Screener
  async getStockScreener(filters: Record<string, any> = {}) {
    const params = new URLSearchParams({
      apikey: API_KEYS.FINANCIAL_MODELING_PREP,
      ...filters
    });
    
    const url = `${BASE_URLS.FINANCIAL_MODELING_PREP}/stock-screener?${params.toString()}`;
    return this.get<Array<{
      symbol: string;
      companyName: string;
      marketCap: number;
      sector: string;
      industry: string;
      beta: number;
      price: number;
      lastAnnualDividend: number;
      volume: number;
      exchange: string;
      exchangeShortName: string;
      country: string;
      isEtf: boolean;
      isFund: boolean;
      isActivelyTrading: boolean;
    }>>(url, `screener_${JSON.stringify(filters)}`, 5 * 60 * 1000); // 5 minute cache for screener
  }
  
  // Get Market News
  async getMarketNews(tickers: string = '', limit: number = 10) {
    const url = `${BASE_URLS.FINANCIAL_MODELING_PREP}/stock_news?tickers=${tickers}&limit=${limit}&apikey=${API_KEYS.FINANCIAL_MODELING_PREP}`;
    return this.get<Array<{
      symbol: string;
      publishedDate: string;
      title: string;
      image: string;
      site: string;
      text: string;
      url: string;
    }>>(url, `news_${tickers}_${limit}`, 5 * 60 * 1000); // 5 minute cache for news
  }
}

export const apiService = new ApiService();
