"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsLogger = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const env_1 = require("@config/env");
const baseConfig = {
    level: env_1.env.LOG_LEVEL,
    timestamp: true,
};
const transport = env_1.env.LOG_FORMAT === 'pretty'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined;
const logger = (0, pino_1.default)({
    ...baseConfig,
    transport,
});
exports.logger = logger;
const metricsLogger = logger.child({ module: 'metrics' });
exports.metricsLogger = metricsLogger;
//# sourceMappingURL=index.js.map