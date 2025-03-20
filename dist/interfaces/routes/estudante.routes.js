"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estudanteRoutes = void 0;
const express_1 = require("express");
const estudante_controller_1 = require("@interfaces/controllers/estudante.controller");
const auth_middleware_1 = require("@interfaces/middlewares/auth.middleware");
const rbac_middleware_1 = require("@interfaces/middlewares/rbac.middleware");
const client_1 = require("@prisma/client");
const estudanteRoutes = (0, express_1.Router)();
exports.estudanteRoutes = estudanteRoutes;
const estudanteController = new estudante_controller_1.EstudanteController();
estudanteRoutes.use(auth_middleware_1.authMiddleware);
estudanteRoutes.get('/', estudanteController.listarEstudantesProfessor);
estudanteRoutes.post('/', estudanteController.cadastrar);
estudanteRoutes.post('/dificuldade', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.COORDENADOR, client_1.CargoUsuario.ADMINISTRADOR]), estudanteController.associarDificuldade);
estudanteRoutes.post('/avaliacao', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.COORDENADOR, client_1.CargoUsuario.ADMINISTRADOR]), estudanteController.registrarAvaliacao);
estudanteRoutes.get('/:estudanteId/intervencoes/recomendacoes', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.COORDENADOR, client_1.CargoUsuario.ADMINISTRADOR]), estudanteController.recomendarIntervencoes);
estudanteRoutes.get('/:estudanteId/progresso', (0, rbac_middleware_1.rbacMiddleware)([client_1.CargoUsuario.PROFESSOR, client_1.CargoUsuario.ESPECIALISTA, client_1.CargoUsuario.COORDENADOR, client_1.CargoUsuario.ADMINISTRADOR]), estudanteController.acompanharProgresso);
//# sourceMappingURL=estudante.routes.js.map