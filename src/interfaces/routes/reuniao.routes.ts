import { Router } from 'express';
import { ReuniaoController } from '@interfaces/controllers/reuniao.controller';
import { authMiddleware } from '@interfaces/middlewares/auth.middleware';
import { rbacMiddleware } from '@interfaces/middlewares/rbac.middleware';
import { ValidationMiddleware } from '@interfaces/middlewares/validation.middleware';
import { CargoUsuario } from '../../shared/types/cargo.enum';
import Joi from 'joi';

const reuniaoRoutes = Router();
const reuniaoController = new ReuniaoController();

// Middleware de autenticação para todas as rotas
reuniaoRoutes.use(authMiddleware);

/**
 * @route GET /reunioes
 * @description Lista reuniões com filtros
 * @access Privado
 */
reuniaoRoutes.get(
  '/',
  rbacMiddleware([
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.ADMIN,
  ]),
  reuniaoController.listar,
);

/**
 * @route GET /reunioes/:id
 * @description Obtém detalhes de uma reunião
 * @access Privado
 */
reuniaoRoutes.get(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
    CargoUsuario.ADMIN,
  ]),
  reuniaoController.detalhar,
);

/**
 * @route POST /reunioes
 * @description Cria uma nova reunião
 * @access Privado
 */
reuniaoRoutes.post(
  '/',
  ValidationMiddleware.validateBody(ValidationMiddleware.schemas.reuniao.criacao),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  reuniaoController.criar,
);

/**
 * @route PUT /reunioes/:id
 * @description Atualiza uma reunião existente
 * @access Privado
 */
reuniaoRoutes.put(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  reuniaoController.atualizar,
);

/**
 * @route POST /reunioes/:id/participantes
 * @description Adiciona participante à reunião
 * @access Privado
 */
reuniaoRoutes.post(
  '/:id/participantes',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  reuniaoController.adicionarParticipante,
);

/**
 * @route DELETE /reunioes/:id/participantes/:participanteId
 * @description Remove participante da reunião
 * @access Privado
 */
reuniaoRoutes.delete(
  '/:id/participantes/:participanteId',
  ValidationMiddleware.validateParams(
    Joi.object({
      id: Joi.string().uuid().required(),
      participanteId: Joi.string().uuid().required(),
    }),
  ),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  reuniaoController.removerParticipante,
);

/**
 * @route PUT /reunioes/:id/participantes/:participanteId/presenca
 * @description Registra presença em reunião
 * @access Privado
 */
reuniaoRoutes.put(
  '/:id/participantes/:participanteId/presenca',
  ValidationMiddleware.validateParams(
    Joi.object({
      id: Joi.string().uuid().required(),
      participanteId: Joi.string().uuid().required(),
    }),
  ),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  reuniaoController.registrarPresenca,
);

/**
 * @route POST /reunioes/:id/encaminhamentos
 * @description Adiciona encaminhamento à reunião
 * @access Privado
 */
reuniaoRoutes.post(
  '/:id/encaminhamentos',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  reuniaoController.adicionarEncaminhamento,
);

/**
 * @route PUT /reunioes/:id/encaminhamentos/:encaminhamentoId
 * @description Atualiza status de encaminhamento
 * @access Privado
 */
reuniaoRoutes.put(
  '/:id/encaminhamentos/:encaminhamentoId',
  ValidationMiddleware.validateParams(
    Joi.object({
      id: Joi.string().uuid().required(),
      encaminhamentoId: Joi.string().uuid().required(),
    }),
  ),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.PROFESSOR, CargoUsuario.ESPECIALISTA]),
  reuniaoController.atualizarEncaminhamento,
);

/**
 * @route DELETE /reunioes/:id
 * @description Exclui uma reunião
 * @access Privado
 */
reuniaoRoutes.delete(
  '/:id',
  ValidationMiddleware.validateParams(ValidationMiddleware.schemas.id),
  rbacMiddleware([CargoUsuario.COORDENADOR, CargoUsuario.ADMIN]),
  reuniaoController.excluir,
);

export { reuniaoRoutes };
