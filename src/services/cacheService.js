import Redis from 'ioredis';

class CacheService {
  constructor() {
    this.redisClient = null;
    this.memoryCache = new Map(); // key -> { value, expiresAt }
    this.init();
  }

  init() {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT || 6379;

    if (redisUrl || redisHost) {
      try {
        this.redisClient = redisUrl ? new Redis(redisUrl) : new Redis({ host: redisHost, port: redisPort });
        this.redisClient.on('connect', () => console.log('[CacheService] Connected to Redis server.'));
        this.redisClient.on('error', (err) => {
          console.warn('[CacheService:Redis] Redis error, falling back to memory cache:', err.message);
          this.redisClient = null;
        });
      } catch (err) {
        console.warn('[CacheService] Failed to init Redis, using memory cache:', err.message);
        this.redisClient = null;
      }
    } else {
      // In-memory cache mode for zero-setup local development
      console.log('[CacheService] In-memory caching active (Redis not configured).');
    }

    // Background cleanup of expired in-memory items every 2 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.memoryCache.entries()) {
        if (record.expiresAt && record.expiresAt < now) {
          this.memoryCache.delete(key);
        }
      }
    }, 2 * 60 * 1000).unref();
  }

  async get(key) {
    if (this.redisClient) {
      try {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
      } catch (err) {
        console.error('[CacheService:Redis] Get error:', err.message);
      }
    }

    const record = this.memoryCache.get(key);
    if (!record) return null;
    if (record.expiresAt && record.expiresAt < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    return record.value;
  }

  async set(key, value, ttlSeconds = 300) {
    if (this.redisClient) {
      try {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch (err) {
        console.error('[CacheService:Redis] Set error:', err.message);
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.memoryCache.set(key, { value, expiresAt });
  }

  async del(key) {
    if (this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err) {
        console.error('[CacheService:Redis] Del error:', err.message);
      }
    }
    this.memoryCache.delete(key);
  }

  async delPattern(pattern) {
    if (this.redisClient) {
      try {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (err) {
        console.error('[CacheService:Redis] DelPattern error:', err.message);
      }
    }

    // In-memory pattern removal
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
      }
    }
  }

  async flush() {
    if (this.redisClient) {
      try {
        await this.redisClient.flushdb();
      } catch (err) {
        console.error('[CacheService:Redis] Flush error:', err.message);
      }
    }
    this.memoryCache.clear();
  }
}

export const cacheService = new CacheService();
