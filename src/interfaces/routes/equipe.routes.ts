import { Router } from 'express';
import { EquipeController } from '@interfaces/controllers/equipe.controller';
import { authMiddleware } from '@interfaces/middlewares/auth.middleware';
import { rbacMiddleware } from '@interfaces/middlewares/rbac.middleware';
import { ValidationMiddleware } from '@interfaces/middlewares/validation.middleware';
import { container } from 'tsyringe';
import { CargoUsuario } from '@shared/enums';
import Joi from 'joi';

const equipeRoutes = Router();
const equipeController = container.resolve<EquipeController>('EquipeController');

// Middleware de autenticação para todas as rotas
equipeRoutes.use(authMiddleware);

/**
 * @route GET /equipes
 * @description Lista equipes com filtros
 * @access Privado
 */
equipeRoutes.get(
  '/',
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR]),
  equipeController.listar,
);

/**
 * @route GET /equipes/:id
 * @description Obtém detalhes de uma equipe
 * @access Privado
 */
equipeRoutes.get(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.DIRETOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
  ]),
  equipeController.detalhar,
);

/**
 * @route POST /equipes
 * @description Cria uma nova equipe
 * @access Privado
 */
equipeRoutes.post(
  '/',
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR]),
  ValidationMiddleware.validateBody(ValidationMiddleware.schemas.equipe.criacao),
  equipeController.criar,
);

/**
 * @route PUT /equipes/:id
 * @description Atualiza uma equipe existente
 * @access Privado
 */
equipeRoutes.put(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR]),
  equipeController.atualizar,
);

/**
 * @route POST /equipes/:id/membros
 * @description Adiciona membro à equipe
 * @access Privado
 */
equipeRoutes.post(
  '/:id/membros',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR]),
  ValidationMiddleware.validateBody(ValidationMiddleware.schemas.equipe.adicionarMembro),
  equipeController.adicionarMembro,
);

/**
 * @route DELETE /equipes/:id/membros/:membroId
 * @description Remove membro da equipe
 * @access Privado
 */
equipeRoutes.delete(
  '/:id/membros/:membroId',
  ValidationMiddleware.validateParams(
    Joi.object({
      id: Joi.string().uuid().required(),
      membroId: Joi.string().uuid().required(),
    }),
  ),
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR]),
  equipeController.removerMembro,
);

/**
 * @route POST /equipes/:id/estudantes
 * @description Adiciona estudante à equipe
 * @access Privado
 */
equipeRoutes.post(
  '/:id/estudantes',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.DIRETOR,
    CargoUsuario.PROFESSOR,
  ]),
  ValidationMiddleware.validateBody(ValidationMiddleware.schemas.equipe.adicionarEstudante),
  equipeController.adicionarEstudante,
);

/**
 * @route DELETE /equipes/:id/estudantes/:estudanteId
 * @description Remove estudante da equipe
 * @access Privado
 */
equipeRoutes.delete(
  '/:id/estudantes/:estudanteId',
  ValidationMiddleware.validateParams(
    Joi.object({
      id: Joi.string().uuid().required(),
      estudanteId: Joi.string().uuid().required(),
    }),
  ),
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.DIRETOR,
    CargoUsuario.PROFESSOR,
  ]),
  equipeController.removerEstudante,
);

/**
 * @route GET /equipes/:id/estudantes
 * @description Lista estudantes de uma equipe
 * @access Privado
 */
equipeRoutes.get(
  '/:id/estudantes',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.DIRETOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
  ]),
  equipeController.listarEstudantes,
);

/**
 * @route DELETE /equipes/:id
 * @description Exclui uma equipe
 * @access Privado
 */
equipeRoutes.delete(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.COORDENADOR, CargoUsuario.DIRETOR]),
  equipeController.excluir,
);

export { equipeRoutes };
