"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("@shared/logger");
const prismaGlobal = global;
function createPrismaClient() {
    const client = new client_1.PrismaClient({
        log: [
            {
                emit: 'event',
                level: 'query',
            },
            {
                emit: 'event',
                level: 'error',
            },
            {
                emit: 'event',
                level: 'info',
            },
            {
                emit: 'event',
                level: 'warn',
            },
        ],
    });
    client.$on('query', (e) => {
        logger_1.logger.debug(`Prisma Query: ${e.query}`, {
            query: {
                params: e.params,
                duration: e.duration,
                target: e.target,
            },
        });
    });
    client.$on('error', (e) => {
        logger_1.logger.error(`Prisma Error: ${e.message}`, {
            error: {
                message: e.message,
                target: e.target,
            },
        }, `Prisma Error: ${e.message}`);
    });
    return client;
}
exports.prisma = prismaGlobal.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') {
    prismaGlobal.prisma = exports.prisma;
}
//# sourceMappingURL=prisma-client.js.map