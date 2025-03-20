"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(3000),
    API_PREFIX: zod_1.z.string().default('/api'),
    DATABASE_URL: zod_1.z.string(),
    REDIS_URL: zod_1.z.string().optional(),
    REDIS_CACHE_TTL: zod_1.z.coerce.number().default(300),
    CORS_ORIGINS: zod_1.z.string().default('http://localhost:3000'),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRATION: zod_1.z.string().default('24h'),
    SESSION_SECRET: zod_1.z.string(),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
    LOG_FORMAT: zod_1.z.enum(['pretty', 'json']).default('pretty'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('❌ Variáveis de ambiente inválidas:', _env.error.format());
    throw new Error('Variáveis de ambiente inválidas');
}
exports.env = _env.data;
//# sourceMappingURL=env.js.map