"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const config = {
    server: {
        port: env_1.env.PORT,
        apiPrefix: env_1.env.API_PREFIX,
        environment: env_1.env.NODE_ENV,
    },
    database: {
        url: env_1.env.DATABASE_URL,
    },
    redis: {
        url: env_1.env.REDIS_URL,
        cacheTtl: env_1.env.REDIS_CACHE_TTL,
    },
    jwt: {
        secret: env_1.env.JWT_SECRET,
        expiresIn: env_1.env.JWT_EXPIRATION,
    },
    session: {
        secret: env_1.env.SESSION_SECRET,
    },
    cors: {
        origins: env_1.env.CORS_ORIGINS.split(','),
    },
    logger: {
        level: env_1.env.LOG_LEVEL,
        format: env_1.env.LOG_FORMAT,
    },
};
exports.default = config;
//# sourceMappingURL=index.js.map