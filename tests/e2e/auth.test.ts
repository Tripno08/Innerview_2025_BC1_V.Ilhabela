import request from 'supertest';
import { app } from './app.mock';

describe('Testes de Autenticação - E2E', () => {
  describe('POST /usuarios', () => {
    it('deve criar um novo usuário com dados válidos', async () => {
      const dadosValidos = {
        nome: 'Novo Usuário',
        email: 'novo@example.com',
        senha: 'senha123',
        cargo: 'ADMIN'
      };

      const response = await request(app)
        .post('/usuarios')
        .send(dadosValidos);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('deve retornar erro 400 ao tentar criar usuário com dados inválidos', async () => {
      const dadosInvalidos = {
        nome: 'Usuário Inválido',
        email: 'invalido@example.com'
        // Faltando senha e cargo
      };

      const response = await request(app)
        .post('/usuarios')
        .send(dadosInvalidos);

      expect(response.status).toBe(400);
    });

    it('deve retornar erro 409 ao tentar criar usuário com email já existente', async () => {
      const dadosDuplicados = {
        nome: 'Usuário Duplicado',
        email: 'teste@example.com',
        senha: 'senha123',
        cargo: 'ADMIN'
      };

      const response = await request(app)
        .post('/usuarios')
        .send(dadosDuplicados);

      expect(response.status).toBe(409);
    });
  });

  describe('POST /auth/login', () => {
    it('deve autenticar com credenciais válidas', async () => {
      const credenciaisValidas = {
        email: 'teste@example.com',
        senha: 'senha123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(credenciaisValidas);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('usuario');
    });

    it('deve retornar erro 401 com credenciais inválidas', async () => {
      const credenciaisInvalidas = {
        email: 'teste@example.com',
        senha: 'senha_errada'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(credenciaisInvalidas);

      expect(response.status).toBe(401);
    });

    it('deve retornar erro 400 com dados incompletos', async () => {
      const dadosIncompletos = {
        email: 'teste@example.com'
        // Faltando senha
      };

      const response = await request(app)
        .post('/auth/login')
        .send(dadosIncompletos);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /auth/me', () => {
    it('deve retornar o perfil do usuário autenticado', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3VhcmlvLWlkLTEiLCJlbWFpbCI6InRlc3RlQGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIn0.token-test';

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('email');
    });

    it('deve retornar erro 401 sem token', async () => {
      const response = await request(app)
        .get('/auth/me');

      expect(response.status).toBe(401);
    });

    it('deve retornar erro 401 com token inválido', async () => {
      const tokenInvalido = 'token-invalido';

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${tokenInvalido}`);

      expect(response.status).toBe(401);
    });
  });
}); 