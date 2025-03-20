import { RegistrarAvaliacaoUseCase } from '../../../../../src/application/use-cases/estudante/registrar-avaliacao.use-case';
import { EstudanteRepositoryMock } from '../../mocks/repositories.mock';
import { AppError } from '../../../../../src/shared/errors/app-error';

describe('RegistrarAvaliacaoUseCase', () => {
  let registrarAvaliacaoUseCase: RegistrarAvaliacaoUseCase;
  let estudanteRepository: EstudanteRepositoryMock;
  let estudanteId: string;

  beforeEach(async () => {
    // Inicializar repositório mock
    estudanteRepository = new EstudanteRepositoryMock();
    
    // Criar um estudante para os testes
    const estudante = await estudanteRepository.create({
      nome: 'Estudante Teste',
      serie: '5º Ano',
      dataNascimento: new Date('2012-01-15'),
      usuarioId: 'professor-id'
    });
    estudanteId = estudante.id;
    
    // Inicializar o caso de uso
    registrarAvaliacaoUseCase = new RegistrarAvaliacaoUseCase(
      estudanteRepository
    );
  });

  it('deve registrar uma avaliação para um estudante', async () => {
    // Arrange
    const dadosAvaliacao = {
      estudanteId,
      data: new Date(),
      tipo: 'Prova Bimestral',
      pontuacao: 8.5,
      observacoes: 'Boa performance em matemática'
    };

    // Act
    const resultado = await registrarAvaliacaoUseCase.execute(dadosAvaliacao);

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado.estudante).toBeDefined();
    expect(resultado.avaliacao).toBeDefined();
    expect(resultado.avaliacao.tipo).toBe(dadosAvaliacao.tipo);
    expect(resultado.avaliacao.pontuacao).toBe(dadosAvaliacao.pontuacao);
    expect(resultado.avaliacao.observacoes).toBe(dadosAvaliacao.observacoes);
  });

  it('deve lançar erro quando o estudante não existe', async () => {
    // Arrange
    const dadosAvaliacao = {
      estudanteId: 'estudante-inexistente',
      data: new Date(),
      tipo: 'Prova Bimestral',
      pontuacao: 8.5,
      observacoes: 'Boa performance em matemática'
    };

    // Act & Assert
    await expect(registrarAvaliacaoUseCase.execute(dadosAvaliacao))
      .rejects
      .toThrow(new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND'));
  });

  it('deve lançar erro quando a data da avaliação é futura', async () => {
    // Arrange
    const dataFutura = new Date();
    dataFutura.setFullYear(dataFutura.getFullYear() + 1);
    
    const dadosAvaliacao = {
      estudanteId,
      data: dataFutura,
      tipo: 'Prova Bimestral',
      pontuacao: 8.5,
      observacoes: 'Boa performance em matemática'
    };

    // Act & Assert
    await expect(registrarAvaliacaoUseCase.execute(dadosAvaliacao))
      .rejects
      .toThrow(new AppError('Data da avaliação não pode ser futura', 400, 'INVALID_ASSESSMENT_DATE'));
  });

  it('deve lançar erro quando o tipo da avaliação não é fornecido', async () => {
    // Arrange
    const dadosAvaliacao = {
      estudanteId,
      data: new Date(),
      tipo: '',
      pontuacao: 8.5,
      observacoes: 'Boa performance em matemática'
    };

    // Act & Assert
    await expect(registrarAvaliacaoUseCase.execute(dadosAvaliacao))
      .rejects
      .toThrow(new AppError('Tipo de avaliação é obrigatório', 400, 'INVALID_ASSESSMENT_TYPE'));
  });

  it('deve lançar erro quando a pontuação está fora do intervalo válido', async () => {
    // Arrange
    const dadosAvaliacao = {
      estudanteId,
      data: new Date(),
      tipo: 'Prova Bimestral',
      pontuacao: 11, // Fora do intervalo válido (0-10)
      observacoes: 'Boa performance em matemática'
    };

    // Act & Assert
    await expect(registrarAvaliacaoUseCase.execute(dadosAvaliacao))
      .rejects
      .toThrow(new AppError('Pontuação deve estar entre 0 e 10', 400, 'INVALID_ASSESSMENT_SCORE'));
  });

  it('deve chamar o método adicionarAvaliacao do repositório com os parâmetros corretos', async () => {
    // Arrange
    const dadosAvaliacao = {
      estudanteId,
      data: new Date(),
      tipo: 'Prova Bimestral',
      pontuacao: 8.5,
      observacoes: 'Boa performance em matemática'
    };
    
    // Spy no método adicionarAvaliacao
    const adicionarAvaliacaoSpy = jest.spyOn(estudanteRepository, 'adicionarAvaliacao');

    // Act
    await registrarAvaliacaoUseCase.execute(dadosAvaliacao);

    // Assert
    expect(adicionarAvaliacaoSpy).toHaveBeenCalledWith(estudanteId, expect.objectContaining({
      data: expect.any(Date),
      tipo: dadosAvaliacao.tipo,
      pontuacao: dadosAvaliacao.pontuacao,
      observacoes: dadosAvaliacao.observacoes,
    }));
  });

  it('deve registrar uma avaliação sem observações', async () => {
    // Arrange
    const dadosAvaliacao = {
      estudanteId,
      data: new Date(),
      tipo: 'Prova Mensal',
      pontuacao: 7.5
    };

    // Act
    const resultado = await registrarAvaliacaoUseCase.execute(dadosAvaliacao);

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado.avaliacao).toBeDefined();
    expect(resultado.avaliacao.tipo).toBe(dadosAvaliacao.tipo);
    expect(resultado.avaliacao.pontuacao).toBe(dadosAvaliacao.pontuacao);
    expect(resultado.avaliacao.observacoes).toBeUndefined();
  });
}); 