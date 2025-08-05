import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cache } from '../cache';

describe('Cache', () => {
  beforeEach(() => {
    cache.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stores and retrieves values correctly', () => {
    const testData = { message: 'Hello World' };
    
    cache.set('test-key', testData);
    const retrieved = cache.get('test-key');
    
    expect(retrieved).toEqual(testData);
  });

  it('returns null for non-existent keys', () => {
    const result = cache.get('non-existent');
    expect(result).toBeNull();
  });

  it('expires items after TTL', () => {
    const testData = { message: 'Hello World' };
    
    cache.set('test-key', testData, 1000); // 1 second TTL
    expect(cache.get('test-key')).toEqual(testData);
    
    // Fast forward time by 1.5 seconds
    vi.advanceTimersByTime(1500);
    expect(cache.get('test-key')).toBeNull();
  });

  it('removes items correctly', () => {
    cache.set('test-key', 'test-value');
    expect(cache.get('test-key')).toBe('test-value');
    
    cache.delete('test-key');
    expect(cache.get('test-key')).toBeNull();
  });

  it('clears all items', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    expect(cache.size).toBe(2);
    cache.clear();
    expect(cache.size).toBe(0);
  });

  it('enforces max size limit', () => {
    // This test would require access to private maxSize property
    // For now, we'll test that the cache doesn't crash with many items
    for (let i = 0; i < 1100; i++) {
      cache.set(`key-${i}`, `value-${i}`);
    }
    
    expect(cache.size).toBeLessThanOrEqual(1000);
  });
});