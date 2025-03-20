import { IUsuarioRepository } from '../../src/domain/repositories/usuario-repository.interface';
import { IEstudanteRepository } from '../../src/domain/repositories/estudante-repository.interface';
import { IIntervencaoRepository } from '../../src/domain/repositories/intervencao-repository.interface'; 
import { IHashService } from '../../src/domain/interfaces/IHashService';
import { container } from 'tsyringe';
import { Status, CargoUsuario, Genero, Turno } from '../../src/shared/enums';

// Mock para a entidade Usuario
export class UsuarioMock {
  id: string;
  email: string;
  senha: string;
  nome: string;
  papel: CargoUsuario;
  criadoEm: Date;
  atualizadoEm: Date;

  // Métodos para manter interface compatível com entidade de domínio
  static restaurar(dados: any): UsuarioMock {
    const usuario = new UsuarioMock();
    Object.assign(usuario, dados);
    return usuario;
  }

  validar() {}
  validarEmail() {}
  atualizar() {}
  temPermissao() { return true; }
  ehAdmin() { return true; }
  ehGestor() { return true; }
}

// Mock para a entidade Estudante
export class EstudanteMock {
  id: string;
  nome: string;
  dataNascimento: Date;
  genero: Genero;
  anoEscolar: string;
  turma: string;
  turno: Turno;
  instituicaoId: string;
  responsaveis: any[];
  criadoEm: Date;
  atualizadoEm: Date;

  static restaurar(dados: any): EstudanteMock {
    const estudante = new EstudanteMock();
    Object.assign(estudante, dados);
    return estudante;
  }
}

// Mock para IUsuarioRepository
export class MockUsuarioRepository implements Partial<IUsuarioRepository> {
  async criar(data: any): Promise<UsuarioMock> {
    const usuario = new UsuarioMock();
    usuario.id = 'mock-user-id';
    usuario.email = data.email;
    usuario.senha = data.senha;
    usuario.nome = data.nome;
    usuario.papel = data.papel || CargoUsuario.PROFESSOR;
    usuario.criadoEm = new Date();
    usuario.atualizadoEm = new Date();
    return usuario;
  }

  async buscarPorEmail(email: string): Promise<UsuarioMock | null> {
    if (email === 'usuario@teste.com') {
      const usuario = new UsuarioMock();
      usuario.id = 'mock-user-id';
      usuario.email = email;
      usuario.senha = 'hash_password';
      usuario.nome = 'Usuário Teste';
      usuario.papel = CargoUsuario.PROFESSOR;
      usuario.criadoEm = new Date();
      usuario.atualizadoEm = new Date();
      return usuario;
    }
    return null;
  }

  async buscarPorId(id: string): Promise<UsuarioMock | null> {
    const usuario = new UsuarioMock();
    usuario.id = id;
    usuario.email = 'usuario@teste.com';
    usuario.senha = 'hash_password';
    usuario.nome = 'Usuário Teste';
    usuario.papel = CargoUsuario.PROFESSOR;
    usuario.criadoEm = new Date();
    usuario.atualizadoEm = new Date();
    return usuario;
  }
}

// Mock para IEstudanteRepository
export class MockEstudanteRepository implements Partial<IEstudanteRepository> {
  async criar(data: any): Promise<EstudanteMock> {
    const estudante = new EstudanteMock();
    estudante.id = 'mock-estudante-id';
    estudante.nome = data.nome;
    estudante.dataNascimento = data.dataNascimento;
    estudante.genero = data.genero;
    estudante.anoEscolar = data.anoEscolar;
    estudante.turma = data.turma;
    estudante.turno = data.turno;
    estudante.instituicaoId = data.instituicaoId;
    estudante.responsaveis = data.responsaveis || [];
    estudante.criadoEm = new Date();
    estudante.atualizadoEm = new Date();
    return estudante;
  }
}

// Mock para IHashService
export class MockHashService implements Partial<IHashService> {
  async hashPassword(password: string): Promise<string> {
    return `hashed_${password}`;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return password === '123456';
  }
}

// Função para configurar os mocks no container do tsyringe
export function setupMocks() {
  container.registerSingleton<IUsuarioRepository>('UsuarioRepository', MockUsuarioRepository);
  container.registerSingleton<IEstudanteRepository>('EstudanteRepository', MockEstudanteRepository);
  container.registerSingleton<IHashService>('HashService', MockHashService);
} 