import { RecomendarIntervencoesUseCase } from '../../../../../src/application/use-cases/estudante/recomendar-intervencoes.use-case';
import { EstudanteRepositoryMock, DificuldadeRepositoryMock, IntervencaoRepositoryMock } from '../../mocks/repositories.mock';
import { AppError } from '../../../../../src/shared/errors/app-error';
import { TipoDificuldade, CategoriaDificuldade } from '../../../../../src/domain/entities/dificuldade-aprendizagem.entity';
import { TipoIntervencao } from '../../../../../src/domain/entities/intervencao.entity';

describe('RecomendarIntervencoesUseCase', () => {
  let recomendarIntervencoesUseCase: RecomendarIntervencoesUseCase;
  let estudanteRepository: EstudanteRepositoryMock;
  let dificuldadeRepository: DificuldadeRepositoryMock;
  let intervencaoRepository: IntervencaoRepositoryMock;
  let estudanteId: string;
  let dificuldadeId: string;

  beforeEach(async () => {
    // Inicializar repositórios mock
    estudanteRepository = new EstudanteRepositoryMock();
    dificuldadeRepository = new DificuldadeRepositoryMock();
    intervencaoRepository = new IntervencaoRepositoryMock();
    
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
    
    // Associar a dificuldade ao estudante
    dificuldadeRepository.associarDificuldadeAEstudante(dificuldadeId, estudanteId);
    
    // Criar algumas intervenções no catálogo
    await intervencaoRepository.createCatalogo({
      titulo: 'Intervenção para Leitura',
      descricao: 'Intervenção para melhorar a leitura',
      tipo: TipoIntervencao.PEDAGOGICA,
      dificuldadesAlvo: [dificuldadeId]
    });
    
    await intervencaoRepository.createCatalogo({
      titulo: 'Intervenção Multidisciplinar',
      descricao: 'Intervenção multidisciplinar',
      tipo: TipoIntervencao.MULTIDISCIPLINAR,
      dificuldadesAlvo: [dificuldadeId]
    });
    
    // Inicializar o caso de uso
    recomendarIntervencoesUseCase = new RecomendarIntervencoesUseCase(
      estudanteRepository,
      dificuldadeRepository,
      intervencaoRepository
    );
  });

  it('deve recomendar intervenções para um estudante com dificuldades', async () => {
    // Arrange
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await recomendarIntervencoesUseCase.execute(dados);

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado.intervencoes).toBeDefined();
    expect(resultado.intervencoes.length).toBeGreaterThan(0);
  });

  it('deve lançar erro quando o estudante não existe', async () => {
    // Arrange
    const dados = {
      estudanteId: 'estudante-inexistente'
    };

    // Act & Assert
    await expect(recomendarIntervencoesUseCase.execute(dados))
      .rejects
      .toThrow(new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND'));
  });

  it('deve lançar erro quando o estudante não possui dificuldades cadastradas', async () => {
    // Arrange
    // Criar um estudante sem dificuldades
    const estudanteSemDificuldades = await estudanteRepository.create({
      nome: 'Estudante Sem Dificuldades',
      serie: '4º Ano',
      dataNascimento: new Date('2013-01-15'),
      usuarioId: 'professor-id'
    });
    
    const dados = {
      estudanteId: estudanteSemDificuldades.id
    };

    // Act & Assert
    await expect(recomendarIntervencoesUseCase.execute(dados))
      .rejects
      .toThrow(new AppError('Estudante não possui dificuldades cadastradas para recomendação', 400, 'NO_DIFFICULTIES_FOUND'));
  });

  it('deve filtrar intervenções já aplicadas ao estudante', async () => {
    // Arrange
    // Obter todas as intervenções do catálogo
    const catalogoIntervencoes = await intervencaoRepository.findAllCatalogo();
    const primeiraIntervencao = catalogoIntervencoes[0];
    
    // Aplicar a primeira intervenção ao estudante
    await intervencaoRepository.create({
      titulo: primeiraIntervencao.titulo,
      descricao: primeiraIntervencao.descricao,
      tipo: primeiraIntervencao.tipo,
      dataInicio: new Date(),
      estudanteId,
      intervencaoBaseId: primeiraIntervencao.id
    });
    
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await recomendarIntervencoesUseCase.execute(dados);

    // Assert
    expect(resultado.intervencoes).toBeDefined();
    
    // Verificar se a intervenção já aplicada não está nas recomendações
    const intervencaoJaAplicada = resultado.intervencoes.find(
      i => i.id === primeiraIntervencao.id
    );
    expect(intervencaoJaAplicada).toBeUndefined();
  });

  it('deve priorizar intervenções multidisciplinares para estudantes com dificuldades graves', async () => {
    // Arrange
    // Criar uma dificuldade grave
    const dificuldadeGrave = await dificuldadeRepository.create({
      nome: 'Dificuldade Grave',
      descricao: 'Dificuldade grave para testes',
      tipo: TipoDificuldade.COMPORTAMENTAL,
      categoria: CategoriaDificuldade.GRAVE
    });
    
    // Associar a dificuldade grave ao estudante
    dificuldadeRepository.associarDificuldadeAEstudante(dificuldadeGrave.id, estudanteId);
    
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await recomendarIntervencoesUseCase.execute(dados);

    // Assert
    expect(resultado.intervencoes.length).toBeGreaterThan(0);
    
    // Verificar se a primeira intervenção é multidisciplinar
    if (resultado.intervencoes.length > 1) {
      expect(resultado.intervencoes[0].tipo).toBe(TipoIntervencao.MULTIDISCIPLINAR);
    }
  });

  it('deve buscar intervenções genéricas quando não há específicas para as dificuldades', async () => {
    // Arrange
    // Criar uma dificuldade sem intervenções específicas
    const dificuldadeSemIntervencoes = await dificuldadeRepository.create({
      nome: 'Dificuldade Sem Intervenções',
      descricao: 'Dificuldade sem intervenções específicas',
      tipo: TipoDificuldade.SOCIAL,
      categoria: CategoriaDificuldade.LEVE
    });
    
    // Criar um estudante com apenas essa dificuldade
    const novoEstudante = await estudanteRepository.create({
      nome: 'Estudante Novo',
      serie: '3º Ano',
      dataNascimento: new Date('2014-01-15'),
      usuarioId: 'professor-id'
    });
    
    // Associar a dificuldade ao estudante
    dificuldadeRepository.associarDificuldadeAEstudante(dificuldadeSemIntervencoes.id, novoEstudante.id);
    
    // Criar uma intervenção genérica
    await intervencaoRepository.createCatalogo({
      titulo: 'Intervenção Genérica',
      descricao: 'Intervenção genérica que serve para qualquer dificuldade',
      tipo: TipoIntervencao.PEDAGOGICA
    });
    
    const dados = {
      estudanteId: novoEstudante.id
    };

    // Act
    const resultado = await recomendarIntervencoesUseCase.execute(dados);

    // Assert
    expect(resultado.intervencoes).toBeDefined();
    expect(resultado.intervencoes.length).toBeGreaterThan(0);
  });
}); 