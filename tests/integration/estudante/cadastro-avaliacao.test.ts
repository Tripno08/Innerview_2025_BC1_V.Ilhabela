import { container } from 'tsyringe';
import { IEstudanteRepository } from '../../../src/domain/repositories/estudante-repository.interface';
import { IDificuldadeRepository } from '../../../src/domain/repositories/dificuldade-repository.interface';
import { CadastrarEstudanteUseCase } from '../../../src/application/use-cases/estudante/cadastrar-estudante';
import { AssociarDificuldadeUseCase } from '../../../src/application/use-cases/estudante/associar-dificuldade';
import { RegistrarAvaliacaoUseCase } from '../../../src/application/use-cases/estudante/registrar-avaliacao';
import { AppError } from '../../../src/shared/errors/AppError';
import { setupTestDatabase, clearTestDatabase, closeTestDatabase } from '../../helpers/database';

describe('Cadastro e Avaliação de Estudantes (Integração)', () => {
  let estudanteRepository: IEstudanteRepository;
  let dificuldadeRepository: IDificuldadeRepository;
  let cadastrarEstudante: CadastrarEstudanteUseCase;
  let associarDificuldade: AssociarDificuldadeUseCase;
  let registrarAvaliacao: RegistrarAvaliacaoUseCase;

  beforeAll(async () => {
    await setupTestDatabase();
    
    estudanteRepository = container.resolve('EstudanteRepository');
    dificuldadeRepository = container.resolve('DificuldadeRepository');
    cadastrarEstudante = container.resolve('CadastrarEstudanteUseCase');
    associarDificuldade = container.resolve('AssociarDificuldadeUseCase');
    registrarAvaliacao = container.resolve('RegistrarAvaliacaoUseCase');
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  it('deve cadastrar um novo estudante com sucesso', async () => {
    // Arrange
    const dadosEstudante = {
      nome: 'Maria Silva',
      dataNascimento: new Date('2010-05-15'),
      matricula: '2024001',
      serie: '5º ano',
      turma: 'A',
    };

    // Act
    const estudante = await cadastrarEstudante.execute(dadosEstudante);

    // Assert
    expect(estudante).toHaveProperty('id');
    expect(estudante.nome).toBe(dadosEstudante.nome);
    expect(estudante.matricula).toBe(dadosEstudante.matricula);
  });

  it('deve associar dificuldades a um estudante', async () => {
    // Arrange
    const estudante = await cadastrarEstudante.execute({
      nome: 'Maria Silva',
      dataNascimento: new Date('2010-05-15'),
      matricula: '2024001',
      serie: '5º ano',
      turma: 'A',
    });

    const dificuldade = await dificuldadeRepository.criar({
      nome: 'Dislexia',
      descricao: 'Dificuldade na leitura e escrita',
      area: 'LINGUAGEM',
    });

    // Act
    const resultado = await associarDificuldade.execute({
      estudanteId: estudante.id,
      dificuldadeId: dificuldade.id,
      nivelGravidade: 'MODERADO',
      observacoes: 'Necessita de acompanhamento especializado',
    });

    // Assert
    expect(resultado).toHaveProperty('id');
    expect(resultado.estudanteId).toBe(estudante.id);
    expect(resultado.dificuldadeId).toBe(dificuldade.id);
  });

  it('deve registrar uma avaliação para o estudante', async () => {
    // Arrange
    const estudante = await cadastrarEstudante.execute({
      nome: 'Maria Silva',
      dataNascimento: new Date('2010-05-15'),
      matricula: '2024001',
      serie: '5º ano',
      turma: 'A',
    });

    // Act
    const avaliacao = await registrarAvaliacao.execute({
      estudanteId: estudante.id,
      avaliadorId: 'avaliador-1',
      tipo: 'PEDAGOGICA',
      data: new Date(),
      resultados: {
        leitura: 7,
        escrita: 6,
        matematica: 8,
      },
      observacoes: 'Apresenta evolução na leitura',
    });

    // Assert
    expect(avaliacao).toHaveProperty('id');
    expect(avaliacao.estudanteId).toBe(estudante.id);
    expect(avaliacao.tipo).toBe('PEDAGOGICA');
  });

  it('deve falhar ao tentar cadastrar estudante com matrícula duplicada', async () => {
    // Arrange
    const dadosEstudante = {
      nome: 'Maria Silva',
      dataNascimento: new Date('2010-05-15'),
      matricula: '2024001',
      serie: '5º ano',
      turma: 'A',
    };

    await cadastrarEstudante.execute(dadosEstudante);

    // Act & Assert
    await expect(
      cadastrarEstudante.execute(dadosEstudante)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('deve falhar ao tentar associar dificuldade inexistente', async () => {
    // Arrange
    const estudante = await cadastrarEstudante.execute({
      nome: 'Maria Silva',
      dataNascimento: new Date('2010-05-15'),
      matricula: '2024001',
      serie: '5º ano',
      turma: 'A',
    });

    // Act & Assert
    await expect(
      associarDificuldade.execute({
        estudanteId: estudante.id,
        dificuldadeId: 'dificuldade-inexistente',
        nivelGravidade: 'MODERADO',
        observacoes: 'Teste',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
}); 