import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UsuarioController } from './usuario.controller';
import { CargoUsuario } from '@prisma/client';
import { AppError } from '@shared/errors/app-error';
import { IUseCase } from '@core/domain/use-case';
import {
  RegistrarUsuarioDTO,
  AutenticarUsuarioDTO,
  AtualizarPerfilDTO,
  AssociarUsuarioInstituicaoDTO,
  Usuario,
  TokenUsuarioAutenticado,
  UsuarioInstituicao,
} from '@core/domain';
import { mock, mockReset } from 'jest-mock-extended';

// Mock do container de injeção de dependências
jest.mock('tsyringe', () => ({
  container: {
    resolve: jest.fn(),
  },
}));

// Mocks para os casos de uso
const listarUsuariosUseCaseMock = mock<IUseCase<any, any>>();
const detalharUsuarioUseCaseMock = mock<IUseCase<any, any>>();
const criarUsuarioUseCaseMock = mock<IUseCase<any, any>>();
const atualizarUsuarioUseCaseMock = mock<IUseCase<any, any>>();
const excluirUsuarioUseCaseMock = mock<IUseCase<any, any>>();

// Mock para request e response
let requestMock: Partial<Request>;
let responseMock: Partial<Response>;

describe('UsuarioController', () => {
  let usuarioController: UsuarioController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let registrarUsuarioUseCaseMock: Partial<IUseCase<RegistrarUsuarioDTO, Usuario>>;
  let autenticarUsuarioUseCaseMock: Partial<
    IUseCase<AutenticarUsuarioDTO, TokenUsuarioAutenticado>
  >;
  let atualizarPerfilUseCaseMock: Partial<IUseCase<AtualizarPerfilDTO, Usuario>>;
  let associarUsuarioInstituicaoUseCaseMock: Partial<
    IUseCase<AssociarUsuarioInstituicaoDTO, UsuarioInstituicao>
  >;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Reset dos mocks
    mockReset(listarUsuariosUseCaseMock);
    mockReset(detalharUsuarioUseCaseMock);
    mockReset(criarUsuarioUseCaseMock);
    mockReset(atualizarUsuarioUseCaseMock);
    mockReset(excluirUsuarioUseCaseMock);

    // Mock para response
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock para request
    req = {
      body: {},
      user: {
        id: 'user-123',
        email: 'user@example.com',
        cargo: CargoUsuario.PROFESSOR,
      },
    };

    // Mock para casos de uso
    registrarUsuarioUseCaseMock = {
      execute: jest.fn(),
    };

    autenticarUsuarioUseCaseMock = {
      execute: jest.fn(),
    };

    atualizarPerfilUseCaseMock = {
      execute: jest.fn(),
    };

    associarUsuarioInstituicaoUseCaseMock = {
      execute: jest.fn(),
    };

    // Configurar o container para retornar os mocks
    (container.resolve as jest.Mock).mockImplementation((useCase) => {
      if (useCase === 'RegistrarUsuarioUseCase') return registrarUsuarioUseCaseMock;
      if (useCase === 'AutenticarUsuarioUseCase') return autenticarUsuarioUseCaseMock;
      if (useCase === 'AtualizarPerfilUseCase') return atualizarPerfilUseCaseMock;
      if (useCase === 'AssociarUsuarioInstituicaoUseCase')
        return associarUsuarioInstituicaoUseCaseMock;
      return null;
    });

    // Instanciar o controller
    usuarioController = new UsuarioController(
      listarUsuariosUseCaseMock,
      detalharUsuarioUseCaseMock,
      criarUsuarioUseCaseMock,
      atualizarUsuarioUseCaseMock,
      excluirUsuarioUseCaseMock,
    );
  });

  describe('registrar', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      // Arrange
      req.body = {
        nome: 'Novo Usuário',
        email: 'novo@exemplo.com',
        senha: 'senha123',
        cargo: CargoUsuario.PROFESSOR,
      };

      const usuarioMock = {
        id: 'user-123',
        nome: 'Novo Usuário',
        email: 'novo@exemplo.com',
        cargo: CargoUsuario.PROFESSOR,
      };

      registrarUsuarioUseCaseMock.execute.mockResolvedValue({
        usuario: usuarioMock,
      });

      // Act
      await usuarioController.registrar(req as Request, res as Response);

      // Assert
      expect(registrarUsuarioUseCaseMock.execute).toHaveBeenCalledWith({
        nome: 'Novo Usuário',
        email: 'novo@exemplo.com',
        senha: 'senha123',
        cargo: CargoUsuario.PROFESSOR,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 'user-123',
        nome: 'Novo Usuário',
        email: 'novo@exemplo.com',
        cargo: CargoUsuario.PROFESSOR,
      });
    });

    it('deve propagar erro quando o caso de uso falhar', async () => {
      // Arrange
      req.body = {
        nome: 'Novo Usuário',
        email: 'existente@exemplo.com',
        senha: 'senha123',
        cargo: CargoUsuario.PROFESSOR,
      };

      const error = new AppError('Email já está em uso', 409, 'EMAIL_IN_USE');
      registrarUsuarioUseCaseMock.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(usuarioController.registrar(req as Request, res as Response)).rejects.toThrow(
        error,
      );
    });
  });

  describe('autenticar', () => {
    it('deve autenticar um usuário com sucesso', async () => {
      // Arrange
      req.body = {
        email: 'usuario@exemplo.com',
        senha: 'senha123',
      };

      const usuarioMock = {
        id: 'user-123',
        nome: 'Usuário Existente',
        email: 'usuario@exemplo.com',
        cargo: CargoUsuario.PROFESSOR,
      };

      autenticarUsuarioUseCaseMock.execute.mockResolvedValue({
        usuario: usuarioMock,
        token: 'jwt-token-123',
      });

      // Act
      await usuarioController.autenticar(req as Request, res as Response);

      // Assert
      expect(autenticarUsuarioUseCaseMock.execute).toHaveBeenCalledWith({
        email: 'usuario@exemplo.com',
        senha: 'senha123',
      });

      expect(res.json).toHaveBeenCalledWith({
        usuario: {
          id: 'user-123',
          nome: 'Usuário Existente',
          email: 'usuario@exemplo.com',
          cargo: CargoUsuario.PROFESSOR,
        },
        token: 'jwt-token-123',
      });
    });

    it('deve propagar erro com credenciais inválidas', async () => {
      // Arrange
      req.body = {
        email: 'usuario@exemplo.com',
        senha: 'senha-errada',
      };

      const error = new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
      autenticarUsuarioUseCaseMock.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(usuarioController.autenticar(req as Request, res as Response)).rejects.toThrow(
        error,
      );
    });
  });

  describe('obterPerfil', () => {
    it('deve retornar o perfil do usuário autenticado', async () => {
      // Arrange
      req.user = {
        id: 'user-123',
        email: 'logado@exemplo.com',
        cargo: CargoUsuario.PROFESSOR,
      };

      // Act
      await usuarioController.obterPerfil(req as Request, res as Response);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'logado@exemplo.com',
        cargo: CargoUsuario.PROFESSOR,
      });
    });
  });

  describe('atualizarPerfil', () => {
    it('deve atualizar o perfil do usuário com sucesso', async () => {
      // Arrange
      req.user = {
        id: 'user-123',
        email: 'usuario@exemplo.com',
        cargo: CargoUsuario.PROFESSOR,
      };

      req.body = {
        nome: 'Nome Atualizado',
        email: 'atualizado@exemplo.com',
        senhaAtual: 'senha-atual',
        novaSenha: 'nova-senha',
        cargo: CargoUsuario.ADMIN,
      };

      const usuarioAtualizadoMock = {
        id: 'user-123',
        nome: 'Nome Atualizado',
        email: 'atualizado@exemplo.com',
        cargo: CargoUsuario.ADMIN,
      };

      atualizarPerfilUseCaseMock.execute.mockResolvedValue(usuarioAtualizadoMock);

      // Act
      await usuarioController.atualizarPerfil(req as Request, res as Response);

      // Assert
      expect(atualizarPerfilUseCaseMock.execute).toHaveBeenCalledWith({
        usuarioId: 'user-123',
        nome: 'Nome Atualizado',
        email: 'atualizado@exemplo.com',
        senhaAtual: 'senha-atual',
        novaSenha: 'nova-senha',
        cargo: CargoUsuario.ADMIN,
      });

      expect(res.json).toHaveBeenCalledWith({
        id: 'user-123',
        nome: 'Nome Atualizado',
        email: 'atualizado@exemplo.com',
        cargo: CargoUsuario.ADMIN,
      });
    });

    it('deve propagar erro quando a senha atual for incorreta', async () => {
      // Arrange
      req.user = {
        id: 'user-123',
        email: 'usuario@exemplo.com',
        cargo: CargoUsuario.PROFESSOR,
      };

      req.body = {
        nome: 'Nome Atualizado',
        senhaAtual: 'senha-errada',
        novaSenha: 'nova-senha',
      };

      const error = new AppError('Senha atual incorreta', 403, 'INVALID_CURRENT_PASSWORD');
      atualizarPerfilUseCaseMock.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(
        usuarioController.atualizarPerfil(req as Request, res as Response),
      ).rejects.toThrow(error);
    });
  });

  describe('associarAInstituicao', () => {
    it('deve associar um usuário a uma instituição com sucesso', async () => {
      // Arrange
      req.body = {
        instituicaoId: 'instituicao-123',
        usuarioId: 'outro-usuario-123',
        cargo: CargoUsuario.PROFESSOR,
      };

      associarUsuarioInstituicaoUseCaseMock.execute.mockResolvedValue(undefined);

      // Act
      await usuarioController.associarAInstituicao(req as Request, res as Response);

      // Assert
      expect(associarUsuarioInstituicaoUseCaseMock.execute).toHaveBeenCalledWith({
        instituicaoId: 'instituicao-123',
        usuarioId: 'outro-usuario-123',
        cargo: CargoUsuario.PROFESSOR,
      });

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith();
    });

    it('deve usar o ID do usuário autenticado se nenhum ID for fornecido', async () => {
      // Arrange
      req.user = {
        id: 'user-123',
        email: 'usuario@exemplo.com',
        cargo: CargoUsuario.PROFESSOR,
      };

      req.body = {
        instituicaoId: 'instituicao-123',
        cargo: CargoUsuario.ESPECIALISTA,
      };

      associarUsuarioInstituicaoUseCaseMock.execute.mockResolvedValue(undefined);

      // Act
      await usuarioController.associarAInstituicao(req as Request, res as Response);

      // Assert
      expect(associarUsuarioInstituicaoUseCaseMock.execute).toHaveBeenCalledWith({
        instituicaoId: 'instituicao-123',
        usuarioId: 'user-123',
        cargo: CargoUsuario.ESPECIALISTA,
      });

      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('listar', () => {
    it('deve retornar status 200 e lista de usuários', async () => {
      // Mock de dados de usuários
      const usuariosMock = [
        {
          id: 'user-1',
          nome: 'Usuário 1',
          email: 'usuario1@example.com',
        },
        {
          id: 'user-2',
          nome: 'Usuário 2',
          email: 'usuario2@example.com',
        },
      ];

      // Configurar o caso de uso para retornar os usuários mockados
      listarUsuariosUseCaseMock.execute.mockResolvedValue(usuariosMock);

      // Chamar o método do controlador
      await usuarioController.listar(req as Request, res as Response);

      // Verificar se o caso de uso foi chamado corretamente
      expect(listarUsuariosUseCaseMock.execute).toHaveBeenCalledWith({});

      // Verificar se a resposta foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: usuariosMock,
      });
    });

    it('deve tratar erros e retornar resposta adequada', async () => {
      // Simular um erro no caso de uso
      const error = new AppError('Erro ao listar usuários', 500);
      listarUsuariosUseCaseMock.execute.mockRejectedValue(error);

      // Chamar o método do controlador
      await usuarioController.listar(req as Request, res as Response);

      // Verificar se a resposta de erro foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Erro ao listar usuários',
      });
    });
  });

  describe('detalhar', () => {
    it('deve retornar status 200 e detalhes do usuário', async () => {
      // Mock de dados do usuário
      const usuarioMock = {
        id: 'user-123',
        nome: 'Usuário Teste',
        email: 'usuario@example.com',
      };

      // Configurar parâmetros da requisição
      req.params = { id: 'user-123' };

      // Configurar o caso de uso para retornar o usuário mockado
      detalharUsuarioUseCaseMock.execute.mockResolvedValue(usuarioMock);

      // Chamar o método do controlador
      await usuarioController.detalhar(req as Request, res as Response);

      // Verificar se o caso de uso foi chamado corretamente
      expect(detalharUsuarioUseCaseMock.execute).toHaveBeenCalledWith({
        id: 'user-123',
      });

      // Verificar se a resposta foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: usuarioMock,
      });
    });

    it('deve tratar erros e retornar resposta adequada', async () => {
      // Configurar parâmetros da requisição
      req.params = { id: 'user-inexistente' };

      // Simular um erro no caso de uso
      const error = new AppError('Usuário não encontrado', 404);
      detalharUsuarioUseCaseMock.execute.mockRejectedValue(error);

      // Chamar o método do controlador
      await usuarioController.detalhar(req as Request, res as Response);

      // Verificar se a resposta de erro foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Usuário não encontrado',
      });
    });
  });

  describe('criar', () => {
    it('deve retornar status 201 e dados do usuário criado', async () => {
      // Mock de dados para criação do usuário
      const dadosUsuarioMock = {
        nome: 'Novo Usuário',
        email: 'novo@example.com',
        senha: 'senha123',
      };

      // Mock do usuário criado
      const usuarioCriadoMock = {
        id: 'new-user-123',
        nome: 'Novo Usuário',
        email: 'novo@example.com',
      };

      // Configurar o corpo da requisição
      req.body = dadosUsuarioMock;

      // Configurar o caso de uso para retornar o usuário mockado
      criarUsuarioUseCaseMock.execute.mockResolvedValue(usuarioCriadoMock);

      // Chamar o método do controlador
      await usuarioController.criar(req as Request, res as Response);

      // Verificar se o caso de uso foi chamado corretamente
      expect(criarUsuarioUseCaseMock.execute).toHaveBeenCalledWith(dadosUsuarioMock);

      // Verificar se a resposta foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: usuarioCriadoMock,
      });
    });

    it('deve tratar erros e retornar resposta adequada', async () => {
      // Mock de dados inválidos para criação do usuário
      const dadosInvalidosMock = {
        nome: 'Novo Usuário',
        // email ausente
        senha: 'senha123',
      };

      // Configurar o corpo da requisição
      req.body = dadosInvalidosMock;

      // Simular um erro no caso de uso
      const error = new AppError('Email é obrigatório', 400);
      criarUsuarioUseCaseMock.execute.mockRejectedValue(error);

      // Chamar o método do controlador
      await usuarioController.criar(req as Request, res as Response);

      // Verificar se a resposta de erro foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Email é obrigatório',
      });
    });
  });

  describe('atualizar', () => {
    it('deve retornar status 200 e dados do usuário atualizado', async () => {
      // Mock de dados para atualização do usuário
      const dadosAtualizacaoMock = {
        nome: 'Usuário Atualizado',
      };

      // Mock do usuário atualizado
      const usuarioAtualizadoMock = {
        id: 'user-123',
        nome: 'Usuário Atualizado',
        email: 'user@example.com',
      };

      // Configurar parâmetros e corpo da requisição
      req.params = { id: 'user-123' };
      req.body = dadosAtualizacaoMock;
      req.user = {
        id: 'user-123',
        email: 'user@example.com',
        cargo: CargoUsuario.PROFESSOR,
      };

      // Configurar o caso de uso para retornar o usuário mockado
      atualizarUsuarioUseCaseMock.execute.mockResolvedValue(usuarioAtualizadoMock);

      // Chamar o método do controlador
      await usuarioController.atualizar(req as Request, res as Response);

      // Verificar se o caso de uso foi chamado corretamente
      expect(atualizarUsuarioUseCaseMock.execute).toHaveBeenCalledWith({
        id: 'user-123',
        ...dadosAtualizacaoMock,
      });

      // Verificar se a resposta foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: usuarioAtualizadoMock,
      });
    });

    it('deve tratar erros e retornar resposta adequada', async () => {
      // Configurar parâmetros e corpo da requisição
      req.params = { id: 'user-123' };
      req.body = {
        email: 'email-invalido',
      };

      // Simular um erro no caso de uso
      const error = new AppError('Email inválido', 400);
      atualizarUsuarioUseCaseMock.execute.mockRejectedValue(error);

      // Chamar o método do controlador
      await usuarioController.atualizar(req as Request, res as Response);

      // Verificar se a resposta de erro foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Email inválido',
      });
    });
  });

  describe('excluir', () => {
    it('deve retornar status 204 ao excluir usuário', async () => {
      // Configurar parâmetros da requisição
      req.params = { id: 'user-123' };
      req.user = {
        id: 'admin-123',
        email: 'admin@example.com',
        cargo: CargoUsuario.PROFESSOR,
      };

      // Configurar o caso de uso
      excluirUsuarioUseCaseMock.execute.mockResolvedValue(undefined);

      // Chamar o método do controlador
      await usuarioController.excluir(req as Request, res as Response);

      // Verificar se o caso de uso foi chamado corretamente
      expect(excluirUsuarioUseCaseMock.execute).toHaveBeenCalledWith({
        id: 'user-123',
      });

      // Verificar se a resposta foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null,
      });
    });

    it('deve tratar erros e retornar resposta adequada', async () => {
      // Configurar parâmetros da requisição
      req.params = { id: 'user-inexistente' };

      // Simular um erro no caso de uso
      const error = new AppError('Usuário não encontrado', 404);
      excluirUsuarioUseCaseMock.execute.mockRejectedValue(error);

      // Chamar o método do controlador
      await usuarioController.excluir(req as Request, res as Response);

      // Verificar se a resposta de erro foi retornada corretamente
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Usuário não encontrado',
      });
    });
  });
});
