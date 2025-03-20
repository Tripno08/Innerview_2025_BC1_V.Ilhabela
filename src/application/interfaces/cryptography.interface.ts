/**
 * Interface para serviço de hash de senha
 */
export interface IHashService {
  /**
   * Gera um hash a partir de uma senha em texto puro
   */
  hash(data: string): Promise<string>;

  /**
   * Compara uma senha em texto puro com um hash
   */
  compare(plaintext: string, hash: string): Promise<boolean>;
}

/**
 * Interface para serviço de JWT
 */
export interface IJwtService {
  /**
   * Gera um token JWT
   */
  sign(
    payload: Record<string, unknown>,
    options?: {
      expiresIn?: string | number;
      subject?: string;
      issuer?: string;
    },
  ): string;

  /**
   * Verifica e decodifica um token JWT
   */
  verify<T extends Record<string, unknown> = Record<string, unknown>>(token: string): T;
}
