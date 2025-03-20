import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '@shared/errors/app-error';
import { env } from '@config/env';
import { logger } from '@shared/logger';
import { CargoUsuario } from '@shared/enums';
import { mapPrismaCargoToLocal } from '@shared/utils/enum-mappers';

interface DecodedToken {
  sub: string;
  email: string;
  cargo: string; // Cargo vem como string do JWT
  iat: number;
  exp: number;
}

/**
 * Interface para estender o tipo Request do Express
 * para incluir o usuário autenticado
 */
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    cargo: CargoUsuario;
  };
}

/**
 * Middleware para verificar se o usuário está autenticado
 */
export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token JWT não encontrado', 401, 'TOKEN_MISSING');
  }

  // Formato 'Bearer TOKEN'
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, env.JWT_SECRET) as DecodedToken;

    // Converter o cargo para o enum local
    const cargoLocal = mapPrismaCargoToLocal(decoded.cargo);

    // Adiciona o usuário na requisição
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      cargo: cargoLocal,
    };

    logger.debug(`Usuário autenticado: ${decoded.sub}`);

    return next();
  } catch (error) {
    throw new AppError('Token JWT inválido', 401, 'TOKEN_INVALID');
  }
}
