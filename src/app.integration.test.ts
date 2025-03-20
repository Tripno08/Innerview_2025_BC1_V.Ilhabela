import express from 'express';
import request from 'supertest';

// Mock simplificado da aplicação para testes
const app = express();

// Rota básica para testes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

describe('App', () => {
  it('deve retornar 200 para rota de saúde', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('deve retornar 404 para rota inexistente', async () => {
    const response = await request(app).get('/caminho-que-nao-existe');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  // Testes adicionais aqui, como verificação de rotas válidas
  // seriam incluídos quando as rotas estiverem implementadas
});
