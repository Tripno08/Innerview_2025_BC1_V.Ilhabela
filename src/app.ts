import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import 'reflect-metadata';
// Importar as extensões do Prisma para garantir que sejam carregadas
import '@infrastructure/database/prisma-schema-extensions';
import { env } from '@config/env';
import { errorHandler } from '@interfaces/http/middlewares/error-handler';
import { notFoundHandler } from '@interfaces/http/middlewares/not-found-handler';
import { routes } from '@interfaces/routes';
import { logger } from '@shared/logger';
import { registerDependencies } from '@shared/container';
import { setupSwagger } from './docs/setup';
import { swaggerAuthMiddleware } from '@interfaces/middlewares/swagger.middleware';

// Inicializar container de injeção de dependências
registerDependencies();

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
      write: (message: string) => logger.http(message.trim()),
    },
  }),
);

// Middleware de autenticação para documentação Swagger
app.use(swaggerAuthMiddleware);

// Configurar documentação Swagger
setupSwagger(app);

// Rotas da API
app.use(env.API_PREFIX, routes);

// Middleware para tratar rotas não encontradas
app.use(notFoundHandler);

// Middleware para tratamento de erros
app.use(errorHandler);

export { app };
