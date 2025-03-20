import { CadastrarEstudanteUseCase } from '../../../../../src/application/use-cases/estudante/cadastrar-estudante.use-case';
import { EstudanteRepositoryMock } from '../../mocks/repositories.mock';
import { UsuarioRepositoryMock } from '../../mocks/repositories.mock';
import { Usuario } from '../../../../../src/domain/entities/usuario.entity';
import { AppError } from '../../../../../src/shared/errors/app-error';

// Mock do enum Status para evitar dependência direta do Prisma
enum StatusMock {
  ATIVO = 'ATIVO',
  PENDENTE = 'PENDENTE',
  CANCELADO = 'CANCELADO'
}

// Mock do enum CargoUsuario para evitar dependência direta do Prisma
enum CargoUsuarioMock {
  PROFESSOR = 'PROFESSOR',
  ESPECIALISTA = 'ESPECIALISTA',
  COORDENADOR = 'COORDENADOR',
  DIRETOR = 'DIRETOR',
  ADMINISTRADOR = 'ADMINISTRADOR'
}

describe('CadastrarEstudanteUseCase', () => {
  let cadastrarEstudanteUseCase: CadastrarEstudanteUseCase;
  let estudanteRepository: EstudanteRepositoryMock;
  let usuarioRepository: UsuarioRepositoryMock;
  let professorId: string;

  beforeEach(async () => {
    // Inicializar repositórios mock
    estudanteRepository = new EstudanteRepositoryMock();
    usuarioRepository = new UsuarioRepositoryMock();
    
    // Criar um professor para os testes
    const professor = await usuarioRepository.create({
      nome: 'Professor Teste',
      email: 'professor@teste.com',
      senha: 'senha123',
      cargo: CargoUsuarioMock.PROFESSOR
    });
    professorId = professor.id;

    // Inicializar o caso de uso
    cadastrarEstudanteUseCase = new CadastrarEstudanteUseCase(
      estudanteRepository,
      usuarioRepository
    );
  });

  it('deve cadastrar um estudante com dados válidos', async () => {
    // Arrange
    const dadosEstudante = {
      nome: 'Estudante Teste',
      serie: '5º Ano',
      dataNascimento: new Date('2012-01-15'),
      usuarioId: professorId
    };

    // Act
    const resultado = await cadastrarEstudanteUseCase.execute(dadosEstudante);

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado.estudante).toBeDefined();
    expect(resultado.estudante.nome).toBe(dadosEstudante.nome);
    expect(resultado.estudante.serie).toBe(dadosEstudante.serie);
    expect(resultado.estudante.usuarioId).toBe(professorId);
    expect(resultado.estudante.status).toBe(StatusMock.ATIVO);
  });

  it('deve lançar erro quando o professor não existe', async () => {
    // Arrange
    const dadosEstudante = {
      nome: 'Estudante Teste',
      serie: '5º Ano',
      dataNascimento: new Date('2012-01-15'),
      usuarioId: 'professor-inexistente'
    };

    // Act & Assert
    await expect(cadastrarEstudanteUseCase.execute(dadosEstudante))
      .rejects
      .toThrow(new AppError('Professor não encontrado', 404, 'TEACHER_NOT_FOUND'));
  });

  it('deve lançar erro quando a data de nascimento é futura', async () => {
    // Arrange
    const dataFutura = new Date();
    dataFutura.setFullYear(dataFutura.getFullYear() + 1);
    
    const dadosEstudante = {
      nome: 'Estudante Teste',
      serie: '5º Ano',
      dataNascimento: dataFutura,
      usuarioId: professorId
    };

    // Act & Assert
    await expect(cadastrarEstudanteUseCase.execute(dadosEstudante))
      .rejects
      .toThrow(new AppError('Data de nascimento não pode ser futura', 400, 'INVALID_BIRTH_DATE'));
  });

  it('deve lançar erro quando a série não é fornecida', async () => {
    // Arrange
    const dadosEstudante = {
      nome: 'Estudante Teste',
      serie: '',
      dataNascimento: new Date('2012-01-15'),
      usuarioId: professorId
    };

    // Act & Assert
    await expect(cadastrarEstudanteUseCase.execute(dadosEstudante))
      .rejects
      .toThrow(new AppError('Série é obrigatória', 400, 'INVALID_GRADE'));
  });

  it('deve chamar o método create do repositório com os dados corretos', async () => {
    // Arrange
    const dadosEstudante = {
      nome: 'Estudante Teste',
      serie: '5º Ano',
      dataNascimento: new Date('2012-01-15'),
      usuarioId: professorId
    };

    // Spy no método create do repositório
    const createSpy = jest.spyOn(estudanteRepository, 'create');

    // Act
    await cadastrarEstudanteUseCase.execute(dadosEstudante);

    // Assert
    expect(createSpy).toHaveBeenCalledWith({
      nome: dadosEstudante.nome,
      serie: dadosEstudante.serie,
      dataNascimento: dadosEstudante.dataNascimento,
      usuarioId: professorId,
    });
  });
}); 