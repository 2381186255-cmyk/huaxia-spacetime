// 华夏时空 - Redis连接服务

import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 200, 5000);
        return delay;
      },
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });
  }
  return redis;
}

/**
 * 获取缓存，若不存在则执行fetcher并缓存结果
 */
export async function cacheOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 86400
): Promise<T> {
  const client = getRedis();

  try {
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.warn(`Cache read error for key ${key}:`, err);
  }

  const data = await fetcher();

  try {
    await client.setex(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.warn(`Cache write error for key ${key}:`, err);
  }

  return data;
}

/**
 * 使缓存失效
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedis();
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (err) {
    console.warn(`Cache invalidation error for pattern ${pattern}:`, err);
  }
}

/**
 * 健康检查
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const result = await getRedis().ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}
