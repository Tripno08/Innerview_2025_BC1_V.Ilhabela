export interface ICacheService {
    set(key: string, value: any, ttlInSeconds?: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    delete(key: string): Promise<void>;
    invalidatePrefix(prefix: string): Promise<void>;
}
