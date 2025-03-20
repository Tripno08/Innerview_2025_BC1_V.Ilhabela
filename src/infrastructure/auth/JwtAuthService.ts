import { sign, verify, SignOptions } from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import { AuthTokenPayload, TokenService } from '../../domain/services/token-service';
import { AppError } from '@shared/errors/app-error';
import { env } from '@config/env';
import type { StringValue } from 'ms';

@injectable()
export class JwtAuthService implements TokenService {
  /**
   * Gera um token JWT assinado para o usuário
   */
  generateToken(payload: AuthTokenPayload): string {
    const { sub, ...restPayload } = payload;

    // Converter segredo para o tipo correto e garantir que seja uma string
    const secret = String(env.JWT_SECRET);
    // Definir expiração diretamente como uma string válida aceita pela biblioteca
    const expiresIn = env.JWT_EXPIRATION || '1d';

    // Configurar opções de assinatura com tipagem correta
    const options: SignOptions = {
      subject: sub,
      // Usar tipo correto para expiresIn
      expiresIn: expiresIn as StringValue | number,
    };

    // Utilizar tipos compatíveis com a função sign
    return sign(restPayload, secret, options);
  }

  /**
   * Verifica a validade de um token JWT
   */
  verifyToken(token: string): AuthTokenPayload {
    try {
      // Converter segredo para o tipo correto e garantir que seja uma string
      const secret = String(env.JWT_SECRET);
      const decoded = verify(token, secret) as AuthTokenPayload;
      return decoded;
    } catch (error) {
      throw new AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN');
    }
  }

  /**
   * Extrai o token do cabeçalho de autorização
   */
  extractTokenFromHeader(authorizationHeader?: string): string {
    if (!authorizationHeader) {
      throw new AppError('Token não fornecido', 401, 'TOKEN_MISSING');
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer') {
      throw new AppError('Tipo de token inválido', 401, 'INVALID_TOKEN_TYPE');
    }

    return token;
  }
}
