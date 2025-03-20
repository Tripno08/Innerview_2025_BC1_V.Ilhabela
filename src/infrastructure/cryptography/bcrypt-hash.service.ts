import { hash, compare } from 'bcryptjs';
import { IHashService } from '@application/interfaces/cryptography.interface';

/**
 * Implementação do serviço de hash usando bcrypt
 */
export class BcryptHashService implements IHashService {
  constructor(private readonly saltRounds: number = 10) {}

  /**
   * Gera um hash a partir de uma senha em texto puro
   */
  async hash(data: string): Promise<string> {
    return hash(data, this.saltRounds);
  }

  /**
   * Compara uma senha em texto puro com um hash
   */
  async compare(plaintext: string, hash: string): Promise<boolean> {
    return compare(plaintext, hash);
  }
}
