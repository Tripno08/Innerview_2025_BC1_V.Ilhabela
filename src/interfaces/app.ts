import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json } from 'body-parser';
import 'reflect-metadata';
import '@shared/container';
import swaggerUi from 'swagger-ui-express';

import { usuarioRoutes } from '@interfaces/routes/usuario.routes';
import { intervencaoRoutes } from '@interfaces/routes/intervencao.routes';
import { estudanteRoutes } from '@interfaces/routes/estudante.routes';
import { mlRoutes } from '@interfaces/routes/ml.routes';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
    this.documentation();
  }

  private middlewares(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(json());
    this.express.use(morgan('dev'));
  }

  private routes(): void {
    // Registrar rotas
    this.express.use('/usuarios', usuarioRoutes);
    this.express.use('/intervencoes', intervencaoRoutes);
    this.express.use('/estudantes', estudanteRoutes);
    this.express.use('/ml', mlRoutes);
  }

  private documentation(): void {
    // Configuração básica Swagger UI
    const swaggerOptions = {
      openapi: '3.0.0',
      info: {
        title: 'API Innerview Ilhabela',
        version: '1.0.0',
        description: 'API para o sistema Innerview de acompanhamento e intervenção educacional',
      },
    };

    this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));
  }
}

export default new App().express;
