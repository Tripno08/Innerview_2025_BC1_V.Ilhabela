import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { AppError } from '@shared/errors/app-error';
import { mapPrismaCargoToLocal } from '@shared/utils/enum-mappers';
import { CargoUsuario } from '@shared/enums';

interface TokenPayload extends JwtPayload {
  email: string;
  cargo: string;
}

/**
 * Middleware para verificar autenticação via JWT
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Obter token do header de autorização
  const authHeader = req.headers.authorization;

  // Verificar se o token foi fornecido
  if (!authHeader) {
    throw new AppError('Token não fornecido', 401, 'TOKEN_MISSING');
  }

  // Formato esperado: "Bearer <token>"
  const [, token] = authHeader.split(' ');

  try {
    // Verificar e decodificar o token
    const decoded = verify(token, process.env.JWT_SECRET) as TokenPayload;

    // Converter o cargo para o enum local
    const cargoLocal = mapPrismaCargoToLocal(decoded.cargo);

    // Adicionar informações do usuário ao request
    req.user = {
      id: String(decoded.sub),
      email: decoded.email,
      cargo: cargoLocal,
    };

    // Seguir para o próximo middleware/controller
    return next();
  } catch (error) {
    throw new AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
  }
}
