// Configuração global de testes
import { PrismaClient } from '@prisma/client';
import { prisma } from '../src/infrastructure/database/prisma-client';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { registerDependencies } from '../src/shared/container';

// Tempo máximo de execução dos testes (30 segundos)
jest.setTimeout(30000);

// Mock global para o logger
jest.mock('../src/shared/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
  metricsLogger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
}));

// Mock para Redis
jest.mock('../src/infrastructure/cache/redis-client', () => ({
  redisClient: null,
  setCache: jest.fn(),
  getCache: jest.fn(),
  invalidateCache: jest.fn(),
}));

// Registra as dependências no container
registerDependencies();

// Limpar o banco de dados antes/depois dos testes
beforeAll(async () => {
  // Usar banco de dados de teste
  process.env.NODE_ENV = 'test';
  
  // Conectar ao banco de dados
  await prisma.$connect();
});

afterAll(async () => {
  // Limpar o banco de dados após os testes
  await prisma.$disconnect();
});

// Limpa o container após cada teste
afterEach(() => {
  container.clearInstances();
  jest.clearAllMocks();
}); 