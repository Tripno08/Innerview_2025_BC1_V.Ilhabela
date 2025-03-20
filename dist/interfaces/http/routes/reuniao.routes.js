"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reuniao_controller_1 = require("@interfaces/http/controllers/reuniao.controller");
const auth_middleware_1 = require("@interfaces/http/middlewares/auth-middleware");
const rbac_middleware_1 = require("@interfaces/http/middlewares/rbac-middleware");
const client_1 = require("@prisma/client");
const reuniaoRouter = (0, express_1.Router)();
const reuniaoController = new reuniao_controller_1.ReuniaoController();
reuniaoRouter.use(auth_middleware_1.ensureAuthenticated);
reuniaoRouter.get('/', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.ADMIN]), reuniaoController.listar);
reuniaoRouter.get('/equipe/:equipeId', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.ADMIN]), reuniaoController.listarPorEquipe);
reuniaoRouter.get('/periodo', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.ADMIN]), reuniaoController.listarPorPeriodo);
reuniaoRouter.get('/status/:status', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.ADMIN]), reuniaoController.listarPorStatus);
reuniaoRouter.get('/:id', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.ADMIN]), reuniaoController.obterDetalhes);
reuniaoRouter.post('/', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.ADMIN]), reuniaoController.criar);
exports.default = reuniaoRouter;
//# sourceMappingURL=reuniao.routes.js.map