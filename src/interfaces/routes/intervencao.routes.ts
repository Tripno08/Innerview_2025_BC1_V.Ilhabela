import { Router } from 'express';
import { IntervencaoController } from '@interfaces/controllers/intervencao.controller';
import { authMiddleware } from '@interfaces/middlewares/auth.middleware';
import { rbacMiddleware } from '@interfaces/middlewares/rbac.middleware';
import { ValidationMiddleware } from '@interfaces/middlewares/validation.middleware';
import { container } from 'tsyringe';
import { CargoUsuario } from '@shared/enums';

const intervencaoRoutes = Router();
const intervencaoController = container.resolve<IntervencaoController>('IntervencaoController');

// Listar intervenções
intervencaoRoutes.get(
  '/',
  authMiddleware,
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
  ]),
  (req, res) => intervencaoController.listar(req, res),
);

// Obter intervenção por ID
intervencaoRoutes.get(
  '/:id',
  authMiddleware,
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
  ]),
  (req, res) => intervencaoController.detalhar(req, res),
);

// Criar intervenção
intervencaoRoutes.post(
  '/',
  authMiddleware,
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
  ]),
  ValidationMiddleware.validateBody(ValidationMiddleware.schemas.intervencao.criacao),
  (req, res) => intervencaoController.criar(req, res),
);

// Atualizar intervenção
intervencaoRoutes.put(
  '/:id',
  authMiddleware,
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
  ]),
  ValidationMiddleware.validateBody(ValidationMiddleware.schemas.intervencao.atualizacao),
  (req, res) => intervencaoController.atualizar(req, res),
);

// Registrar progresso de intervenção
intervencaoRoutes.post(
  '/:id/progresso',
  authMiddleware,
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
  ]),
  ValidationMiddleware.validateBody(ValidationMiddleware.schemas.intervencao.progresso),
  (req, res) => intervencaoController.registrarProgresso(req, res),
);

// Excluir intervenção
intervencaoRoutes.delete(
  '/:id',
  authMiddleware,
  rbacMiddleware([CargoUsuario.ADMIN, CargoUsuario.COORDENADOR]),
  (req, res) => intervencaoController.excluir(req, res),
);

// Obter intervenções por estudante
intervencaoRoutes.get(
  '/estudante/:estudanteId',
  authMiddleware,
  rbacMiddleware([
    CargoUsuario.ADMIN,
    CargoUsuario.COORDENADOR,
    CargoUsuario.PROFESSOR,
    CargoUsuario.ESPECIALISTA,
  ]),
  (req, res) => intervencaoController.listarPorEstudante(req, res),
);

export { intervencaoRoutes };
