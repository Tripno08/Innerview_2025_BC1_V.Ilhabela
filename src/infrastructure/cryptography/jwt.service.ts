import { sign, verify } from 'jsonwebtoken';
import { IJwtService } from '@application/interfaces/cryptography.interface';
import config from '@config/index';
import type { StringValue } from 'ms';

/**
 * Implementação do serviço de JWT
 */
export class JwtService implements IJwtService {
  /**
   * Gera um token JWT
   */
  sign(
    payload: Record<string, unknown>,
    options?: {
      expiresIn?: StringValue | number;
      subject?: string;
      issuer?: string;
    },
  ): string {
    const secret = config.jwt.secret;

    const finalOptions = {
      expiresIn: config.jwt.expiresIn as StringValue | number,
      ...options,
    };

    return sign(payload, secret, finalOptions);
  }

  /**
   * Verifica e decodifica um token JWT
   */
  verify<T extends Record<string, unknown> = Record<string, unknown>>(token: string): T {
    const secret = config.jwt.secret;
    return verify(token, secret) as T;
  }
}
