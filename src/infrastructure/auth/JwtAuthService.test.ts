import { JwtAuthService } from './JwtAuthService';
import { sign, verify } from 'jsonwebtoken';
import { AppError } from '@shared/errors/app-error';

// Mock do jsonwebtoken
jest.mock('jsonwebtoken');

describe('JwtAuthService', () => {
  let jwtAuthService: JwtAuthService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Instanciar o serviço
    jwtAuthService = new JwtAuthService();

    // Mock para sign
    (sign as jest.Mock).mockImplementation((payload, secret, _options) => {
      if (!secret) throw new Error('Invalid secret');
      return 'mocked-jwt-token';
    });

    // Mock para verify
    (verify as jest.Mock).mockImplementation((token, secret) => {
      if (!secret) throw new Error('Invalid secret');
      if (token === 'invalid-token') throw new Error('Invalid token');
      return {
        sub: 'user-123',
        email: 'test@example.com',
        cargo: 'PROFESSOR',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
    });
  });

  describe('generateToken', () => {
    it('deve gerar um token JWT válido', () => {
      // Arrange
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        cargo: 'PROFESSOR',
      };

      // Act
      const token = jwtAuthService.generateToken(payload);

      // Assert
      expect(token).toBe('mocked-jwt-token');
      expect(sign).toHaveBeenCalledWith(
        { email: 'test@example.com', cargo: 'PROFESSOR' },
        expect.any(String),
        {
          expiresIn: expect.any(String),
          subject: 'user-123',
        },
      );
    });

    it('deve propagar erros do método sign', () => {
      // Arrange
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        cargo: 'PROFESSOR',
      };

      (sign as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to sign token');
      });

      // Act & Assert
      expect(() => jwtAuthService.generateToken(payload)).toThrow('Failed to sign token');
      expect(sign).toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('deve verificar um token válido e retornar o payload', () => {
      // Arrange
      const token = 'valid-token';
      const expectedPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        cargo: 'PROFESSOR',
        iat: expect.any(Number),
        exp: expect.any(Number),
      };

      // Act
      const decodedToken = jwtAuthService.verifyToken(token);

      // Assert
      expect(decodedToken).toEqual(expectedPayload);
      expect(verify).toHaveBeenCalledWith(token, expect.any(String));
    });

    it('deve lançar um AppError quando o token for inválido', () => {
      // Arrange
      const token = 'invalid-token';

      // Act & Assert
      expect(() => jwtAuthService.verifyToken(token)).toThrow(AppError);
      expect(() => jwtAuthService.verifyToken(token)).toThrow('Token inválido ou expirado');
      expect(verify).toHaveBeenCalledWith(token, expect.any(String));
    });

    it('deve propagar erros inesperados como AppError', () => {
      // Arrange
      const token = 'valid-token';

      (verify as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act & Assert
      expect(() => jwtAuthService.verifyToken(token)).toThrow(AppError);
      expect(() => jwtAuthService.verifyToken(token)).toThrow('Token inválido ou expirado');
      expect(verify).toHaveBeenCalledWith(token, expect.any(String));
    });
  });

  describe('extractTokenFromHeader', () => {
    it('deve extrair corretamente o token do cabeçalho de autorização', () => {
      // Arrange
      const authorization = 'Bearer valid-token';

      // Act
      const token = jwtAuthService.extractTokenFromHeader(authorization);

      // Assert
      expect(token).toBe('valid-token');
    });

    it('deve lançar erro quando o cabeçalho de autorização não for fornecido', () => {
      // Act & Assert
      expect(() => jwtAuthService.extractTokenFromHeader()).toThrow(AppError);
      expect(() => jwtAuthService.extractTokenFromHeader()).toThrow('Token não fornecido');
    });

    it('deve lançar erro quando o tipo de token não for Bearer', () => {
      // Arrange
      const authorization = 'Basic valid-token';

      // Act & Assert
      expect(() => jwtAuthService.extractTokenFromHeader(authorization)).toThrow(AppError);
      expect(() => jwtAuthService.extractTokenFromHeader(authorization)).toThrow(
        'Tipo de token inválido',
      );
    });
  });
});
