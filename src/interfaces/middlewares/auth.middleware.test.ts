import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { authMiddleware } from './auth.middleware';
import { AppError } from '@shared/errors/app-error';
import { CargoUsuario } from '@prisma/client';
import { IAuthService } from '@domain/interfaces/IAuthService';

// Mock das dependências
jest.mock('@shared/container', () => ({
  container: {
    resolve: jest.fn(),
  },
}));

describe('Auth Middleware', () => {
  // Configurações iniciais e mocks
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jwtServiceMock: Partial<IAuthService>;

  beforeEach(() => {
    // Reset das variáveis para cada teste
    req = {
      headers: {},
      user: undefined,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock do serviço JWT
    jwtServiceMock = {
      verify: jest.fn(),
    };

    // Configurar o container para retornar o mock do JwtService
    (container.resolve as jest.Mock).mockReturnValue(jwtServiceMock);
  });

  it('deve lançar erro quando o token não for fornecido', () => {
    // Act & Assert
    expect(() => authMiddleware(req as Request, res as Response, next)).toThrow(AppError);
    expect(() => authMiddleware(req as Request, res as Response, next)).toThrow(
      'Token não fornecido',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando o token for inválido', () => {
    // Arrange
    req.headers = { authorization: 'Bearer invalid_token' };
    jwtServiceMock.verify.mockImplementation(() => {
      throw new Error('Token inválido');
    });

    // Act & Assert
    expect(() => authMiddleware(req as Request, res as Response, next)).toThrow(AppError);
    expect(() => authMiddleware(req as Request, res as Response, next)).toThrow(
      'Token inválido ou expirado',
    );
    expect(jwtServiceMock.verify).toHaveBeenCalledWith('invalid_token');
    expect(next).not.toHaveBeenCalled();
  });

  it('deve configurar req.user e chamar next quando o token for válido', () => {
    // Arrange
    req.headers = { authorization: 'Bearer valid_token' };
    const decodedToken = {
      sub: 'user123',
      email: 'usuario@teste.com',
      cargo: CargoUsuario.PROFESSOR,
    };
    jwtServiceMock.verify.mockReturnValue(decodedToken);

    // Act
    authMiddleware(req as Request, res as Response, next);

    // Assert
    expect(jwtServiceMock.verify).toHaveBeenCalledWith('valid_token');
    expect(req.user).toEqual({
      id: 'user123',
      email: 'usuario@teste.com',
      cargo: CargoUsuario.PROFESSOR,
    });
    expect(next).toHaveBeenCalled();
  });
});
