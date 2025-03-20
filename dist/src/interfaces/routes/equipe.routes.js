"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipeRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("@interfaces/middlewares/auth.middleware");
const rbac_middleware_1 = require("@interfaces/middlewares/rbac.middleware");
const validation_middleware_1 = require("@interfaces/middlewares/validation.middleware");
const tsyringe_1 = require("tsyringe");
const enums_1 = require("@shared/enums");
const joi_1 = __importDefault(require("joi"));
const equipeRoutes = (0, express_1.Router)();
exports.equipeRoutes = equipeRoutes;
const equipeController = tsyringe_1.container.resolve('EquipeController');
equipeRoutes.use(auth_middleware_1.authMiddleware);
equipeRoutes.get('/', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.COORDENADOR, enums_1.CargoUsuario.DIRETOR]), equipeController.listar);
equipeRoutes.get('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.DIRETOR,
    enums_1.CargoUsuario.PROFESSOR,
    enums_1.CargoUsuario.ESPECIALISTA,
]), equipeController.detalhar);
equipeRoutes.post('/', (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.COORDENADOR, enums_1.CargoUsuario.DIRETOR]), validation_middleware_1.ValidationMiddleware.validateBody(validation_middleware_1.ValidationMiddleware.schemas.equipe.criacao), equipeController.criar);
equipeRoutes.put('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.COORDENADOR, enums_1.CargoUsuario.DIRETOR]), equipeController.atualizar);
equipeRoutes.post('/:id/membros', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.COORDENADOR, enums_1.CargoUsuario.DIRETOR]), validation_middleware_1.ValidationMiddleware.validateBody(validation_middleware_1.ValidationMiddleware.schemas.equipe.adicionarMembro), equipeController.adicionarMembro);
equipeRoutes.delete('/:id/membros/:membroId', validation_middleware_1.ValidationMiddleware.validateParams(joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    membroId: joi_1.default.string().uuid().required(),
})), (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.COORDENADOR, enums_1.CargoUsuario.DIRETOR]), equipeController.removerMembro);
equipeRoutes.post('/:id/estudantes', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.DIRETOR,
    enums_1.CargoUsuario.PROFESSOR,
]), validation_middleware_1.ValidationMiddleware.validateBody(validation_middleware_1.ValidationMiddleware.schemas.equipe.adicionarEstudante), equipeController.adicionarEstudante);
equipeRoutes.delete('/:id/estudantes/:estudanteId', validation_middleware_1.ValidationMiddleware.validateParams(joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    estudanteId: joi_1.default.string().uuid().required(),
})), (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.DIRETOR,
    enums_1.CargoUsuario.PROFESSOR,
]), equipeController.removerEstudante);
equipeRoutes.get('/:id/estudantes', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([
    enums_1.CargoUsuario.ADMIN,
    enums_1.CargoUsuario.COORDENADOR,
    enums_1.CargoUsuario.DIRETOR,
    enums_1.CargoUsuario.PROFESSOR,
    enums_1.CargoUsuario.ESPECIALISTA,
]), equipeController.listarEstudantes);
equipeRoutes.delete('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([enums_1.CargoUsuario.ADMIN, enums_1.CargoUsuario.COORDENADOR, enums_1.CargoUsuario.DIRETOR]), equipeController.excluir);
//# sourceMappingURL=equipe.routes.js.map