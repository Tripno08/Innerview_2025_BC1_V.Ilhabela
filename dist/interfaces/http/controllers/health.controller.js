"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const logger_1 = require("@shared/logger");
const prisma_client_1 = require("@infrastructure/database/prisma-client");
const redis_client_1 = require("@infrastructure/cache/redis-client");
class HealthController {
    async check(_req, res) {
        logger_1.logger.debug('Verificação de saúde básica');
        return res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            service: 'innerview-api',
        });
    }
    async details(_req, res) {
        logger_1.logger.debug('Verificação de saúde detalhada');
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
            await prisma_client_1.prisma.$queryRaw `SELECT 1`;
            health.dependencies.database.status = 'healthy';
        }
        catch (error) {
            health.status = 'degraded';
            health.dependencies.database.status = 'unhealthy';
            logger_1.logger.error({ error }, 'Erro ao verificar banco de dados');
        }
        try {
            if (redis_client_1.redisClient) {
                await redis_client_1.redisClient.ping();
                health.dependencies.redis.status = 'healthy';
            }
            else {
                health.dependencies.redis.status = 'disabled';
            }
        }
        catch (error) {
            health.dependencies.redis.status = 'unhealthy';
            if (health.status !== 'degraded') {
                health.status = 'degraded';
            }
            logger_1.logger.error({ error }, 'Erro ao verificar Redis');
        }
        return res.status(health.status === 'healthy' ? 200 : 503).json(health);
    }
}
exports.HealthController = HealthController;
//# sourceMappingURL=health.controller.js.map