import { AssociarDificuldadeUseCase } from '../../../../../src/application/use-cases/estudante/associar-dificuldade.use-case';
import { EstudanteRepositoryMock, DificuldadeRepositoryMock } from '../../mocks/repositories.mock';
import { AppError } from '../../../../../src/shared/errors/app-error';
import { TipoDificuldade, CategoriaDificuldade } from '../../../../../src/domain/entities/dificuldade-aprendizagem.entity';

describe('AssociarDificuldadeUseCase', () => {
  let associarDificuldadeUseCase: AssociarDificuldadeUseCase;
  let estudanteRepository: EstudanteRepositoryMock;
  let dificuldadeRepository: DificuldadeRepositoryMock;
  let estudanteId: string;
  let dificuldadeId: string;

  beforeEach(async () => {
    // Inicializar repositórios mock
    estudanteRepository = new EstudanteRepositoryMock();
    dificuldadeRepository = new DificuldadeRepositoryMock();
    
    // Criar um estudante para os testes
    const estudante = await estudanteRepository.create({
      nome: 'Estudante Teste',
      serie: '5º Ano',
      dataNascimento: new Date('2012-01-15'),
      usuarioId: 'professor-id'
    });
    estudanteId = estudante.id;
    
    // Criar uma dificuldade para os testes
    const dificuldade = await dificuldadeRepository.create({
      nome: 'Dificuldade de Leitura',
      descricao: 'Dificuldade para decodificar textos',
      tipo: TipoDificuldade.LEITURA,
      categoria: CategoriaDificuldade.MODERADA
    });
    dificuldadeId = dificuldade.id;
    
    // Inicializar o caso de uso
    associarDificuldadeUseCase = new AssociarDificuldadeUseCase(
      estudanteRepository,
      dificuldadeRepository
    );
  });

  it('deve associar uma dificuldade a um estudante', async () => {
    // Arrange
    const dados = {
      estudanteId,
      dificuldadeId
    };

    // Act
    const resultado = await associarDificuldadeUseCase.execute(dados);

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado.estudante).toBeDefined();
    
    // Verificar se a dificuldade foi associada
    const dificuldadesDoEstudante = await dificuldadeRepository.findByEstudanteId(estudanteId);
    expect(dificuldadesDoEstudante.length).toBeGreaterThan(0);
  });

  it('deve lançar erro quando o estudante não existe', async () => {
    // Arrange
    const dados = {
      estudanteId: 'estudante-inexistente',
      dificuldadeId
    };

    // Act & Assert
    await expect(associarDificuldadeUseCase.execute(dados))
      .rejects
      .toThrow(new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND'));
  });

  it('deve lançar erro quando a dificuldade não existe', async () => {
    // Arrange
    const dados = {
      estudanteId,
      dificuldadeId: 'dificuldade-inexistente'
    };

    // Act & Assert
    await expect(associarDificuldadeUseCase.execute(dados))
      .rejects
      .toThrow(new AppError('Dificuldade de aprendizagem não encontrada', 404, 'DIFFICULTY_NOT_FOUND'));
  });

  it('deve lançar erro quando a dificuldade estiver inativa', async () => {
    // Arrange
    // Criar uma dificuldade inativa
    const dificuldadeInativa = await dificuldadeRepository.create({
      nome: 'Dificuldade Inativa',
      descricao: 'Dificuldade inativa para teste',
      tipo: TipoDificuldade.ESCRITA,
      categoria: CategoriaDificuldade.LEVE,
      status: 'CANCELADO' // Inativo
    });
    
    const dados = {
      estudanteId,
      dificuldadeId: dificuldadeInativa.id
    };

    // Act & Assert
    await expect(associarDificuldadeUseCase.execute(dados))
      .rejects
      .toThrow(new AppError('Dificuldade de aprendizagem inativa não pode ser associada', 400, 'INACTIVE_DIFFICULTY'));
  });

  it('deve lançar erro quando a dificuldade já estiver associada ao estudante', async () => {
    // Arrange
    const dados = {
      estudanteId,
      dificuldadeId
    };
    
    // Associar a dificuldade previamente
    dificuldadeRepository.associarDificuldadeAEstudante(dificuldadeId, estudanteId);

    // Act & Assert
    await expect(associarDificuldadeUseCase.execute(dados))
      .rejects
      .toThrow(new AppError('Dificuldade já está associada a este estudante', 409, 'DIFFICULTY_ALREADY_ASSOCIATED'));
  });

  it('deve chamar o método adicionarDificuldade do repositório com os parâmetros corretos', async () => {
    // Arrange
    const dados = {
      estudanteId,
      dificuldadeId
    };
    
    // Spy no método adicionarDificuldade
    const adicionarDificuldadeSpy = jest.spyOn(estudanteRepository, 'adicionarDificuldade');

    // Act
    await associarDificuldadeUseCase.execute(dados);

    // Assert
    expect(adicionarDificuldadeSpy).toHaveBeenCalledWith(estudanteId, dificuldadeId);
  });
}); 