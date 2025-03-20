import { container } from 'tsyringe';
import { IMLService } from '@domain/services/ml/ml-service.interface';
import { EstudanteRepository } from '@infrastructure/repositories/estudante.repository';
import { IntervencaoRepository } from '@infrastructure/repositories/intervencao.repository';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { MLServiceBasic } from '@infrastructure/services/ml/ml-service-basic';

// Configurar banco de dados de teste
const prisma = new PrismaClient();

describe('ML Service - Testes de Integração', () => {
  let mlService: MLServiceBasic;
  let estudanteRepository: EstudanteRepository;
  let intervencaoRepository: IntervencaoRepository;
  let estudanteId: string;
  let intervencaoId: string;
  let usuarioId: string;
  let instituicaoId: string;

  // Configurar dados de teste no banco antes de todos os testes
  beforeAll(async () => {
    // Registrar as dependências no container
    estudanteRepository = new EstudanteRepository(prisma);
    intervencaoRepository = new IntervencaoRepository(prisma);
    container.registerInstance('EstudanteRepository', estudanteRepository);
    container.registerInstance('IntervencaoRepository', intervencaoRepository);
    
    mlService = container.resolve(MLServiceBasic);

    // Criar dados de teste no banco
    const instituicao = await prisma.instituicao.create({
      data: {
        nome: 'Escola Teste Integração',
        cnpj: '12345678901234',
        endereco: 'Rua Teste, 123',
        telefone: '11999999999',
        email: 'escola.teste@example.com'
      }
    });

    instituicaoId = instituicao.id;

    const usuario = await prisma.usuario.create({
      data: {
        nome: 'Usuário Teste',
        email: 'usuario.teste@example.com',
        senha: 'senha123',
        cargo: 'PROFESSOR',
        UsuarioInstituicao: {
          create: {
            instituicaoId
          }
        }
      }
    });

    usuarioId = usuario.id;

    // Criar estudante de teste
    const estudante = await prisma.estudante.create({
      data: {
        nome: 'Estudante Teste',
        matricula: '12345',
        dataNascimento: new Date('2010-01-01'),
        serie: '5º ano',
        turma: 'A',
        responsavel: 'Pai do Estudante',
        telefoneResponsavel: '11988888888',
        observacoes: 'Aluno para testes de integração',
        genero: 'M',
        status: 'ATIVO',
        usuarioId,
        instituicaoId
      }
    });

    estudanteId = estudante.id;

    // Criar dificuldades de aprendizagem para o estudante
    const dificuldade1 = await prisma.dificuldadeAprendizagem.create({
      data: {
        nome: 'Dificuldade em matemática',
        descricao: 'Dificuldade em operações básicas de matemática',
        observacoes: 'Requer atenção em frações e problemas textuais'
      }
    });

    const dificuldade2 = await prisma.dificuldadeAprendizagem.create({
      data: {
        nome: 'Dificuldade de concentração',
        descricao: 'Distrai-se facilmente durante as aulas',
        observacoes: 'Recomenda-se atividades de curta duração'
      }
    });

    // Associar dificuldades ao estudante
    await prisma.estudanteDificuldade.create({
      data: {
        estudanteId: estudante.id,
        dificuldadeId: dificuldade1.id,
        dataIdentificacao: new Date(),
        nivel: 'MEDIO',
        observacoes: 'Identificado em avaliação diagnóstica'
      }
    });

    await prisma.estudanteDificuldade.create({
      data: {
        estudanteId: estudante.id,
        dificuldadeId: dificuldade2.id,
        dataIdentificacao: new Date(),
        nivel: 'LEVE',
        observacoes: 'Relatado pelo professor'
      }
    });

    // Criar intervenção de teste
    const intervencao = await prisma.intervencao.create({
      data: {
        titulo: 'Intervenção de Teste',
        descricao: 'Intervenção criada para testes de integração',
        estudanteId: estudante.id,
        dataInicio: new Date('2023-02-01'),
        dataFim: new Date('2023-03-10'),
        status: 'CONCLUIDO',
        responsavelId: usuarioId
      }
    });

    intervencaoId = intervencao.id;

    // Criar registro de progresso da intervenção
    await prisma.progressoIntervencao.create({
      data: {
        intervencaoId: intervencao.id,
        dataRegistro: new Date('2023-02-20'),
        descricao: 'Progresso intermediário da intervenção',
        observacoes: 'Progresso significativo observado',
        avaliacaoNumerica: 8,
        responsavelId: usuarioId
      }
    });
  });

  // Limpar dados de teste após todos os testes
  afterAll(async () => {
    // Remover dados na ordem correta para evitar violações de chave estrangeira
    await prisma.progressoIntervencao.deleteMany({
      where: {
        intervencaoId
      }
    });
    
    await prisma.intervencao.delete({
      where: {
        id: intervencaoId
      }
    });
    
    await prisma.estudanteDificuldade.deleteMany({
      where: {
        estudanteId
      }
    });
    
    await prisma.estudante.delete({
      where: {
        id: estudanteId
      }
    });

    // Limpar outros dados criados nos testes
    await prisma.dificuldadeAprendizagem.deleteMany({
      where: {
        nome: {
          in: ['Dificuldade em matemática', 'Dificuldade de concentração']
        }
      }
    });

    await prisma.usuarioInstituicao.deleteMany({
      where: {
        usuario: {
          email: 'usuario.teste@example.com'
        }
      }
    });

    await prisma.usuario.deleteMany({
      where: {
        email: 'usuario.teste@example.com'
      }
    });

    await prisma.instituicao.deleteMany({
      where: {
        nome: 'Escola Teste Integração'
      }
    });

    await prisma.$disconnect();
  });

  describe('Testes de previsão de risco e recomendações', () => {
    test('deve prever risco acadêmico para um estudante real', async () => {
      // Buscar estudante do banco
      const estudante = await estudanteRepository.obterPorId(estudanteId);
      
      // Executar predição de risco
      const previsao = await mlService.preverRiscoAcademico(estudante, true);
      
      // Verificar resultados
      expect(previsao).toHaveProperty('estudanteId', estudanteId);
      expect(previsao).toHaveProperty('probabilidade');
      expect(previsao).toHaveProperty('nivelRisco');
      expect(previsao.fatoresContribuintes.length).toBeGreaterThan(0);
      
      // Verificar valores dentro dos limites esperados
      expect(previsao.probabilidade).toBeGreaterThanOrEqual(0);
      expect(previsao.probabilidade).toBeLessThanOrEqual(100);
      expect(['BAIXO', 'MEDIO', 'ALTO', 'CRITICO']).toContain(previsao.nivelRisco);
    });

    test('deve recomendar intervenções relevantes para o estudante', async () => {
      // Buscar estudante e suas dificuldades
      const estudante = await estudanteRepository.obterPorId(estudanteId);
      const dificuldades = await estudanteRepository.obterDificuldades(estudanteId);
      
      // Executar recomendação de intervenções
      const recomendacoes = await mlService.recomendarIntervencoes(estudante, dificuldades, 3);
      
      // Verificar resultados
      expect(recomendacoes.length).toBeGreaterThan(0);
      expect(recomendacoes.length).toBeLessThanOrEqual(3);
      
      // Verificar estrutura das recomendações
      recomendacoes.forEach(recomendacao => {
        expect(recomendacao).toHaveProperty('intervencaoId');
        expect(recomendacao).toHaveProperty('titulo');
        expect(recomendacao).toHaveProperty('descricao');
        expect(recomendacao).toHaveProperty('nivelCompatibilidade');
        expect(recomendacao).toHaveProperty('baseadoEm');
        
        // Verificar valores dentro dos limites esperados
        expect(recomendacao.nivelCompatibilidade).toBeGreaterThanOrEqual(0);
        expect(recomendacao.nivelCompatibilidade).toBeLessThanOrEqual(100);
      });
    });

    test('deve analisar eficácia de uma intervenção real', async () => {
      // Buscar intervenção
      const intervencao = await intervencaoRepository.obterPorId(intervencaoId);
      
      // Executar análise de eficácia
      const analise = await mlService.analisarEficaciaIntervencao(intervencao);
      
      // Verificar resultados
      expect(analise).toHaveProperty('intervencaoId', intervencaoId);
      expect(analise).toHaveProperty('eficaciaGeral');
      expect(analise).toHaveProperty('metricas');
      expect(analise).toHaveProperty('tendencia');
      expect(analise).toHaveProperty('tempoParaResultado');
      
      // Verificar valores dentro dos limites esperados
      expect(analise.eficaciaGeral).toBeGreaterThanOrEqual(0);
      expect(analise.eficaciaGeral).toBeLessThanOrEqual(100);
      expect(['POSITIVA', 'NEUTRA', 'NEGATIVA']).toContain(analise.tendencia);
      expect(analise.metricas.length).toBeGreaterThan(0);
    });
  });

  describe('Testes de robustez com casos de borda', () => {
    test('deve processar estudante sem dificuldades cadastradas', async () => {
      // Criar estudante de teste sem dificuldades
      const estudanteSemDificuldades = await prisma.estudante.create({
        data: {
          nome: 'Estudante Sem Dificuldades',
          matricula: '54321',
          dataNascimento: new Date('2011-05-10'),
          serie: '4º ano',
          turma: 'C',
          responsavel: 'Mãe do Estudante',
          telefoneResponsavel: '11977777777',
          observacoes: 'Aluno para teste sem dificuldades',
          genero: 'F',
          status: 'ATIVO',
          usuarioId: (
            await prisma.usuario.findFirst({ where: { email: 'usuario.teste@example.com' } })
          ).id,
          instituicaoId: (
            await prisma.instituicao.findFirst({ where: { nome: 'Escola Teste Integração' } })
          ).id,
        }
      });
      
      try {
        // Buscar estudante
        const estudante = await estudanteRepository.obterPorId(estudanteSemDificuldades.id);
        
        // Executar recomendação sem dificuldades
        const recomendacoes = await mlService.recomendarIntervencoes(estudante, [], 3);
        
        // Verificar que houve recomendações mesmo sem dificuldades
        expect(recomendacoes.length).toBeGreaterThan(0);
      } finally {
        // Limpar estudante criado
        await prisma.estudante.delete({
          where: {
            id: estudanteSemDificuldades.id
          }
        });
      }
    });

    test('deve comparar com normas usando indicadores não padrão', async () => {
      // Buscar estudante
      const estudante = await estudanteRepository.obterPorId(estudanteId);
      
      // Executar comparação com normas usando indicadores incomuns
      const comparacao = await mlService.compararComNormas(
        estudante,
        ['Indicador Não Padrão', 'desempenho geral', 'frequência']
      );
      
      // Verificar resultados
      expect(comparacao).toHaveProperty('estudanteId', estudanteId);
      expect(comparacao).toHaveProperty('metricas');
      expect(comparacao).toHaveProperty('tendenciaTemporal');
      
      // Verificar que todos os indicadores foram processados
      expect(comparacao.metricas.length).toBe(3);
      
      // Verificar estrutura dos indicadores
      comparacao.metricas.forEach(metrica => {
        expect(metrica).toHaveProperty('nome');
        expect(metrica).toHaveProperty('valorEstudante');
        expect(metrica).toHaveProperty('mediaPopulacional');
        expect(metrica).toHaveProperty('desvioPadrao');
        expect(metrica).toHaveProperty('percentil');
        expect(metrica).toHaveProperty('classificacao');
        
        // Verificar valores dentro dos limites esperados
        expect(metrica.percentil).toBeGreaterThanOrEqual(0);
        expect(metrica.percentil).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Performance com volumes maiores', () => {
    test('deve registrar eficientemente lotes de dados de treinamento', async () => {
      // Criar lote de dados para treinamento
      const dadosTreinamento = Array.from({ length: 500 }, (_, i) => ({
        fonte: 'teste-integracao',
        data: new Date(),
        tipo: i % 3 === 0 ? 'avaliacao' : i % 3 === 1 ? 'intervencao' : 'comportamento',
        valor: {
          id: `valor-${i}`,
          estudanteId: i % 5 === 0 ? estudanteId : `estudante-${i % 10}`,
          metrica: Math.random() * 10,
          observacao: `Observação de teste ${i}`
        },
        metadados: {
          origem: 'teste-integracao',
          versao: '1.0',
          ambiente: 'teste'
        }
      }));
      
      // Medir tempo de execução
      const startTime = Date.now();
      
      await mlService.registrarDadosTreinamento(dadosTreinamento);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Verificar que o tempo de execução é razoável (< 500ms para 500 registros)
      expect(executionTime).toBeLessThan(500);
    });

    test('deve treinar modelo eficientemente', async () => {
      // Obter lista de modelos
      const modelos = await mlService.listarModelos();
      
      // Garantir que há modelos disponíveis
      expect(modelos.length).toBeGreaterThan(0);
      
      // Selecionar um modelo para treinar
      const modeloId = modelos[0].id;
      
      // Configurar treinamento
      const configuracao = {
        epocas: 5,
        taxaAprendizado: 0.01,
        validacaoCruzada: true
      };
      
      // Medir tempo de execução
      const startTime = Date.now();
      
      const modeloAtualizado = await mlService.treinarModelo(modeloId, configuracao);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Verificar resultado do treinamento
      expect(modeloAtualizado).toHaveProperty('id', modeloId);
      expect(modeloAtualizado).toHaveProperty('status', 'ATIVO');
      expect(modeloAtualizado.versao).not.toBe(modelos[0].versao);
      
      // Verificar que o tempo de execução é razoável (< 3000ms, incluindo simulação)
      expect(executionTime).toBeLessThan(3000);
    });
  });
}); 