import winston from 'winston';
import { env } from '@config/env';

// Definição de tipos personalizados para o logger
interface ExtendedLogger extends winston.Logger {
  http: winston.LeveledLogMethod;
}

// Configuração do logger usando Winston
export const logger: ExtendedLogger = winston.createLogger({
  level: env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    env.LOG_FORMAT === 'pretty' ? winston.format.prettyPrint() : winston.format.json(),
  ),
  defaultMeta: { service: 'innerview-api' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
}) as ExtendedLogger;

// Definir o método http no logger
const originalInfo = logger.info.bind(logger);
logger.http = (message: string | object, ...meta: unknown[]) => originalInfo(message, ...meta);

// Exporta a métrica logger para uso em outros módulos
export const metricsLogger: ExtendedLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: 'innerview-metrics' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/metrics.log' }),
  ],
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
}) as ExtendedLogger;

// Definir o método http no metricsLogger
const originalMetricsInfo = metricsLogger.info.bind(metricsLogger);
metricsLogger.http = (message: string | object, ...meta: unknown[]) =>
  originalMetricsInfo(message, ...meta);
