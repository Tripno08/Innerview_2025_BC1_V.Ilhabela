import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { rbacMiddleware } from './rbac.middleware';
import { AppError } from '@shared/errors/app-error';
import { CargoUsuario } from '@prisma/client';

// Mock das dependências
jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn(),
  },
}));

describe('RBAC Middleware', () => {
  // Configurações iniciais e mocks
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let verificarPermissaoUseCaseMock: Partial<{
    execute: (usuarioId: string, recurso: string, acao: string) => Promise<boolean>;
  }>;

  beforeEach(() => {
    // Reset das variáveis para cada teste
    req = {
      user: {
        id: 'user123',
        email: 'usuario@teste.com',
        cargo: CargoUsuario.PROFESSOR,
      },
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock do caso de uso de verificação de permissão
    verificarPermissaoUseCaseMock = {
      execute: jest.fn(),
    };

    // Configurar o container para retornar o mock do caso de uso
    (container.resolve as jest.Mock).mockReturnValue(verificarPermissaoUseCaseMock);
  });

  it('deve lançar erro quando o usuário não está autenticado', async () => {
    // Arrange
    req.user = undefined;
    const middleware = rbacMiddleware([CargoUsuario.ADMIN]);

    // Act & Assert
    await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(AppError);
    await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(
      'Usuário não autenticado',
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando o usuário não tem permissão', async () => {
    // Arrange
    verificarPermissaoUseCaseMock.execute.mockResolvedValue(false);
    const middleware = rbacMiddleware([CargoUsuario.ADMIN]);

    // Act & Assert
    await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(AppError);
    await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(
      'Acesso não autorizado',
    );
    expect(verificarPermissaoUseCaseMock.execute).toHaveBeenCalledWith({
      usuarioId: 'user123',
      instituicaoId: undefined,
      cargosPermitidos: [CargoUsuario.ADMIN],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next quando o usuário tem permissão', async () => {
    // Arrange
    verificarPermissaoUseCaseMock.execute.mockResolvedValue(true);
    const middleware = rbacMiddleware([CargoUsuario.PROFESSOR]);

    // Act
    await middleware(req as Request, res as Response, next);

    // Assert
    expect(verificarPermissaoUseCaseMock.execute).toHaveBeenCalledWith({
      usuarioId: 'user123',
      instituicaoId: undefined,
      cargosPermitidos: [CargoUsuario.PROFESSOR],
    });
    expect(next).toHaveBeenCalled();
  });

  it('deve considerar o instituicaoId dos parâmetros da requisição', async () => {
    // Arrange
    req.params.instituicaoId = 'inst123';
    verificarPermissaoUseCaseMock.execute.mockResolvedValue(true);
    const middleware = rbacMiddleware([CargoUsuario.PROFESSOR]);

    // Act
    await middleware(req as Request, res as Response, next);

    // Assert
    expect(verificarPermissaoUseCaseMock.execute).toHaveBeenCalledWith({
      usuarioId: 'user123',
      instituicaoId: 'inst123',
      cargosPermitidos: [CargoUsuario.PROFESSOR],
    });
  });

  it('deve considerar o instituicaoId do corpo da requisição se não estiver nos parâmetros', async () => {
    // Arrange
    req.body.instituicaoId = 'inst456';
    verificarPermissaoUseCaseMock.execute.mockResolvedValue(true);
    const middleware = rbacMiddleware([CargoUsuario.PROFESSOR]);

    // Act
    await middleware(req as Request, res as Response, next);

    // Assert
    expect(verificarPermissaoUseCaseMock.execute).toHaveBeenCalledWith({
      usuarioId: 'user123',
      instituicaoId: 'inst456',
      cargosPermitidos: [CargoUsuario.PROFESSOR],
    });
  });

  it('deve propagar erros de AppError lançados pelo caso de uso', async () => {
    // Arrange
    const appError = new AppError('Erro específico', 403, 'SPECIFIC_ERROR');
    verificarPermissaoUseCaseMock.execute.mockRejectedValue(appError);
    const middleware = rbacMiddleware([CargoUsuario.PROFESSOR]);

    // Act & Assert
    await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(appError);
    expect(next).not.toHaveBeenCalled();
  });

  it('deve converter erros genéricos em AppError', async () => {
    // Arrange
    verificarPermissaoUseCaseMock.execute.mockRejectedValue(new Error('Erro genérico'));
    const middleware = rbacMiddleware([CargoUsuario.PROFESSOR]);

    // Act & Assert
    await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(AppError);
    await expect(middleware(req as Request, res as Response, next)).rejects.toThrow(
      'Erro ao verificar permissões',
    );
    expect(next).not.toHaveBeenCalled();
  });
});
