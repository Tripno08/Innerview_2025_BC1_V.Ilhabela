import pino from 'pino';
import { env } from '@config/env';

// Configurações base para o logger
const baseConfig = {
  level: env.LOG_LEVEL,
  timestamp: true,
};

// Determinando qual formato de log usar com base na configuração
const transport =
  env.LOG_FORMAT === 'pretty' ? { target: 'pino-pretty', options: { colorize: true } } : undefined;

// Criando a instância do logger
const logger = pino({
  ...baseConfig,
  transport,
});

// Log para métricas e informações operacionais
const metricsLogger = logger.child({ module: 'metrics' });

export { logger, metricsLogger };
