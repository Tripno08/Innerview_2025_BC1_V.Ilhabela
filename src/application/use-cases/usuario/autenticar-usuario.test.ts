import { AutenticarUsuarioUseCase } from './autenticar-usuario.use-case';
import { AppError } from '@shared/errors/app-error';
import { CargoUsuario } from '@shared/enums';
import {
  IUsuarioRepository,
  UsuarioComCredenciais,
} from '@domain/repositories/usuario-repository.interface';
import { IHashService } from '@application/interfaces/cryptography.interface';
import { IJwtService } from '@application/interfaces/cryptography.interface';
import { Usuario } from '@domain/entities/usuario.entity';

describe('AutenticarUsuarioUseCase', () => {
  let autenticarUsuarioUseCase: AutenticarUsuarioUseCase;
  let usuarioRepositoryMock: jest.Mocked<IUsuarioRepository>;
  let hashServiceMock: jest.Mocked<IHashService>;
  let jwtServiceMock: jest.Mocked<IJwtService>;

  beforeEach(() => {
    // Mock para o repositório de usuários
    usuarioRepositoryMock = {
      findWithCredentials: jest.fn(),
      findByEmail: jest.fn(),
      associarAInstituicao: jest.fn(),
      removerDeInstituicao: jest.fn(),
      listarInstituicoesDoUsuario: jest.fn(),
      verificarPertencimentoInstituicao: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUsuarioRepository>;

    // Mock para o serviço de hash
    hashServiceMock = {
      compare: jest.fn(),
      hash: jest.fn(),
    } as jest.Mocked<IHashService>;

    // Mock para o serviço JWT
    jwtServiceMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<IJwtService>;

    // Instanciar o caso de uso com as dependências mockadas
    autenticarUsuarioUseCase = new AutenticarUsuarioUseCase(
      usuarioRepositoryMock,
      hashServiceMock,
      jwtServiceMock,
    );
  });

  it('deve autenticar um usuário com credenciais válidas', async () => {
    // Arrange
    const email = 'usuario@exemplo.com';
    const senha = 'senha123';

    const usuarioProps = {
      id: 'user-123',
      nome: 'Usuário Teste',
      email,
      cargo: CargoUsuario.PROFESSOR,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    const usuarioMock = Usuario.criar(usuarioProps) as UsuarioComCredenciais;
    // Adicionamos a senha diretamente ao objeto após a criação
    (usuarioMock as unknown as { senha: string }).senha = 'senha-hash';

    const tokenMock = 'jwt-token-123';

    usuarioRepositoryMock.findWithCredentials.mockResolvedValue(usuarioMock);
    hashServiceMock.compare.mockResolvedValue(true);
    jwtServiceMock.sign.mockReturnValue(tokenMock);

    // Act
    const resultado = await autenticarUsuarioUseCase.execute({ email, senha });

    // Assert
    expect(resultado).toEqual({
      usuario: expect.objectContaining({
        id: usuarioMock.id,
        email: usuarioMock.email,
        nome: usuarioMock.nome,
        cargo: usuarioMock.cargo,
      }),
      token: tokenMock,
    });

    expect(usuarioRepositoryMock.findWithCredentials).toHaveBeenCalledWith(email);
    expect(hashServiceMock.compare).toHaveBeenCalledWith(
      senha,
      (usuarioMock as unknown as { senha: string }).senha,
    );
    expect(jwtServiceMock.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: usuarioMock.id,
        email: usuarioMock.email,
        cargo: usuarioMock.cargo,
      }),
    );
  });

  it('deve lançar erro se o usuário não existir', async () => {
    // Arrange
    const email = 'inexistente@exemplo.com';
    const senha = 'senha123';

    usuarioRepositoryMock.findWithCredentials.mockResolvedValue(null);

    // Act & Assert
    await expect(autenticarUsuarioUseCase.execute({ email, senha })).rejects.toThrow(
      new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS'),
    );

    expect(usuarioRepositoryMock.findWithCredentials).toHaveBeenCalledWith(email);
    expect(hashServiceMock.compare).not.toHaveBeenCalled();
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });

  it('deve lançar erro se a senha for incorreta', async () => {
    // Arrange
    const email = 'usuario@exemplo.com';
    const senha = 'senha-incorreta';

    const usuarioProps = {
      id: 'user-123',
      nome: 'Usuário Teste',
      email,
      cargo: CargoUsuario.PROFESSOR,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    const usuarioMock = Usuario.criar(usuarioProps) as UsuarioComCredenciais;
    // Adicionamos a senha diretamente ao objeto após a criação
    (usuarioMock as unknown as { senha: string }).senha = 'senha-hash';

    usuarioRepositoryMock.findWithCredentials.mockResolvedValue(usuarioMock);
    hashServiceMock.compare.mockResolvedValue(false); // Senha incorreta

    // Act & Assert
    await expect(autenticarUsuarioUseCase.execute({ email, senha })).rejects.toThrow(
      new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS'),
    );

    expect(usuarioRepositoryMock.findWithCredentials).toHaveBeenCalledWith(email);
    expect(hashServiceMock.compare).toHaveBeenCalledWith(
      senha,
      (usuarioMock as unknown as { senha: string }).senha,
    );
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });

  it('deve propagar erros inesperados do repositório', async () => {
    // Arrange
    const email = 'usuario@exemplo.com';
    const senha = 'senha123';

    const erro = new Error('Erro de conexão com o banco de dados');
    usuarioRepositoryMock.findWithCredentials.mockRejectedValue(erro);

    // Act & Assert
    await expect(autenticarUsuarioUseCase.execute({ email, senha })).rejects.toThrow(erro);

    expect(usuarioRepositoryMock.findWithCredentials).toHaveBeenCalledWith(email);
    expect(hashServiceMock.compare).not.toHaveBeenCalled();
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });

  it('deve propagar erros inesperados do serviço de hash', async () => {
    // Arrange
    const email = 'usuario@exemplo.com';
    const senha = 'senha123';

    const usuarioProps = {
      id: 'user-123',
      nome: 'Usuário Teste',
      email,
      cargo: CargoUsuario.PROFESSOR,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };
    const usuarioMock = Usuario.criar(usuarioProps) as UsuarioComCredenciais;
    // Adicionamos a senha diretamente ao objeto após a criação
    (usuarioMock as unknown as { senha: string }).senha = 'senha-hash';

    const erro = new Error('Erro na verificação de hash');
    usuarioRepositoryMock.findWithCredentials.mockResolvedValue(usuarioMock);
    hashServiceMock.compare.mockRejectedValue(erro);

    // Act & Assert
    await expect(autenticarUsuarioUseCase.execute({ email, senha })).rejects.toThrow(erro);

    expect(usuarioRepositoryMock.findWithCredentials).toHaveBeenCalledWith(email);
    expect(hashServiceMock.compare).toHaveBeenCalledWith(
      senha,
      (usuarioMock as unknown as { senha: string }).senha,
    );
    expect(jwtServiceMock.sign).not.toHaveBeenCalled();
  });
});
