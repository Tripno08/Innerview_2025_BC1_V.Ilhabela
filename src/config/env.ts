import 'dotenv/config';
import { z } from 'zod';

// Schema para validação das variáveis de ambiente
const envSchema = z.object({
  // Ambiente
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Servidor
  PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('/api'),

  // Banco de dados
  DATABASE_URL: z.string(),

  // Redis
  REDIS_URL: z.string().optional(),
  REDIS_CACHE_TTL: z.coerce.number().default(300),

  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string().default('24h'),

  // Sessão
  SESSION_SECRET: z.string(),

  // Logs
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['pretty', 'json']).default('pretty'),
});

// Validação do ambiente
const _env = envSchema.safeParse(process.env);

// Verificar se há erros na validação
if (!_env.success) {
  console.error('❌ Variáveis de ambiente inválidas:', _env.error.format());
  throw new Error('Variáveis de ambiente inválidas');
}

export const env = _env.data;
