import request from 'supertest';
import { app } from './app.mock';

describe('Swagger Documentation (E2E)', () => {
  it('deve acessar a documentação Swagger', async () => {
    const response = await request(app)
      .get('/api-docs')
      .set('Accept', 'text/html');

    expect(response.status).toBe(200);
  });

  it('deve acessar o JSON da especificação OpenAPI', async () => {
    const response = await request(app)
      .get('/api-docs.json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('openapi');
    expect(response.body).toHaveProperty('info');
    expect(response.body).toHaveProperty('paths');
  });
}); 