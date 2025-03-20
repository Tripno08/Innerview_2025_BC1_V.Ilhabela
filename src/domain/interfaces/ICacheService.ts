export interface ICacheService {
  set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  delete(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
