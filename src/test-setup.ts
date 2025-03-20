// Mock do logger
jest.mock('@shared/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
}));

// Mock do config/env
jest.mock('@config/env', () => ({
  env: {
    PORT: 3000,
    NODE_ENV: 'test',
    API_PREFIX: '/api',
    CORS_ORIGINS: 'http://localhost:3000',
    JWT_SECRET: 'test-secret',
    JWT_EXPIRATION: '1d',
  },
}));

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});
