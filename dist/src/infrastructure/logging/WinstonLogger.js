"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const tsyringe_1 = require("tsyringe");
let WinstonLogger = class WinstonLogger {
    logger;
    constructor() {
        this.logger = winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            transports: [
                new winston_1.default.transports.Console({
                    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
                }),
                new winston_1.default.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
                new winston_1.default.transports.File({
                    filename: 'logs/combined.log',
                }),
            ],
        });
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    error(message, error, meta) {
        this.logger.error(message, {
            error: error?.stack,
            ...meta,
        });
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
};
exports.WinstonLogger = WinstonLogger;
exports.WinstonLogger = WinstonLogger = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], WinstonLogger);
//# sourceMappingURL=WinstonLogger.js.map