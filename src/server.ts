import 'reflect-metadata';
import 'express-async-errors';
import { app } from './app';
import { env } from '@config/env';
import { logger } from '@shared/logger';

const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Servidor iniciado na porta ${PORT}`);
  logger.info(`Ambiente: ${env.NODE_ENV}`);
  logger.info(`Acesse: http://localhost:${PORT}${env.API_PREFIX}`);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Rejeição não tratada:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Exceção não capturada:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    logger.info('Servidor encerrado');
    process.exit(0);
  });
});

export { server };
