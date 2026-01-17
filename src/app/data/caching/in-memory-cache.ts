export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Simple in-memory cache with TTL support.
 *
 * @typeParam T - Cached value type.
 */
export class InMemoryCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  /**
   * Creates a cache with the provided TTL in milliseconds.
   *
   * @param ttlMs - Time to live in milliseconds for each entry.
   */
  constructor(private readonly ttlMs: number) {}

  /**
   * Returns a cached value when present and not expired.
   *
   * @param key - Cache key.
   * @returns Cached value or undefined when missing/expired.
   */
  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Stores a value with an expiration based on the configured TTL.
   *
   * @param key - Cache key.
   * @param value - Value to cache.
   */
  set(key: string, value: T) {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}
