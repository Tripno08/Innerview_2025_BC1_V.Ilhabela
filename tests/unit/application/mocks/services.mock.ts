import { IHashService, IJwtService } from '../../../../src/application/interfaces/cryptography.interface';

// Mock para serviço de hash
export class HashServiceMock implements IHashService {
  // Map para simular hashes armazenados
  private hashes: Map<string, string> = new Map();

  async hash(data: string): Promise<string> {
    const hashedValue = `hashed_${data}`;
    this.hashes.set(data, hashedValue);
    return hashedValue;
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    const expectedHash = this.hashes.get(plaintext);
    // Se temos o hash exato, é uma comparação direta
    if (expectedHash === hash) {
      return true;
    }
    // Simulação simplificada: se o hash começa com "hashed_" + plaintext
    return hash === `hashed_${plaintext}`;
  }
}

// Mock para serviço de JWT
export class JwtServiceMock implements IJwtService {
  // Armazenar payloads para verificação
  private tokens: Map<string, any> = new Map();
  
  sign(payload: any, options?: any): string {
    const token = `token_${Date.now()}_${Math.random()}`;
    this.tokens.set(token, payload);
    return token;
  }

  verify<T = any>(token: string): T {
    const payload = this.tokens.get(token);
    if (!payload) {
      throw new Error('Token inválido ou expirado');
    }
    return payload as T;
  }
} 