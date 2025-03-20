import { Request, Response } from 'express';
import { logger } from '@shared/logger';
import { prisma } from '@infrastructure/database/prisma-client';
import { redisClient } from '@infrastructure/cache/redis-client';

export class HealthController {
  /**
   * Verifica status básico do serviço
   */
  async check(_req: Request, res: Response): Promise<Response> {
    logger.debug('Verificação de saúde básica');

    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      service: 'innerview-api',
    });
  }

  /**
   * Verifica status detalhado incluindo banco de dados e outros serviços
   */
  async details(_req: Request, res: Response): Promise<Response> {
    logger.debug('Verificação de saúde detalhada');

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      service: 'innerview-api',
      uptime: process.uptime(),
      dependencies: {
        database: {
          status: 'pending',
          type: 'mysql',
        },
        redis: {
          status: 'pending',
        },
      },
    };

    try {
      // Verificar conexão com banco de dados
      await prisma.$queryRaw`SELECT 1`;
      health.dependencies.database.status = 'healthy';
    } catch (error) {
      health.status = 'degraded';
      health.dependencies.database.status = 'unhealthy';
      logger.error('Erro ao verificar banco de dados', { error });
    }

    try {
      // Verificar conexão com Redis
      if (redisClient) {
        await redisClient.ping();
        health.dependencies.redis.status = 'healthy';
      } else {
        health.dependencies.redis.status = 'disabled';
      }
    } catch (error) {
      health.dependencies.redis.status = 'unhealthy';
      if (health.status !== 'degraded') {
        health.status = 'degraded';
      }
      logger.error('Erro ao verificar Redis', { error });
    }

    return res.status(health.status === 'healthy' ? 200 : 503).json(health);
  }
}
