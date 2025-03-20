"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("@interfaces/controllers/dashboard.controller");
const auth_middleware_1 = require("@interfaces/middlewares/auth.middleware");
const rbac_middleware_1 = require("@interfaces/middlewares/rbac.middleware");
const validation_middleware_1 = require("@interfaces/middlewares/validation.middleware");
const cargo_enum_1 = require("../../shared/types/cargo.enum");
const dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes = dashboardRoutes;
const dashboardController = new dashboard_controller_1.DashboardController();
dashboardRoutes.use(auth_middleware_1.authMiddleware);
dashboardRoutes.get('/indicadores', (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.DIRETOR, cargo_enum_1.CargoUsuario.ADMIN]), dashboardController.obterIndicadores);
dashboardRoutes.get('/estatisticas/estudantes', (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.DIRETOR, cargo_enum_1.CargoUsuario.ADMIN]), dashboardController.obterEstatisticasEstudantes);
dashboardRoutes.get('/estatisticas/dificuldades', (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.DIRETOR, cargo_enum_1.CargoUsuario.ADMIN]), dashboardController.obterEstatisticasDificuldades);
dashboardRoutes.get('/estatisticas/intervencoes', (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.DIRETOR, cargo_enum_1.CargoUsuario.ADMIN]), dashboardController.obterEstatisticasIntervencoes);
dashboardRoutes.get('/estatisticas/reunioes', (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.DIRETOR, cargo_enum_1.CargoUsuario.ADMIN]), dashboardController.obterEstatisticasReunioes);
dashboardRoutes.get('/relatorios/estudante/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([
    cargo_enum_1.CargoUsuario.COORDENADOR,
    cargo_enum_1.CargoUsuario.PROFESSOR,
    cargo_enum_1.CargoUsuario.ESPECIALISTA,
    cargo_enum_1.CargoUsuario.ADMIN,
]), dashboardController.gerarRelatorioEstudante);
dashboardRoutes.get('/relatorios/intervencoes', (0, rbac_middleware_1.rbacMiddleware)([
    cargo_enum_1.CargoUsuario.COORDENADOR,
    cargo_enum_1.CargoUsuario.PROFESSOR,
    cargo_enum_1.CargoUsuario.ESPECIALISTA,
    cargo_enum_1.CargoUsuario.ADMIN,
]), dashboardController.gerarRelatorioIntervencoes);
dashboardRoutes.get('/relatorios/equipe/:id', validation_middleware_1.ValidationMiddleware.validateParams(validation_middleware_1.ValidationMiddleware.schemas.id), (0, rbac_middleware_1.rbacMiddleware)([cargo_enum_1.CargoUsuario.COORDENADOR, cargo_enum_1.CargoUsuario.DIRETOR, cargo_enum_1.CargoUsuario.ADMIN]), dashboardController.gerarRelatorioEquipe);
//# sourceMappingURL=dashboard.routes.js.map