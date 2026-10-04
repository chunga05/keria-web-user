import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Giữ connection không bị tạo lại liên tục khi Next.js hot-reload
const globalForRedis = global as unknown as { redis: Redis };

export const redis = globalForRedis.redis || new Redis(redisUrl, {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 1, // Don't hang indefinitely on single request
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}