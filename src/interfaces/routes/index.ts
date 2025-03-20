import { Router } from 'express';
import { dashboardRoutes } from './dashboard.routes';
import { estudanteRoutes } from './estudante.routes';
import { equipeRoutes } from './equipe.routes';
import { intervencaoRoutes } from './intervencao.routes';
import { reuniaoRoutes } from './reuniao.routes';
import { usuarioRoutes } from './usuario.routes';
import { dificuldadeRoutes } from './dificuldade.routes';
import { mlRoutes } from './ml.routes';

const routes = Router();

// Rotas específicas
routes.use('/dashboard', dashboardRoutes);
routes.use('/estudantes', estudanteRoutes);
routes.use('/equipes', equipeRoutes);
routes.use('/intervencoes', intervencaoRoutes);
routes.use('/reunioes', reuniaoRoutes);
routes.use('/usuarios', usuarioRoutes);
routes.use('/dificuldades', dificuldadeRoutes);
routes.use('/ml', mlRoutes);

export { routes };
