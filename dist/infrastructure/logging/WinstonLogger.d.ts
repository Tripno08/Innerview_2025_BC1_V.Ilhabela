import { ILogger } from '@domain/interfaces/ILogger';
export declare class WinstonLogger implements ILogger {
    private logger;
    constructor();
    info(message: string, meta?: object): void;
    error(message: string, error?: Error, meta?: object): void;
    warn(message: string, meta?: object): void;
    debug(message: string, meta?: object): void;
}
