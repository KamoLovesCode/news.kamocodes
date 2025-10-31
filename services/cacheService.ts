// This service has been cleared as per your request.
// The functions below are stubs to prevent the app from crashing.

/**
 * Simulates saving to cache. Does nothing.
 */
export function saveToCache<T>(key: string, data: T, ttlMinutes: number): void {
  console.warn("cacheService.saveToCache has been removed.");
}

/**
 * Simulates loading from cache. Always returns null.
 */
export function loadFromCache<T>(key: string): T | null {
  console.warn("cacheService.loadFromCache has been removed.");
  return null;
}
