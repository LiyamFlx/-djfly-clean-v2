import { cache } from '../../../utils/cache';

const API_KEYS = {
  ALPHA_VANTAGE: 'JFH07GVNN39J1RZ6',
};

export class TradingAPI {
  private baseUrl = 'https://www.alphavantage.co/query';

  async getStockData(symbol: string) {
    const cacheKey = `stock-${symbol}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEYS.ALPHA_VANTAGE}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache for 5 minutes
      cache.set(cacheKey, data, 5 * 60 * 1000);

      return data;
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
      throw error;
    }
  }
}

export const tradingAPI = new TradingAPI();
