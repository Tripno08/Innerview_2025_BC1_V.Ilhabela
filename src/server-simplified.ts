/**
 * Versão simplificada do servidor que contorna problemas de tipo e de importação
 * 
 * Este arquivo evita problemas de referências circulares no TypeScript e erros
 * de importação substituindo o container de dependências original por uma 
 * versão simplificada que contém apenas o essencial.
 */
import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from '@config/env';
import { logger } from '@shared/logger';
import { routes } from '@interfaces/routes';
import { errorHandler } from '@interfaces/http/middlewares/error-handler';
import { notFoundHandler } from '@interfaces/http/middlewares/not-found-handler';

// Substituir o registro de dependências padrão pelo simplificado
import { registerSimplifiedDependencies } from './shared/container/simplified';

// Registrar dependências simplificadas em vez do container padrão
registerSimplifiedDependencies();

// Exibir aviso sobre o modo simplificado
logger.warn('⚠️ Aplicação rodando no modo simplificado para contornar problemas');
logger.warn('⚠️ Este modo deve ser usado apenas temporariamente até a resolução dos problemas');

// Criar aplicação express manualmente em vez de importar do app.ts
const app = express();

// Middlewares para segurança e otimização
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(','),
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requisições HTTP
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }),
);

// Rotas da API
app.use(env.API_PREFIX, routes);

// Middleware para tratar rotas não encontradas
app.use(notFoundHandler);

// Middleware para tratamento de erros
app.use(errorHandler);

// Define a porta explicitamente como 3333 para evitar ambiguidades
const PORT = 3333;

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