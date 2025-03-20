import { Redis } from 'ioredis';
declare let redisClient: Redis | null;
export { redisClient };
export declare function setCache<T>(key: string, data: T, ttl?: number): Promise<void>;
export declare function getCache<T>(key: string): Promise<T | null>;
export declare function invalidateCache(key: string): Promise<void>;
