import Redis from 'ioredis';
import { testConfig } from '@config/test';

const redis = new Redis({
  host: testConfig.redis.host,
  port: testConfig.redis.port,
  keyPrefix: testConfig.redis.keyPrefix,
});

export async function clearTestRedis() {
  const keys = await redis.keys(`${testConfig.redis.keyPrefix}*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export async function closeTestRedis() {
  await redis.quit();
} 