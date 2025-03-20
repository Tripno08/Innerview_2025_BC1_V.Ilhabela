"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dificuldadeRoutes = void 0;
const express_1 = require("express");
const dificuldade_controller_1 = require("../../interfaces/controllers/dificuldade.controller");
const auth_middleware_1 = require("../../interfaces/middlewares/auth.middleware");
const rbac_middleware_1 = require("../../interfaces/middlewares/rbac.middleware");
const validation_middleware_1 = require("../../interfaces/middlewares/validation.middleware");
const cargo_enum_1 = require("../../shared/types/cargo.enum");
const dificuldadeRoutes = (0, express_1.Router)();
exports.dificuldadeRoutes = dificuldadeRoutes;
const dificuldadeController = new dificuldade_controller_1.DificuldadeController();
dificuldadeRoutes.use(auth_middleware_1.authMiddleware);
dificuldadeRoutes.get('/', (0, rbac_middleware_1.rbacMiddleware)([
    cargo_enum_1.CargoUsuario.COORDENADOR,
    cargo_enum_1.CargoUsuario.PROFESSOR,
    cargo_enum_1.CargoUsuario.ESPECIALISTA,
    cargo_enum_1.CargoUsuario.ADMIN,
]), dificuldadeController.listar);
dificuldadeRoutes.get('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([
    cargo_enum_1.CargoUsuario.COORDENADOR,
    cargo_enum_1.CargoUsuario.PROFESSOR,
    cargo_enum_1.CargoUsuario.ESPECIALISTA,
    cargo_enum_1.CargoUsuario.ADMIN,
]), dificuldadeController.detalhar);
dificuldadeRoutes.post('/', validation_middleware_1.ValidationMiddleware.validateBody(validation_middleware_1.ValidationMiddleware.schemas.dificuldade?.criacao || {}), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.ESPECIALISTA, cargo_enum_1.CargoUsuario.ADMIN]), dificuldadeController.criar);
dificuldadeRoutes.put('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.ESPECIALISTA, cargo_enum_1.CargoUsuario.ADMIN]), dificuldadeController.atualizar);
dificuldadeRoutes.post('/:id/estudantes/:estudanteId', validation_middleware_1.ValidationMiddleware.validateParams({
    id: validation_middleware_1.ValidationMiddleware.schemas.id,
    estudanteId: validation_middleware_1.ValidationMiddleware.schemas.id,
}), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), dificuldadeController.associarAEstudante);
dificuldadeRoutes.delete('/:id/estudantes/:estudanteId', validation_middleware_1.ValidationMiddleware.validateParams({
    id: validation_middleware_1.ValidationMiddleware.schemas.id,
    estudanteId: validation_middleware_1.ValidationMiddleware.schemas.id,
}), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), dificuldadeController.removerDeEstudante);
dificuldadeRoutes.get('/:id/intervencoes', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([
    cargo_enum_1.CargoUsuario.COORDENADOR,
    cargo_enum_1.CargoUsuario.PROFESSOR,
    cargo_enum_1.CargoUsuario.ESPECIALISTA,
    cargo_enum_1.CargoUsuario.ADMIN,
]), dificuldadeController.listarIntervencoesRecomendadas);
dificuldadeRoutes.delete('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.ADMIN]), dificuldadeController.excluir);
//# sourceMappingURL=dificuldade.routes.js.map