import winston from 'winston';
import { injectable } from 'tsyringe';
import { ILogger } from '@domain/interfaces/ILogger';

@injectable()
export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  public info(message: string, meta?: object): void {
    this.logger.info(message, meta);
  }

  public error(message: string, error?: Error, meta?: object): void {
    this.logger.error(message, {
      error: error?.stack,
      ...meta,
    });
  }

  public warn(message: string, meta?: object): void {
    this.logger.warn(message, meta);
  }

  public debug(message: string, meta?: object): void {
    this.logger.debug(message, meta);
  }
}
