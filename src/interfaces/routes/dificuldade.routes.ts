import { Router } from 'express';
import { DificuldadeController } from '../../interfaces/controllers/dificuldade.controller';
import { authMiddleware } from '../../interfaces/middlewares/auth.middleware';
import { rbacMiddleware } from '../../interfaces/middlewares/rbac.middleware';
import { ValidationMiddleware } from '../../interfaces/middlewares/validation.middleware';
import { CargoUsuario } from '../../shared/types/cargo.enum';

const dificuldadeRoutes = Router();
const dificuldadeController = new DificuldadeController();

// Middleware de autenticação para todas as rotas
dificuldadeRoutes.use(authMiddleware);

/**
 * @route GET /dificuldades
 * @description Lista dificuldades de aprendizagem
 * @access Privado
 */
dificuldadeRoutes.get(
  '/',
  rbacMiddleware([
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.ADMIN,
  ]),
  dificuldadeController.listar,
);

/**
 * @route GET /dificuldades/:id
 * @description Obtém detalhes de uma dificuldade
 * @access Privado
 */
dificuldadeRoutes.get(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.ADMIN,
  ]),
  dificuldadeController.detalhar,
);

/**
 * @route POST /dificuldades
 * @description Cria uma nova dificuldade de aprendizagem
 * @access Privado
 */
dificuldadeRoutes.post(
  '/',
  ValidationMiddleware.validateBody(ValidationMiddleware.schemas.dificuldade?.criacao || {}),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.ESPECIALISTA, CargoUsuario.ADMIN]),
  dificuldadeController.criar,
);

/**
 * @route PUT /dificuldades/:id
 * @description Atualiza uma dificuldade existente
 * @access Privado
 */
dificuldadeRoutes.put(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.ESPECIALISTA, CargoUsuario.ADMIN]),
  dificuldadeController.atualizar,
);

/**
 * @route POST /dificuldades/:id/estudantes/:estudanteId
 * @description Associa uma dificuldade a um estudante
 * @access Privado
 */
dificuldadeRoutes.post(
  '/:id/estudantes/:estudanteId',
  ValidationMiddleware.validateParams({
    id: ValidationMiddleware.schemas.id,
    estudanteId: ValidationMiddleware.schemas.id,
  }),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  dificuldadeController.associarAEstudante,
);

/**
 * @route DELETE /dificuldades/:id/estudantes/:estudanteId
 * @description Remove a associação de uma dificuldade com um estudante
 * @access Privado
 */
dificuldadeRoutes.delete(
  '/:id/estudantes/:estudanteId',
  ValidationMiddleware.validateParams({
    id: ValidationMiddleware.schemas.id,
    estudanteId: ValidationMiddleware.schemas.id,
  }),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  dificuldadeController.removerDeEstudante,
);

/**
 * @route GET /dificuldades/:id/intervencoes
 * @description Lista intervenções recomendadas para uma dificuldade
 * @access Privado
 */
dificuldadeRoutes.get(
  '/:id/intervencoes',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.ADMIN,
  ]),
  dificuldadeController.listarIntervencoesRecomendadas,
);

/**
 * @route DELETE /dificuldades/:id
 * @description Exclui uma dificuldade
 * @access Privado
 */
dificuldadeRoutes.delete(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.ADMIN]),
  dificuldadeController.excluir,
);

export { dificuldadeRoutes };
