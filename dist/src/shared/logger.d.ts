import winston from 'winston';
interface ExtendedLogger extends winston.Logger {
    http: winston.LeveledLogMethod;
}
export declare const logger: ExtendedLogger;
export declare const metricsLogger: ExtendedLogger;
export {};
