// lib/cache.js
export class CacheManager {
  constructor(ttl = 3600000) {
    this.ttl = ttl; // 1 ora
  }

  set(key, data) {
    if (typeof window !== 'undefined') {
      const item = {
        data,
        expiry: Date.now() + this.ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
    }
  }

  get(key) {
    if (typeof window !== 'undefined') {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.data;
    }
    return null;
  }
}
