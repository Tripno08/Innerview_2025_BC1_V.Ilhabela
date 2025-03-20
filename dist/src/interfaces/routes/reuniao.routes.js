"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reuniaoRoutes = void 0;
const express_1 = require("express");
const reuniao_controller_1 = require("@interfaces/controllers/reuniao.controller");
const auth_middleware_1 = require("@interfaces/middlewares/auth.middleware");
const rbac_middleware_1 = require("@interfaces/middlewares/rbac.middleware");
const validation_middleware_1 = require("@interfaces/middlewares/validation.middleware");
const cargo_enum_1 = require("../../shared/types/cargo.enum");
const joi_1 = __importDefault(require("joi"));
const reuniaoRoutes = (0, express_1.Router)();
exports.reuniaoRoutes = reuniaoRoutes;
const reuniaoController = new reuniao_controller_1.ReuniaoController();
reuniaoRoutes.use(auth_middleware_1.authMiddleware);
reuniaoRoutes.get('/', (0, rbac_middleware_1.rbacMiddleware)([
    cargo_enum_1.CargoUsuario.COORDENADOR,
    cargo_enum_1.CargoUsuario.PROFESSOR,
    cargo_enum_1.CargoUsuario.ESPECIALISTA,
    cargo_enum_1.CargoUsuario.ADMIN,
]), reuniaoController.listar);
reuniaoRoutes.get('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([
    cargo_enum_1.CargoUsuario.COORDENADOR,
    cargo_enum_1.CargoUsuario.PROFESSOR,
    cargo_enum_1.CargoUsuario.ESPECIALISTA,
    cargo_enum_1.CargoUsuario.ADMIN,
]), reuniaoController.detalhar);
reuniaoRoutes.post('/', validation_middleware_1.ValidationMiddleware.validateBody(validation_middleware_1.ValidationMiddleware.schemas.reuniao.criacao), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), reuniaoController.criar);
reuniaoRoutes.put('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), reuniaoController.atualizar);
reuniaoRoutes.post('/:id/participantes', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), reuniaoController.adicionarParticipante);
reuniaoRoutes.delete('/:id/participantes/:participanteId', validation_middleware_1.ValidationMiddleware.validateParams(joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    participanteId: joi_1.default.string().uuid().required(),
})), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), reuniaoController.removerParticipante);
reuniaoRoutes.put('/:id/participantes/:participanteId/presenca', validation_middleware_1.ValidationMiddleware.validateParams(joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    participanteId: joi_1.default.string().uuid().required(),
})), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), reuniaoController.registrarPresenca);
reuniaoRoutes.post('/:id/encaminhamentos', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), reuniaoController.adicionarEncaminhamento);
reuniaoRoutes.put('/:id/encaminhamentos/:encaminhamentoId', validation_middleware_1.ValidationMiddleware.validateParams(joi_1.default.object({
    id: joi_1.default.string().uuid().required(),
    encaminhamentoId: joi_1.default.string().uuid().required(),
})), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.PROFESSOR, cargo_enum_1.CargoUsuario.ESPECIALISTA]), reuniaoController.atualizarEncaminhamento);
reuniaoRoutes.delete('/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.ADMIN]), reuniaoController.excluir);
//# sourceMappingURL=reuniao.routes.js.map