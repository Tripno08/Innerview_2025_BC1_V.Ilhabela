import request from 'supertest';
import { app } from './app.mock';

describe('ML Service - E2E Tests', () => {
  // Token simulado para testes
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMSIsIm5hbWUiOiJVc3VhcmlvIFRlc3RlIiwiZW1haWwiOiJ0ZXN0ZUBleGFtcGxlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY0NjMxNzk4MX0.y1VQ9NG8GfaG8m1iGaH8b1bPRjIAANhXn6U5wV2wOQo';

  // IDs simulados
  const estudanteId = 'est-123';
  const intervencaoId = 'int-123';
  const modeloId = 'modelo-123';

  describe('Previsão de risco e recomendações', () => {
    test('Deve prever risco acadêmico para um estudante', async () => {
      const response = await request(app)
        .get(`/ml/estudantes/${estudanteId}/risco`)
        .set('Authorization', `Bearer ${mockToken}`)
        .query({ incluirFatores: 'true' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('estudanteId', estudanteId);
      expect(response.body).toHaveProperty('probabilidade');
      expect(response.body).toHaveProperty('nivelRisco');
      expect(response.body).toHaveProperty('fatoresContribuintes');
      expect(response.body).toHaveProperty('dataCriacao');
      
      expect(response.body.fatoresContribuintes.length).toBeGreaterThan(0);
      expect(response.body.probabilidade).toBeGreaterThanOrEqual(0);
      expect(response.body.probabilidade).toBeLessThanOrEqual(100);
      expect(['BAIXO', 'MEDIO', 'ALTO', 'CRITICO']).toContain(response.body.nivelRisco);
    });

    test('Deve recomendar intervenções para um estudante', async () => {
      const response = await request(app)
        .get(`/ml/estudantes/${estudanteId}/recomendacoes`)
        .set('Authorization', `Bearer ${mockToken}`)
        .query({ limite: '3' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(3);
      expect(response.body.length).toBeGreaterThan(0);
      
      const recomendacao = response.body[0];
      expect(recomendacao).toHaveProperty('intervencaoId');
      expect(recomendacao).toHaveProperty('titulo');
      expect(recomendacao).toHaveProperty('descricao');
      expect(recomendacao).toHaveProperty('nivelCompatibilidade');
      expect(recomendacao).toHaveProperty('baseadoEm');
    });
  });

  describe('Análise de eficácia e padrões', () => {
    test('Deve analisar eficácia de uma intervenção', async () => {
      const response = await request(app)
        .get(`/ml/intervencoes/${intervencaoId}/eficacia`)
        .set('Authorization', `Bearer ${mockToken}`)
        .query({ metricas: 'Frequência escolar,Nota média' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('intervencaoId', intervencaoId);
      expect(response.body).toHaveProperty('eficaciaGeral');
      expect(response.body).toHaveProperty('metricas');
      expect(response.body).toHaveProperty('tendencia');
      expect(response.body).toHaveProperty('tempoParaResultado');
      
      // Verificar que apenas as métricas solicitadas foram incluídas
      expect(response.body.metricas).toHaveLength(2);
      expect(response.body.metricas[0].nome).toBe('Frequência escolar');
    });

    test('Deve detectar padrões nas dificuldades de aprendizagem', async () => {
      const response = await request(app)
        .get('/ml/padroes')
        .set('Authorization', `Bearer ${mockToken}`)
        .query({
          limiteConfianca: '0.7',
          area: 'matematica',
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const padrao = response.body[0];
      expect(padrao).toHaveProperty('nome');
      expect(padrao).toHaveProperty('descricao');
      expect(padrao).toHaveProperty('confianca');
      expect(padrao).toHaveProperty('estudantesAfetados');
      expect(padrao).toHaveProperty('indicadores');
      expect(padrao).toHaveProperty('possiveisCausas');
      expect(padrao).toHaveProperty('recomendacoes');
      
      // Verificar que a confiança atende ao limite mínimo
      expect(padrao.confianca).toBeGreaterThanOrEqual(0.7);
      
      // Verificar que o padrão está relacionado à área solicitada
      expect(
        padrao.nome.toLowerCase().includes('matematica') || 
          padrao.descricao.toLowerCase().includes('matematica'),
      ).toBeTruthy();
    });
  });

  describe('Comparação normativa e modelos', () => {
    test('Deve comparar estudante com normas populacionais', async () => {
      const response = await request(app)
        .get(`/ml/estudantes/${estudanteId}/comparacao`)
        .set('Authorization', `Bearer ${mockToken}`)
        .query({
          indicadores: 'desempenho geral,frequência,participação',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('estudanteId', estudanteId);
      expect(response.body).toHaveProperty('metricas');
      expect(response.body).toHaveProperty('tendenciaTemporal');
      
      // Verificar que todos os indicadores solicitados foram incluídos
      expect(response.body.metricas).toHaveLength(3);
      
      const indicadores = response.body.metricas.map((m) => m.nome.toLowerCase());
      expect(indicadores).toContain('desempenho geral');
      expect(indicadores).toContain('frequência');
      expect(indicadores).toContain('participação');
    });
  });

  describe('Controle de acesso', () => {
    test('Deve negar acesso sem token de autenticação', async () => {
      const response = await request(app)
        .get(`/ml/estudantes/${estudanteId}/risco`);

      expect(response.status).toBe(401);
    });

    test('Deve negar acesso para usuário sem permissão', async () => {
      // Token de usuário sem permissão (não é ADMIN, COORDENADOR, PROFESSOR ou ESPECIALISTA)
      const tokenSemPermissao = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMiIsIm5hbWUiOiJVc3VhcmlvIFNlbSBQZXJtaXNzYW8iLCJlbWFpbCI6InNlbXBlcm1pc3Nhb0BleGFtcGxlLmNvbSIsInJvbGUiOiJPVVRSTyIsImlhdCI6MTY0NjMxNzk4MX0.1W5NqnQHUCn_PXAJCz-GDEJXpZrbYR_X_mjV3a1t67M';
      
      const response = await request(app)
        .get(`/ml/estudantes/${estudanteId}/risco`)
        .set('Authorization', `Bearer ${tokenSemPermissao}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Gestão de modelos', () => {
    test('Deve listar modelos de ML disponíveis', async () => {
      const response = await request(app)
        .get('/ml/modelos')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      const modelo = response.body[0];
      expect(modelo).toHaveProperty('id');
      expect(modelo).toHaveProperty('nome');
      expect(modelo).toHaveProperty('tipo');
      expect(modelo).toHaveProperty('versao');
      expect(modelo).toHaveProperty('dataAtualizacao');
      expect(modelo).toHaveProperty('metricas');
      expect(modelo).toHaveProperty('status');
    });

    test('Deve treinar um modelo', async () => {
      const configuracao = {
        epocas: 5,
        taxaAprendizado: 0.01,
        validacaoCruzada: true,
      };
      
      const response = await request(app)
        .post(`/ml/modelos/${modeloId}/treinar`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send(configuracao);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', modeloId);
      expect(response.body).toHaveProperty('status', 'ATIVO');
      expect(response.body).toHaveProperty('versao');
      expect(response.body).toHaveProperty('dataAtualizacao');
    });
  });

  describe('Registro de dados de treinamento', () => {
    test('Deve registrar dados para treinamento', async () => {
      const dadosTreinamento = [
        {
          fonte: 'teste-e2e',
          data: new Date().toISOString(),
          tipo: 'avaliacao',
          valor: { id: 'valor-1', metrica: 8.5 },
          metadados: { origem: 'teste-e2e' },
        },
        {
          fonte: 'teste-e2e',
          data: new Date().toISOString(),
          tipo: 'intervencao',
          valor: { id: 'valor-2', metrica: 7.2 },
          metadados: { origem: 'teste-e2e' },
        },
      ];
      
      const response = await request(app)
        .post('/ml/dados/treinamento')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(dadosTreinamento);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Dados registrados com sucesso');
      expect(response.body).toHaveProperty('quantidadeRegistrada', 2);
    });

    test('Deve validar estrutura dos dados de treinamento', async () => {
      const dadosInvalidos = [
        {
          // Sem fonte, que é obrigatória
          data: new Date().toISOString(),
          tipo: 'avaliacao',
          valor: { metrica: 8.5 },
        },
      ];
      
      const response = await request(app)
        .post('/ml/dados/treinamento')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(dadosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    test('Deve retornar erro para formato inválido de dados', async () => {
      const dadosInvalidos = {
        // Não é um array como esperado
        fonte: 'teste-invalido',
        data: new Date().toISOString(),
      };
      
      const response = await request(app)
        .post('/ml/dados/treinamento')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(dadosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 