import { PrismaClient } from '@prisma/client';
import { logger } from '../../shared/logger';

// Instância global do PrismaClient
const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

// Função para criar o cliente do Prisma com logs
function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
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

  // Logging de consultas
  client.$on('query', (e) => {
    logger.debug(`Prisma Query: ${e.query}`, {
      query: {
        params: e.params,
        duration: e.duration,
        target: e.target,
      },
    });
  });

  // Logging de erros
  client.$on('error', (e) => {
    logger.error(
      `Prisma Error: ${e.message}`,
      {
        error: {
          message: e.message,
          target: e.target,
        },
      },
      `Prisma Error: ${e.message}`,
    );
  });

  return client;
}

// Exportar cliente do Prisma (reutilizar em desenvolvimento)
export const prisma: PrismaClient = prismaGlobal.prisma ?? createPrismaClient();

// Salvar referência em ambiente de desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}
