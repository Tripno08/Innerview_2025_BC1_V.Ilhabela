import request from 'supertest';
import { app } from './app.mock';

describe('Estudantes (E2E)', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvLWlkLTEiLCJlbWFpbCI6InRlc3RlQGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIn0.token-test';

  describe('POST /estudantes', () => {
    it('deve criar um novo estudante com dados válidos', async () => {
      const dadosValidos = {
        nome: 'Novo Estudante',
        dataNascimento: '2010-01-01',
        genero: 'M',
        turno: 'MANHA',
        serie: '5º ano',
        turma: 'A'
      };

      const response = await request(app)
        .post('/estudantes')
        .set('Authorization', `Bearer ${token}`)
        .send(dadosValidos);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('deve retornar erro 400 ao tentar criar estudante com dados inválidos', async () => {
      const dadosInvalidos = {
        // Faltando nome, que é obrigatório
        dataNascimento: '2010-01-01',
        genero: 'M'
      };

      const response = await request(app)
        .post('/estudantes')
        .set('Authorization', `Bearer ${token}`)
        .send(dadosInvalidos);

      expect(response.status).toBe(400);
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      const dados = {
        nome: 'Estudante Teste',
        dataNascimento: '2010-01-01',
        genero: 'M'
      };

      const response = await request(app)
        .post('/estudantes')
        .send(dados);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /estudantes', () => {
    it('deve listar estudantes', async () => {
      const response = await request(app)
        .get('/estudantes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('estudantes');
      expect(Array.isArray(response.body.estudantes)).toBe(true);
    });

    it('deve retornar erro 401 sem autenticação', async () => {
      const response = await request(app)
        .get('/estudantes');

      expect(response.status).toBe(401);
    });
  });
}); 