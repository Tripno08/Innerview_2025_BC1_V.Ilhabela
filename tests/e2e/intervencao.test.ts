import request from 'supertest';
import { app } from './app.mock';

describe('Intervenções (E2E)', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvLWlkLTEiLCJlbWFpbCI6InRlc3RlQGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIn0.token-test';

  describe('POST /intervencoes', () => {
    it('deve criar uma nova intervenção com dados válidos', async () => {
      const dadosValidos = {
        titulo: 'Intervenção Teste',
        descricao: 'Descrição detalhada da intervenção',
        objetivos: 'Objetivos da intervenção',
        estrategias: 'Estratégias a serem aplicadas',
        estudanteId: 'estudante-id-1'
      };

      const response = await request(app)
        .post('/intervencoes')
        .set('Authorization', `Bearer ${token}`)
        .send(dadosValidos);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('message');
    });

    it('deve retornar erro 400 ao tentar criar intervenção com dados inválidos', async () => {
      const dadosInvalidos = {
        // Faltando título, que é obrigatório
        descricao: 'Descrição da intervenção'
      };

      const response = await request(app)
        .post('/intervencoes')
        .set('Authorization', `Bearer ${token}`)
        .send(dadosInvalidos);

      expect(response.status).toBe(400);
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      const dados = {
        titulo: 'Intervenção Teste',
        descricao: 'Descrição da intervenção'
      };

      const response = await request(app)
        .post('/intervencoes')
        .send(dados);

      expect(response.status).toBe(401);
    });

    it('deve retornar erro 404 com estudanteId inexistente', async () => {
      const dados = {
        titulo: 'Intervenção Teste',
        descricao: 'Descrição da intervenção',
        estudanteId: 'estudante-nao-existe'
      };

      const response = await request(app)
        .post('/intervencoes')
        .set('Authorization', `Bearer ${token}`)
        .send(dados);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /intervencoes', () => {
    it('deve listar intervenções', async () => {
      const response = await request(app)
        .get('/intervencoes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('intervencoes');
      expect(Array.isArray(response.body.intervencoes)).toBe(true);
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/intervencoes');

      expect(response.status).toBe(401);
    });
  });
}); 