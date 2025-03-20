import Redis from 'ioredis';
import { injectable } from 'tsyringe';
import { ICacheService } from '@domain/interfaces/ICacheService';
import { config } from '@config/cache';

@injectable()
export class RedisCache implements ICacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.redis);
  }

  public async set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);

    if (ttlInSeconds) {
      await this.client.setex(key, ttlInSeconds, serializedValue);
    } else {
      await this.client.set(key, serializedValue);
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}
