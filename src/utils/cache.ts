interface CacheItem<T> {
  data: T;
  expiry: number;
}

class Cache {
  private cache: Map<string, CacheItem<unknown>> = new Map();
  private maxSize: number = 1000; // Maximum number of items to store

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns Cached value or null if not found or expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if item has expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    // If we've reached max size, remove the oldest item
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      data: value,
      expiry: Date.now() + ttl
    });
  }

  /**
   * Remove an item from the cache
   * @param key Cache key to remove
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of items in the cache
   */
  get size(): number {
    return this.cache.size;
  }
}

export const cache = new Cache();
