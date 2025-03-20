import { Router } from 'express';
import { ReuniaoController } from '@interfaces/http/controllers/reuniao.controller';
import { ensureAuthenticated } from '@interfaces/http/middlewares/auth-middleware';
import { rbacMiddleware } from '@interfaces/http/middlewares/rbac-middleware';
import { CargoUsuario } from '@prisma/client';

const reuniaoRouter = Router();
const reuniaoController = new ReuniaoController();

// Middleware de autenticação para todas as rotas
reuniaoRouter.use(ensureAuthenticated);

// Listar todas as reuniões
reuniaoRouter.get(
  '/',
  rbacMiddleware([CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA, CargoUsuario.ADMIN]),
  reuniaoController.listar,
);

// Listar reuniões por equipe
reuniaoRouter.get(
  '/equipe/:equipeId',
  rbacMiddleware([CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA, CargoUsuario.ADMIN]),
  reuniaoController.listarPorEquipe,
);

// Listar reuniões por período
reuniaoRouter.get(
  '/periodo',
  rbacMiddleware([CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA, CargoUsuario.ADMIN]),
  reuniaoController.listarPorPeriodo,
);

// Listar reuniões por status
reuniaoRouter.get(
  '/status/:status',
  rbacMiddleware([CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA, CargoUsuario.ADMIN]),
  reuniaoController.listarPorStatus,
);

// Obter detalhes de uma reunião
reuniaoRouter.get(
  '/:id',
  rbacMiddleware([CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA, CargoUsuario.ADMIN]),
  reuniaoController.obterDetalhes,
);

// Criar uma nova reunião
reuniaoRouter.post(
  '/',
  rbacMiddleware([CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA, CargoUsuario.ADMIN]),
  reuniaoController.criar,
);

export default reuniaoRouter;
