import { env } from './env';

const config = {
  server: {
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    environment: env.NODE_ENV,
  },
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
    cacheTtl: env.REDIS_CACHE_TTL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRATION,
  },
  session: {
    secret: env.SESSION_SECRET,
  },
  cors: {
    origins: env.CORS_ORIGINS.split(','),
  },
  logger: {
    level: env.LOG_LEVEL,
    format: env.LOG_FORMAT,
  },
};

export default config;
