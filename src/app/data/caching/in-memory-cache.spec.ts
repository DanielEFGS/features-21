import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { InMemoryCache } from './in-memory-cache';

describe('InMemoryCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns undefined for missing keys', () => {
    const cache = new InMemoryCache<string>(1000);

    expect(cache.get('missing')).toBeUndefined();
  });

  it('returns cached values until expiration', () => {
    const cache = new InMemoryCache<string>(1000);

    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');

    vi.advanceTimersByTime(1500);
    expect(cache.get('key')).toBeUndefined();
  });
});
