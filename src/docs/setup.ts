import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

/**
 * Configura a documentação Swagger na aplicação
 * @param app Instância do Express
 */
export function setupSwagger(app: Express): void {
  // Interface de usuário do Swagger
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );

  // Endpoint para baixar a especificação OpenAPI em JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📚 Documentação Swagger disponível em /api-docs`);
}
