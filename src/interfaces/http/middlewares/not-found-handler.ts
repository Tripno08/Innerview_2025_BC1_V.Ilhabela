import { Request, Response } from 'express';
import { logger } from '@shared/logger';

/**
 * Middleware para tratar rotas não encontradas
 */
export function notFoundHandler(req: Request, res: Response) {
  const path = `${req.method} ${req.path}`;

  logger.info(`Rota não encontrada: ${path}`);

  return res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `Rota não encontrada: ${path}`,
  });
}
