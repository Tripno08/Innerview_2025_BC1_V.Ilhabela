"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.setCache = setCache;
exports.getCache = getCache;
exports.invalidateCache = invalidateCache;
const ioredis_1 = require("ioredis");
const env_1 = require("@config/env");
const logger_1 = require("@shared/logger");
let redisClient = null;
exports.redisClient = redisClient;
if (env_1.env.REDIS_URL) {
    try {
        exports.redisClient = redisClient = new ioredis_1.Redis(env_1.env.REDIS_URL, {
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: true,
        });
        redisClient.on('connect', () => {
            logger_1.logger.info('Redis conectado');
        });
        redisClient.on('error', (error) => {
            logger_1.logger.error('Erro na conexão Redis', { error });
        });
        redisClient.on('reconnecting', () => {
            logger_1.logger.warn('Reconectando ao Redis...');
        });
        redisClient.connect().catch((error) => {
            logger_1.logger.error('Falha ao conectar ao Redis', { error });
        });
    }
    catch (error) {
        logger_1.logger.error('Erro ao inicializar cliente Redis', { error });
        exports.redisClient = redisClient = null;
    }
}
else {
    logger_1.logger.warn('Redis URL não configurada. Cache Redis está desabilitado.');
}
async function setCache(key, data, ttl = env_1.env.REDIS_CACHE_TTL) {
    if (!redisClient)
        return;
    try {
        await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
    }
    catch (error) {
        logger_1.logger.error('Erro ao armazenar em cache', { error, key });
    }
}
async function getCache(key) {
    if (!redisClient)
        return null;
    try {
        const data = await redisClient.get(key);
        if (!data)
            return null;
        return JSON.parse(data);
    }
    catch (error) {
        logger_1.logger.error('Erro ao recuperar do cache', { error, key });
        return null;
    }
}
async function invalidateCache(key) {
    if (!redisClient)
        return;
    try {
        await redisClient.del(key);
    }
    catch (error) {
        logger_1.logger.error('Erro ao invalidar cache', { error, key });
    }
}
//# sourceMappingURL=redis-client.js.map