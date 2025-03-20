import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/app-error';
import { logger } from '@shared/logger';
import { ZodError } from 'zod';
import { env } from '@config/env';

/**
 * Middleware para tratamento centralizado de erros
 */
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  // Erros de negócio (AppError)
  if (error instanceof AppError) {
    logger.warn(`[${error.statusCode}] ${error.message}`, {
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack,
      },
    });

    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
    });
  }

  // Erros de validação (ZodError)
  if (error instanceof ZodError) {
    const message = 'Erro de validação nos dados fornecidos';

    logger.warn(`[400] ${message}`, {
      error: {
        message,
        issues: error.format(),
        stack: error.stack,
      },
    });

    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message,
      details: error.format(),
    });
  }

  // Erros inesperados (não tratados)
  const message = 'Erro interno do servidor';

  logger.error(`[500] ${error.message}`, {
    error: {
      message: error.message,
      stack: error.stack,
    },
  });

  // Em produção, não expor detalhes de erros internos
  const response = {
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: env.NODE_ENV === 'production' ? message : error.message,
  };

  // Adicionar stack trace em ambiente de desenvolvimento
  if (env.NODE_ENV !== 'production') {
    Object.assign(response, { stack: error.stack });
  }

  return res.status(500).json(response);
}
