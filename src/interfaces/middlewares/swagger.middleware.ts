import { Request, Response, NextFunction } from 'express';
import { env } from '@config/env';

/**
 * Middleware para autenticação na documentação Swagger
 */
export const swaggerAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Verifica se a rota é relacionada ao Swagger e se a autenticação está habilitada
  const isSwaggerRoute = req.path.startsWith('/api-docs');

  if (isSwaggerRoute && env.NODE_ENV === 'production') {
    // Implementa autenticação básica para acessar a documentação em produção
    const auth = req.headers.authorization;

    if (!auth || !isValidBasicAuth(auth)) {
      res
        .status(401)
        .set('WWW-Authenticate', 'Basic realm="Innerview API Documentation"')
        .send('Não autorizado');
      return;
    }
  }

  next();
};

/**
 * Valida credenciais de autenticação básica
 * Formato: Basic base64(username:password)
 */
function isValidBasicAuth(auth: string): boolean {
  if (!auth.startsWith('Basic ')) {
    return false;
  }

  try {
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Credenciais configuradas no ambiente
    const validUsername = env.SWAGGER_USERNAME || 'admin';
    const validPassword = env.SWAGGER_PASSWORD || 'innerview';

    return username === validUsername && password === validPassword;
  } catch (error) {
    return false;
  }
}
