import request from 'supertest';
import { app } from './app.mock';

describe('Validação de Dados (E2E)', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvLWlkLTEiLCJlbWFpbCI6InRlc3RlQGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIn0.token-test';

  describe('Validação de estudantes', () => {
    it('deve validar que nome é obrigatório', async () => {
      const dadosInvalidos = {
        // nome não informado intencionalmente
        dataNascimento: '2010-01-01',
        genero: 'M',
        turno: 'MANHA'
      };

      const response = await request(app)
        .post('/estudantes')
        .set('Authorization', `Bearer ${token}`)
        .send(dadosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Validação de intervenções', () => {
    it('deve validar que título é obrigatório', async () => {
      const dadosInvalidos = {
        // título não informado intencionalmente
        descricao: 'Descrição da intervenção',
        dataInicio: '2023-05-01',
        estudanteId: 'estudante-id-1'
      };

      const response = await request(app)
        .post('/intervencoes')
        .set('Authorization', `Bearer ${token}`)
        .send(dadosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Validação de autenticação', () => {
    it('deve validar que senha é obrigatória', async () => {
      const dadosInvalidos = {
        email: 'teste@example.com'
        // senha não informada intencionalmente
      };

      const response = await request(app)
        .post('/auth/login')
        .send(dadosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 