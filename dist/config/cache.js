"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'innerview:',
    },
};
//# sourceMappingURL=cache.js.map