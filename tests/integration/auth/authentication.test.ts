import { container } from 'tsyringe';
import { IUsuarioRepository } from '../../../src/domain/repositories/usuario-repository.interface';
import { IHashService } from '../../../src/domain/interfaces/IHashService';
import { IAuthService } from '../../../src/domain/interfaces/IAuthService';
import { ICacheService } from '../../../src/domain/interfaces/ICacheService';
import { AutenticarUsuarioUseCase } from '../../../src/application/use-cases/usuario/autenticar-usuario';
import { AppError } from '../../../src/shared/errors/AppError';
import { setupTestDatabase, clearTestDatabase, closeTestDatabase } from '../../helpers/database';
import { clearTestRedis, closeTestRedis } from '../../helpers/redis';

describe('Autenticação (Integração)', () => {
  let usuarioRepository: IUsuarioRepository;
  let hashService: IHashService;
  let authService: IAuthService;
  let cacheService: ICacheService;
  let autenticarUsuario: AutenticarUsuarioUseCase;

  beforeAll(async () => {
    await setupTestDatabase();
    
    usuarioRepository = container.resolve('UsuarioRepository');
    hashService = container.resolve('HashService');
    authService = container.resolve('AuthService');
    cacheService = container.resolve('CacheService');
    autenticarUsuario = container.resolve('AutenticarUsuarioUseCase');
  });

  beforeEach(async () => {
    await clearTestDatabase();
    await clearTestRedis();
  });

  afterAll(async () => {
    await closeTestDatabase();
    await closeTestRedis();
  });

  it('deve autenticar um usuário com credenciais válidas', async () => {
    // Arrange
    const senha = '123456';
    const senhaHash = await hashService.hashPassword(senha);
    
    const usuario = await usuarioRepository.criar({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: senhaHash,
      papel: 'PROFESSOR',
    });

    // Act
    const resultado = await autenticarUsuario.execute({
      email: 'john@example.com',
      senha: '123456',
    });

    // Assert
    expect(resultado).toHaveProperty('token');
    expect(resultado).toHaveProperty('usuario');
    expect(resultado.usuario.id).toBe(usuario.id);
    expect(resultado.usuario.email).toBe(usuario.email);

    // Verifica se o token foi cacheado
    const tokenCacheado = await cacheService.get(`auth:${usuario.id}`);
    expect(tokenCacheado).toBeTruthy();
  });

  it('deve falhar ao tentar autenticar com senha incorreta', async () => {
    // Arrange
    const senha = '123456';
    const senhaHash = await hashService.hashPassword(senha);
    
    await usuarioRepository.criar({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: senhaHash,
      papel: 'PROFESSOR',
    });

    // Act & Assert
    await expect(
      autenticarUsuario.execute({
        email: 'john@example.com',
        senha: 'senha_errada',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('deve falhar ao tentar autenticar com email não cadastrado', async () => {
    // Act & Assert
    await expect(
      autenticarUsuario.execute({
        email: 'naoexiste@example.com',
        senha: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('deve invalidar token após logout', async () => {
    // Arrange
    const senha = '123456';
    const senhaHash = await hashService.hashPassword(senha);
    
    const usuario = await usuarioRepository.criar({
      nome: 'John Doe',
      email: 'john@example.com',
      senha: senhaHash,
      papel: 'PROFESSOR',
    });

    const { token } = await autenticarUsuario.execute({
      email: 'john@example.com',
      senha: '123456',
    });

    // Act
    await cacheService.delete(`auth:${usuario.id}`);

    // Assert
    const tokenCacheado = await cacheService.get(`auth:${usuario.id}`);
    expect(tokenCacheado).toBeNull();
  });
}); 