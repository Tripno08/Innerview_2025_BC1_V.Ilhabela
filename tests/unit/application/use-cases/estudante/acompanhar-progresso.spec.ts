import { AcompanharProgressoUseCase } from '../../../../../src/application/use-cases/estudante/acompanhar-progresso.use-case';
import { EstudanteRepositoryMock, IntervencaoRepositoryMock } from '../../mocks/repositories.mock';
import { AppError } from '../../../../../src/shared/errors/app-error';
import { TipoIntervencao } from '../../../../../src/domain/entities/intervencao.entity';

// Mock do enum Status para evitar dependência direta do Prisma
enum StatusMock {
  ATIVO = 'ATIVO',
  PENDENTE = 'PENDENTE',
  CANCELADO = 'CANCELADO'
}

describe('AcompanharProgressoUseCase', () => {
  let acompanharProgressoUseCase: AcompanharProgressoUseCase;
  let estudanteRepository: EstudanteRepositoryMock;
  let intervencaoRepository: IntervencaoRepositoryMock;
  let estudanteId: string;

  beforeEach(async () => {
    // Inicializar repositórios mock
    estudanteRepository = new EstudanteRepositoryMock();
    intervencaoRepository = new IntervencaoRepositoryMock();
    
    // Criar um estudante para os testes
    const estudante = await estudanteRepository.create({
      nome: 'Estudante Teste',
      serie: '5º Ano',
      dataNascimento: new Date('2012-01-15'),
      usuarioId: 'professor-id'
    });
    estudanteId = estudante.id;
    
    // Criar algumas intervenções para o estudante
    await intervencaoRepository.create({
      titulo: 'Intervenção Ativa 1',
      descricao: 'Intervenção em andamento',
      tipo: TipoIntervencao.PEDAGOGICA,
      dataInicio: new Date(),
      estudanteId,
      progresso: 45
    });
    
    await intervencaoRepository.create({
      titulo: 'Intervenção Ativa 2',
      descricao: 'Outra intervenção em andamento',
      tipo: TipoIntervencao.COMPORTAMENTAL,
      dataInicio: new Date(),
      estudanteId,
      progresso: 30
    });
    
    // Criar algumas avaliações para o estudante
    const dataAnterior = new Date();
    dataAnterior.setMonth(dataAnterior.getMonth() - 2);
    
    await estudanteRepository.adicionarAvaliacao(estudanteId, {
      data: dataAnterior,
      tipo: 'Avaliação Inicial',
      pontuacao: 6.0,
      observacoes: 'Avaliação inicial'
    });
    
    const dataRecente = new Date();
    dataRecente.setDate(dataRecente.getDate() - 7);
    
    await estudanteRepository.adicionarAvaliacao(estudanteId, {
      data: dataRecente,
      tipo: 'Avaliação de Progresso',
      pontuacao: 7.5,
      observacoes: 'Melhora significativa'
    });
    
    // Inicializar o caso de uso
    acompanharProgressoUseCase = new AcompanharProgressoUseCase(
      estudanteRepository,
      intervencaoRepository
    );
  });

  it('deve retornar informações de progresso para um estudante', async () => {
    // Arrange
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await acompanharProgressoUseCase.execute(dados);

    // Assert
    expect(resultado).toBeDefined();
    expect(resultado.intervencoes).toBeDefined();
    expect(resultado.intervencoes.length).toBe(2);
    expect(resultado.avaliacoes).toBeDefined();
    expect(resultado.avaliacoes.length).toBe(2);
    expect(resultado.progressoGeral).toBeGreaterThan(0);
    expect(resultado.statusIntervencoes).toBeDefined();
    expect(resultado.mediaAvaliacoes).toBeGreaterThan(0);
    expect(resultado.tendencia).toBeDefined();
  });

  it('deve lançar erro quando o estudante não existe', async () => {
    // Arrange
    const dados = {
      estudanteId: 'estudante-inexistente'
    };

    // Act & Assert
    await expect(acompanharProgressoUseCase.execute(dados))
      .rejects
      .toThrow(new AppError('Estudante não encontrado', 404, 'STUDENT_NOT_FOUND'));
  });

  it('deve lançar erro quando o estudante não possui intervenções', async () => {
    // Arrange
    // Criar um estudante sem intervenções
    const estudanteSemIntervencoes = await estudanteRepository.create({
      nome: 'Estudante Sem Intervenções',
      serie: '4º Ano',
      dataNascimento: new Date('2013-01-15'),
      usuarioId: 'professor-id'
    });
    
    const dados = {
      estudanteId: estudanteSemIntervencoes.id
    };

    // Act & Assert
    await expect(acompanharProgressoUseCase.execute(dados))
      .rejects
      .toThrow(new AppError('Estudante não possui intervenções cadastradas para acompanhamento', 400, 'NO_INTERVENTIONS_FOUND'));
  });

  it('deve calcular o progresso geral corretamente', async () => {
    // Arrange
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await acompanharProgressoUseCase.execute(dados);

    // Assert
    // Progresso geral deve ser a média dos progressos das intervenções (45 + 30) / 2 = 37.5
    expect(resultado.progressoGeral).toBeCloseTo(37.5);
  });

  it('deve calcular a tendência como MELHORA quando as avaliações recentes são melhores', async () => {
    // Arrange
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await acompanharProgressoUseCase.execute(dados);

    // Assert
    // Tendência deve ser MELHORA porque a avaliação mais recente (7.5) é melhor que a inicial (6.0)
    expect(resultado.tendencia).toBe('MELHORA');
  });

  it('deve calcular a tendência como PIORA quando as avaliações recentes são piores', async () => {
    // Arrange
    // Adicionar uma avaliação mais recente com pontuação pior
    const dataRecente = new Date();
    await estudanteRepository.adicionarAvaliacao(estudanteId, {
      data: dataRecente,
      tipo: 'Avaliação Recente',
      pontuacao: 4.5,
      observacoes: 'Dificuldades persistentes'
    });
    
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await acompanharProgressoUseCase.execute(dados);

    // Assert
    // A tendência deve ser PIORA porque a avaliação mais recente tem pontuação menor
    expect(resultado.tendencia).toBe('PIORA');
  });

  it('deve calcular a tendência como ESTAVEL quando não há mudança significativa', async () => {
    // Arrange
    // Adicionar uma avaliação mais recente com pontuação similar
    const dataRecente = new Date();
    await estudanteRepository.adicionarAvaliacao(estudanteId, {
      data: dataRecente,
      tipo: 'Avaliação Recente',
      pontuacao: 6.2, // Próxima da avaliação inicial (6.0)
      observacoes: 'Sem mudanças significativas'
    });
    
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await acompanharProgressoUseCase.execute(dados);

    // Assert
    // A tendência deve ser ESTAVEL porque não há diferença significativa
    expect(resultado.tendencia).toBe('ESTAVEL');
  });

  it('deve contar corretamente o status das intervenções', async () => {
    // Arrange
    // Adicionar uma intervenção concluída
    const intervencaoConcluida = await intervencaoRepository.create({
      titulo: 'Intervenção Concluída',
      descricao: 'Intervenção já concluída',
      tipo: TipoIntervencao.PEDAGOGICA,
      dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      dataFim: new Date(),
      estudanteId,
      progresso: 100
    });
    await intervencaoRepository.concluir(intervencaoConcluida.id);
    
    // Adicionar uma intervenção cancelada
    const intervencaoCancelada = await intervencaoRepository.create({
      titulo: 'Intervenção Cancelada',
      descricao: 'Intervenção cancelada',
      tipo: TipoIntervencao.SOCIAL,
      dataInicio: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 dias atrás
      estudanteId,
      progresso: 20
    });
    await intervencaoRepository.cancelar(intervencaoCancelada.id);
    
    const dados = {
      estudanteId
    };

    // Act
    const resultado = await acompanharProgressoUseCase.execute(dados);

    // Assert
    expect(resultado.statusIntervencoes.ativas).toBe(2); // As duas intervenções iniciais
    expect(resultado.statusIntervencoes.concluidas).toBe(1); // A intervenção concluída
    expect(resultado.statusIntervencoes.canceladas).toBe(1); // A intervenção cancelada
  });
}); 