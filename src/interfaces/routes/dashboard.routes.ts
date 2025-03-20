import { Router } from 'express';
import { DashboardController } from '@interfaces/controllers/dashboard.controller';
import { authMiddleware } from '@interfaces/middlewares/auth.middleware';
import { rbacMiddleware } from '@interfaces/middlewares/rbac.middleware';
import { ValidationMiddleware } from '@interfaces/middlewares/validation.middleware';
import { CargoUsuario } from '../../shared/types/cargo.enum';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

// Middleware de autenticação para todas as rotas
dashboardRoutes.use(authMiddleware);

/**
 * @route GET /dashboard/indicadores
 * @description Obtém indicadores principais do dashboard
 * @access Privado
 */
dashboardRoutes.get(
  '/indicadores',
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR, CargoUsuario.ADMIN]),
  dashboardController.obterIndicadores,
);

/**
 * @route GET /dashboard/estatisticas/estudantes
 * @description Obtém estatísticas de estudantes
 * @access Privado
 */
dashboardRoutes.get(
  '/estatisticas/estudantes',
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR, CargoUsuario.ADMIN]),
  dashboardController.obterEstatisticasEstudantes,
);

/**
 * @route GET /dashboard/estatisticas/dificuldades
 * @description Obtém estatísticas de dificuldades
 * @access Privado
 */
dashboardRoutes.get(
  '/estatisticas/dificuldades',
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR, CargoUsuario.ADMIN]),
  dashboardController.obterEstatisticasDificuldades,
);

/**
 * @route GET /dashboard/estatisticas/intervencoes
 * @description Obtém estatísticas de intervenções
 * @access Privado
 */
dashboardRoutes.get(
  '/estatisticas/intervencoes',
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR, CargoUsuario.ADMIN]),
  dashboardController.obterEstatisticasIntervencoes,
);

/**
 * @route GET /dashboard/estatisticas/reunioes
 * @description Obtém estatísticas de reuniões
 * @access Privado
 */
dashboardRoutes.get(
  '/estatisticas/reunioes',
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR, CargoUsuario.ADMIN]),
  dashboardController.obterEstatisticasReunioes,
);

/**
 * @route GET /dashboard/relatorios/estudante/:id
 * @description Gera relatório de acompanhamento de estudante
 * @access Privado
 */
dashboardRoutes.get(
  '/relatorios/estudante/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.ADMIN,
  ]),
  dashboardController.gerarRelatorioEstudante,
);

/**
 * @route GET /dashboard/relatorios/intervencoes
 * @description Gera relatório de intervenções
 * @access Privado
 */
dashboardRoutes.get(
  '/relatorios/intervencoes',
  rbacMiddleware([
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.ADMIN,
  ]),
  dashboardController.gerarRelatorioIntervencoes,
);

/**
 * @route GET /dashboard/relatorios/equipe/:id
 * @description Gera relatório de desempenho de equipe
 * @access Privado
 */
dashboardRoutes.get(
  '/relatorios/equipe/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR, CargoUsuario.ADMIN]),
  dashboardController.gerarRelatorioEquipe,
);

export { dashboardRoutes };
