"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intervencaoRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("@interfaces/middlewares/auth.middleware");
const rbac_middleware_1 = require("@interfaces/middlewares/rbac.middleware");
const validation_middleware_1 = require("@interfaces/middlewares/validation.middleware");
const tsyringe_1 = require("tsyringe");
const enums_1 = require("@shared/enums");
const intervencaoRoutes = (0, express_1.Router)();
exports.intervencaoRoutes = intervencaoRoutes;
const intervencaoController = tsyringe_1.container.resolve('IntervencaoController');
intervencaoRoutes.get('/', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.PROFESSOR,
    enums_1.CargoUsuario.ESPECIALISTA,
]), (req, res) => intervencaoController.listar(req, res));
intervencaoRoutes.get('/:id', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.PROFESSOR,
    enums_1.CargoUsuario.ESPECIALISTA,
]), (req, res) => intervencaoController.detalhar(req, res));
intervencaoRoutes.post('/', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.PROFESSOR,
    enums_1.CargoUsuario.ESPECIALISTA,
]), validation_middleware_1.ValidationMiddleware.validateBody(validation_middleware_1.ValidationMiddleware.schemas.intervencao.criacao), (req, res) => intervencaoController.criar(req, res));
intervencaoRoutes.put('/:id', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.PROFESSOR,
    enums_1.CargoUsuario.ESPECIALISTA,
]), validation_middleware_1.ValidationMiddleware.validateBody(validation_middleware_1.ValidationMiddleware.schemas.intervencao.atualizacao), (req, res) => intervencaoController.atualizar(req, res));
intervencaoRoutes.post('/:id/progresso', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.PROFESSOR,
    enums_1.CargoUsuario.ESPECIALISTA,
]), validation_middleware_1.ValidationMiddleware.validateBody(validation_middleware_1.ValidationMiddleware.schemas.intervencao.progresso), (req, res) => intervencaoController.registrarProgresso(req, res));
intervencaoRoutes.delete('/:id', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.COORDENADOR]), (req, res) => intervencaoController.excluir(req, res));
intervencaoRoutes.get('/estudante/:estudanteId', auth_middleware_1.authMiddleware, (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.PROFESSOR,
    enums_1.CargoUsuario.ESPECIALISTA,
]), (req, res) => intervencaoController.listarPorEstudante(req, res));
//# sourceMappingURL=intervencao.routes.js.map