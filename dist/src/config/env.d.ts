import 'dotenv/config';
export declare const env: {
    NODE_ENV?: "development" | "test" | "production";
    PORT?: number;
    API_PREFIX?: string;
    DATABASE_URL?: string;
    REDIS_URL?: string;
    REDIS_CACHE_TTL?: number;
    CORS_ORIGINS?: string;
    JWT_SECRET?: string;
    JWT_EXPIRATION?: string;
    SESSION_SECRET?: string;
    LOG_LEVEL?: "error" | "warn" | "info" | "http" | "debug";
    LOG_FORMAT?: "pretty" | "json";
};
