"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const env_1 = require("@config/env");
exports.logger = winston_1.default.createLogger({
    level: env_1.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), env_1.env.LOG_FORMAT === 'pretty' ? winston_1.default.format.prettyPrint() : winston_1.default.format.json()),
    defaultMeta: { service: 'innerview-api' },
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
    ],
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
});
const originalInfo = exports.logger.info.bind(exports.logger);
exports.logger.http = (message, ...meta) => originalInfo(message, ...meta);
exports.metricsLogger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    defaultMeta: { service: 'innerview-metrics' },
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'logs/metrics.log' }),
    ],
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
});
const originalMetricsInfo = exports.metricsLogger.info.bind(exports.metricsLogger);
exports.metricsLogger.http = (message, ...meta) => originalMetricsInfo(message, ...meta);
//# sourceMappingURL=logger.js.map