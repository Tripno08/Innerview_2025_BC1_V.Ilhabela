import { Redis } from 'ioredis';
import { env } from '@config/env';
import { logger } from '@shared/logger';

let redisClient: Redis | null = null;

// Inicializar cliente Redis apenas se a URL estiver configurada
if (env.REDIS_URL) {
  try {
    redisClient = new Redis(env.REDIS_URL, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    // Eventos de conexão
    redisClient.on('connect', () => {
      logger.info('Redis conectado');
    });

    redisClient.on('error', (error) => {
      logger.error('Erro na conexão Redis', { error });
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Reconectando ao Redis...');
    });

    // Conectar ao Redis
    redisClient.connect().catch((error) => {
      logger.error('Falha ao conectar ao Redis', { error });
    });
  } catch (error) {
    logger.error('Erro ao inicializar cliente Redis', { error });
    redisClient = null;
  }
} else {
  logger.warn('Redis URL não configurada. Cache Redis está desabilitado.');
}

export { redisClient };

// Função utilitária para armazenar dados em cache
export async function setCache<T>(
  key: string,
  data: T,
  ttl: number = env.REDIS_CACHE_TTL,
): Promise<void> {
  if (!redisClient) return;

  try {
    await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (error) {
    logger.error('Erro ao armazenar em cache', { error, key });
  }
}

// Função utilitária para recuperar dados do cache
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redisClient) return null;

  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error('Erro ao recuperar do cache', { error, key });
    return null;
  }
}

// Função utilitária para invalidar cache
export async function invalidateCache(key: string): Promise<void> {
  if (!redisClient) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Erro ao invalidar cache', { error, key });
  }
}
