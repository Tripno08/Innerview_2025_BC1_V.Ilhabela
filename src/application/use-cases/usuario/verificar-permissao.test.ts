import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { VerificarPermissaoUseCase } from './verificar-permissao.use-case';
import { IUsuarioRepository } from '@domain/repositories/usuario-repository.interface';
import { CargoUsuario } from '@shared/enums';
import { Usuario } from '@domain/entities/usuario.entity';
import { AppError } from '@shared/errors/app-error';

// Mock o repositório de usuário
let verificarPermissaoUseCase: VerificarPermissaoUseCase;
let usuarioRepositoryMock: jest.Mocked<IUsuarioRepository>;

// Setup para os testes
describe('VerificarPermissaoUseCase', () => {
  beforeEach(() => {
    usuarioRepositoryMock = {
      findById: jest.fn(),
      verificarPertencimentoInstituicao: jest.fn(),
      listarInstituicoesDoUsuario: jest.fn(),
      // Adicionando todos os métodos necessários para o mock completo
      findByEmail: jest.fn(),
      findWithCredentials: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      count: jest.fn(),
      associarAInstituicao: jest.fn(),
      removerDeInstituicao: jest.fn(),
      findByInstituicao: jest.fn(),
    };

    verificarPermissaoUseCase = new VerificarPermissaoUseCase(usuarioRepositoryMock);
  });

  it('deve retornar verdadeiro se o usuário tiver o cargo permitido', async () => {
    // Cria um usuário mock com cargo ADMIN
    const usuario = Usuario.criar({
      id: '1',
      nome: 'Teste',
      email: 'teste@example.com',
      cargo: CargoUsuario.ADMIN,
    });

    // Configura o mock para retornar o usuário
    usuarioRepositoryMock.findById.mockResolvedValue(usuario);

    // Define os cargos permitidos
    const cargosPermitidos = [CargoUsuario.ADMIN, CargoUsuario.PROFESSOR];

    // Executa o caso de uso
    const resultado = await verificarPermissaoUseCase.execute({
      usuarioId: '1',
      cargosPermitidos,
    });

    // Verifica se o resultado é verdadeiro
    expect(resultado).toBe(true);
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith('1');
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    // Configura o mock para retornar null
    usuarioRepositoryMock.findById.mockResolvedValue(null);

    // Define os cargos permitidos
    const cargosPermitidos = [CargoUsuario.PROFESSOR];

    // Executa o caso de uso e espera que lance um erro
    await expect(
      verificarPermissaoUseCase.execute({
        usuarioId: '1',
        cargosPermitidos,
      }),
    ).rejects.toThrow(new AppError('Usuário não encontrado', 404));
  });

  it('deve retornar verdadeiro se o usuário tiver o cargo permitido e pertencer à instituição', async () => {
    // Cria um usuário mock com cargo PROFESSOR
    const usuario = Usuario.criar({
      id: '1',
      nome: 'Teste',
      email: 'teste@example.com',
      cargo: CargoUsuario.PROFESSOR,
    });

    // Configura o mock para retornar o usuário
    usuarioRepositoryMock.findById.mockResolvedValue(usuario);
    usuarioRepositoryMock.verificarPertencimentoInstituicao.mockResolvedValue({
      pertence: true,
      cargo: CargoUsuario.PROFESSOR,
    });

    // Define os cargos permitidos
    const cargosPermitidos = [CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA];

    // Executa o caso de uso
    const resultado = await verificarPermissaoUseCase.execute({
      usuarioId: '1',
      instituicaoId: 'inst-1',
      cargosPermitidos,
    });

    // Verifica se o resultado é verdadeiro
    expect(resultado).toBe(true);
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith('1');
    expect(usuarioRepositoryMock.verificarPertencimentoInstituicao).toHaveBeenCalledWith(
      '1',
      'inst-1',
    );
  });

  it('deve lançar erro se o usuário não pertencer à instituição', async () => {
    // Cria um usuário mock com cargo PROFESSOR
    const usuario = Usuario.criar({
      id: '1',
      nome: 'Teste',
      email: 'teste@example.com',
      cargo: CargoUsuario.PROFESSOR,
    });

    // Configura o mock para retornar o usuário
    usuarioRepositoryMock.findById.mockResolvedValue(usuario);
    usuarioRepositoryMock.verificarPertencimentoInstituicao.mockResolvedValue({ pertence: false });

    // Define os cargos permitidos
    const cargosPermitidos = [CargoUsuario.ADMIN, CargoUsuario.ESPECIALISTA];

    // Executa o caso de uso e espera que lance um erro
    await expect(
      verificarPermissaoUseCase.execute({
        usuarioId: '1',
        instituicaoId: 'inst-1',
        cargosPermitidos,
      }),
    ).rejects.toThrow(new AppError('Usuário não pertence à instituição', 403));
  });

  it('deve retornar falso se o usuário não tiver o cargo permitido', async () => {
    // Cria um usuário mock com cargo PROFESSOR
    const usuario = Usuario.criar({
      id: '1',
      nome: 'Teste',
      email: 'teste@example.com',
      cargo: CargoUsuario.PROFESSOR,
    });

    // Configura o mock para retornar o usuário
    usuarioRepositoryMock.findById.mockResolvedValue(usuario);
    usuarioRepositoryMock.verificarPertencimentoInstituicao.mockResolvedValue({
      pertence: true,
      cargo: CargoUsuario.PROFESSOR,
    });

    // Define os cargos permitidos
    const cargosPermitidos = [CargoUsuario.ADMIN, CargoUsuario.ESPECIALISTA];

    // Executa o caso de uso
    const resultado = await verificarPermissaoUseCase.execute({
      usuarioId: '1',
      instituicaoId: 'inst-1',
      cargosPermitidos,
    });

    // Verifica se o resultado é falso
    expect(resultado).toBe(false);
  });

  it('deve verificar permissões sem instituição mesmo se instituição for fornecida, quando o usuário é ADMIN', async () => {
    // Cria um usuário mock com cargo PROFESSOR
    const usuario = Usuario.criar({
      id: '1',
      nome: 'Teste',
      email: 'teste@example.com',
      cargo: CargoUsuario.PROFESSOR,
    });

    // Configura o spy no método ehAdministrador
    const ehAdministradorSpy = jest.spyOn(usuario, 'ehAdministrador');
    ehAdministradorSpy.mockReturnValue(true);

    // Configura o mock para retornar o usuário
    usuarioRepositoryMock.findById.mockResolvedValue(usuario);

    // Define os cargos permitidos
    const cargosPermitidos = [CargoUsuario.PROFESSOR];

    // Executa o caso de uso
    const resultado = await verificarPermissaoUseCase.execute({
      usuarioId: '1',
      instituicaoId: 'inst-1',
      cargosPermitidos,
    });

    // Verifica se o resultado é verdadeiro e se o método verificarPertencimentoInstituicao não foi chamado
    expect(resultado).toBe(true);
    expect(usuarioRepositoryMock.verificarPertencimentoInstituicao).not.toHaveBeenCalled();
  });

  it('deve usar o cargo da instituição para verificação quando fornecido', async () => {
    // Cria um usuário mock com cargo PROFESSOR
    const usuario = Usuario.criar({
      id: '1',
      nome: 'Teste',
      email: 'teste@example.com',
      cargo: CargoUsuario.PROFESSOR,
    });

    // Configura o mock para retornar o usuário
    usuarioRepositoryMock.findById.mockResolvedValue(usuario);
    usuarioRepositoryMock.verificarPertencimentoInstituicao.mockResolvedValue({
      pertence: true,
      cargo: CargoUsuario.PROFESSOR,
    });

    // Define os cargos permitidos
    const cargosPermitidos = [CargoUsuario.PROFESSOR];

    // Executa o caso de uso
    const resultado = await verificarPermissaoUseCase.execute({
      usuarioId: '1',
      instituicaoId: 'inst-1',
      cargosPermitidos,
    });

    // Verifica se o resultado é verdadeiro
    expect(resultado).toBe(true);
  });
});
